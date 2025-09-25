'use strict';

const fs = require('fs');
const path = require('path');

//load bad words from profanity csv file
const loadBannedWords = () => {
  try {
    const csvPath = path.join(__dirname, 'profanity.csv');
    const csv = fs.readFileSync(csvPath, 'utf8');
    return csv.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  } catch (e) {
    return [];
  }
};

const bannedWords = loadBannedWords();


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

let RX = buildRegex(bannedWords);

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

const Plugin = {};

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

module.exports = Plugin;
