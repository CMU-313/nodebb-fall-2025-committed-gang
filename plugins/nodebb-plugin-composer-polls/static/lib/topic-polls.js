'use strict';

require([
	'hooks',
	'benchpress',
	'translator',
	'alerts',
], function (hooks, Benchpress, translator, alerts) {
	const pollsByPid = new Map();

	hooks.on('action:posts.loaded', (data) => {
		if (!data || !Array.isArray(data.posts)) {
			return;
		}
		data.posts.forEach((post) => processPost(post));
	});

		hooks.on('action:ajaxify.end', () => {
			const topicData = typeof ajaxify === 'object' && ajaxify.data && Array.isArray(ajaxify.data.posts) ? ajaxify.data.posts : [];
			topicData.forEach(post => processPost(post));
		});

	function processPost(post) {
		if (!post || typeof post.pid === 'undefined') {
			return;
		}
		const pid = String(post.pid);
		if (post.poll) {
			const existing = pollsByPid.get(pid);
			const existingWidget = document.querySelector(`[component="post"][data-pid="${pid}"] .composer-polls-widget`);
			if (existing && existingWidget && existing.updatedAt === post.poll.updatedAt) {
				return;
			}
			pollsByPid.set(pid, post.poll);
			renderPoll(pid, post.poll).catch((err) => {
				if (err) {
					console.error('[composer-polls] Failed to render poll', err);
				}
			});
		} else {
			pollsByPid.delete(pid);
			removePoll(pid);
		}
	}

	function removePoll(pid) {
		const selector = `[component="post"][data-pid="${pid}"] .composer-polls-widget`;
		const widget = document.querySelector(selector);
		if (widget && widget.parentNode) {
			widget.parentNode.removeChild(widget);
		}
	}

	async function renderPoll(pid, poll) {
		const postEl = document.querySelector(`[component="post"][data-pid="${pid}"]`);
		if (!postEl) {
			return;
		}
		const bodyEl = postEl.querySelector('.post-container');
		if (!bodyEl) {
			return;
		}

		const existing = bodyEl.querySelector('.composer-polls-widget');
		if (existing && existing.parentNode) {
			existing.parentNode.removeChild(existing);
		}

		const templateData = buildTemplateData(poll);
		let html = await Benchpress.render('composer-polls/poll', templateData);
		html = await translate(html);

		const wrapper = document.createElement('div');
		wrapper.innerHTML = html.trim();
		const widgetEl = wrapper.firstElementChild;
		if (!widgetEl) {
			return;
		}

		const footer = bodyEl.querySelector('[component="post/footer"]');
		if (footer && footer.parentNode) {
			footer.parentNode.insertBefore(widgetEl, footer);
		} else {
			bodyEl.appendChild(widgetEl);
		}

		widgetEl.dataset.pid = String(poll.pid);
		bindWidgetHandlers(widgetEl);
	}

	function buildTemplateData(poll) {
		const safePoll = poll || {};
		const results = safePoll.results || {};
		const optionResults = results.options || {};
		const totalParticipants = results.totalParticipants || 0;

		let orderedOptions = Array.isArray(safePoll.options) ? safePoll.options.slice() : [];
		if (safePoll.type === 'ranked' && Array.isArray(safePoll.userSelections) && safePoll.userSelections.length) {
			const seen = new Set();
			const ordered = [];
			safePoll.userSelections.forEach((id) => {
				const option = orderedOptions.find(opt => opt.id === id);
				if (option && !seen.has(option.id)) {
					ordered.push(option);
					seen.add(option.id);
				}
			});
			orderedOptions.forEach((option) => {
				if (!seen.has(option.id)) {
					ordered.push(option);
				}
			});
			orderedOptions = ordered;
		}

		let totalPoints = 0;
		if (safePoll.type === 'ranked') {
			orderedOptions.forEach((option) => {
				totalPoints += optionResults[option.id]?.points || 0;
			});
		}

		const selections = new Set(Array.isArray(safePoll.userSelections) ? safePoll.userSelections : []);
		const optionData = orderedOptions.map((option, index) => {
			const stats = optionResults[option.id] || {};
			const count = stats.count || 0;
			const points = stats.points || 0;
			let percent = 0;
			if (safePoll.type === 'ranked') {
				percent = totalPoints ? Math.round((points / totalPoints) * 100) : 0;
			} else {
				percent = totalParticipants ? Math.round((count / totalParticipants) * 100) : 0;
			}
			if (!Number.isFinite(percent)) {
				percent = 0;
			}

			let inputType = null;
			if (safePoll.type === 'single') {
				inputType = 'radio';
			} else if (safePoll.type === 'multi') {
				inputType = 'checkbox';
			}

			const rawVoters = Array.isArray(stats.voters) ? stats.voters : [];
			const voters = rawVoters.map((voter) => {
				if (!voter || typeof voter !== 'object') {
					return {
						uid: String(voter || ''),
						username: String(voter || ''),
						profileUrl: null,
					};
				}
				return {
					uid: String(voter.uid || voter.userslug || voter.username || ''),
					username: voter.username || voter.uid || voter.userslug || '',
					profileUrl: voter.profileUrl || null,
				};
			});
			const showVoters = safePoll.visibility === 'public' && voters.length > 0;
			const votersLabel = voters.map(voter => voter.username || voter.uid).join(', ');

			return {
				id: option.id,
				text: option.text,
				inputType,
				selected: selections.has(option.id),
				percent,
				percentLabel: `[[composer-polls:results.percentage, ${percent}]]`,
				countLabel: safePoll.type === 'ranked'
					? `[[composer-polls:results.points, ${points}]]`
					: `[[composer-polls:results.votes, ${count}]]`,
				isFirst: safePoll.type === 'ranked' && index === 0,
				isLast: safePoll.type === 'ranked' && index === orderedOptions.length - 1,
				position: index + 1,
				voters,
				votersLabel,
				showVoters,
			};
		});

		const visibilityLabel = safePoll.visibility === 'public'
			? '[[composer-polls:widget.public]]'
			: '[[composer-polls:widget.anonymous]]';

		const participantsLabel = `[[composer-polls:widget.participants, ${safePoll.totalParticipants || 0}]]`;
		const closesAtLabel = safePoll.closesAt
			? `[[composer-polls:widget.closes, ${formatDate(safePoll.closesAt)}]]`
			: '';

		const allowRevote = coerceBoolean(safePoll.allowRevote);
		const hasVoted = coerceBoolean(safePoll.hasVoted);
		const canVote = coerceBoolean(safePoll.canVote);
		const isClosed = coerceBoolean(safePoll.isClosed);
		const canManage = coerceBoolean(safePoll.canManage);

		const buttonLabel = hasVoted && allowRevote
			? '[[composer-polls:widget.update]]'
			: '[[composer-polls:widget.vote]]';

		const statusText = visibilityLabel;
		const cannotVoteLabel = isClosed
			? '[[composer-polls:widget.closed]]'
			: '[[composer-polls:widget.cant-vote]]';

		return {
			poll: {
				id: safePoll.id,
				pid: safePoll.pid,
				type: safePoll.type,
				visibility: safePoll.visibility,
				visibilityLabel,
				isClosed,
				allowRevote,
				canVote,
				canManage,
				hasVoted,
				totalParticipants: safePoll.totalParticipants || 0,
				participantsLabel,
				closesAtLabel,
				buttonLabel,
				statusText,
				cannotVoteLabel,
				isRanked: safePoll.type === 'ranked',
				showPublicVoters: safePoll.visibility === 'public',
			},
			options: optionData,
		};
	}

	function bindWidgetHandlers(widgetEl) {
		if (!widgetEl) {
			return;
		}

		widgetEl.querySelectorAll('[data-action="composer-polls-move-up"]').forEach((button) => {
			button.addEventListener('click', (event) => {
				event.preventDefault();
				moveRankedOption(widgetEl, button.closest('[data-option-id]'), -1);
			});
		});

		widgetEl.querySelectorAll('[data-action="composer-polls-move-down"]').forEach((button) => {
			button.addEventListener('click', (event) => {
				event.preventDefault();
				moveRankedOption(widgetEl, button.closest('[data-option-id]'), 1);
			});
		});

		widgetEl.querySelectorAll('[data-action="composer-polls-close"]').forEach((button) => {
			button.addEventListener('click', (event) => {
				event.preventDefault();
				managePoll(widgetEl, button, 'close');
			});
		});

		widgetEl.querySelectorAll('[data-action="composer-polls-reopen"]').forEach((button) => {
			button.addEventListener('click', (event) => {
				event.preventDefault();
				managePoll(widgetEl, button, 'reopen');
			});
		});

		const submitBtn = widgetEl.querySelector('[data-action="composer-polls-submit"]');
		if (submitBtn) {
			submitBtn.addEventListener('click', async (event) => {
				event.preventDefault();
				await handleVote(widgetEl, submitBtn);
			});
		}

		enableOptionBoxSelection(widgetEl);
		updateRankedControls(widgetEl);
	}

	function enableOptionBoxSelection(widgetEl) {
		if (!widgetEl) {
			return;
		}
		const pid = widgetEl.dataset.pid;
		if (!pid) {
			return;
		}

		const poll = pollsByPid.get(String(widgetEl.dataset.pid));
		
		widgetEl.querySelectorAll('.composer-polls-option').forEach((optionEl) => {
			const input = optionEl.querySelector('.form-check-input');
			
			// Enable drag-and-drop for ranked polls
			if (poll && poll.type === 'ranked' && coerceBoolean(poll.canVote)) {
				enableDragAndDrop(widgetEl, optionEl);
				return;
			}
			
			if (!input) {
				return;
			}

			optionEl.addEventListener('click', (event) => {
				const target = event.target;
				if (target.closest('.form-check-input') || target.closest('label') || target.closest('button')) {
					return;
				}

				if (!poll || poll.type === 'ranked' || !coerceBoolean(poll.canVote)) {
					return;
				}

				event.preventDefault();
				if (poll.type === 'single') {
					input.checked = true;
				} else if (poll.type === 'multi') {
					input.checked = !input.checked;
				} else {
					return;
				}

				input.dispatchEvent(new Event('change', { bubbles: true }));
				if (typeof input.focus === 'function') {
					try {
						input.focus({ preventScroll: true });
					} catch (err) {
						input.focus();
					}
				}
			});
		});
	}

	function enableDragAndDrop(widgetEl, optionEl) {
		// Make the option draggable
		optionEl.setAttribute('draggable', 'true');
		optionEl.style.cursor = 'grab';
		
		optionEl.addEventListener('dragstart', (e) => {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/plain', optionEl.dataset.optionId);
			optionEl.classList.add('dragging');
			optionEl.style.opacity = '0.5';
		});
		
		optionEl.addEventListener('dragend', (e) => {
			optionEl.classList.remove('dragging');
			optionEl.style.opacity = '1';
			optionEl.style.cursor = 'grab';
			// Update controls after drag ends
			updateRankedControls(widgetEl);
		});
		
		optionEl.addEventListener('dragover', (e) => {
			e.preventDefault();
			e.dataTransfer.dropEffect = 'move';
			
			const draggingEl = widgetEl.querySelector('.dragging');
			if (!draggingEl || draggingEl === optionEl) {
				return;
			}
			
			// Get bounding rectangles
			const rect = optionEl.getBoundingClientRect();
			const midpoint = rect.top + rect.height / 2;
			
			// Determine if we should insert before or after
			if (e.clientY < midpoint) {
				optionEl.parentNode.insertBefore(draggingEl, optionEl);
			} else {
				optionEl.parentNode.insertBefore(draggingEl, optionEl.nextSibling);
			}
		});
		
		optionEl.addEventListener('drop', (e) => {
			e.preventDefault();
			e.stopPropagation();
		});
		
		// Visual feedback on hover
		optionEl.addEventListener('dragenter', (e) => {
			if (!optionEl.classList.contains('dragging')) {
				optionEl.style.borderColor = '#0d6efd';
				optionEl.style.backgroundColor = 'rgba(13, 110, 253, 0.05)';
			}
		});
		
		optionEl.addEventListener('dragleave', (e) => {
			optionEl.style.borderColor = '';
			optionEl.style.backgroundColor = '';
		});
	}

	async function managePoll(widgetEl, actionButton, action) {
		const pid = widgetEl.dataset.pid;
		const poll = pollsByPid.get(String(pid));
		if (!poll) {
			return;
		}

		if (actionButton) {
			actionButton.disabled = true;
			actionButton.classList.add('disabled');
		}

		try {
			const updated = await emitManage(poll.id, action);
			pollsByPid.set(String(updated.pid), updated);
			await renderPoll(String(updated.pid), updated);
		} catch (err) {
			const message = err && err.message ? err.message : err;
			alerts.error(message || '[[error:unknown-error]]');
		} finally {
			if (actionButton && actionButton.isConnected) {
				actionButton.disabled = false;
				actionButton.classList.remove('disabled');
			}
		}
	}

	async function handleVote(widgetEl, submitBtn) {
		const pid = widgetEl.dataset.pid;
		const poll = pollsByPid.get(String(pid));
		if (!poll) {
			return;
		}

		const selections = collectSelections(widgetEl, poll);
		if (!selections.length) {
			alerts.error('[[composer-polls:errors.vote-required]]');
			return;
		}
		if (poll.type === 'ranked' && selections.length < 2) {
			alerts.error('[[composer-polls:errors.vote-ranked-min]]');
			return;
		}

		if (submitBtn) {
			submitBtn.disabled = true;
			submitBtn.classList.add('disabled');
		}

		try {
			const updated = await emitVote(poll.id, selections);
			const updatedPid = String(updated.pid);
			pollsByPid.set(updatedPid, updated);
			await renderPoll(updatedPid, updated);
		} catch (err) {
			const message = err && err.message ? err.message : err;
			alerts.error(message || '[[error:unknown-error]]');
		} finally {
			if (submitBtn && submitBtn.isConnected) {
				submitBtn.disabled = false;
				submitBtn.classList.remove('disabled');
			}
		}
	}

	function collectSelections(widgetEl, poll) {
		if (!widgetEl || !poll) {
			return [];
		}
		if (poll.type === 'single') {
			const checked = widgetEl.querySelector('input[type="radio"]:checked');
			return checked ? [checked.value] : [];
		}
		if (poll.type === 'multi') {
			const checked = widgetEl.querySelectorAll('input[type="checkbox"]:checked');
			const selections = [];
			checked.forEach((input) => {
				if (input && input.value) {
					selections.push(input.value);
				}
			});
			return selections;
		}

		const options = widgetEl.querySelectorAll('[data-option-id]');
		return Array.from(options)
			.map(option => option.getAttribute('data-option-id'))
			.filter(Boolean);
	}

	function moveRankedOption(widgetEl, optionEl, delta) {
		if (!widgetEl || !optionEl || !optionEl.parentNode || !delta) {
			return;
		}
		const parent = optionEl.parentNode;
		if (delta < 0) {
			const previous = optionEl.previousElementSibling;
			if (previous) {
				const reference = previous;
				parent.insertBefore(optionEl, reference);
			}
		} else if (delta > 0) {
			const next = optionEl.nextElementSibling;
			if (next) {
				const reference = next.nextElementSibling;
				parent.insertBefore(optionEl, reference);
			}
		}
		updateRankedControls(widgetEl);
	}

	function updateRankedControls(widgetEl) {
		if (!widgetEl) {
			return;
		}
		const options = widgetEl.querySelectorAll('.composer-polls-option');
		options.forEach((option, index) => {
			const upBtn = option.querySelector('[data-action="composer-polls-move-up"]');
			const downBtn = option.querySelector('[data-action="composer-polls-move-down"]');
			if (upBtn) {
				upBtn.disabled = index === 0;
			}
			if (downBtn) {
				downBtn.disabled = index === options.length - 1;
			}
			const badge = option.querySelector('.composer-polls-ranked-row .badge');
			if (badge) {
				badge.textContent = index + 1;
			}
		});
	}

	function emitVote(pollId, selections) {
		return new Promise((resolve, reject) => {
			socket.emit('plugins.composerPolls.vote', {
				pollId,
				selections,
			}, (err, result) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(result);
			});
		});
	}

	function emitManage(pollId, action) {
		return new Promise((resolve, reject) => {
			socket.emit('plugins.composerPolls.manage', {
				pollId,
				action,
			}, (err, result) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(result);
			});
		});
	}

	function coerceBoolean(value) {
		if (typeof value === 'string') {
			const lowered = value.toLowerCase();
			if (lowered === 'true' || lowered === '1') {
				return true;
			}
			if (lowered === 'false' || lowered === '0' || lowered === '') {
				return false;
			}
		}
		if (typeof value === 'number') {
			return value === 1;
		}
		return Boolean(value);
	}

	function formatDate(timestamp) {
		if (!timestamp) {
			return '';
		}
		const date = new Date(timestamp);
		if (Number.isNaN(date.getTime())) {
			return '';
		}
		return date.toLocaleString();
	}

	function translate(html) {
		return new Promise((resolve) => {
			translator.translate(html, resolve);
		});
	}
});
