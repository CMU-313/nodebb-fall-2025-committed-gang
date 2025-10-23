'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var assert = require('assert');

// Simulates hook function
var pollSubmissionDebugHook = function pollSubmissionDebugHook(payload) {
  console.log('=== POLL SUBMISSION DEBUG ===');
  console.log('Payload:', payload);
  console.log('Available composer object:', typeof composer === "undefined" ? "undefined" : _typeof(composer));
  if (typeof composer !== 'undefined' && composer.posts) {
    console.log('Composer posts keys:', Object.keys(composer.posts));

    // Log each composer post to see what's available
    Object.keys(composer.posts).forEach(function (uuid) {
      console.log("Post ".concat(uuid, ":"), composer.posts[uuid]);
      if (composer.posts[uuid].pollConfig) {
        console.log("Poll config found in ".concat(uuid, ":"), composer.posts[uuid].pollConfig);
      }
    });
  }
  return payload;
};
describe('Poll Submission Debug Hook', function () {
  var originalConsoleLog;
  var loggedMessages;
  beforeEach(function () {
    // Capture console.log output
    loggedMessages = [];
    originalConsoleLog = console.log;
    console.log = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      loggedMessages.push(args);
    };

    // Reset global composer
    global.composer = undefined;
  });
  afterEach(function () {
    // Restore console.log
    console.log = originalConsoleLog;

    // Clean up global
    delete global.composer;
  });
  it('should log debug header and payload information', function (done) {
    var payload = {
      action: 'topics.post',
      composerData: {
        title: 'Test Topic'
      }
    };
    var result = pollSubmissionDebugHook(payload);

    // Check that debug messages were logged
    var logMessages = loggedMessages.map(function (args) {
      return args.join(' ');
    });
    assert(logMessages.some(function (msg) {
      return msg.includes('=== POLL SUBMISSION DEBUG ===');
    }));
    assert.strictEqual(result, payload);
    done();
  });
  it('should handle null payload without throwing', function (done) {
    assert.doesNotThrow(function () {
      pollSubmissionDebugHook(null);
    });
    done();
  });
  it('should detect when composer is undefined', function (done) {
    var payload = {
      action: 'topics.post'
    };
    pollSubmissionDebugHook(payload);
    var logMessages = loggedMessages.map(function (args) {
      return args.join(' ');
    });
    assert(logMessages.some(function (msg) {
      return msg.includes('Available composer object: undefined');
    }));
    done();
  });
  it('should detect when composer is an object', function (done) {
    global.composer = {
      posts: {}
    };
    var payload = {
      action: 'topics.post'
    };
    pollSubmissionDebugHook(payload);
    var logMessages = loggedMessages.map(function (args) {
      return args.join(' ');
    });
    assert(logMessages.some(function (msg) {
      return msg.includes('Available composer object: object');
    }));
    done();
  });
  it('should log composer posts keys when posts exist', function (done) {
    global.composer = {
      posts: {
        'uuid-1': {
          title: 'Post 1'
        },
        'uuid-2': {
          title: 'Post 2'
        }
      }
    };
    var payload = {
      action: 'topics.post'
    };
    pollSubmissionDebugHook(payload);

    // Check that composer posts keys were logged
    var hasComposerKeysLog = loggedMessages.some(function (args) {
      return args[0] === 'Composer posts keys:' && Array.isArray(args[1]) && args[1].includes('uuid-1') && args[1].includes('uuid-2');
    });
    assert(hasComposerKeysLog);
    done();
  });
  it('should handle empty posts object', function (done) {
    global.composer = {
      posts: {}
    };
    var payload = {
      action: 'topics.post'
    };
    pollSubmissionDebugHook(payload);
    var hasEmptyKeysLog = loggedMessages.some(function (args) {
      return args[0] === 'Composer posts keys:' && Array.isArray(args[1]) && args[1].length === 0;
    });
    assert(hasEmptyKeysLog);
    done();
  });
  it('should log individual post data', function (done) {
    var postData = {
      save_id: 'composer:1:1758843749014',
      action: 'topics.post',
      cid: 2,
      title: 'Test Post'
    };
    global.composer = {
      posts: {
        'test-uuid': postData
      }
    };
    var payload = {
      action: 'topics.post'
    };
    pollSubmissionDebugHook(payload);
    var hasPostLog = loggedMessages.some(function (args) {
      return args[0] === 'Post test-uuid:' && args[1] === postData;
    });
    assert(hasPostLog);
    done();
  });
  it('should detect and log poll config when present', function (done) {
    var pollConfig = {
      type: 'single',
      options: [{
        text: 'Option 1',
        id: 'opt1'
      }, {
        text: 'Option 2',
        id: 'opt2'
      }],
      visibility: 'anonymous',
      closesAt: 0,
      allowRevote: true
    };
    global.composer = {
      posts: {
        '0a471582-9d3c-4d5d-9c42-af2abe297aed': {
          save_id: 'composer:1:1758843749014',
          action: 'topics.post',
          cid: 2,
          pollConfig: pollConfig
        }
      }
    };
    var payload = {
      action: 'topics.post'
    };
    pollSubmissionDebugHook(payload);
    var hasPollConfigLog = loggedMessages.some(function (args) {
      return args[0] === 'Poll config found in 0a471582-9d3c-4d5d-9c42-af2abe297aed:' && args[1] === pollConfig;
    });
    assert(hasPollConfigLog);
    done();
  });
  it('should not log poll config when not present', function (done) {
    global.composer = {
      posts: {
        'test-uuid': {
          save_id: 'composer:1:1758843749014',
          action: 'topics.post',
          cid: 2
          // No pollConfig property
        }
      }
    };
    var payload = {
      action: 'topics.post'
    };
    pollSubmissionDebugHook(payload);
    var hasPollConfigLog = loggedMessages.some(function (args) {
      return args[0] && args[0].includes('Poll config found in');
    });
    assert(!hasPollConfigLog);
    done();
  });
  it('should handle multiple posts, some with poll config', function (done) {
    var pollConfig = {
      type: 'multiple',
      options: [{
        text: 'Yes'
      }, {
        text: 'No'
      }],
      visibility: 'public'
    };
    global.composer = {
      posts: {
        'uuid-with-poll': {
          title: 'Post with poll',
          pollConfig: pollConfig
        },
        'uuid-without-poll': {
          title: 'Post without poll'
        }
      }
    };
    var payload = {
      action: 'topics.post'
    };
    pollSubmissionDebugHook(payload);
    var hasPollConfigLog = loggedMessages.some(function (args) {
      return args[0] === 'Poll config found in uuid-with-poll:' && args[1] === pollConfig;
    });
    var hasNoPollConfigForOther = !loggedMessages.some(function (args) {
      return args[0] && args[0].includes('Poll config found in uuid-without-poll');
    });
    assert(hasPollConfigLog);
    assert(hasNoPollConfigForOther);
    done();
  });
  it('should return the same payload object unmodified', function (done) {
    var originalPayload = {
      action: 'topics.post',
      composerData: {
        title: 'Test'
      },
      metadata: {
        custom: 'value'
      }
    };
    var result = pollSubmissionDebugHook(originalPayload);
    assert.strictEqual(result, originalPayload);
    done();
  });
  it('should handle the exact scenario from debug output', function (done) {
    // Recreate the exact scenario you debugged
    global.composer = {
      posts: {
        '0a471582-9d3c-4d5d-9c42-af2abe297aed': {
          save_id: 'composer:1:1758843749014',
          action: 'topics.post',
          cid: 2,
          handle: undefined,
          title: '',
          pollConfig: {
            type: 'single',
            options: [{
              text: 'Option A',
              id: 'opt1'
            }, {
              text: 'Option B',
              id: 'opt2'
            }],
            visibility: 'anonymous',
            closesAt: 0,
            allowRevote: true
          }
        }
      }
    };
    var payload = {
      composerUid: 1,
      fn: 'init',
      action: 'topics.post',
      composerData: {
        tid: 'postQueueId',
        redirect: true
      }
    };
    var result = pollSubmissionDebugHook(payload);

    // Verify key log messages exist
    var logMessages = loggedMessages.map(function (args) {
      return args.join(' ');
    });
    assert(logMessages.some(function (msg) {
      return msg.includes('=== POLL SUBMISSION DEBUG ===');
    }));
    assert(logMessages.some(function (msg) {
      return msg.includes('Available composer object: object');
    }));
    var hasUUIDLog = loggedMessages.some(function (args) {
      return args[0] === 'Composer posts keys:' && Array.isArray(args[1]) && args[1].includes('0a471582-9d3c-4d5d-9c42-af2abe297aed');
    });
    assert(hasUUIDLog);
    var hasPollConfigLog = loggedMessages.some(function (args) {
      return args[0] && args[0].includes('Poll config found in 0a471582-9d3c-4d5d-9c42-af2abe297aed');
    });
    assert(hasPollConfigLog);

    // Verify payload is returned unchanged
    assert.strictEqual(result, payload);
    done();
  });
  it('should handle composer.posts being null', function (done) {
    global.composer = {
      posts: null
    };
    var payload = {
      action: 'topics.post'
    };
    assert.doesNotThrow(function () {
      pollSubmissionDebugHook(payload);
    });
    done();
  });
  it('should handle composer without posts property', function (done) {
    global.composer = {
      someOtherProperty: 'value'
    };
    var payload = {
      action: 'topics.post'
    };
    pollSubmissionDebugHook(payload);
    var logMessages = loggedMessages.map(function (args) {
      return args.join(' ');
    });
    assert(logMessages.some(function (msg) {
      return msg.includes('Available composer object: object');
    }));
    // Should not log composer posts keys since posts property doesn't exist
    var hasComposerKeysLog = loggedMessages.some(function (args) {
      return args[0] === 'Composer posts keys:';
    });
    assert(!hasComposerKeysLog);
    done();
  });
  it('should handle null poll config', function (done) {
    global.composer = {
      posts: {
        'test-uuid': {
          pollConfig: null
        }
      }
    };
    var payload = {
      action: 'topics.post'
    };
    pollSubmissionDebugHook(payload);

    // Should not log poll config since it's null (falsy)
    var hasPollConfigLog = loggedMessages.some(function (args) {
      return args[0] && args[0].includes('Poll config found in');
    });
    assert(!hasPollConfigLog);
    done();
  });
});