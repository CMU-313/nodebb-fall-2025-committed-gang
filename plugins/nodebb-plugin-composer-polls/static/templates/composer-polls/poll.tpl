<div class="composer-polls-widget card mt-3" data-poll-id="{poll.id}" data-pid="{poll.pid}">
	<div class="card-header d-flex flex-wrap align-items-center justify-content-between gap-2">
		<div class="d-flex align-items-center gap-2">
			<i class="fa fa-pie-chart text-primary"></i>
			<span class="fw-semibold">[[composer-polls:widget.title]]</span>
		</div>
		<div class="d-flex flex-wrap align-items-center gap-2">
			<span class="badge bg-secondary" data-role="poll-visibility">{poll.visibilityLabel}</span>
			{{{ if poll.isClosed }}}
			<span class="badge bg-danger" data-role="poll-status">[[composer-polls:widget.closed]]</span>
			{{{ end }}}
		</div>
	</div>
	<div class="card-body d-flex flex-column gap-3" data-role="poll-body">
		<div class="d-flex flex-wrap gap-3 small text-muted">
			<span data-role="poll-participants">{poll.participantsLabel}</span>
			{{{ if poll.closesAtLabel }}}
			<span data-role="poll-closes">{poll.closesAtLabel}</span>
			{{{ end }}}
		</div>
		{{{ if poll.isRanked }}}
		<div class="alert alert-info py-2 px-3 small mb-0" data-role="poll-ranked-hint">[[composer-polls:widget.ranked-hint]]</div>
		{{{ end }}}
		<div class="composer-polls-options d-flex flex-column gap-3" data-role="poll-options" data-type="{poll.type}">
		{{{ each options }}}
			<div class="composer-polls-option border rounded-2 p-3" data-option-id="{./id}">
				{{{ if ./inputType }}}
				<div class="form-check">
					<input class="form-check-input" type="{./inputType}" name="composer-polls-{../poll.id}" id="composer-polls-{../poll.id}-{./id}" value="{./id}" {{{ if ./selected }}}checked{{{ end }}} {{{ if !../poll.canVote }}}disabled{{{ end }}}>
					<label class="form-check-label fw-semibold text-break" for="composer-polls-{../poll.id}-{./id}">{./text}</label>
				</div>
				{{{ else }}}
				<div class="d-flex align-items-center justify-content-between gap-3 composer-polls-ranked-row">
					<div class="d-flex align-items-center gap-2">
						<span class="badge bg-light text-dark border">{./position}</span>
						<span class="fw-semibold text-break">{./text}</span>
					</div>
					<div class="btn-group btn-group-sm" role="group">
						<button type="button" class="btn btn-outline-secondary" data-action="composer-polls-move-up" {{{ if ./isFirst }}}disabled{{{ end }}}>
							<i class="fa fa-arrow-up"></i>
						</button>
						<button type="button" class="btn btn-outline-secondary" data-action="composer-polls-move-down" {{{ if ./isLast }}}disabled{{{ end }}}>
							<i class="fa fa-arrow-down"></i>
						</button>
					</div>
				</div>
				{{{ end }}}
				<div class="progress mt-3" aria-hidden="true">
					<div class="progress-bar" role="progressbar" style="width: {./percent}%;" aria-valuenow="{./percent}" aria-valuemin="0" aria-valuemax="100"></div>
				</div>
				<div class="d-flex align-items-center justify-content-between mt-2 small text-muted">
					<span>{./countLabel}</span>
					<span>{./percentLabel}</span>
				</div>
			</div>
		{{{ end }}}
		</div>
		<div class="d-flex flex-wrap gap-2 align-items-center justify-content-between">
			<span class="small text-muted" data-role="poll-status-text">{poll.statusText}</span>
			{{{ if poll.canVote }}}
			<button type="button" class="btn btn-primary btn-sm" data-action="composer-polls-submit">{poll.buttonLabel}</button>
			{{{ else if poll.hasVoted }}}
			<span class="badge bg-success text-wrap" data-role="poll-thanks">[[composer-polls:widget.you-voted]]</span>
			{{{ else }}}
			<span class="small text-muted text-wrap" data-role="poll-cannot-vote">{poll.cannotVoteLabel}</span>
			{{{ end }}}
		</div>
	</div>
</div>
