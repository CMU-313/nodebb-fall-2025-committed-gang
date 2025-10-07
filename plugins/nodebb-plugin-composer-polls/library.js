'use strict';

const db = require.main.require('./src/database');
const utils = require.main.require('./src/utils');
const user = require.main.require('./src/user');
const privileges = require.main.require('./src/privileges');
const nconf = require.main.require('nconf');
const winston = require.main.require('winston');
const SocketPlugins = require.main.require('./src/socket.io/plugins');

const SOCKET_NAMESPACE = 'composerPolls';


const POLL_TYPES = new Set(['single', 'multi', 'ranked']);
const POLL_VISIBILITY = new Set(['anonymous', 'public']);
const POLL_MIN_OPTIONS = 2;
const POLL_MAX_OPTIONS = 10;
const OPTION_MAX_LENGTH = 120;

const plugin = {};
plugin.addPollFormattingOption = async function (payload) {
	if (!payload || !Array.isArray(payload.options)) {
		return payload;
	}

	const alreadyPresent = payload.options.some(option => option && option.name === 'polls');
	if (!alreadyPresent) {
		const defaultVisibility = payload.defaultVisibility || {
			mobile: true,
			desktop: true,
			main: true,
			reply: true,
		};

		payload.options.push({
			name: 'polls',
			title: '[[composer-polls:add]]',
			className: 'fa fa-pie-chart',
			badge: true,
			visibility: {
				...defaultVisibility,
				reply: false,
			},
		});
	}

	return payload;
};

// 1. In plugin.handleComposerCheck (around line 75):
plugin.handleComposerCheck = async function (payload) {
	if (!payload || !payload.data || !payload.data.poll) {
		return payload;
	}

	if (!utils.isNumber(payload.data.uid)) {
		throw new Error('[[composer-polls:errors.invalid-author]]');
	}

	const sanitized = sanitizePollConfig(payload.data.poll, parseInt(payload.data.uid, 10));
	payload.data._poll = sanitized;
	delete payload.data.poll;
	
	return payload;
};

plugin.handleTopicPost = async function (data) {
	if (!data || !data.poll) {
		return data;
	}

	if (!utils.isNumber(data.uid)) {
		throw new Error('[[composer-polls:errors.invalid-author]]');
	}

	const sanitized = sanitizePollConfig(data.poll, parseInt(data.uid, 10));
	data._poll = sanitized;
	delete data.poll;

	return data;
};

plugin.onTopicPost = async function ({ topic, post, data }) {
	if (!data || !data._poll || !post || !topic) {
		return;
	}
	
	const pollId = String(post.pid);
	const now = Date.now();
	const pollRecord = {
		id: pollId,
		pid: String(post.pid),
		tid: String(topic.tid),
		uid: String(post.uid),
		type: data._poll.type,
		visibility: data._poll.visibility,
		allowRevote: data._poll.allowRevote ? 1 : 0,
		closesAt: data._poll.closesAt || 0,
		createdAt: now,
		updatedAt: now,
		options: JSON.stringify(data._poll.options),
		results: JSON.stringify(createEmptyResults(data._poll)),
	};

	try {
		await db.setObject(`poll:${pollId}`, pollRecord);
		await Promise.all([
			db.setObjectField(`post:${post.pid}`, 'pollId', pollId),
			db.setObjectField(`topic:${topic.tid}`, 'pollId', pollId),
		]);
	} catch (error) {
		winston.error(`[composer-polls] Failed to save poll for post ${post.pid}: ${error.message}`);
		// Clean up any partial data
		await db.delete(`poll:${pollId}`).catch(() => {});
		await db.deleteObjectField(`post:${post.pid}`, 'pollId').catch(() => {});
		await db.deleteObjectField(`topic:${topic.tid}`, 'pollId').catch(() => {});
		throw new Error('[[composer-polls:errors.save-failed]]');
	}
};

// Helpers for debugging composer post data

