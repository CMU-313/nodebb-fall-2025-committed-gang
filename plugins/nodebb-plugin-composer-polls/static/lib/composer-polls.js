'use strict';

require([
	'hooks',
	'composer/formatting',
	'translator',
	'benchpress',
	'bootbox',
	'alerts',
	'utils',
	'composer',
], function (
	hooks,
	formatting,
	translator,
	Benchpress,
	bootbox,
	alerts,
	utils,
	composer
) {
	const MAX_OPTIONS = 10;
	const MIN_OPTIONS = 2;
	const OPTION_MAX_LENGTH = 120;
	const DEFAULT_TYPE = 'single';
	const DEFAULT_VISIBILITY = 'anonymous';

	let dispatchRegistered = false;

	hooks.on('action:composer.enhanced', ({ postContainer }) => {
		if (!postContainer || !postContainer.length) {
			return;
		}
		const uuid = postContainer.attr('data-uuid');
		// Composer instances are recreated often; keep the summary UI in sync each time.
		bindSummaryActions(postContainer);
		refreshSummary(postContainer, getPoll(uuid));
		updateBadge(postContainer, getPoll(uuid));
	});

	hooks.on('action:composer.discard', ({ post_uuid: uuid }) => {
		if (!uuid) {
			return;
		}
		setPoll(uuid, null);
	});

	hooks.on('filter:composer.submit', (payload) => {
		if (!payload || !payload.postData || !payload.composerData) {
			return payload;
		}

		if (payload.action !== 'topics.post') {
			delete payload.composerData.poll;
			return payload;
		}

		const poll = payload.postData.pollConfig;
		if (poll && Array.isArray(poll.options) && poll.options.length >= MIN_OPTIONS) {
			payload.composerData.poll = poll;
		} else {
			delete payload.composerData.poll;
		}

		return payload;
	});

	function registerDispatch(postContainer) {
		if (dispatchRegistered || !formatting || typeof formatting.addButtonDispatch !== 'function') {
			return;
		}

		dispatchRegistered = true;
		// Hook Composer's toolbar button into our modal, exiting fullscreen if needed first.
		formatting.addButtonDispatch('polls', function () {
			formatting.exitFullscreen();
			openPollModal(this || postContainer);
		});
	}

	hooks.on('action:composer.enhanced', ({ postContainer }) => {
		registerDispatch(postContainer);
	});

	registerDispatch();

	async function openPollModal(postContainer) {
		postContainer = $(postContainer);
		if (!postContainer.length) {
			return;
		}
		const uuid = postContainer.attr('data-uuid');
		if (!uuid) {
			return;
		}

		const existing = clonePoll(getPoll(uuid));
		const poll = existing || createDefaultPoll();
		enforceOptionBounds(poll);

		const placeholders = await getPlaceholders();
		const modalMarkup = await renderModal({ poll, placeholders });
		// Translate all static labels once before we build the dialog buttons.
		const [
			title,
			saveLabel,
			cancelLabel,
			removeLabel,
			editLabel,
			removeSummaryLabel,
			allowNote,
			optionRemoveLabel,
		] = await translateMany([
			'[[composer-polls:add]]',
			'[[composer-polls:save]]',
			'[[composer-polls:cancel]]',
			'[[composer-polls:remove]]',
			'[[composer-polls:summary.edit]]',
			'[[composer-polls:summary.remove]]',
			'[[composer-polls:note]]',
			'[[composer-polls:options.remove]]',
		]);

		const buttons = {};
		if (existing) {
			buttons.remove = {
				label: removeLabel,
				className: 'btn-outline-danger me-auto',
				callback: () => {
					setPoll(uuid, null);
					refreshSummary(postContainer, null, { editLabel, removeSummaryLabel, allowNote });
					updateBadge(postContainer, null);
				},
			};
		}

		buttons.cancel = {
			label: cancelLabel,
			className: 'btn-secondary',
		};

		buttons.save = {
			label: saveLabel,
			className: 'btn-primary',
			callback: () => handleSave(dialog, uuid, postContainer, placeholders, { editLabel, removeSummaryLabel, allowNote }),
		};

		const dialog = bootbox.dialog({
			title,
			message: modalMarkup,
			className: 'composer-polls-dialog',
			buttons,
		});

		// Keep the modal responsive after bootbox injects it into the DOM.
		dialog.on('shown.bs.modal', () => {
			const modalEl = dialog.find('.composer-polls-modal');
			attachModalHandlers(modalEl, placeholders, optionRemoveLabel);
			refreshOptionNumbering(modalEl, placeholders);
		});
	}

	function bindSummaryActions(postContainer) {
		if (postContainer.data('composer-poll-bound')) {
			return;
		}
		postContainer.data('composer-poll-bound', true);

		// Delegate edit/remove controls so we survive composer rerenders.
		postContainer.on('click', '[data-action="composer-poll-edit"]', (ev) => {
			ev.preventDefault();
			openPollModal(postContainer);
		});

		postContainer.on('click', '[data-action="composer-poll-remove"]', (ev) => {
			ev.preventDefault();
			const uuid = postContainer.attr('data-uuid');
			setPoll(uuid, null);
			refreshSummary(postContainer, null);
			updateBadge(postContainer, null);
		});
	}

	async function renderModal({ poll, placeholders }) {
		const options = await Promise.all(poll.options.map(async (option, index) => ({
			id: option.id,
			text: option.text || '',
			placeholder: placeholders[index] || placeholders[placeholders.length - 1],
			position: index + 1,
		})));

		// Pass primitive values to the template so Benchpress can hydrate inputs correctly.
		const data = {
			type: poll.type || DEFAULT_TYPE,
			options,
			visibility: poll.visibility || DEFAULT_VISIBILITY,
			closesAt: poll.closesAt || 0,
			closesAtISO: poll.closesAt ? timestampToInputValue(poll.closesAt) : '',
			maxOptions: MAX_OPTIONS,
		};

		const html = await Benchpress.render('composer-polls/modal', data);
		return translate(html);
	}

	// Wire up add/remove handlers once the modal markup is live.
	function attachModalHandlers(modalEl, placeholders, optionRemoveLabel) {
		modalEl.on('click', '.composer-polls-add-option', function () {
			const optionCount = modalEl.find('.composer-polls-option').length;
			if (optionCount >= MAX_OPTIONS) {
				return;
			}
			const placeholder = placeholders[optionCount] || placeholders[placeholders.length - 1];
			const safePlaceholder = utils.escapeHTML(placeholder);
			const safeRemoveLabel = utils.escapeHTML(optionRemoveLabel);
			const optionId = generateOptionId();
			const optionRow = $(
				`<div class="input-group composer-polls-option" data-option-id="${optionId}">
					<span class="input-group-text"></span>
					<input type="text" class="form-control composer-polls-option-input" maxlength="${OPTION_MAX_LENGTH}" placeholder="${safePlaceholder}">
					<button class="btn btn-outline-danger composer-polls-remove-option" type="button" aria-label="${safeRemoveLabel}">
						<i class="fa fa-trash"></i>
					</button>
				</div>`
			);
			modalEl.find('.composer-polls-options').append(optionRow);
			refreshOptionNumbering(modalEl, placeholders);
		});

		modalEl.on('click', '.composer-polls-remove-option', function () {
			const optionCount = modalEl.find('.composer-polls-option').length;
			if (optionCount <= MIN_OPTIONS) {
				return;
			}
			$(this).closest('.composer-polls-option').remove();
			refreshOptionNumbering(modalEl, placeholders);
		});

		modalEl.on('change', 'input[name="composer-polls-close-mode"]', function () {
			const selected = $(this).val();
			const input = modalEl.find('.composer-polls-close-input');
			input.prop('disabled', selected !== 'date');
		});
	}

	// Keep numbering, placeholders, and button states consistent with option count.
	function refreshOptionNumbering(modalEl, placeholders) {
		const options = modalEl.find('.composer-polls-option');
		options.each((index, element) => {
			const optionEl = $(element);
			optionEl.find('.input-group-text').text(`${index + 1}.`);
			const placeholder = placeholders[index] || placeholders[placeholders.length - 1];
			optionEl.find('.composer-polls-option-input').attr('placeholder', utils.escapeHTML(placeholder));
		});

		const addBtn = modalEl.find('.composer-polls-add-option');
		addBtn.prop('disabled', options.length >= MAX_OPTIONS);
		const removeButtons = modalEl.find('.composer-polls-remove-option');
		removeButtons.prop('disabled', options.length <= MIN_OPTIONS);
	}

	// Skeleton poll matches server defaults so we stay in sync.
	function createDefaultPoll() {
		return {
			type: DEFAULT_TYPE,
			options: Array.from({ length: MIN_OPTIONS }, () => ({ id: generateOptionId(), text: '' })),
			visibility: DEFAULT_VISIBILITY,
			closesAt: 0,
			allowRevote: true,
		};
	}

	// Normalise option array length before the modal renders.
	function enforceOptionBounds(poll) {
		if (!Array.isArray(poll.options)) {
			poll.options = [];
		}
		while (poll.options.length < MIN_OPTIONS) {
			poll.options.push({ id: generateOptionId(), text: '' });
		}
		if (poll.options.length > MAX_OPTIONS) {
			poll.options.length = MAX_OPTIONS;
		}
	}

	// Avoid mutating shared references when editing existing polls.
	function clonePoll(poll) {
		if (!poll) {
			return null;
		}
		return JSON.parse(JSON.stringify(poll));
	}

	// Composer keeps per-UUID state; look up the active poll if it exists.
	function getPoll(uuid) {
		if (!uuid || !composer.posts || !composer.posts[uuid]) {
			return null;
		}
		return composer.posts[uuid].pollConfig || null;
	}

	// Persist the poll in composer state and mark the draft dirty for autosave.
	function setPoll(uuid, poll) {
		if (!uuid || !composer.posts || !composer.posts[uuid]) {
			return;
		}
		if (poll) {
			composer.posts[uuid].pollConfig = clonePoll(poll);
		} else {
			delete composer.posts[uuid].pollConfig;
		}
		composer.posts[uuid].modified = true;
	}

	// Stick with alphanumeric IDs so they are safe across transports.
	function generateOptionId() {
		return utils.generateUUID().replace(/[^a-z0-9]/gi, '').slice(0, 12) || `opt${Date.now()}`;
	}

	// Convert stored UTC timestamps into the local ISO format used by inputs.
	function timestampToInputValue(timestamp) {
		if (!timestamp) {
			return '';
		}
		const date = new Date(timestamp);
		if (Number.isNaN(date.getTime())) {
			return '';
		}
		const offset = date.getTimezoneOffset() * 60000;
		const local = new Date(timestamp - offset);
		return local.toISOString().slice(0, 16);
	}

	// Parse user input back into a comparable UTC timestamp.
	function inputValueToTimestamp(value) {
		if (!value) {
			return 0;
		}
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) {
			return 0;
		}
		return date.getTime();
	}

	// Validate, persist, and reflect poll changes after the modal save button.
	async function handleSave(dialog, uuid, postContainer, placeholders, summaryLabels) {
		const modalEl = dialog.find('.composer-polls-modal');
		const collection = collectPollFromModal(modalEl);
		if (collection.error) {
			const errorText = await translate(collection.error);
			alerts.error(errorText);
			return false;
		}

		setPoll(uuid, collection.poll);
		refreshSummary(postContainer, collection.poll, summaryLabels);
		updateBadge(postContainer, collection.poll);
		return true;
	}

	// Gather the user's selections and enforce client-side constraints.
	function collectPollFromModal(modalEl) {
		const type = modalEl.find('input[name="composer-poll-type"]:checked').val();
		if (!type) {
			return { error: '[[composer-polls:errors.type-required]]' };
		}

		const options = [];
		let optionError = null;
		modalEl.find('.composer-polls-option').each((index, element) => {
			if (optionError) {
				return;
			}
			const optionEl = $(element);
			const text = optionEl.find('.composer-polls-option-input').val().trim();
			if (!text) {
				optionError = '[[composer-polls:errors.option-text]]';
				return;
			}
			if (text.length > OPTION_MAX_LENGTH) {
				optionError = '[[composer-polls:errors.option-length, ' + OPTION_MAX_LENGTH + ']]';
				return;
			}
			options.push({
				id: optionEl.attr('data-option-id') || generateOptionId(),
				text,
			});
		});

		if (optionError) {
			return { error: optionError };
		}
		if (options.length < MIN_OPTIONS) {
			return { error: '[[composer-polls:errors.option-required, ' + MIN_OPTIONS + ']]' };
		}
		if (options.length > MAX_OPTIONS) {
			return { error: '[[composer-polls:errors.option-limit, ' + MAX_OPTIONS + ']]' };
		}

		const visibility = modalEl.find('.composer-polls-visibility').val() || DEFAULT_VISIBILITY;
		const closeMode = modalEl.find('input[name="composer-polls-close-mode"]:checked').val();
		const closeInput = modalEl.find('.composer-polls-close-input').val();

		let closesAt = 0;
		if (closeMode === 'date') {
			const timestamp = inputValueToTimestamp(closeInput);
			if (!timestamp || timestamp <= Date.now()) {
				return { error: '[[composer-polls:errors.close-date]]' };
			}
			closesAt = timestamp;
		}

		return {
			poll: {
				type,
				options,
				visibility,
				closesAt,
				allowRevote: true,
			},
		};
	}

	// Rebuild the inline summary so authors see the saved configuration instantly.
	async function refreshSummary(postContainer, poll, labels) {
		const summaryEl = ensureSummary(postContainer);

	const [title, editLabel, removeLabel, typeLabel, visibilityLabel, optionsLabel, closeLabel, closeNever, noteLabel] = await translateMany([
		'[[composer-polls:summary.title]]',
		 labels?.editLabel || '[[composer-polls:summary.edit]]',
		 labels?.removeSummaryLabel || '[[composer-polls:summary.remove]]',
		'[[composer-polls:type.label]]',
		'[[composer-polls:visibility.label]]',
		'[[composer-polls:options.label]]',
		'[[composer-polls:close.label]]',
		'[[composer-polls:summary.never]]',
		 labels?.allowNote || '[[composer-polls:note]]',
	]);

		summaryEl.find('[data-role="summary-title"]').text(title);
		summaryEl.find('[data-action="composer-poll-edit"]').text(editLabel);
		summaryEl.find('[data-action="composer-poll-remove"]').text(removeLabel);

		if (!poll) {
			summaryEl.addClass('d-none');
			summaryEl.find('[data-role="summary-type"]').empty();
			summaryEl.find('[data-role="summary-visibility"]').empty();
			summaryEl.find('[data-role="summary-options"]').empty();
			summaryEl.find('[data-role="summary-closes"]').empty();
			summaryEl.find('[data-role="summary-note"]').text(noteLabel);
			return;
		}

		summaryEl.removeClass('d-none');
		const typeValue = await translate(`[[composer-polls:type.${poll.type}]]`);
		const visibilityKey = poll.visibility === 'public' ? '[[composer-polls:visibility.named]]' : '[[composer-polls:visibility.anonymous]]';
		const visibilityValue = await translate(visibilityKey);

		summaryEl.find('[data-role="summary-type"]').text(`${typeLabel}: ${typeValue}`);
		summaryEl.find('[data-role="summary-visibility"]').text(`${visibilityLabel}: ${visibilityValue}`);
		summaryEl.find('[data-role="summary-options"]').text(`${optionsLabel}: ${poll.options.length}`);

		if (poll.closesAt) {
			const closeDisplay = new Date(poll.closesAt).toLocaleString();
			summaryEl.find('[data-role="summary-closes"]').text(`${closeLabel}: ${closeDisplay}`);
		} else {
			summaryEl.find('[data-role="summary-closes"]').text(closeNever);
		}

		summaryEl.find('[data-role="summary-note"]').text(noteLabel);
	}

	// Lazily create the summary container so we do not rely on template changes.
	function ensureSummary(postContainer) {
		let summary = postContainer.find('.composer-polls-summary');
		if (!summary.length) {
			summary = $(
				'<div class="composer-polls-summary alert alert-info d-flex flex-column gap-2 mt-3" data-role="poll-summary">' +
					'<div class="d-flex justify-content-between align-items-center gap-3">' +
						'<div class="d-flex align-items-center gap-2">' +
							'<i class="fa fa-pie-chart"></i>' +
							'<span data-role="summary-title"></span>' +
						'</div>' +
						'<div class="btn-group btn-group-sm">' +
							'<button type="button" class="btn btn-outline-primary" data-action="composer-poll-edit"></button>' +
							'<button type="button" class="btn btn-outline-danger" data-action="composer-poll-remove"></button>' +
						'</div>' +
					'</div>' +
					'<div class="small text-body-secondary" data-role="summary-type"></div>' +
					'<div class="small text-body-secondary" data-role="summary-visibility"></div>' +
					'<div class="small text-body-secondary" data-role="summary-options"></div>' +
					'<div class="small text-body-secondary" data-role="summary-closes"></div>' +
					'<div class="small text-muted fst-italic" data-role="summary-note"></div>' +
				'</div>'
			);

			const insertTarget = postContainer.find('.imagedrop');
			if (insertTarget.length) {
				insertTarget.before(summary);
			} else {
				postContainer.append(summary);
			}
		}
		return summary;
	}

	// Mirror poll state in the toolbar badge for quick visual feedback.
	function updateBadge(postContainer, poll) {
		const badge = postContainer.find('[data-format="polls"] .badge');
		if (!badge.length) {
			return;
		}
		if (poll) {
			badge.text(poll.options.length).removeClass('hidden');
		} else {
			badge.text('').addClass('hidden');
		}
	}

	// Prefetch all option placeholders so modal creation is synchronous.
	async function getPlaceholders() {
		return Promise.all(
			Array.from({ length: MAX_OPTIONS }, (_, index) =>
				translate(`[[composer-polls:options.placeholder, ${index + 1}]]`)
			)
		);
	}

	// Promise-wrapped translator helper keeps flow async/await friendly.
	function translate(str) {
		return new Promise((resolve) => {
			translator.translate(str, resolve);
		});
	}

	// Fan out through translate() to keep ordering aligned with callers.
	function translateMany(keys) {
		return Promise.all(keys.map(key => translate(key)));
	}
});
