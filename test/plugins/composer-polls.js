'use strict';

const assert = require('assert');


let SocketPlugins;

describe('Plugin: composer polls', () => {
	let plugin;
	let originalMainRequire;
	const storedObjects = new Map();

	const dbStub = {
		async setObject(key, value) {
			const clone = JSON.parse(JSON.stringify(value));
			const existing = storedObjects.get(key) || {};
			storedObjects.set(key, { ...existing, ...clone });
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
		async getObjectField(key, field) {
			const existing = storedObjects.get(key) || {};
			return existing[field] ?? null;
		},
		async deleteObjectField(key, field) {
			const existing = storedObjects.get(key);
			if (existing) {
				delete existing[field];
				storedObjects.set(key, existing);
			}
		},
		async delete(key) {
			storedObjects.delete(key);
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

	const privilegesStub = {
		posts: {
			async canEdit() {
				return { flag: true };
			},
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
			if (modulePath === './src/privileges') {
				return privilegesStub;
			}
			return originalMainRequire(modulePath);
		};
		plugin = require('../../plugins/nodebb-plugin-composer-polls/library');
		SocketPlugins = require('../../src/socket.io/plugins');
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

	describe('handlePostEdit', () => {
		it('sanitizes poll updates for the main post author', async () => {
			storedObjects.set('post:101', { uid: '7', tid: '55' });
			storedObjects.set('topic:55', { mainPid: '101' });

			const data = {
				pid: 101,
				uid: 42,
				poll: {
					type: 'single',
					options: [
						{ text: 'Yes' },
						{ text: 'No' },
					],
					visibility: 'anonymous',
				},
			};

			const result = await plugin.handlePostEdit({ data });
			assert.ok(result.data._poll);
			assert.strictEqual(result.data._poll.ownerUid, 7);
			assert.strictEqual(result.data._poll.options.length, 2);
			assert.strictEqual(result.data.poll, undefined);
		});

		it('marks poll removals when requested', async () => {
			storedObjects.set('post:102', { uid: '9', tid: '60' });
			storedObjects.set('topic:60', { mainPid: '102' });

			const hookData = await plugin.handlePostEdit({ data: { pid: 102, uid: 9, pollRemoved: true } });
			assert.strictEqual(hookData.data._removePoll, true);
		});

		it('ignores edits for non-main posts', async () => {
			storedObjects.set('post:201', { uid: '9', tid: '61' });
			storedObjects.set('topic:61', { mainPid: '200' });

			const data = {
				pid: 201,
				uid: 9,
				poll: {
					type: 'single',
					options: [
						{ text: 'A' },
						{ text: 'B' },
					],
				},
			};

			const result = await plugin.handlePostEdit({ data });
			assert.strictEqual(result.data._poll, undefined);
		});
	});

	describe('onPostEdit', () => {
		it('updates stored poll when a new configuration is supplied', async () => {
			storedObjects.set('post:101', { uid: '7', tid: '55', pollId: '101' });
			storedObjects.set('topic:55', { mainPid: '101', pollId: '101' });
			storedObjects.set('poll:101', {
				id: '101',
				pid: '101',
				tid: '55',
				uid: '7',
				type: 'single',
				visibility: 'anonymous',
				allowRevote: 1,
				closesAt: 0,
				createdAt: '1000',
				updatedAt: '1000',
				options: JSON.stringify([
					{ id: 'opt1', text: 'Old' },
					{ id: 'opt2', text: 'Two' },
				]),
				results: JSON.stringify({
					totalParticipants: 3,
					options: {
						opt1: { count: 2 },
						opt2: { count: 1 },
					},
				}),
			});

			const data = {
				_poll: {
					type: 'single',
					options: [
						{ id: 'opt1', text: 'Updated One' },
						{ id: 'opt2', text: 'Updated Two' },
					],
					visibility: 'anonymous',
					allowRevote: true,
					closesAt: 0,
					ownerUid: 7,
				},
			};

			await plugin.onPostEdit({ post: { pid: 101, uid: 7, tid: 55 }, data });

			const record = storedObjects.get('poll:101');
			assert.ok(record);
			const options = JSON.parse(record.options);
			assert.strictEqual(options[0].text, 'Updated One');
			const results = JSON.parse(record.results);
			assert.strictEqual(results.options.opt1.count, 2);
			assert.strictEqual(storedObjects.get('post:101').pollId, '101');
			assert.strictEqual(storedObjects.get('topic:55').pollId, '101');
		});

		it('removes poll data when requested', async () => {
			storedObjects.set('post:202', { uid: '8', tid: '77', pollId: '202' });
			storedObjects.set('topic:77', { mainPid: '202', pollId: '202' });
			storedObjects.set('poll:202', { id: '202', pid: '202', tid: '77', uid: '8', options: '[]', results: '{}' });

			await plugin.onPostEdit({ post: { pid: 202, uid: 8, tid: 77 }, data: { _removePoll: true } });

			assert.strictEqual(storedObjects.has('poll:202'), false);
			assert.strictEqual(storedObjects.get('post:202').pollId, undefined);
			assert.strictEqual(storedObjects.get('topic:77').pollId, undefined);
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

	describe('onPostsPurge', () => {
		it('removes poll data when the poll post is purged', async () => {
			storedObjects.set('post:500', { uid: '2', tid: '77', pollId: '500' });
			storedObjects.set('topic:77', { pollId: '500' });
			storedObjects.set('poll:500', { id: '500', pid: '500', tid: '77', uid: '2', options: '[]', results: '{}' });
			storedObjects.set('pollVotes:500', { '9': JSON.stringify({ selections: ['opt1'], castAt: Date.now() }) });

			await plugin.onPostsPurge({ posts: [{ pid: 500, tid: 77 }] });

			assert.strictEqual(storedObjects.has('poll:500'), false);
			assert.strictEqual(storedObjects.has('pollVotes:500'), false);
			assert.strictEqual(storedObjects.get('topic:77')?.pollId, undefined);
		});
	});

	describe('onTopicPurge', () => {
		it('removes residual poll references when a topic is purged', async () => {
			storedObjects.set('post:800', { uid: '4', tid: '88', pollId: '800' });
			storedObjects.set('topic:88', { pollId: '800' });
			storedObjects.set('poll:800', { id: '800', pid: '800', tid: '88', uid: '4', options: '[]', results: '{}' });

			await plugin.onTopicPurge({ topic: { tid: 88, pollId: '800' } });

			assert.strictEqual(storedObjects.has('poll:800'), false);
			assert.strictEqual(storedObjects.get('topic:88')?.pollId, undefined);
		});
	});

	describe('socket manage', () => {
		it('allows poll owners to close and reopen polls', async () => {
			storedObjects.set('poll:900', {
				id: '900',
				pid: '900',
				tid: '44',
				uid: '6',
				type: 'single',
				visibility: 'anonymous',
				allowRevote: 1,
				options: JSON.stringify([{ id: 'opt1', text: 'Choice' }]),
				results: JSON.stringify({ totalParticipants: 0, options: { opt1: { count: 0 } } }),
			});

			const socket = { uid: 6 };
			const closeResult = await new Promise((resolve, reject) => {
				SocketPlugins.composerPolls.manage(socket, { pollId: '900', action: 'close' }, (err, res) => {
					if (err) { reject(err); return; }
					resolve(res);
				});
			});
			assert.ok(closeResult.isClosed, 'poll should be closed');
			const storedAfterClose = storedObjects.get('poll:900');
			assert.ok(parseInt(storedAfterClose.closesAt, 10) > 0);

			const reopenResult = await new Promise((resolve, reject) => {
				SocketPlugins.composerPolls.manage(socket, { pollId: '900', action: 'reopen' }, (err, res) => {
					if (err) { reject(err); return; }
					resolve(res);
				});
			});
			assert.strictEqual(reopenResult.isClosed, false);
			const storedAfterReopen = storedObjects.get('poll:900');
			assert.strictEqual(parseInt(storedAfterReopen.closesAt, 10), 0);
		});
	});
});