plugin.attachPollToPosts = async function (hookData) {
	const { posts, uid } = hookData;
	if (!Array.isArray(posts) || !posts.length) {
		return hookData;
	}

	const pollIds = Array.from(new Set(posts
		.filter(post => post && post.pollId)
		.map(post => String(post.pollId))));

	if (!pollIds.length) {
		return hookData;
	}

	const pollRecords = await Promise.all(pollIds.map(id => db.getObject(`poll:${id}`)));
	const pollMap = new Map();
	pollRecords.forEach((record) => {
		if (!record) {
			return;
		}
		const poll = normalisePollRecord(record);
		pollMap.set(String(poll.id), poll);
	});

	if (!pollMap.size) {
		return hookData;
	}

	const viewerUid = utils.isNumber(uid) ? String(uid) : null;
	const viewerVotes = new Map();
	const voterLookups = new Map();

	const publicPolls = Array.from(pollMap.values()).filter(poll => poll.visibility === 'public');
	if (publicPolls.length) {
		const voterIds = new Set();
		publicPolls.forEach((poll) => {
			Object.values(poll.results.options || {}).forEach((result) => {
				if (Array.isArray(result.voters)) {
					result.voters.forEach((voter) => {
						if (voter) {
							voterIds.add(String(voter));
						}
					});
				}
			});
		});
		if (voterIds.size) {
			const users = await user.getUsersFields(Array.from(voterIds), ['username', 'userslug']);
			users.forEach((userData, index) => {
				const uidValue = Array.from(voterIds)[index];
				if (!userData) {
					return;
				}
				voterLookups.set(uidValue, {
					uid: uidValue,
					username: userData.username || uidValue,
					userslug: userData.userslug || '',
					profileUrl: userData.userslug ? `${nconf.get('relative_path') || ''}/user/${userData.userslug}` : null,
				});
			});
		}
	}

	if (viewerUid) {
		await Promise.all(Array.from(pollMap.keys()).map(async (pollId) => {
			const vote = await getUserVote(pollId, viewerUid);
			viewerVotes.set(pollId, vote);
		}));
	}

	posts.forEach((post) => {
		if (!post || !post.pollId) {
			return;
		}
		const poll = pollMap.get(String(post.pollId));
		if (!poll) {
			return;
		}
		if (poll.visibility === 'public') {
			Object.values(poll.results.options || {}).forEach((result) => {
				if (!Array.isArray(result.voters)) {
					return;
				}
				result.voters = result.voters.map((voterUid) => {
					const profile = voterLookups.get(String(voterUid));
					if (!profile) {
						return {
							uid: String(voterUid),
							username: String(voterUid),
						};
					}
					return profile;
				});
			});
		}
		const viewerVote = viewerUid ? viewerVotes.get(String(poll.id)) : null;
		post.poll = preparePollForView(poll, viewerUid, viewerVote);
	});

	return hookData;
};

plugin.handlePostEdit = async function (hookData) {
	const { data } = hookData;
	if (!data || !utils.isNumber(data.pid)) {
		return hookData;
	}

	const pid = parseInt(data.pid, 10);
	const context = await getPostContext(pid);
	if (!context || !context.isMain) {
		delete data.poll;
		delete data.pollRemoved;
		return hookData;
	}

	// Check if user has permission to edit the post (respects category/topic restrictions)
	const editorUid = parseInt(data.uid, 10);
	const canEdit = await privileges.posts.canEdit(pid, editorUid);
	if (!canEdit.flag) {
		winston.warn(`[composer-polls] User ${editorUid} attempted to edit poll on post ${pid} without permission`);
		throw new Error('[[error:no-privileges]]');
	}

	const pollProvided = Object.prototype.hasOwnProperty.call(data, 'poll');
	const removeRequested = data.pollRemoved === true;
	if (!pollProvided && removeRequested) {
		data._removePoll = true;
		delete data.pollRemoved;
		return hookData;
	}
	if (!pollProvided) {
		delete data.pollRemoved;
		return hookData;
	}

	const ownerCandidate = utils.isNumber(context.postUid) ? parseInt(context.postUid, 10) : parseInt(data.uid, 10);
	const ownerUid = utils.isNumber(ownerCandidate) ? ownerCandidate : parseInt(data.uid, 10);
	if (!utils.isNumber(ownerUid)) {
		throw new Error('[[composer-polls:errors.invalid-author]]');
	}

	const sanitized = sanitizePollConfig(data.poll, ownerUid);
	data._poll = sanitized;
	data._pollContext = context;
	delete data.poll;
	delete data.pollRemoved;

	return hookData;
};

