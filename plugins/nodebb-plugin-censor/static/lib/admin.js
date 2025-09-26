'use strict';
define('admin/plugins/censor/settings', ['alerts'], function (alerts) {
  const ACP = {};
  ACP.init = function () {
    const form = document.querySelector('.censor-settings');
    const saveBtn = document.getElementById('censor-save');
    const resetBtn = document.getElementById('censor-reset');
    const status = document.getElementById('censor-status');

    async function save(text) {
      status.textContent = 'Saving…';
      const res = await fetch('/api/admin/plugins/censor/settings', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin',
        body: JSON.stringify({
          bannedWords: text,
          _csrf: form.querySelector('input[name="_csrf"]').value,
        }),
      });
      const json = await res.json();
      if (json?.success) { status.textContent = 'Saved ✓'; alerts.success('Saved'); }
      else { status.textContent = 'Save failed'; alerts.error('Save failed'); }
    }

    saveBtn?.addEventListener('click', () => save(form.querySelector('textarea[name="bannedWords"]').value));
    resetBtn?.addEventListener('click', () => { form.querySelector('textarea[name="bannedWords"]').value = ''; save(''); });
  };
  return ACP;
});
