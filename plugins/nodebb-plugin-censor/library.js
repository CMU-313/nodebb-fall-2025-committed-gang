'use strict';

const bannedWords = ['badword', 'curse', 'swear'];

function mask(text) {
  return bannedWords.reduce((acc, word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    return acc.replace(regex, '****');
  }, text);
}

const Plugin = {};

Plugin.censorPost = async (data) => {
  if (data && data.content) {
    data.content = mask(data.content);
  }
  return data;
};

Plugin.censorParsed = async (payload) => {
  if (payload && payload.postData && payload.postData.content) {
    payload.postData.content = mask(payload.postData.content);
  }
  return payload;
};

module.exports = Plugin;