plugin.onPostEdit = async function ({ post, data }) {
	if (!post || !data || !utils.isNumber(post.pid)) {
		return;
	}

	const pid = parseInt(post.pid, 10);
	const context = data._pollContext || await getPostContext(pid);
	if (!context || !context.isMain) {
		return;
	}

	if (data._removePoll) {
		await removePollRecord(String(pid), context.tid);
		return;
	}

	if (!data._poll) {
		return;
	}

	const pollId = String(pid);
	const now = Date.now();
	const existingRecord = await db.getObject(`poll:${pollId}`);
	const mergedResults = mergeResultsForEdit(data._poll, existingRecord);
	const createdAt = parseInt(existingRecord?.createdAt, 10) || now;
	const pollRecord = {
		id: pollId,
		pid: pollId,
		tid: String(context.tid),
		uid: String(data._poll.ownerUid),
		type: data._poll.type,
		visibility: data._poll.visibility,
		allowRevote: data._poll.allowRevote ? 1 : 0,
		closesAt: data._poll.closesAt || 0,
		createdAt,
		updatedAt: now,
		options: JSON.stringify(data._poll.options),
		results: JSON.stringify(mergedResults),
	};

	await Promise.all([
		db.setObject(`poll:${pollId}`, pollRecord),
		db.setObjectField(`post:${pid}`, 'pollId', pollId),
		context.tid ? db.setObjectField(`topic:${context.tid}`, 'pollId', pollId) : Promise.resolve(),
	]);
};

plugin.onPostsPurge = async function ({ posts }) {
	if (!Array.isArray(posts) || !posts.length) {
		return;
	}

	await Promise.all(posts.map(async (post) => {
		if (!post || !utils.isNumber(post.pid)) {
			return;
		}
		const pid = parseInt(post.pid, 10);
		const pollId = await db.getObjectField(`post:${pid}`, 'pollId');
		if (!pollId) {
			return;
		}
		const tid = utils.isNumber(post.tid) ? parseInt(post.tid, 10) : parseInt(await db.getObjectField(`post:${pollId}`, 'tid'), 10) || null;
		await removePollRecord(String(pollId), tid);
	}));
};

plugin.onTopicPurge = async function ({ topic }) {
	if (!topic || !utils.isNumber(topic.tid)) {
		return;
	}

	const tid = parseInt(topic.tid, 10);
	let pollId = topic.pollId;
	if (!pollId) {
		pollId = await db.getObjectField(`topic:${tid}`, 'pollId');
	}
	if (!pollId) {
		return;
	}
	await removePollRecord(String(pollId), tid);
};

plugin.onPostMove = async function ({ post, tid }) {
	if (!post || !utils.isNumber(post.pid) || !utils.isNumber(tid)) {
		return;
	}

	const pid = parseInt(post.pid, 10);
	const newTid = parseInt(tid, 10);
	
	// Check if this post has a poll
	const pollId = await db.getObjectField(`post:${pid}`, 'pollId');
	if (!pollId) {
		return;
	}

	// Get the poll to check if this is the main post
	const pollRecord = await db.getObject(`poll:${pollId}`);
	if (!pollRecord || String(pollRecord.pid) !== String(pid)) {
		return;
	}

	// Update the poll's topic reference
	const oldTid = parseInt(pollRecord.tid, 10);
	await Promise.all([
		db.setObjectField(`poll:${pollId}`, 'tid', String(newTid)),
		db.setObjectField(`poll:${pollId}`, 'updatedAt', Date.now()),
		// Remove pollId from old topic, add to new topic
		oldTid ? db.deleteObjectField(`topic:${oldTid}`, 'pollId') : Promise.resolve(),
		db.setObjectField(`topic:${newTid}`, 'pollId', pollId),
	]);
};

plugin.onTopicMerge = async function ({ mergeIntoTid, otherTids }) {
	if (!utils.isNumber(mergeIntoTid) || !Array.isArray(otherTids)) {
		return;
	}

	const mainTid = parseInt(mergeIntoTid, 10);
	
	// Check if the main topic already has a poll
	const mainPollId = await db.getObjectField(`topic:${mainTid}`, 'pollId');
	
	// Check each merged topic for polls
	for (const tid of otherTids) {
		if (!utils.isNumber(tid)) {
			continue;
		}
		const numericTid = parseInt(tid, 10);
		const pollId = await db.getObjectField(`topic:${numericTid}`, 'pollId');
		
		if (!pollId) {
			continue;
		}
		
		if (mainPollId) {
			// Main topic already has a poll, close the conflicting poll
			await db.setObject(`poll:${pollId}`, {
				closesAt: Date.now(),
				updatedAt: Date.now(),
			});
		} else {
			// Move the poll to the merged topic
			await Promise.all([
				db.setObjectField(`poll:${pollId}`, 'tid', String(mainTid)),
				db.setObjectField(`poll:${pollId}`, 'updatedAt', Date.now()),
				db.setObjectField(`topic:${mainTid}`, 'pollId', pollId),
			]);
		}
		
		// Clean up old topic reference
		await db.deleteObjectField(`topic:${numericTid}`, 'pollId');
	}
};

// Sanitization and normalization functions

