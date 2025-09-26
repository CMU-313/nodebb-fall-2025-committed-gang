'use strict';

const fs = require('fs');
const path = require('path');

//access nodeBB core modules
const meta = require.main.require("./src/meta");
const settings = require.main.require("./src/meta/settings");
const plugins = require.main.require("./src/plugins");
const settingsRoute = "/admin/plugins/censor";

const PLUGIN_HASH = "nodebb-plugin-censor";
const CSV_PATH = path.join(__dirname, "profanity.csv");
const BACKUP_PATH = path.join(__dirname, "profanity.csv.bak");

let bannedWords = [];
let RX = null;
const replacement = '****';

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildRegex = (words) => {
  const parts = words
    .map(w => w.trim())
    .filter(Boolean)
    .map(escapeRegExp)
    .sort((a, b) => b.length - a.length);
  if (!parts.length) return null;
  return new RegExp(`\\b(?:${parts.join('|')})\\b`, 'gi');
};

const readCsvFile = (csvPath) => {
  try {
    const csv = fs.readFileSync(csvPath,"utf8");
    return csv.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  } catch (e) {
    return [];
  }
};

const writeCsvFile = (csvPath, lines) => {
  const data = lines.join("\n") + "\n";
  fs.writeFileSync(csvPath, data, "utf8");
}

async function loadFromSettingsOrCsv() {
  try {
    const values = await settings.get(PLUGIN_HASH);
    if (values && values.bannedWords) {
      const raw = String(values.bannedWords || "");
      const parts = raw.split(/[,\r?\n]+/).map(s => s.trim()).filter(Boolean);
      bannedWords = parts;
      RX = buildRegex(bannedWords);
      return { from: 'settings', words: bannedWords}; 
    }
  } catch (e) {
    //fallback to CSV
  }

  bannedWords = readCsvFile(CSV_PATH);
  RX = buildRegex(bannedWords);
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

      }
      writeCsvFile(CSV_PATH, lines);
      bannedWords = lines;
      RX = buildRegex(bannedWords);
      return true;
    }
  } catch (e) {

  }
  return false;
};

function maskSkippingCode(text) {
  if (!text || !RX) return text;

  const codeRx = /(```[\s\S]*?```|`[^`]*`)/g;
  let out = [];
  let last = 0;
  let m;

  while ((m = codeRx.exec(text)) !== null) {
    out.push(text.slice(last, m.index).replace(RX, replacement));
    out.push(m[0]);
    last = codeRx.lastIndex;
  }
  out.push(text.slice(last).replace(RX, replacement));
  return out.join('');
}

//initialize the csv file on load
loadFromSettingsOrCsv().then(() =>  {
  //register listener for settings
  plugins.hooks.on('action:settings.set.' + PLUGIN_HASH, async (data) => {
    await loadFromSettingsOrCsv();
    await persistSettingsToCsvIfRequested(data);
  });
}).catch(() => {});

const Plugin = {};

Plugin.settingsRoute = '/plugins/censor';

// Ensure a left-sidebar entry under "Plugins"
Plugin.addAdminNav = function (header, callback) {
  header.plugins = header.plugins || [];
  header.plugins.push({
    route: '/plugins/censor',   // must match plugin.json admin.route (without /admin)
    icon: 'fa-ban',
    name: 'Censor',
  });
  callback(null, header);
};

Plugin.censorPost = async (data) => {
  if (data && data.content) {
    data.content = maskSkippingCode(data.content);
  }
  return data;
};

Plugin.censorParsed = async (payload) => {
  if (payload?.postData?.content) {
    payload.postData.content = maskSkippingCode(payload.postData.content);
  }
  return payload;
};

Plugin.censorTopic = async (data) => {
  if (data && data.title) {
    data.title = maskSkippingCode(data.title);
  }
  return data;
};

Plugin.init = function ({ router, middleware }) {
  const routeHelpers = require.main.require('./src/routes/helpers');

  const renderSettings = async (req, res) => {
    const values = (await settings.get(PLUGIN_HASH)) || {};
    // If no custom list saved, show the CSV contents as the default text
    const banned = values.bannedWords && values.bannedWords.trim().length
      ? values.bannedWords
      : readCsvFile(CSV_PATH).join('\n');

    res.render('admin/plugins/censor/settings', {
      bannedWords: banned,
      // include CSRF in template via {config.csrf_token}
    });
  };

  // Creates:
  //   GET  /admin/plugins/censor/settings
  //   GET  /api/admin/plugins/censor/settings
  routeHelpers.setupAdminPageRoute(router, settingsRoute, [], renderSettings);

  const applyCSRF =
    middleware.applyCSRF || middleware.applyCSRFcheck || ((req, res, next) => next());

  // Save handler: store to settings and rebuild in-memory regex
  router.post(
    '/api' + settingsRoute,
    middleware.ensureLoggedIn,
    middleware.admin.checkPrivileges,
    applyCSRF,
    async (req, res) => {
      const body = req.body || {};
      const text = (body.bannedWords || '').trim();

      // If the textbox is empty, we store empty string: loadFromSettingsOrCsv() will fall back to CSV
      await settings.set(PLUGIN_HASH, { bannedWords: text });

      // Rebuild in-memory list/regex immediately
      await loadFromSettingsOrCsv();

      res.json({ success: true });
    }
  );
};

module.exports = Plugin;
