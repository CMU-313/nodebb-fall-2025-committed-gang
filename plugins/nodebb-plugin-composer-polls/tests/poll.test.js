'use strict';

const assert = require('assert');

// Simulates hook function
const pollSubmissionDebugHook = (payload) => {
  console.log('=== POLL SUBMISSION DEBUG ===');
  console.log('Payload:', payload);
  console.log('Available composer object:', typeof composer);
  
  if (typeof composer !== 'undefined' && composer.posts) {
    console.log('Composer posts keys:', Object.keys(composer.posts));
    
    // Log each composer post to see what's available
    Object.keys(composer.posts).forEach(uuid => {
      console.log(`Post ${uuid}:`, composer.posts[uuid]);
      if (composer.posts[uuid].pollConfig) {
        console.log(`Poll config found in ${uuid}:`, composer.posts[uuid].pollConfig);
      }
    });
  }
  
  return payload;
};

describe('Poll Submission Debug Hook', () => {
  let originalConsoleLog;
  let loggedMessages;

  beforeEach(() => {
    // Capture console.log output
    loggedMessages = [];
    originalConsoleLog = console.log;
    console.log = (...args) => {
      loggedMessages.push(args);
    };
    
    // Reset global composer
    global.composer = undefined;
  });

  afterEach(() => {
    // Restore console.log
    console.log = originalConsoleLog;
    
    // Clean up global
    delete global.composer;
  });

  it('should log debug header and payload information', (done) => {
    const payload = {
      action: 'topics.post',
      composerData: { title: 'Test Topic' }
    };

    const result = pollSubmissionDebugHook(payload);

    // Check that debug messages were logged
    const logMessages = loggedMessages.map(args => args.join(' '));
    assert(logMessages.some(msg => msg.includes('=== POLL SUBMISSION DEBUG ===')));
    assert.strictEqual(result, payload);
    done();
  });

  it('should handle null payload without throwing', (done) => {
    assert.doesNotThrow(() => {
      pollSubmissionDebugHook(null);
    });
    done();
  });

  it('should detect when composer is undefined', (done) => {
    const payload = { action: 'topics.post' };
    
    pollSubmissionDebugHook(payload);

    const logMessages = loggedMessages.map(args => args.join(' '));
    assert(logMessages.some(msg => msg.includes('Available composer object: undefined')));
    done();
  });

  it('should detect when composer is an object', (done) => {
    global.composer = { posts: {} };
    const payload = { action: 'topics.post' };
    
    pollSubmissionDebugHook(payload);

    const logMessages = loggedMessages.map(args => args.join(' '));
    assert(logMessages.some(msg => msg.includes('Available composer object: object')));
    done();
  });

  it('should log composer posts keys when posts exist', (done) => {
    global.composer = {
      posts: {
        'uuid-1': { title: 'Post 1' },
        'uuid-2': { title: 'Post 2' }
      }
    };
    const payload = { action: 'topics.post' };
    
    pollSubmissionDebugHook(payload);

    // Check that composer posts keys were logged
    const hasComposerKeysLog = loggedMessages.some(args => 
      args[0] === 'Composer posts keys:' && 
      Array.isArray(args[1]) &&
      args[1].includes('uuid-1') && 
      args[1].includes('uuid-2')
    );
    assert(hasComposerKeysLog);
    done();
  });

  it('should handle empty posts object', (done) => {
    global.composer = { posts: {} };
    const payload = { action: 'topics.post' };
    
    pollSubmissionDebugHook(payload);

    const hasEmptyKeysLog = loggedMessages.some(args => 
      args[0] === 'Composer posts keys:' && 
      Array.isArray(args[1]) && 
      args[1].length === 0
    );
    assert(hasEmptyKeysLog);
    done();
  });

  it('should log individual post data', (done) => {
    const postData = {
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
    const payload = { action: 'topics.post' };
    
    pollSubmissionDebugHook(payload);

    const hasPostLog = loggedMessages.some(args => 
      args[0] === 'Post test-uuid:' && 
      args[1] === postData
    );
    assert(hasPostLog);
    done();
  });

  it('should detect and log poll config when present', (done) => {
    const pollConfig = {
      type: 'single',
      options: [
        { text: 'Option 1', id: 'opt1' },
        { text: 'Option 2', id: 'opt2' }
      ],
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
    const payload = { action: 'topics.post' };
    
    pollSubmissionDebugHook(payload);

    const hasPollConfigLog = loggedMessages.some(args => 
      args[0] === 'Poll config found in 0a471582-9d3c-4d5d-9c42-af2abe297aed:' && 
      args[1] === pollConfig
    );
    assert(hasPollConfigLog);
    done();
  });

  it('should not log poll config when not present', (done) => {
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
    const payload = { action: 'topics.post' };
    
    pollSubmissionDebugHook(payload);

    const hasPollConfigLog = loggedMessages.some(args => 
      args[0] && args[0].includes('Poll config found in')
    );
    assert(!hasPollConfigLog);
    done();
  });

  it('should handle multiple posts, some with poll config', (done) => {
    const pollConfig = {
      type: 'multiple',
      options: [{ text: 'Yes' }, { text: 'No' }],
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
    const payload = { action: 'topics.post' };
    
    pollSubmissionDebugHook(payload);

    const hasPollConfigLog = loggedMessages.some(args => 
      args[0] === 'Poll config found in uuid-with-poll:' && args[1] === pollConfig
    );
    const hasNoPollConfigForOther = !loggedMessages.some(args => 
      args[0] && args[0].includes('Poll config found in uuid-without-poll')
    );
    
    assert(hasPollConfigLog);
    assert(hasNoPollConfigForOther);
    done();
  });

  it('should return the same payload object unmodified', (done) => {
    const originalPayload = {
      action: 'topics.post',
      composerData: { title: 'Test' },
      metadata: { custom: 'value' }
    };
    
    const result = pollSubmissionDebugHook(originalPayload);

    assert.strictEqual(result, originalPayload);
    done();
  });

  it('should handle the exact scenario from debug output', (done) => {
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
            options: [
              { text: 'Option A', id: 'opt1' },
              { text: 'Option B', id: 'opt2' }
            ],
            visibility: 'anonymous',
            closesAt: 0,
            allowRevote: true
          }
        }
      }
    };

    const payload = {
      composerUid: 1,
      fn: 'init',
      action: 'topics.post',
      composerData: {
        tid: 'postQueueId',
        redirect: true
      }
    };
    
    const result = pollSubmissionDebugHook(payload);

    // Verify key log messages exist
    const logMessages = loggedMessages.map(args => args.join(' '));
    assert(logMessages.some(msg => msg.includes('=== POLL SUBMISSION DEBUG ===')));
    assert(logMessages.some(msg => msg.includes('Available composer object: object')));
    
    const hasUUIDLog = loggedMessages.some(args => 
      args[0] === 'Composer posts keys:' && 
      Array.isArray(args[1]) && 
      args[1].includes('0a471582-9d3c-4d5d-9c42-af2abe297aed')
    );
    assert(hasUUIDLog);

    const hasPollConfigLog = loggedMessages.some(args => 
      args[0] && args[0].includes('Poll config found in 0a471582-9d3c-4d5d-9c42-af2abe297aed')
    );
    assert(hasPollConfigLog);
    
    // Verify payload is returned unchanged
    assert.strictEqual(result, payload);
    done();
  });

  it('should handle composer.posts being null', (done) => {
    global.composer = { posts: null };
    const payload = { action: 'topics.post' };
    
    assert.doesNotThrow(() => {
      pollSubmissionDebugHook(payload);
    });
    done();
  });

  it('should handle composer without posts property', (done) => {
    global.composer = { someOtherProperty: 'value' };
    const payload = { action: 'topics.post' };
    
    pollSubmissionDebugHook(payload);

    const logMessages = loggedMessages.map(args => args.join(' '));
    assert(logMessages.some(msg => msg.includes('Available composer object: object')));
    // Should not log composer posts keys since posts property doesn't exist
    const hasComposerKeysLog = loggedMessages.some(args => args[0] === 'Composer posts keys:');
    assert(!hasComposerKeysLog);
    done();
  });

  it('should handle null poll config', (done) => {
    global.composer = {
      posts: {
        'test-uuid': {
          pollConfig: null
        }
      }
    };
    const payload = { action: 'topics.post' };
    
    pollSubmissionDebugHook(payload);

    // Should not log poll config since it's null (falsy)
    const hasPollConfigLog = loggedMessages.some(args => 
      args[0] && args[0].includes('Poll config found in')
    );
    assert(!hasPollConfigLog);
    done();
  });
});