function sanitizePollConfig(rawPoll, ownerUid) {
	if (!rawPoll || typeof rawPoll !== 'object') {
		throw new Error('[[composer-polls:errors.invalid]]');
	}

	const type = typeof rawPoll.type === 'string' ? rawPoll.type.trim() : '';
	if (!POLL_TYPES.has(type)) {
		throw new Error('[[composer-polls:errors.type-required]]');
	}

	const rawOptions = Array.isArray(rawPoll.options) ? rawPoll.options : [];
	if (rawOptions.length < POLL_MIN_OPTIONS) {
		throw new Error('[[composer-polls:errors.option-required, ' + POLL_MIN_OPTIONS + ']]');
	}
	if (rawOptions.length > POLL_MAX_OPTIONS) {
		throw new Error('[[composer-polls:errors.option-limit, ' + POLL_MAX_OPTIONS + ']]');
	}

	const usedIds = new Set();
	const options = rawOptions.map((rawOption, index) => {
		const option = sanitizeOption(rawOption, index);

		// Guarantee every option has a unique id even if duplicates were supplied.
		let uniqueId = option.id;
		let counter = 1;
		while (usedIds.has(uniqueId)) {
			uniqueId = `${option.id}-${counter}`;
			counter += 1;
		}
		usedIds.add(uniqueId);

		return {
			id: uniqueId,
			text: option.text,
		};
	});

	let closesAt = 0;
	if (rawPoll.closesAt) {
		const parsed = Number(rawPoll.closesAt);
		if (Number.isNaN(parsed) || parsed <= Date.now()) {
			throw new Error('[[composer-polls:errors.close-date]]');
		}
		closesAt = Math.round(parsed);
	}

	let visibility = typeof rawPoll.visibility === 'string' ? rawPoll.visibility.trim() : 'anonymous';
	if (!POLL_VISIBILITY.has(visibility)) {
		visibility = 'anonymous';
	}

	return {
		type,
		options,
		visibility,
		allowRevote: true,
		closesAt,
		ownerUid,
	};
}


function sanitizeOption(rawOption, index) {
	const text = typeof rawOption?.text === 'string' ? rawOption.text.trim() : '';
	if (!text) {
		throw new Error('[[composer-polls:errors.option-text]]');
	}
	if (text.length > OPTION_MAX_LENGTH) {
		throw new Error('[[composer-polls:errors.option-length, ' + OPTION_MAX_LENGTH + ']]');
	}

	const suppliedId = typeof rawOption?.id === 'string' ? rawOption.id.trim() : '';
	const baseId = suppliedId && /^[a-zA-Z0-9_-]+$/.test(suppliedId) ? suppliedId.slice(0, 24) : `opt${index + 1}`;

	// Sanitize HTML to prevent XSS attacks
	const sanitizedText = utils.escapeHTML(text);

	return {
		id: baseId,
		text: sanitizedText,
	};
}

function normalisePollRecord(record) {
	let options = [];
	try {
		options = JSON.parse(record.options || '[]');
	} catch (err) {
		options = [];
	}
	if (!Array.isArray(options)) {
		options = [];
	}
	options = options
		.map((option) => ({
			id: typeof option?.id === 'string' ? option.id : String(option?.id || ''),
			text: typeof option?.text === 'string' ? option.text : '',
		}))
		.filter(option => option.id && option.text);

	const closesAt = parseInt(record.closesAt, 10) || 0;

	const poll = {
		id: String(record.id || record.pid),
		pid: parseInt(record.pid, 10),
		tid: parseInt(record.tid, 10),
		ownerUid: parseInt(record.uid, 10),
		type: record.type,
		visibility: record.visibility,
		allowRevote: parseInt(record.allowRevote, 10) === 1,
		closesAt: closesAt > 0 ? closesAt : null,
		createdAt: parseInt(record.createdAt, 10) || null,
		updatedAt: parseInt(record.updatedAt, 10) || null,
		options,
	};

	let rawResults = {};
	try {
		rawResults = JSON.parse(record.results || '{}');
	} catch (err) {
		rawResults = {};
	}

	poll.results = ensureResultsStructure(rawResults, poll);

	return poll;
}

async function getUserVote(pollId, uid) {
	if (!uid) {
		return null;
	}

	const raw = await db.getObjectField(`pollVotes:${pollId}`, String(uid));
	return parseVoteRecord(raw);
}

