'use strict';

const assert = require('assert');

describe('Plugin: composer polls', () => {
	let plugin;
	let originalMainRequire;
	const storedObjects = new Map();

	const dbStub = {
		async setObject(key, value) {
			storedObjects.set(key, JSON.parse(JSON.stringify(value)));
		},
		async setObjectField(key, field, value) {
			const existing = storedObjects.get(key) || {};
			existing[field] = value;
			storedObjects.set(key, existing);
		},
		async getObject(key) {
			const value = storedObjects.get(key);
			return value ? JSON.parse(JSON.stringify(value)) : null;
		},
	};

	const utilsStub = {
		isNumber(value) {
			if (value === null || value === undefined) {
				return false;
			}
			return !Number.isNaN(Number(value));
		},
	};

	before(() => {
		originalMainRequire = require.main.require;
		require.main.require = (modulePath) => {
			if (modulePath === './src/database') {
				return dbStub;
			}
			if (modulePath === './src/utils') {
				return utilsStub;
			}
			return originalMainRequire(modulePath);
		};
		plugin = require('../../plugins/nodebb-plugin-composer-polls/library');
	});

	after(() => {
		require.main.require = originalMainRequire;
		delete require.cache[require.resolve('../../plugins/nodebb-plugin-composer-polls/library')];
	});

	beforeEach(() => {
		storedObjects.clear();
	});

	describe('addPollFormattingOption', () => {
		it('adds poll toolbar button only once', async () => {
			const payload = { options: [] };
			const first = await plugin.addPollFormattingOption(payload);
			assert.strictEqual(first.options.length, 1);
			const option = first.options[0];
			assert.strictEqual(option.name, 'polls');
			assert.strictEqual(option.badge, true);
			assert.strictEqual(option.visibility.reply, false);

			const again = await plugin.addPollFormattingOption(first);
			assert.strictEqual(again.options.length, 1);
		});
	});

	describe('handleTopicPost', () => {
		it('sanitizes poll payload and stores it on _poll', async () => {
			const future = Date.now() + 60000;
			const data = {
				uid: 42,
				poll: {
					type: 'single',
					options: [
						{ id: 'dup', text: 'Option A' },
						{ id: 'dup', text: 'Option B ' },
					],
					visibility: 'public',
					closesAt: future,
				},
			};

			const result = await plugin.handleTopicPost(data);
			assert.ok(result._poll);
			assert.strictEqual(result.poll, undefined);
			const sanitized = result._poll;
			assert.strictEqual(sanitized.options.length, 2);
			const ids = sanitized.options.map(option => option.id);
			assert.notStrictEqual(ids[0], ids[1]);
			assert.strictEqual(sanitized.visibility, 'public');
			assert.strictEqual(sanitized.ownerUid, 42);
			assert.strictEqual(sanitized.allowRevote, true);
			assert.strictEqual(sanitized.closesAt, Math.round(future));
		});

		it('throws when uid is not numeric', async () => {
			const payload = {
				uid: 'not-a-number',
				poll: {
					type: 'single',
					options: [
						{ text: 'One' },
						{ text: 'Two' },
					],
				},
			};
			await assert.rejects(() => plugin.handleTopicPost(payload), /invalid-author/);
		});
	});

	describe('onTopicPost', () => {
		it('persists poll data alongside post and topic references', async () => {
			const data = {
				_poll: {
					type: 'single',
					options: [
						{ id: 'opt1', text: 'One' },
						{ id: 'opt2', text: 'Two' },
					],
					visibility: 'anonymous',
					allowRevote: true,
					closesAt: 0,
				},
			};
			const post = { pid: 101, uid: 7 };
			const topic = { tid: 55 };

			await plugin.onTopicPost({ topic, post, data });

			const pollRecord = storedObjects.get('poll:101');
			assert.ok(pollRecord);
			assert.strictEqual(pollRecord.id, '101');
			assert.strictEqual(pollRecord.pid, '101');
			assert.strictEqual(pollRecord.tid, '55');
			assert.strictEqual(pollRecord.uid, '7');
			assert.strictEqual(pollRecord.allowRevote, 1);
			assert.ok(storedObjects.get('post:101'));
			assert.strictEqual(storedObjects.get('post:101').pollId, '101');
			assert.ok(storedObjects.get('topic:55'));
			assert.strictEqual(storedObjects.get('topic:55').pollId, '101');
		});
	});

	describe('attachPollToPosts', () => {
		it('hydrates posts with normalised poll data and permissions', async () => {
			storedObjects.set('poll:2001', {
				id: '2001',
				pid: '2001',
				tid: '88',
				uid: '5',
				type: 'multi',
				visibility: 'public',
				allowRevote: '1',
				closesAt: '0',
				createdAt: '100',
				updatedAt: '120',
				options: JSON.stringify([{ id: 'optA', text: 'Alpha' }]),
				results: JSON.stringify({ optA: ['5'] }),
			});

			const hookData = {
				uid: '5',
				posts: [
					{ pid: 2001, pollId: 2001 },
					{ pid: 2002 },
				],
			};

			const result = await plugin.attachPollToPosts(hookData);
			assert.ok(result.posts[0].poll);
			assert.strictEqual(result.posts[0].poll.id, '2001');
			assert.strictEqual(result.posts[0].poll.options[0].text, 'Alpha');
			assert.strictEqual(result.posts[0].poll.canManage, true);
			assert.ok(!result.posts[1].poll);
		});
	});
});
