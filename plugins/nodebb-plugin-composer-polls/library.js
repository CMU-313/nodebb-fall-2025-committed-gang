'use strict';

const db = require.main.require('./src/database');
const utils = require.main.require('./src/utils');

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
		results: JSON.stringify({}),
	};

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

	posts.forEach((post) => {
		if (!post || !post.pollId) {
			return;
		}
		const poll = pollMap.get(String(post.pollId));
		if (!poll) {
			return;
		}

		post.poll = {
			...poll,
			canManage: utils.isNumber(uid) && parseInt(uid, 10) === poll.ownerUid,
		};
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
	let results = {};
	try {
		results = JSON.parse(record.results || '{}');
	} catch (err) {
		results = {};
	}

	const closesAt = parseInt(record.closesAt, 10) || 0;

	return {
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
		results,
	};
}

module.exports = plugin;