function preparePollForView(poll, viewerUid, viewerVote) {
	const resultsForViewer = prepareResultsForViewer(poll);
	const hasVoted = Boolean(viewerVote);
	const isClosed = isPollClosed(poll);
	const numericViewerUid = utils.isNumber(viewerUid) ? parseInt(viewerUid, 10) : null;
	const canManage = numericViewerUid !== null && numericViewerUid === poll.ownerUid;
	const canVote = Boolean(viewerUid) && !isClosed && (!hasVoted || poll.allowRevote);
	const canRevote = Boolean(viewerUid) && !isClosed && hasVoted && poll.allowRevote;

	return {
		id: poll.id,
		pid: poll.pid,
		tid: poll.tid,
		ownerUid: poll.ownerUid,
		type: poll.type,
		visibility: poll.visibility,
		allowRevote: poll.allowRevote,
		closesAt: poll.closesAt,
		createdAt: poll.createdAt,
		updatedAt: poll.updatedAt,
		options: poll.options,
		results: resultsForViewer,
		totalParticipants: resultsForViewer.totalParticipants,
		canManage,
		hasVoted,
		canVote,
		canRevote,
		isClosed,
		userSelections: viewerVote ? viewerVote.selections : [],
		userLastVoteAt: viewerVote ? viewerVote.castAt : null,
	};
}

function prepareResultsForViewer(poll) {
	const cloned = cloneResults(poll.results);
	const results = ensureResultsStructure(cloned, poll);
	if (poll.visibility !== 'public') {
		Object.values(results.options).forEach((optionResult) => {
			if (optionResult && typeof optionResult === 'object') {
				delete optionResult.voters;
			}
		});
	}
	return results;
}

function createEmptyResults(poll) {
	return ensureResultsStructure({}, poll);
}

function ensureResultsStructure(rawResults, poll) {
	const safePoll = poll || {};
	const options = Array.isArray(safePoll.options) ? safePoll.options : [];
	const results = {
		totalParticipants: 0,
		options: {},
	};

	const total = parseInt(rawResults?.totalParticipants, 10);
	results.totalParticipants = Number.isFinite(total) && total > 0 ? total : 0;

	options.forEach((option) => {
		const optionId = typeof option?.id === 'string' ? option.id : String(option?.id || '');
		if (!optionId) {
			return;
		}
		const optionData = rawResults?.options?.[optionId] || {};
		results.options[optionId] = normaliseOptionResult(optionData, safePoll);
	});

	return results;
}

function normaliseOptionResult(optionResult, poll) {
	const normalised = {
		count: parseInt(optionResult?.count, 10) || 0,
	};
	if (poll.type === 'ranked') {
		normalised.points = parseInt(optionResult?.points, 10) || 0;
	}
	if (poll.visibility === 'public') {
		const voters = Array.isArray(optionResult?.voters) ? optionResult.voters.map(val => String(val)) : [];
		normalised.voters = Array.from(new Set(voters.filter(Boolean)));
	}
	return normalised;
}

function cloneResults(results) {
	try {
		return JSON.parse(JSON.stringify(results || {}));
	} catch (err) {
		return { totalParticipants: 0, options: {} };
	}
}

function ensureOptionResult(results, optionId, poll) {
	if (!results.options[optionId]) {
		results.options[optionId] = normaliseOptionResult({}, poll);
	}
	if (poll.visibility === 'public' && !Array.isArray(results.options[optionId].voters)) {
		results.options[optionId].voters = [];
	}
	if (poll.type === 'ranked' && typeof results.options[optionId].points !== 'number') {
		results.options[optionId].points = 0;
	}
	if (typeof results.options[optionId].count !== 'number') {
		results.options[optionId].count = 0;
	}
	return results.options[optionId];
}

function addVoteToResults(results, poll, selections, voterUid, incrementParticipants) {
	if (incrementParticipants) {
		results.totalParticipants = (results.totalParticipants || 0) + 1;
	}
	if (poll.type === 'ranked') {
		const length = selections.length;
		selections.forEach((optionId, index) => {
			const entry = ensureOptionResult(results, optionId, poll);
			const score = length - index;
			entry.points = (entry.points || 0) + score;
			if (poll.visibility === 'public' && Array.isArray(entry.voters) && !entry.voters.includes(voterUid)) {
				entry.voters.push(voterUid);
			}
		});
		return;
	}

	selections.forEach((optionId) => {
		const entry = ensureOptionResult(results, optionId, poll);
		entry.count = (entry.count || 0) + 1;
		if (poll.visibility === 'public' && Array.isArray(entry.voters) && !entry.voters.includes(voterUid)) {
			entry.voters.push(voterUid);
		}
	});
}

