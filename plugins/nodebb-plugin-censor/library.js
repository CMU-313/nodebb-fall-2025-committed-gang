'use strict';

const fs = require('fs');
const path = require('path');
const Topics = require.main.require('./src/topics');

//access nodeBB core modules
const meta = require.main.require("./src/meta");
const settings = require.main.require("./src/meta/settings");
const plugins = require.main.require("./src/plugins");
const settingsRoute = "/admin/plugins/censor/settings";

const PLUGIN_HASH = "nodebb-plugin-censor";
const CSV_PATH = path.join(__dirname, "profanity.csv");
const BACKUP_PATH = path.join(__dirname, "profanity.csv.bak");

let bannedWords = [];
let RX = null;
const replacement = '****';

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

let censorStats = {
  totalCensored: 0,
  lastCensoredAt: null,
  postsCensored: 0,
};

const buildRegex = (words) => {
  let list;
  if (!words) {
    list = [];
  } else if (Array.isArray(words)) {
    list = words;
  } else if (typeof words === 'string') {
    list = words.split(/[,\r?\n]+/);
  } else {
    // As a last resort, coerce object values to strings
    list = Object.values(words || {}).map(String);
  }

  const parts = list
    .map(w => String(w).trim())
    .filter(Boolean)
    .map(escapeRegExp)
    .sort((a, b) => b.length - a.length);
  if (!parts.length) return null;
  return new RegExp(`\\b(?:${parts.join('|')})\\b`, 'gi');
};

const readCsvFile = (csvPath) => {
  try {
    const csv = fs.readFileSync(csvPath, "utf8");
    return csv.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  } catch (e) {
    return [];
  }
};

const writeCsvFile = (csvPath, lines) => {
  const data = lines.join("\n") + "\n";
  fs.writeFileSync(csvPath, data, "utf8");
};

async function loadFromSettingsOrCsv() {
  try {
    const values = await settings.get(PLUGIN_HASH);
    if (values && values.bannedWords) {
      const raw = String(values.bannedWords || "");
      const parts = raw.split(/[,\r?\n]+/).map(s => s.trim()).filter(Boolean);
      bannedWords = parts;
      RX = buildRegex(bannedWords);
      console.log('[censor] loaded from settings:', bannedWords.length, 'words');
      return { from: 'settings', words: bannedWords}; 
    }
  } catch (e) {
    //fallback to CSV
  }

  bannedWords = readCsvFile(CSV_PATH);
  RX = buildRegex(bannedWords);
  console.log('[censor] loaded from CSV:', CSV_PATH, 'words:', bannedWords.length, 'rx?', !!RX);
  return { from: 'csv', words: bannedWords};
};

async function persistSettingsToCsvIfRequested(values) {
  try {
    if (!values) return false;
    if (values.persistCsv === 'on' && values.bannedWords) {
      const lines = String(values.bannedWords).split(/[,\r?\n]+/).map(s => s.trim()).filter(Boolean);
      //backup existing csv if present
      try {
        if (fs.existsSync(CSV_PATH)) {
          fs.copyFileSync(CSV_PATH, BACKUP_PATH);
        }
      } catch (e) {
        // ignore
      }
      writeCsvFile(CSV_PATH, lines);
      bannedWords = lines;
      RX = buildRegex(bannedWords);
      return true;
    }
  } catch (e) {
    // ignore
  }
  return false;
}

