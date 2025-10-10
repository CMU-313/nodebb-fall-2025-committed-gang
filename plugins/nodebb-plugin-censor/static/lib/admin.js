'use strict';
define('admin/plugins/censor/settings', ['alerts'], function (alerts) {
  const ACP = {};
  ACP.init = function () {
    const form = document.querySelector('.censor-settings');
    const saveBtn = document.getElementById('censor-save');
    const resetBtn = document.getElementById('censor-reset');
    const status = document.getElementById('censor-status');

    async function save(text) {
      try {
        status.textContent = 'Saving...';
        const token = form.querySelector('input[name="_csrf"]').value;
        console.log('[nodebb-plugin-censor][admin] saving, token present?:', !!token);
        const res = await fetch('/api/admin/plugins/censor/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': token,
          },
          credentials: 'same-origin',
          body: JSON.stringify({
            bannedWords: text,
            _csrf: token,
          }),
        });
        const json = await res.json();
        if (json && json.success) {
          status.textContent = 'Saved ✓';
          alerts.success('Saved');
        } else {
          status.textContent = 'Save failed';
          alerts.error('Save failed');
        }
      } catch (err) {
        status.textContent = 'Save failed';
        alerts.error('Save failed');
        console.error('[nodebb-plugin-censor][admin] save error', err);
      }
    }

    // Intercept form submit to use fetch-based save (and prevent full page reload)
    form?.addEventListener('submit', (ev) => {
      ev.preventDefault();
      save(form.querySelector('textarea[name="bannedWords"]').value);
    });
    resetBtn?.addEventListener('click', () => { form.querySelector('textarea[name="bannedWords"]').value = ''; save(''); });
  };
  return ACP;
});
