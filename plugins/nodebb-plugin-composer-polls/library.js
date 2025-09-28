'use strict';

const db = require.main.require('./src/database');
const utils = require.main.require('./src/utils');
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

	// Make sure we only register the poll button once regardless of hook order.
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

plugin.handleTopicPost = async function (data) {
	if (!data || !data.poll) {
		return data;
	}

	if (!utils.isNumber(data.uid)) {
		throw new Error('[[composer-polls:errors.invalid-author]]');
	}

	// Persist the sanitized poll payload on a private field consumed by onTopicPost.
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

	// Store the poll alongside convenience references from post/topic documents.
	await db.setObject(`poll:${pollId}`, pollRecord);
	await Promise.all([
		db.setObjectField(`post:${post.pid}`, 'pollId', pollId),
		db.setObjectField(`topic:${topic.tid}`, 'pollId', pollId),
	]);
};

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
		const viewerVote = viewerUid ? viewerVotes.get(String(poll.id)) : null;
		post.poll = preparePollForView(poll, viewerUid, viewerVote);
	});

	return hookData;
};

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

	return {
		id: baseId,
		text,
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
		throw new Error('[[composer-polls:errors.not-found]]');
	}

	const poll = normalisePollRecord(pollRecord);
	if (isPollClosed(poll)) {
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