function maskSkippingCode(text) {
  if (!text || !RX) return text;

  const codeRx = /(```[\s\S]*?```|`[^`]*`)/g;
  let out = [];
  let last = 0;
  let m;
  let hasCensored = false;
  let censorCount = 0;

  while ((m = codeRx.exec(text)) !== null) {
    const cleaned = text.slice(last, m.index).replace(RX, (match) => {
      censorCount++;
      hasCensored = true;
      return replacement;
    });
    out.push(cleaned);
    out.push(m[0]);
    last = codeRx.lastIndex;
  }
  out.push(text.slice(last).replace(RX, (match) => {
    censorCount++;
    hasCensored = true;
    return replacement;
  }));

  if (hasCensored) {
    censorStats.totalCensored += censorCount;
    censorStats.lastCensoredAt = new Date().toISOString();
    censorStats.postsCensored++;
  }

  return out.join('');
}

//initialize the csv file on load
loadFromSettingsOrCsv().catch((e) => {
      console.error('[nodebb-plugin-censor] Failed to register ACP routes:',e);
});

const Plugin = {};

// Controller to render the admin settings template
async function renderAdminPage(req, res) {
  try {
    console.log('[nodebb-plugin-censor] renderAdminPage called for', req.path, 'uid:', req.uid);
    // ensure stats and banned words are available to the template
    const stats = {
      totalCensored: censorStats.totalCensored || 0,
      postsCensored: censorStats.postsCensored || 0,
      lastCensoredAt: censorStats.lastCensoredAt || '',
    };
    const bannedWordsText = Array.isArray(bannedWords) ? bannedWords.join('\n') : String(bannedWords || '');
    res.render('admin/plugins/censor/settings', {
      title: 'Censor Settings',
      stats,
      bannedWords: bannedWordsText,
      bannedWordsCount: (bannedWords || []).length || 0,
      config: { csrf_token: req.csrfToken && req.csrfToken() },
    });
  } catch (err) {
    console.error('[nodebb-plugin-censor] renderAdminPage error', err);
    return res.status(500).send('Server error');
  }
}

// Register admin route when plugin initializes
Plugin.init = async function (params) {
  console.log('[nodebb-plugin-censor] Plugin.init called');
  const { router } = params;
  const routeHelpers = require.main.require('./src/routes/helpers');
  // Register page and API endpoint (GET for page, GET /api for ajax)
  // Register both the admin routes referenced by plugin.json and the
  // internal /admin/... path so links from the admin UI resolve.
  const jsonRoute = '/plugins/censor';
  const adminBaseRoute = '/admin/plugins/censor';
  routeHelpers.setupAdminPageRoute(router, jsonRoute, [], renderAdminPage);
  routeHelpers.setupAdminPageRoute(router, adminBaseRoute, [], renderAdminPage);
  routeHelpers.setupAdminPageRoute(router, settingsRoute, [], renderAdminPage);

  // Add a POST API endpoint for saving settings used by the admin JS
  const routeHelpersApi = routeHelpers; // same helpers file contains setupApiRoute
  const saveSettings = async (req, res) => {
    try {
      const values = req.body || {};
      console.log('[nodebb-plugin-censor] saveSettings called, keys:', Object.keys(values));
      // Don't persist CSRF token or any internal fields into plugin settings
      const toSave = { ...values };
      delete toSave._csrf;
      delete toSave.csrf_token;
      // save to NodeBB settings
      await settings.set(PLUGIN_HASH, toSave);
      // optionally persist to CSV
      await persistSettingsToCsvIfRequested(values);
      // reload words into memory
      await loadFromSettingsOrCsv();
      res.json({ success: true });
    } catch (err) {
      console.error('[nodebb-plugin-censor] saveSettings error', err);
      res.json({ success: false, error: err.message });
    }
  };
  // Register both non-/api and /api POST endpoints so client-side (which posts to /api/...) reaches this handler
  routeHelpersApi.setupApiRoute(router, 'post', '/admin/plugins/censor/settings', [], saveSettings);
  routeHelpersApi.setupApiRoute(router, 'post', '/api/admin/plugins/censor/settings', [], saveSettings);

  // Admin-only GET endpoint for inspecting current saved settings (debug/verification)
  const getSettings = async (req, res) => {
    try {
      const current = await settings.get(PLUGIN_HASH);
      res.json({ success: true, settings: current });
    } catch (err) {
      res.json({ success: false, error: err.message });
    }
  };
  routeHelpersApi.setupApiRoute(router, 'get', '/api/admin/plugins/censor/settings', [], getSettings);
  // Temporary debug route to inspect uid and privilege resolution
  const debugRoute = async (req, res) => {
    try {
      const uid = req.uid ?? -1;
      const path = req.path.replace(/^(\/api)?(\/v3)?\/admin\/?/, '');
      const privilege = require.main.require('./src/privileges/admin').resolve(path);
      const can = await require.main.require('./src/privileges/admin').can(privilege, uid);
      res.json({ uid, path, privilege, allowed: !!can });
    } catch (err) {
      res.json({ error: err.message });
    }
  };
  routeHelpersApi.setupApiRoute(router, 'get', '/admin/plugins/censor/debug', [], debugRoute);
  // Register the public whoami debug route as well
  try {
    if (typeof Plugin._registerPublicDebug === 'function') {
      Plugin._registerPublicDebug({ router });
    }
  } catch (e) {
    console.error('[nodebb-plugin-censor] error registering public debug route', e);
  }
};

// Public debugging endpoint (non-admin) to show whether the browser session
// is recognized. Visit in the browser and paste the JSON response here.
Plugin._registerPublicDebug = function (params) {
  try {
    const { router } = params;
    const routeHelpers = require.main.require('./src/routes/helpers');
    const whoami = async (req, res) => {
      res.json({ uid: req.uid || -1, loggedIn: !!req.loggedIn, sessionMeta: req.session && req.session.meta });
    };
    // use setupPageRoute so middleware sets req.uid but does not force login
    routeHelpers.setupPageRoute(router, '/plugin-censor/whoami', [], whoami);
  } catch (e) {
    console.error('[nodebb-plugin-censor] failed to register public whoami route', e);
  }
};

// Add the plugin entry into the admin navigation (left-hand menu)
Plugin.addAdminNavigation = async function (header) {
  header.plugins = header.plugins || [];
  header.plugins.push({
    route: '/plugins/censor',
    icon: 'fa-ban',
    name: 'Censor',
  });
  return header;
};

Plugin.censorPost = async (data) => {
  try {
    if (data && data.content) {
      data.content = maskSkippingCode(data.content);
    }

    if (data && data.title) {
      data.title = maskSkippingCode(data.title);
    }

    if (data && data.topic && data.topic.title) {
      data.topic.title = maskSkippingCode(data.topic.title);
    }
  } catch (err) {
    console.error('[nodebb-plugin-censor] censorPost error', err);
  }
    const uid = (data && data.uid) || -1;
    if (data && data.content) {
      const before = String(data.content).slice(0, 200);
      const matchesBefore = RX ? (String(data.content).match(RX) || []).length : 0;
      console.log('[nodebb-plugin-censor] censorPost uid:', uid, 'rx?', !!RX, 'matchesBefore:', matchesBefore, 'preview:', before);
      data.content = maskSkippingCode(data.content);
      const after = String(data.content).slice(0, 200);
      const matchesAfter = RX ? (String(after).match(RX) || []).length : 0;
      console.log('[nodebb-plugin-censor] censorPost uid:', uid, 'matchesAfter:', matchesAfter, 'previewAfter:', after);
    }
    if (data && data.title) {
      data.title = maskSkippingCode(data.title);
    }
    if (data && data.topic && data.topic.title) {
      data.topic.title = maskSkippingCode(data.topic.title);
    }
  return data;
};

Plugin.censorParsed = async (payload) => {
  try {
    if (payload?.postData?.content) {
      payload.postData.content = maskSkippingCode(payload.postData.content);
    }
  } catch (err) {
    console.error('[nodebb-plugin-censor] censorParsed error', err);
  }
    if (payload?.postData?.content) {
      const before = String(payload.postData.content).slice(0, 200);
      const matchesBefore = RX ? (String(payload.postData.content).match(RX) || []).length : 0;
      console.log('[nodebb-plugin-censor] censorParsed rx?', !!RX, 'matchesBefore:', matchesBefore, 'preview:', before);
      payload.postData.content = maskSkippingCode(payload.postData.content);
      const after = String(payload.postData.content).slice(0, 200);
      console.log('[nodebb-plugin-censor] censorParsed matchesAfter:', RX ? ((String(after).match(RX) || []).length) : 0, 'previewAfter:', after);
    }
  return payload;
};

Plugin.parseRaw = async (raw) => {
  try {
    console.log('[nodebb-plugin-censor] parseRaw called; RX?', !!RX);
    if (typeof raw === 'string' && RX) {
      return maskSkippingCode(raw);
    }
  } catch (err) {
    console.error('[nodebb-plugin-censor] parseRaw error', err);
  }
  return raw;
};

module.exports = Plugin;