function removeVoteFromResults(results, poll, selections, voterUid, decrementParticipants) {
	if (decrementParticipants) {
		results.totalParticipants = Math.max(0, (results.totalParticipants || 0) - 1);
	}
	if (poll.type === 'ranked') {
		const length = selections.length;
		selections.forEach((optionId, index) => {
			const entry = ensureOptionResult(results, optionId, poll);
			const score = length - index;
			entry.points = Math.max(0, (entry.points || 0) - score);
			if (poll.visibility === 'public' && Array.isArray(entry.voters)) {
				entry.voters = entry.voters.filter(voter => voter !== voterUid);
			}
		});
		return;
	}

	selections.forEach((optionId) => {
		const entry = ensureOptionResult(results, optionId, poll);
		entry.count = Math.max(0, (entry.count || 0) - 1);
		if (poll.visibility === 'public' && Array.isArray(entry.voters)) {
			entry.voters = entry.voters.filter(voter => voter !== voterUid);
		}
	});
}

function normaliseSelections(poll, rawSelections) {
	const options = Array.isArray(poll.options) ? poll.options : [];
	const optionSet = new Set(options.map(option => option.id));

	if (!optionSet.size) {
		throw new Error('[[composer-polls:errors.option-required, ' + POLL_MIN_OPTIONS + ']]');
	}

	if (poll.type === 'single') {
		const choice = Array.isArray(rawSelections) ? rawSelections[0] : rawSelections;
		const value = typeof choice === 'string' ? choice.trim() : '';
		if (!value) {
			throw new Error('[[composer-polls:errors.vote-required]]');
		}
		if (!optionSet.has(value)) {
			throw new Error('[[composer-polls:errors.option-invalid]]');
		}
		return [value];
	}

	if (poll.type === 'multi') {
		const selectionArray = Array.isArray(rawSelections) ? rawSelections : [rawSelections];
		const seen = new Set();
		const cleaned = [];
		selectionArray.forEach((value) => {
			if (typeof value !== 'string') {
				return;
			}
			const trimmed = value.trim();
			if (!trimmed || seen.has(trimmed)) {
				return;
			}
			if (!optionSet.has(trimmed)) {
				throw new Error('[[composer-polls:errors.option-invalid]]');
			}
			seen.add(trimmed);
			cleaned.push(trimmed);
		});
		if (!cleaned.length) {
			throw new Error('[[composer-polls:errors.vote-required]]');
		}
		return cleaned;
	}

	if (poll.type === 'ranked') {
		if (!Array.isArray(rawSelections)) {
			throw new Error('[[composer-polls:errors.vote-ranked-min]]');
		}
		const seen = new Set();
		const cleaned = [];
		rawSelections.forEach((value) => {
			if (typeof value !== 'string') {
				return;
			}
			const trimmed = value.trim();
			if (!trimmed || seen.has(trimmed)) {
				return;
			}
			if (!optionSet.has(trimmed)) {
				throw new Error('[[composer-polls:errors.option-invalid]]');
			}
			seen.add(trimmed);
			cleaned.push(trimmed);
		});
		if (cleaned.length < 2) {
			throw new Error('[[composer-polls:errors.vote-ranked-min]]');
		}
		return cleaned;
	}

	throw new Error('[[composer-polls:errors.invalid]]');
}

function parseVoteRecord(raw) {
	if (!raw) {
		return null;
	}
	try {
		const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
		if (!Array.isArray(parsed?.selections)) {
			return null;
		}
		return {
			selections: parsed.selections.map(value => String(value)).filter(Boolean),
			castAt: parseInt(parsed.castAt, 10) || 0,
		};
	} catch (err) {
		return null;
	}
}

function isPollClosed(poll) {
	if (!poll || !poll.closesAt) {
		return false;
	}
	return poll.closesAt <= Date.now();
}

