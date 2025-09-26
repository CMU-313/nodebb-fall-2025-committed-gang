<div class="composer-polls-modal" data-max-options="{maxOptions}">
	<div class="mb-3">
		<label class="form-label fw-semibold">[[composer-polls:type.label]]</label>
		<div class="btn-group" role="group" aria-label="[[composer-polls:type.label]]">
			<input type="radio" class="btn-check" name="composer-poll-type" id="composer-poll-type-single" value="single" {{ if type == 'single' }}checked{{ end }}>
			<label class="btn btn-outline-primary" for="composer-poll-type-single">[[composer-polls:type.single]]</label>
			<input type="radio" class="btn-check" name="composer-poll-type" id="composer-poll-type-multi" value="multi" {{ if type == 'multi' }}checked{{ end }}>
			<label class="btn btn-outline-primary" for="composer-poll-type-multi">[[composer-polls:type.multi]]</label>
			<input type="radio" class="btn-check" name="composer-poll-type" id="composer-poll-type-ranked" value="ranked" {{ if type == 'ranked' }}checked{{ end }}>
			<label class="btn btn-outline-primary" for="composer-poll-type-ranked">[[composer-polls:type.ranked]]</label>
		</div>
	</div>

	<div class="mb-3">
		<label class="form-label fw-semibold">[[composer-polls:options.label]]</label>
		<div class="composer-polls-options d-flex flex-column gap-2">
		{{{ each options }}}
		<div class="input-group composer-polls-option" data-option-id="{./id}">
			<span class="input-group-text">{./position}.</span>
			<input type="text" class="form-control composer-polls-option-input" value="{./text}" placeholder="{./placeholder}" maxlength="120">
				<button class="btn btn-outline-danger composer-polls-remove-option" type="button" aria-label="[[composer-polls:options.remove]]">
					<i class="fa fa-trash"></i>
				</button>
			</div>
			{{{ end }}}
		</div>
		<button type="button" class="btn btn-outline-secondary btn-sm mt-2 composer-polls-add-option" data-action="add-option">
			<i class="fa fa-plus"></i>
			[[composer-polls:options.add]]
		</button>
	</div>

	<div class="mb-3">
		<label class="form-label fw-semibold">[[composer-polls:visibility.label]]</label>
		<select class="form-select composer-polls-visibility">
			<option value="anonymous" {{ if visibility == 'anonymous' }}selected{{ end }}>[[composer-polls:visibility.anonymous]]</option>
			<option value="public" {{ if visibility == 'public' }}selected{{ end }}>[[composer-polls:visibility.named]]</option>
		</select>
	</div>

	<div class="mb-3 composer-polls-close">
		<label class="form-label fw-semibold d-block">[[composer-polls:close.label]]</label>
		<div class="form-check">
			<input class="form-check-input" type="radio" name="composer-polls-close-mode" id="composer-polls-close-never" value="never" {{ if !closesAt }}checked{{ end }}>
			<label class="form-check-label" for="composer-polls-close-never">[[composer-polls:close.never]]</label>
		</div>
		<div class="form-check mt-2 d-flex align-items-center gap-2">
			<input class="form-check-input" type="radio" name="composer-polls-close-mode" id="composer-polls-close-at" value="date" {{ if closesAt }}checked{{ end }}>
			<label class="form-check-label" for="composer-polls-close-at">[[composer-polls:close.at]]</label>
			<input type="datetime-local" class="form-control composer-polls-close-input" value="{closesAtISO}" {{ if !closesAt }}disabled{{ end }}>
		</div>
	</div>
</div>