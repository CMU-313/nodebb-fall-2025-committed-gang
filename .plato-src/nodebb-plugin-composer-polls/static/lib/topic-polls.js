'use strict';

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
require(['hooks', 'benchpress', 'translator', 'alerts'], function (hooks, Benchpress, translator, alerts) {
  var pollsByPid = new Map();
  hooks.on('action:posts.loaded', function (data) {
    if (!data || !Array.isArray(data.posts)) {
      return;
    }
    data.posts.forEach(function (post) {
      return processPost(post);
    });
  });
  hooks.on('action:ajaxify.end', function () {
    var topicData = (typeof ajaxify === "undefined" ? "undefined" : _typeof(ajaxify)) === 'object' && ajaxify.data && Array.isArray(ajaxify.data.posts) ? ajaxify.data.posts : [];
    topicData.forEach(function (post) {
      return processPost(post);
    });
  });
  function processPost(post) {
    if (!post || typeof post.pid === 'undefined') {
      return;
    }
    var pid = String(post.pid);
    if (post.poll) {
      var existing = pollsByPid.get(pid);
      var existingWidget = document.querySelector("[component=\"post\"][data-pid=\"".concat(pid, "\"] .composer-polls-widget"));
      if (existing && existingWidget && existing.updatedAt === post.poll.updatedAt) {
        return;
      }
      pollsByPid.set(pid, post.poll);
      renderPoll(pid, post.poll)["catch"](function (err) {
        if (err) {
          console.error('[composer-polls] Failed to render poll', err);
        }
      });
    } else {
      pollsByPid["delete"](pid);
      removePoll(pid);
    }
  }
  function removePoll(pid) {
    var selector = "[component=\"post\"][data-pid=\"".concat(pid, "\"] .composer-polls-widget");
    var widget = document.querySelector(selector);
    if (widget && widget.parentNode) {
      widget.parentNode.removeChild(widget);
    }
  }
  function renderPoll(_x, _x2) {
    return _renderPoll.apply(this, arguments);
  }
  function _renderPoll() {
    _renderPoll = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(pid, poll) {
      var postEl, bodyEl, existing, templateData, html, wrapper, widgetEl, footer;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            postEl = document.querySelector("[component=\"post\"][data-pid=\"".concat(pid, "\"]"));
            if (postEl) {
              _context2.n = 1;
              break;
            }
            return _context2.a(2);
          case 1:
            bodyEl = postEl.querySelector('.post-container');
            if (bodyEl) {
              _context2.n = 2;
              break;
            }
            return _context2.a(2);
          case 2:
            existing = bodyEl.querySelector('.composer-polls-widget');
            if (existing && existing.parentNode) {
              existing.parentNode.removeChild(existing);
            }
            templateData = buildTemplateData(poll);
            _context2.n = 3;
            return Benchpress.render('composer-polls/poll', templateData);
          case 3:
            html = _context2.v;
            _context2.n = 4;
            return translate(html);
          case 4:
            html = _context2.v;
            wrapper = document.createElement('div');
            wrapper.innerHTML = html.trim();
            widgetEl = wrapper.firstElementChild;
            if (widgetEl) {
              _context2.n = 5;
              break;
            }
            return _context2.a(2);
          case 5:
            footer = bodyEl.querySelector('[component="post/footer"]');
            if (footer && footer.parentNode) {
              footer.parentNode.insertBefore(widgetEl, footer);
            } else {
              bodyEl.appendChild(widgetEl);
            }
            widgetEl.dataset.pid = String(poll.pid);
            bindWidgetHandlers(widgetEl);
          case 6:
            return _context2.a(2);
        }
      }, _callee2);
    }));
    return _renderPoll.apply(this, arguments);
  }
  function buildTemplateData(poll) {
    var safePoll = poll || {};
    var results = safePoll.results || {};
    var optionResults = results.options || {};
    var totalParticipants = results.totalParticipants || 0;
    var orderedOptions = Array.isArray(safePoll.options) ? safePoll.options.slice() : [];
    if (safePoll.type === 'ranked' && Array.isArray(safePoll.userSelections) && safePoll.userSelections.length) {
      var seen = new Set();
      var ordered = [];
      safePoll.userSelections.forEach(function (id) {
        var option = orderedOptions.find(function (opt) {
          return opt.id === id;
        });
        if (option && !seen.has(option.id)) {
          ordered.push(option);
          seen.add(option.id);
        }
      });
      orderedOptions.forEach(function (option) {
        if (!seen.has(option.id)) {
          ordered.push(option);
        }
      });
      orderedOptions = ordered;
    }
    var totalPoints = 0;
    if (safePoll.type === 'ranked') {
      orderedOptions.forEach(function (option) {
        var _optionResults$option;
        totalPoints += ((_optionResults$option = optionResults[option.id]) === null || _optionResults$option === void 0 ? void 0 : _optionResults$option.points) || 0;
      });
    }
    var selections = new Set(Array.isArray(safePoll.userSelections) ? safePoll.userSelections : []);
    var optionData = orderedOptions.map(function (option, index) {
      var stats = optionResults[option.id] || {};
      var count = stats.count || 0;
      var points = stats.points || 0;
      var percent = 0;
      if (safePoll.type === 'ranked') {
        percent = totalPoints ? Math.round(points / totalPoints * 100) : 0;
      } else {
        percent = totalParticipants ? Math.round(count / totalParticipants * 100) : 0;
      }
      if (!Number.isFinite(percent)) {
        percent = 0;
      }
      var inputType = null;
      if (safePoll.type === 'single') {
        inputType = 'radio';
      } else if (safePoll.type === 'multi') {
        inputType = 'checkbox';
      }
      var rawVoters = Array.isArray(stats.voters) ? stats.voters : [];
      var voters = rawVoters.map(function (voter) {
        if (!voter || _typeof(voter) !== 'object') {
          return {
            uid: String(voter || ''),
            username: String(voter || ''),
            profileUrl: null
          };
        }
        return {
          uid: String(voter.uid || voter.userslug || voter.username || ''),
          username: voter.username || voter.uid || voter.userslug || '',
          profileUrl: voter.profileUrl || null
        };
      });
      var showVoters = safePoll.visibility === 'public' && voters.length > 0;
      var votersLabel = voters.map(function (voter) {
        return voter.username || voter.uid;
      }).join(', ');
      return {
        id: option.id,
        text: option.text,
        inputType: inputType,
        selected: selections.has(option.id),
        percent: percent,
        percentLabel: "[[composer-polls:results.percentage, ".concat(percent, "]]"),
        countLabel: safePoll.type === 'ranked' ? "[[composer-polls:results.points, ".concat(points, "]]") : "[[composer-polls:results.votes, ".concat(count, "]]"),
        isFirst: safePoll.type === 'ranked' && index === 0,
        isLast: safePoll.type === 'ranked' && index === orderedOptions.length - 1,
        position: index + 1,
        voters: voters,
        votersLabel: votersLabel,
        showVoters: showVoters
      };
    });
    var visibilityLabel = safePoll.visibility === 'public' ? '[[composer-polls:widget.public]]' : '[[composer-polls:widget.anonymous]]';
    var participantsLabel = "[[composer-polls:widget.participants, ".concat(safePoll.totalParticipants || 0, "]]");
    var closesAtLabel = safePoll.closesAt ? "[[composer-polls:widget.closes, ".concat(formatDate(safePoll.closesAt), "]]") : '';
    var allowRevote = coerceBoolean(safePoll.allowRevote);
    var hasVoted = coerceBoolean(safePoll.hasVoted);
    var canVote = coerceBoolean(safePoll.canVote);
    var isClosed = coerceBoolean(safePoll.isClosed);
    var canManage = coerceBoolean(safePoll.canManage);
    var buttonLabel = hasVoted && allowRevote ? '[[composer-polls:widget.update]]' : '[[composer-polls:widget.vote]]';
    var statusText = visibilityLabel;
    var cannotVoteLabel = isClosed ? '[[composer-polls:widget.closed]]' : '[[composer-polls:widget.cant-vote]]';
    return {
      poll: {
        id: safePoll.id,
        pid: safePoll.pid,
        type: safePoll.type,
        visibility: safePoll.visibility,
        visibilityLabel: visibilityLabel,
        isClosed: isClosed,
        allowRevote: allowRevote,
        canVote: canVote,
        canManage: canManage,
        hasVoted: hasVoted,
        totalParticipants: safePoll.totalParticipants || 0,
        participantsLabel: participantsLabel,
        closesAtLabel: closesAtLabel,
        buttonLabel: buttonLabel,
        statusText: statusText,
        cannotVoteLabel: cannotVoteLabel,
        isRanked: safePoll.type === 'ranked',
        showPublicVoters: safePoll.visibility === 'public'
      },
      options: optionData
    };
  }
  function bindWidgetHandlers(widgetEl) {
    if (!widgetEl) {
      return;
    }
    widgetEl.querySelectorAll('[data-action="composer-polls-move-up"]').forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        moveRankedOption(widgetEl, button.closest('[data-option-id]'), -1);
      });
    });
    widgetEl.querySelectorAll('[data-action="composer-polls-move-down"]').forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        moveRankedOption(widgetEl, button.closest('[data-option-id]'), 1);
      });
    });
    widgetEl.querySelectorAll('[data-action="composer-polls-close"]').forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        managePoll(widgetEl, button, 'close');
      });
    });
    widgetEl.querySelectorAll('[data-action="composer-polls-reopen"]').forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        managePoll(widgetEl, button, 'reopen');
      });
    });
    var submitBtn = widgetEl.querySelector('[data-action="composer-polls-submit"]');
    if (submitBtn) {
      submitBtn.addEventListener('click', /*#__PURE__*/function () {
        var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(event) {
          return _regenerator().w(function (_context) {
            while (1) switch (_context.n) {
              case 0:
                event.preventDefault();
                _context.n = 1;
                return handleVote(widgetEl, submitBtn);
              case 1:
                return _context.a(2);
            }
          }, _callee);
        }));
        return function (_x3) {
          return _ref.apply(this, arguments);
        };
      }());
    }
    enableOptionBoxSelection(widgetEl);
    updateRankedControls(widgetEl);
  }
  function enableOptionBoxSelection(widgetEl) {
    if (!widgetEl) {
      return;
    }
    var pid = widgetEl.dataset.pid;
    if (!pid) {
      return;
    }
    var poll = pollsByPid.get(String(widgetEl.dataset.pid));
    widgetEl.querySelectorAll('.composer-polls-option').forEach(function (optionEl) {
      var input = optionEl.querySelector('.form-check-input');

      // Enable drag-and-drop for ranked polls
      if (poll && poll.type === 'ranked' && coerceBoolean(poll.canVote)) {
        enableDragAndDrop(widgetEl, optionEl);
        return;
      }
      if (!input) {
        return;
      }
      optionEl.addEventListener('click', function (event) {
        var target = event.target;
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
        input.dispatchEvent(new Event('change', {
          bubbles: true
        }));
        if (typeof input.focus === 'function') {
          try {
            input.focus({
              preventScroll: true
            });
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
    optionEl.addEventListener('dragstart', function (e) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', optionEl.dataset.optionId);
      optionEl.classList.add('dragging');
      optionEl.style.opacity = '0.5';
    });
    optionEl.addEventListener('dragend', function (e) {
      optionEl.classList.remove('dragging');
      optionEl.style.opacity = '1';
      optionEl.style.cursor = 'grab';
      // Update controls after drag ends
      updateRankedControls(widgetEl);
    });
    optionEl.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      var draggingEl = widgetEl.querySelector('.dragging');
      if (!draggingEl || draggingEl === optionEl) {
        return;
      }

      // Get bounding rectangles
      var rect = optionEl.getBoundingClientRect();
      var midpoint = rect.top + rect.height / 2;

      // Determine if we should insert before or after
      if (e.clientY < midpoint) {
        optionEl.parentNode.insertBefore(draggingEl, optionEl);
      } else {
        optionEl.parentNode.insertBefore(draggingEl, optionEl.nextSibling);
      }
    });
    optionEl.addEventListener('drop', function (e) {
      e.preventDefault();
      e.stopPropagation();
    });

    // Visual feedback on hover
    optionEl.addEventListener('dragenter', function (e) {
      if (!optionEl.classList.contains('dragging')) {
        optionEl.style.borderColor = '#0d6efd';
        optionEl.style.backgroundColor = 'rgba(13, 110, 253, 0.05)';
      }
    });
    optionEl.addEventListener('dragleave', function (e) {
      optionEl.style.borderColor = '';
      optionEl.style.backgroundColor = '';
    });
  }
  function managePoll(_x4, _x5, _x6) {
    return _managePoll.apply(this, arguments);
  }
  function _managePoll() {
    _managePoll = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(widgetEl, actionButton, action) {
      var pid, poll, updated, message, _t;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            pid = widgetEl.dataset.pid;
            poll = pollsByPid.get(String(pid));
            if (poll) {
              _context3.n = 1;
              break;
            }
            return _context3.a(2);
          case 1:
            if (actionButton) {
              actionButton.disabled = true;
              actionButton.classList.add('disabled');
            }
            _context3.p = 2;
            _context3.n = 3;
            return emitManage(poll.id, action);
          case 3:
            updated = _context3.v;
            pollsByPid.set(String(updated.pid), updated);
            _context3.n = 4;
            return renderPoll(String(updated.pid), updated);
          case 4:
            _context3.n = 6;
            break;
          case 5:
            _context3.p = 5;
            _t = _context3.v;
            message = _t && _t.message ? _t.message : _t;
            alerts.error(message || '[[error:unknown-error]]');
          case 6:
            _context3.p = 6;
            if (actionButton && actionButton.isConnected) {
              actionButton.disabled = false;
              actionButton.classList.remove('disabled');
            }
            return _context3.f(6);
          case 7:
            return _context3.a(2);
        }
      }, _callee3, null, [[2, 5, 6, 7]]);
    }));
    return _managePoll.apply(this, arguments);
  }
  function handleVote(_x7, _x8) {
    return _handleVote.apply(this, arguments);
  }
  function _handleVote() {
    _handleVote = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(widgetEl, submitBtn) {
      var pid, poll, selections, updated, updatedPid, message, _t2;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.p = _context4.n) {
          case 0:
            pid = widgetEl.dataset.pid;
            poll = pollsByPid.get(String(pid));
            if (poll) {
              _context4.n = 1;
              break;
            }
            return _context4.a(2);
          case 1:
            selections = collectSelections(widgetEl, poll);
            if (selections.length) {
              _context4.n = 2;
              break;
            }
            alerts.error('[[composer-polls:errors.vote-required]]');
            return _context4.a(2);
          case 2:
            if (!(poll.type === 'ranked' && selections.length < 2)) {
              _context4.n = 3;
              break;
            }
            alerts.error('[[composer-polls:errors.vote-ranked-min]]');
            return _context4.a(2);
          case 3:
            if (submitBtn) {
              submitBtn.disabled = true;
              submitBtn.classList.add('disabled');
            }
            _context4.p = 4;
            _context4.n = 5;
            return emitVote(poll.id, selections);
          case 5:
            updated = _context4.v;
            updatedPid = String(updated.pid);
            pollsByPid.set(updatedPid, updated);
            _context4.n = 6;
            return renderPoll(updatedPid, updated);
          case 6:
            _context4.n = 8;
            break;
          case 7:
            _context4.p = 7;
            _t2 = _context4.v;
            message = _t2 && _t2.message ? _t2.message : _t2;
            alerts.error(message || '[[error:unknown-error]]');
          case 8:
            _context4.p = 8;
            if (submitBtn && submitBtn.isConnected) {
              submitBtn.disabled = false;
              submitBtn.classList.remove('disabled');
            }
            return _context4.f(8);
          case 9:
            return _context4.a(2);
        }
      }, _callee4, null, [[4, 7, 8, 9]]);
    }));
    return _handleVote.apply(this, arguments);
  }
  function collectSelections(widgetEl, poll) {
    if (!widgetEl || !poll) {
      return [];
    }
    if (poll.type === 'single') {
      var checked = widgetEl.querySelector('input[type="radio"]:checked');
      return checked ? [checked.value] : [];
    }
    if (poll.type === 'multi') {
      var _checked = widgetEl.querySelectorAll('input[type="checkbox"]:checked');
      var selections = [];
      _checked.forEach(function (input) {
        if (input && input.value) {
          selections.push(input.value);
        }
      });
      return selections;
    }
    var options = widgetEl.querySelectorAll('[data-option-id]');
    return Array.from(options).map(function (option) {
      return option.getAttribute('data-option-id');
    }).filter(Boolean);
  }
  function moveRankedOption(widgetEl, optionEl, delta) {
    if (!widgetEl || !optionEl || !optionEl.parentNode || !delta) {
      return;
    }
    var parent = optionEl.parentNode;
    if (delta < 0) {
      var previous = optionEl.previousElementSibling;
      if (previous) {
        var reference = previous;
        parent.insertBefore(optionEl, reference);
      }
    } else if (delta > 0) {
      var next = optionEl.nextElementSibling;
      if (next) {
        var _reference = next.nextElementSibling;
        parent.insertBefore(optionEl, _reference);
      }
    }
    updateRankedControls(widgetEl);
  }
  function updateRankedControls(widgetEl) {
    if (!widgetEl) {
      return;
    }
    var options = widgetEl.querySelectorAll('.composer-polls-option');
    options.forEach(function (option, index) {
      var upBtn = option.querySelector('[data-action="composer-polls-move-up"]');
      var downBtn = option.querySelector('[data-action="composer-polls-move-down"]');
      if (upBtn) {
        upBtn.disabled = index === 0;
      }
      if (downBtn) {
        downBtn.disabled = index === options.length - 1;
      }
      var badge = option.querySelector('.composer-polls-ranked-row .badge');
      if (badge) {
        badge.textContent = index + 1;
      }
    });
  }
  function emitVote(pollId, selections) {
    return new Promise(function (resolve, reject) {
      socket.emit('plugins.composerPolls.vote', {
        pollId: pollId,
        selections: selections
      }, function (err, result) {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }
  function emitManage(pollId, action) {
    return new Promise(function (resolve, reject) {
      socket.emit('plugins.composerPolls.manage', {
        pollId: pollId,
        action: action
      }, function (err, result) {
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
      var lowered = value.toLowerCase();
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
    var date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    return date.toLocaleString();
  }
  function translate(html) {
    return new Promise(function (resolve) {
      translator.translate(html, resolve);
    });
  }
});