async function castVote(pollId, voterUid, rawSelections) {
	const pollRecord = await db.getObject(`poll:${pollId}`);
	if (!pollRecord) {
		winston.warn(`[composer-polls] Vote attempt on non-existent poll: ${pollId} by user: ${voterUid}`);
		throw new Error('[[composer-polls:errors.not-found]]');
	}

	const poll = normalisePollRecord(pollRecord);
	if (isPollClosed(poll)) {
		winston.info(`[composer-polls] Vote attempt on closed poll: ${pollId} by user: ${voterUid}`);
		throw new Error('[[composer-polls:errors.closed]]');
	}

	const selections = normaliseSelections(poll, rawSelections);
	const voteKey = `pollVotes:${pollId}`;
	const voterKey = String(voterUid);

	const existingRaw = await db.getObjectField(voteKey, voterKey);
	const existingVote = parseVoteRecord(existingRaw);

	if (existingVote && !poll.allowRevote) {
		throw new Error('[[composer-polls:errors.revoting-disabled]]');
	}

	// Rate limiting: prevent rapid vote changes
	if (existingVote && poll.allowRevote) {
		const timeSinceLastVote = Date.now() - existingVote.castAt;
		const minVoteInterval = 5000; // 5 seconds minimum between votes
		if (timeSinceLastVote < minVoteInterval) {
			const waitTime = Math.ceil((minVoteInterval - timeSinceLastVote) / 1000);
			throw new Error(`[[composer-polls:errors.vote-too-soon, ${waitTime}]]`);
		}
	}

	let results = cloneResults(poll.results);
	results = ensureResultsStructure(results, poll);

	if (existingVote) {
		removeVoteFromResults(results, poll, existingVote.selections, voterKey, false);
	}

	addVoteToResults(results, poll, selections, voterKey, !existingVote);

	const now = Date.now();
	const voteRecord = {
		selections,
		castAt: now,
	};

	await Promise.all([
		db.setObjectField(voteKey, voterKey, JSON.stringify(voteRecord)),
		db.setObject(`poll:${pollId}`, {
			results: JSON.stringify(results),
			updatedAt: now,
		}),
	]);

	poll.results = ensureResultsStructure(results, poll);
	poll.updatedAt = now;

	return preparePollForView(poll, voterKey, voteRecord);
}

async function getPostContext(pid) {
	const postKey = `post:${pid}`;
	const [postRecord, tidValue] = await Promise.all([
		db.getObject(postKey),
		db.getObjectField(postKey, 'tid'),
	]);
	const tid = utils.isNumber(tidValue) ? parseInt(tidValue, 10) : null;
	if (!postRecord || !utils.isNumber(pid) || !utils.isNumber(tid)) {
		return null;
	}
	const topicRecord = await db.getObject(`topic:${tid}`);
	const mainPid = utils.isNumber(topicRecord?.mainPid) ? parseInt(topicRecord.mainPid, 10) : null;
	return {
		pid,
		tid,
		postUid: postRecord.uid,
		isMain: utils.isNumber(mainPid) && mainPid === pid,
		pollId: postRecord.pollId ? String(postRecord.pollId) : null,
	};
}

function mergeResultsForEdit(newPoll, existingRecord) {
	if (!existingRecord) {
		return createEmptyResults(newPoll);
	}
	try {
		const existingPoll = normalisePollRecord(existingRecord);
		const typeChanged = existingPoll.type !== newPoll.type;
		const visibilityChanged = existingPoll.visibility !== newPoll.visibility;
		if (typeChanged || visibilityChanged) {
			return createEmptyResults(newPoll);
		}
		const merged = createEmptyResults(newPoll);
		merged.totalParticipants = existingPoll.results.totalParticipants || 0;
		newPoll.options.forEach((option) => {
			const existing = existingPoll.results.options[option.id];
			if (existing) {
				merged.options[option.id] = {
					count: existing.count || 0,
				};
				if (newPoll.type === 'ranked') {
					merged.options[option.id].points = existing.points || 0;
				}
				if (newPoll.visibility === 'public') {
					merged.options[option.id].voters = Array.isArray(existing.voters) ? existing.voters.slice() : [];
				}
			}
		});
		return ensureResultsStructure(merged, newPoll);
	} catch (err) {
		return createEmptyResults(newPoll);
	}
}

async function removePollRecord(pollId, tid) {
	if (!pollId) {
		return;
	}
	const key = String(pollId);
	await Promise.all([
		db.delete(`poll:${key}`),
		db.delete(`pollVotes:${key}`),
		db.deleteObjectField(`post:${key}`, 'pollId'),
		tid ? db.deleteObjectField(`topic:${tid}`, 'pollId') : Promise.resolve(),
	]);
}

async function handleGetPoll(socket, payload) {
	if (!socket || !utils.isNumber(socket.uid)) {
		throw new Error('[[composer-polls:errors.login-required]]');
	}

	const pid = utils.isNumber(payload?.pid) ? parseInt(payload.pid, 10) : null;
	if (!pid) {
		throw new Error('[[composer-polls:errors.invalid]]');
	}

	const permission = await privileges.posts.canEdit(pid, socket.uid);
	if (!permission || permission.flag !== true) {
		throw new Error(permission?.message || '[[error:no-privileges]]');
	}

	const context = await getPostContext(pid);
	if (!context || !context.isMain) {
		return null;
	}

	const pollKey = context.pollId ? `poll:${context.pollId}` : `poll:${pid}`;
	const pollRecord = await db.getObject(pollKey);
	if (!pollRecord) {
		return null;
	}

	const poll = normalisePollRecord(pollRecord);
	return {
		poll: {
			type: poll.type,
			visibility: poll.visibility,
			allowRevote: poll.allowRevote,
			closesAt: poll.closesAt || 0,
			options: poll.options.map(option => ({
				id: option.id,
				text: option.text,
			})),
		},
	};
}

