'use strict';

// ensure winston doesn't print noisy logs during tests
try {
  const winston = require('winston');
  if (winston && winston.configure) {
    winston.configure({
      transports: [
        // silence all logger output during tests
        new winston.transports.Console({ silent: true }),
      ],
    });
  }
} catch (e) {
  // winston not present — ignore
}

// DEBUG: confirm test file is being loaded
console.log('[test] starting censorship tests');

const assert = require('assert');

describe('Plugin: censor', () => {
  let plugin;
  let originalMainRequire;

  before(() => {
    originalMainRequire = require.main.require;
    require.main.require = (modulePath) => {
      if (modulePath === './src/meta/settings') {
        return {
          async get() {
            return { bannedWords: 'fuck\nbitch' };
          },
          async set() { /* noop */ },
        };
      }
      if (modulePath === './src/plugins') {
        return { hooks: { on() { /* noop */ } } };
      }
      if (modulePath === './src/topics') {
        return {}; // not needed for these tests
      }
      return originalMainRequire(modulePath);
    };

    plugin = require('../../plugins/nodebb-plugin-censor/library');
  });

  after(() => {
    require.main.require = originalMainRequire;
    // ensure we delete the same module we required above
    try {
      delete require.cache[require.resolve('../../plugins/nodebb-plugin-censor/library')];
    } catch (e) { /* ignore */ }
  });

  it('censors post content and preserves inline code', async () => {
    const input = {
      content: 'This is fuck and `fuck` inside code and bitch outside.',
    };

    const result = await plugin.censorPost(JSON.parse(JSON.stringify(input)));
    assert.strictEqual(
      result.content,
      'This is **** and `fuck` inside code and **** outside.'
    );
  });

  it('does not censor words inside fenced code blocks or inline code', async () => {
    const input = {
      content: 'outside fuck ```\nmultiline fuck\n``` end `inline fuck` final fuck',
    };

    const result = await plugin.censorPost(JSON.parse(JSON.stringify(input)));

    // code blocks and inline code preserved, outside words censored
    assert.ok(result.content.includes('outside **** ```\nmultiline fuck\n``` end `inline fuck` final ****'));
  });

  it('censorParsed modifies postData.content when present', async () => {
    const payload = {
      postData: { content: 'no code fuck and bitch' },
    };

    const result = await plugin.censorParsed(JSON.parse(JSON.stringify(payload)));
    assert.strictEqual(result.postData.content, 'no code **** and ****');
  });

  it('sanity', () => { assert.strictEqual(1, 1); });
});