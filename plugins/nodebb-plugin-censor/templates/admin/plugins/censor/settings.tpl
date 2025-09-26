<div class="row">
  <div class="col-sm-9">
    <form class="censor-settings">
      <div class="mb-3">
        <label class="form-label">Banned words (one per line or comma-separated)</label>
        <textarea class="form-control" name="bannedWords" rows="18">{bannedWords}</textarea>
      </div>
      <input type="hidden" name="_csrf" value="{config.csrf_token}">
      <button id="censor-save" type="button" class="btn btn-primary">Save</button>
      <button id="censor-reset" type="button" class="btn btn-outline-secondary ms-2">Reset to CSV defaults</button>
      <span id="censor-status" class="text-muted ms-2"></span>
    </form>
  </div>
</div>
