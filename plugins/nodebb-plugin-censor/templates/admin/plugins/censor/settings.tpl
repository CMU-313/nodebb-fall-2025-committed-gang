<div class="row">
  <div class="col-sm-3">
    <div class="card mb-3">
      <div class="card-header bg-primary text-white">
        <h5 class="card-title mb-0"><i class="fa fa-chart-bar"></i> Statistics</h5>
      </div>
      <div class="card-body">
        <div class="mb-2">
          <strong>Total Words Censored:</strong>
          <h3 class="text-primary">{stats.totalCensored}</h3>
        </div>
        <div class="mb-2">
          <strong>Posts Censored:</strong>
          <h3 class="text-success">{stats.postsCensored}</h3>
        </div>
        <div class="mb-2">
          <strong>Banned Words:</strong>
          <h3 class="text-danger"><span id="word-count">{bannedWordsCount}</span></h3>
        </div>
        <div class="mb-0">
          <strong>Last Censored:</strong><br>
          <small class="text-muted">{stats.lastCensoredAt}</small>
        </div>
      </div>
    </div>
  </div>
  
  <div class="col-sm-9">
    <form class="censor-settings">
      <div class="mb-3">
        <label class="form-label"><strong>Banned words</strong> (one per line or comma-separated)</label>
        <textarea class="form-control" name="bannedWords" rows="18">{bannedWords}</textarea>
      </div>
      <input type="hidden" name="_csrf" value="{config.csrf_token}">
      <button id="censor-save" type="button" class="btn btn-primary">
        <i class="fa fa-save"></i> Save
      </button>
      <button id="censor-reset" type="button" class="btn btn-outline-secondary ms-2">
        <i class="fa fa-undo"></i> Reset to CSV defaults
      </button>
      <span id="censor-status" class="text-muted ms-2"></span>
    </form>
  </div>
</div>

<script>
  require(['admin/plugins/censor/settings'], function (Page) {
    if (Page && typeof Page.init === 'function') {
      Page.init();
    }
  });
  
  // Update word count dynamically
  document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.querySelector('textarea[name="bannedWords"]');
    const counter = document.getElementById('word-count');
    function updateCount() {
      const words = textarea.value.split(/[\n,]/).filter(w => w.trim()).length;
      counter.textContent = words;
    }
    textarea?.addEventListener('input', updateCount);
  });
</script>