async function handleManagePoll(socket, payload) {
	if (!socket || !utils.isNumber(socket.uid)) {
		throw new Error('[[composer-polls:errors.login-required]]');
	}

	const pollId = typeof payload?.pollId === 'string' || typeof payload?.pollId === 'number' ? String(payload.pollId).trim() : '';
	if (!pollId) {
		throw new Error('[[composer-polls:errors.invalid]]');
	}

	const pollRecord = await db.getObject(`poll:${pollId}`);
	if (!pollRecord) {
		throw new Error('[[composer-polls:errors.not-found]]');
	}

	const pid = parseInt(pollRecord.pid, 10);
	const permission = await privileges.posts.canEdit(pid, socket.uid);
	if (!permission || permission.flag !== true) {
		throw new Error(permission?.message || '[[error:no-privileges]]');
	}

	const action = typeof payload?.action === 'string' ? payload.action.trim().toLowerCase() : '';
	if (!['close', 'reopen'].includes(action)) {
		throw new Error('[[composer-polls:errors.invalid]]');
	}

	const now = Date.now();
	const updates = {
		updatedAt: now,
	};
	if (action === 'close') {
		updates.closesAt = now;
	} else if (action === 'reopen') {
		updates.closesAt = 0;
	}

	await db.setObject(`poll:${pollId}`, updates);

	const updatedRecord = await db.getObject(`poll:${pollId}`);
	const poll = normalisePollRecord(updatedRecord);
	const voterVote = await getUserVote(pollId, String(socket.uid));
	return preparePollForView(poll, String(socket.uid), voterVote);
}

function registerSocketHandlers() {
	if (!SocketPlugins[SOCKET_NAMESPACE]) {
		SocketPlugins[SOCKET_NAMESPACE] = {};
	}
	if (!SocketPlugins[SOCKET_NAMESPACE].vote) {
		SocketPlugins[SOCKET_NAMESPACE].vote = async function (socket, payload = {}, callback) {
			try {
				const response = await handleVote(socket, payload);
				if (typeof callback === 'function') {
					callback(null, response);
				}
				return response;
			} catch (err) {
				winston.error(`[composer-polls] Vote error - User: ${socket.uid}, Poll: ${payload?.pollId}, Error: ${err.message}`);
				if (typeof callback === 'function') {
					callback(err);
				}
				throw err;
			}
		};
	}
	if (!SocketPlugins[SOCKET_NAMESPACE].get) {
		SocketPlugins[SOCKET_NAMESPACE].get = async function (socket, payload = {}, callback) {
			try {
				const response = await handleGetPoll(socket, payload);
				if (typeof callback === 'function') {
					callback(null, response);
				}
				return response;
			} catch (err) {
				winston.error(`[composer-polls] Get poll error - User: ${socket.uid}, Poll: ${payload?.pollId}, Error: ${err.message}`);
				if (typeof callback === 'function') {
					callback(err);
				}
				throw err;
			}
		};
	}
	if (!SocketPlugins[SOCKET_NAMESPACE].manage) {
		SocketPlugins[SOCKET_NAMESPACE].manage = async function (socket, payload = {}, callback) {
			try {
				const response = await handleManagePoll(socket, payload);
				if (typeof callback === 'function') {
					callback(null, response);
				}
				return response;
			} catch (err) {
				winston.error(`[composer-polls] Manage poll error - User: ${socket.uid}, Poll: ${payload?.pollId}, Action: ${payload?.action}, Error: ${err.message}`);
				if (typeof callback === 'function') {
					callback(err);
				}
				throw err;
			}
		};
	}
}

async function handleVote(socket, payload) {
	if (!socket || !utils.isNumber(socket.uid)) {
		throw new Error('[[composer-polls:errors.login-required]]');
	}

	const pollId = typeof payload?.pollId === 'string' || typeof payload?.pollId === 'number' ? String(payload.pollId).trim() : '';
	if (!pollId) {
		throw new Error('[[composer-polls:errors.invalid]]');
	}

	return castVote(pollId, String(socket.uid), payload?.selections);
}

registerSocketHandlers();

module.exports = plugin;
