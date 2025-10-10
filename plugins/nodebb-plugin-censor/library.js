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

Plugin.censorPost = async (data) => {
  if (data && data.content) {
    data.content = maskSkippingCode(data.content);
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
  if (payload?.postData?.content) {
    payload.postData.content = maskSkippingCode(payload.postData.content);
  }
  return payload;
};

Plugin.parseRaw = async (raw) => {
  if (typeof raw === 'string' && RX) {
    return maskSkippingCode(raw);
  }
  return raw;
};

module.exports = Plugin;
