'use strict';

const db = require.main.require('./src/database');
const utils = require.main.require('./src/utils');

<<<<<<< HEAD

=======
>>>>>>> origin/main
const POLL_TYPES = new Set(['single', 'multi', 'ranked']);
const POLL_VISIBILITY = new Set(['anonymous', 'public']);
const POLL_MIN_OPTIONS = 2;
const POLL_MAX_OPTIONS = 10;
const OPTION_MAX_LENGTH = 120;

const plugin = {};
<<<<<<< HEAD
const Benchpress = require.main.require('benchpressjs');


plugin.debugCheckPollData = async function(pid) {
	console.log('=== MANUAL POLL DATA CHECK ===');
	console.log('Checking PID:', pid);
	
	try {
		const pollData = await db.getObject(`poll:${pid}`);
		console.log('Poll data from DB:', pollData);
		
		const postData = await db.getObject(`post:${pid}`);
		console.log('Post pollId field:', postData?.pollId);
		
		return { pollData, postData };
	} catch (error) {
		console.log('❌ Database check error:', error);
		return { error };
	}
};


// Save poll data when post is created 
plugin.savePoll = async function (postData) {
    if (postData.poll) {
        await db.setObject(`poll:${postData.pid}`, postData.poll);
    }
    return postData;
};



// Attach poll when posts are fetched
plugin.attachPoll = async function(posts) {
    const postArray = Array.isArray(posts) ? posts : [posts];

    for (let post of postArray) {
        const poll = await db.getObject(`poll:${post.pid}`);
        if (poll) {
            post.poll = poll;

            // Render plugin partial for posts that have a poll
            post.pollHTML = await Benchpress.render('nodebb-composer-polls/post', { poll });
        }
    }

    return Array.isArray(posts) ? postArray : postArray[0];
};



=======
>>>>>>> origin/main

plugin.addPollFormattingOption = async function (payload) {
	if (!payload || !Array.isArray(payload.options)) {
		return payload;
	}

<<<<<<< HEAD
=======
	// Make sure we only register the poll button once regardless of hook order.
>>>>>>> origin/main
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

<<<<<<< HEAD
// 1. In plugin.handleComposerCheck (around line 75):
plugin.handleComposerCheck = async function (payload) {
	console.log('=== COMPOSER CHECK START ===');
	console.log('Payload received:', payload);
	console.log('Has data:', !!payload?.data);
	console.log('Has poll in data:', !!payload?.data?.poll);
	console.log('Poll data:', payload?.data?.poll);

	if (!payload || !payload.data || !payload.data.poll) {
		console.log('❌ No poll data found in composer check');
		return payload;
	}

	if (!utils.isNumber(payload.data.uid)) {
		console.log('❌ Invalid UID:', payload.data.uid);
		throw new Error('[[composer-polls:errors.invalid-author]]');
	}

	console.log('✅ Sanitizing poll config...');
	const sanitized = sanitizePollConfig(payload.data.poll, parseInt(payload.data.uid, 10));
	console.log('Sanitized poll:', sanitized);
	
	payload.data._poll = sanitized;
	delete payload.data.poll;
	
	console.log('✅ Poll moved to _poll property');
	console.log('=== COMPOSER CHECK END ===');
	return payload;
};

=======
>>>>>>> origin/main
plugin.handleTopicPost = async function (data) {
	if (!data || !data.poll) {
		return data;
	}

	if (!utils.isNumber(data.uid)) {
		throw new Error('[[composer-polls:errors.invalid-author]]');
	}

<<<<<<< HEAD
=======
	// Persist the sanitized poll payload on a private field consumed by onTopicPost.
>>>>>>> origin/main
	const sanitized = sanitizePollConfig(data.poll, parseInt(data.uid, 10));
	data._poll = sanitized;
	delete data.poll;

	return data;
};

<<<<<<< HEAD
// 2. In plugin.onTopicPost (around line 107):
plugin.onTopicPost = async function ({ topic, post, data }) {
	console.log('=== TOPIC POST HOOK START ===');
	console.log('Topic:', topic);
	console.log('Post:', post);
	console.log('Data keys:', Object.keys(data || {}));
	console.log('Has _poll:', !!data?._poll);
	console.log('Poll data:', data?._poll);

	if (!data || !data._poll || !post || !topic) {
		console.log('❌ Missing required data for poll creation');
		return;
	}
	
	// Create poll record
=======
plugin.onTopicPost = async function ({ topic, post, data }) {
	if (!data || !data._poll || !post || !topic) {
		return;
	}
>>>>>>> origin/main

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

<<<<<<< HEAD
	console.log('✅ Creating poll record:', pollRecord);
	console.log('Saving to database key:', `poll:${pollId}`);

=======
	// Store the poll alongside convenience references from post/topic documents.
>>>>>>> origin/main
	await db.setObject(`poll:${pollId}`, pollRecord);
	await Promise.all([
		db.setObjectField(`post:${post.pid}`, 'pollId', pollId),
		db.setObjectField(`topic:${topic.tid}`, 'pollId', pollId),
	]);
<<<<<<< HEAD

	console.log('✅ Poll saved successfully!');
	console.log('=== TOPIC POST HOOK END ===');
};

// Helpers for debugging composer post data

=======
};

>>>>>>> origin/main
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
<<<<<<< HEAD
=======
		// Normalise persisted payloads because Redis returns everything as strings.
>>>>>>> origin/main
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

<<<<<<< HEAD
// Sanitization and normalization functions

function sanitizePollConfig(rawPoll, ownerUid) {
	console.log('=== SANITIZE POLL START ===');
	console.log('Raw poll input:', rawPoll);
	console.log('Owner UID:', ownerUid);

	if (!rawPoll || typeof rawPoll !== 'object') {
		console.log('❌ Invalid poll object');
=======
function sanitizePollConfig(rawPoll, ownerUid) {
	if (!rawPoll || typeof rawPoll !== 'object') {
>>>>>>> origin/main
		throw new Error('[[composer-polls:errors.invalid]]');
	}

	const type = typeof rawPoll.type === 'string' ? rawPoll.type.trim() : '';
<<<<<<< HEAD
	console.log('Poll type:', type, 'Valid:', POLL_TYPES.has(type));

	if (!POLL_TYPES.has(type)) {
		console.log('❌ Invalid poll type');
=======
	if (!POLL_TYPES.has(type)) {
>>>>>>> origin/main
		throw new Error('[[composer-polls:errors.type-required]]');
	}

	const rawOptions = Array.isArray(rawPoll.options) ? rawPoll.options : [];
<<<<<<< HEAD
	console.log('Raw options count:', rawOptions.length);
	console.log('Raw options:', rawOptions);

	if (rawOptions.length < POLL_MIN_OPTIONS) {
		console.log('❌ Too few options');
		throw new Error('[[composer-polls:errors.option-required, ' + POLL_MIN_OPTIONS + ']]');
	}
	if (rawOptions.length > POLL_MAX_OPTIONS) {
		console.log('❌ Too many options');
		throw new Error('[[composer-polls:errors.option-limit, ' + POLL_MAX_OPTIONS + ']]');
	}
	
	const result = {
=======
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
>>>>>>> origin/main
		type,
		options,
		visibility,
		allowRevote: true,
		closesAt,
		ownerUid,
	};
<<<<<<< HEAD

	console.log('✅ Sanitized poll result:', result);
	console.log('=== SANITIZE POLL END ===');
	return result;
}


=======
}

>>>>>>> origin/main
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
