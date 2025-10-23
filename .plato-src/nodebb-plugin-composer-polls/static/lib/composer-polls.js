'use strict';

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
require(['hooks', 'composer/formatting', 'translator', 'benchpress', 'bootbox', 'alerts', 'utils', 'composer'], function (hooks, formatting, translator, Benchpress, bootbox, alerts, utils, composer) {
  var MAX_OPTIONS = 10;
  var MIN_OPTIONS = 2;
  var OPTION_MAX_LENGTH = 120;
  var DEFAULT_TYPE = 'single';
  var DEFAULT_VISIBILITY = 'anonymous';
  var hydrationQueue = new Map();
  var dispatchRegistered = false;
  hooks.on('action:composer.enhanced', function (_ref) {
    var postContainer = _ref.postContainer;
    if (!postContainer || !postContainer.length) {
      return;
    }
    var uuid = postContainer.attr('data-uuid');
    var poll = getPoll(uuid);
    // Composer instances are recreated often; keep the summary UI in sync each time.
    bindSummaryActions(postContainer);
    refreshSummary(postContainer, poll);
    updateBadge(postContainer, poll);
    void hydrateComposerPoll(postContainer, uuid);
  });
  hooks.on('action:composer.discard', function (_ref2) {
    var uuid = _ref2.post_uuid;
    if (!uuid) {
      return;
    }
    setPoll(uuid, null);
    hydrationQueue["delete"](uuid);
  });
  hooks.on('filter:composer.submit', function (payload) {
    if (!payload || !payload.postData || !payload.composerData) {
      return payload;
    }
    var poll = payload.postData.pollConfig;
    var hasValidPoll = poll && Array.isArray(poll.options) && poll.options.length >= MIN_OPTIONS;
    var isTopicPost = payload.action === 'topics.post';
    var isEditingMain = payload.action === 'posts.edit' && payload.postData && payload.postData.isMain;
    var removalRequested = Boolean(payload.postData && payload.postData.pollRemoved);
    var hadExisting = Boolean(payload.postData && payload.postData.composerPollInitial);
    if (isTopicPost || isEditingMain) {
      if (hasValidPoll) {
        payload.composerData.poll = poll;
      } else {
        delete payload.composerData.poll;
      }
      if (isEditingMain) {
        if (!hasValidPoll && (removalRequested || hadExisting)) {
          delete payload.composerData.poll;
          payload.composerData.pollRemoved = true;
        } else if (!removalRequested) {
          delete payload.composerData.pollRemoved;
        }
      }
      return payload;
    }
    delete payload.composerData.poll;
    delete payload.composerData.pollRemoved;
    return payload;
  });
  function registerDispatch(postContainer) {
    if (dispatchRegistered || !formatting || typeof formatting.addButtonDispatch !== 'function') {
      return;
    }
    dispatchRegistered = true;
    formatting.addButtonDispatch('polls', function () {
      formatting.exitFullscreen();
      openPollModal(this || postContainer);
    });
  }
  hooks.on('action:composer.enhanced', function (_ref3) {
    var postContainer = _ref3.postContainer;
    registerDispatch(postContainer);
  });
  registerDispatch();
  function openPollModal(_x) {
    return _openPollModal.apply(this, arguments);
  }
  function _openPollModal() {
    _openPollModal = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(postContainer) {
      var uuid, existing, poll, placeholders, modalMarkup, _yield$translateMany, _yield$translateMany2, title, saveLabel, cancelLabel, removeLabel, editLabel, removeSummaryLabel, allowNote, optionRemoveLabel, buttons, dialog;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            postContainer = $(postContainer);
            if (postContainer.length) {
              _context.n = 1;
              break;
            }
            return _context.a(2);
          case 1:
            uuid = postContainer.attr('data-uuid');
            if (uuid) {
              _context.n = 2;
              break;
            }
            return _context.a(2);
          case 2:
            existing = clonePoll(getPoll(uuid));
            poll = existing || createDefaultPoll();
            enforceOptionBounds(poll);
            _context.n = 3;
            return getPlaceholders();
          case 3:
            placeholders = _context.v;
            _context.n = 4;
            return renderModal({
              poll: poll,
              placeholders: placeholders
            });
          case 4:
            modalMarkup = _context.v;
            _context.n = 5;
            return translateMany(['[[composer-polls:add]]', '[[composer-polls:save]]', '[[composer-polls:cancel]]', '[[composer-polls:remove]]', '[[composer-polls:summary.edit]]', '[[composer-polls:summary.remove]]', '[[composer-polls:note]]', '[[composer-polls:options.remove]]']);
          case 5:
            _yield$translateMany = _context.v;
            _yield$translateMany2 = _slicedToArray(_yield$translateMany, 8);
            title = _yield$translateMany2[0];
            saveLabel = _yield$translateMany2[1];
            cancelLabel = _yield$translateMany2[2];
            removeLabel = _yield$translateMany2[3];
            editLabel = _yield$translateMany2[4];
            removeSummaryLabel = _yield$translateMany2[5];
            allowNote = _yield$translateMany2[6];
            optionRemoveLabel = _yield$translateMany2[7];
            buttons = {};
            if (existing) {
              buttons.remove = {
                label: removeLabel,
                className: 'btn-outline-danger me-auto',
                callback: function callback() {
                  setPoll(uuid, null);
                  refreshSummary(postContainer, null, {
                    editLabel: editLabel,
                    removeSummaryLabel: removeSummaryLabel,
                    allowNote: allowNote
                  });
                  updateBadge(postContainer, null);
                }
              };
            }
            buttons.cancel = {
              label: cancelLabel,
              className: 'btn-secondary'
            };

            // Find the buttons.save section in openPollModal and replace it with:
            buttons.save = {
              label: saveLabel,
              className: 'btn-primary',
              callback: function callback() {
                // Return false immediately to prevent dialog from closing
                handleSave(dialog, uuid, postContainer, placeholders, {
                  editLabel: editLabel,
                  removeSummaryLabel: removeSummaryLabel,
                  allowNote: allowNote
                }).then(function (saved) {
                  // Only close dialog manually if save was successful
                  if (saved) {
                    dialog.modal('hide');
                  }
                });
                return false;
              }
            };
            dialog = bootbox.dialog({
              title: title,
              message: modalMarkup,
              className: 'composer-polls-dialog',
              buttons: buttons
            });
            dialog.on('shown.bs.modal', function () {
              var modalEl = dialog.find('.composer-polls-modal');
              attachModalHandlers(modalEl, placeholders, optionRemoveLabel);
              refreshOptionNumbering(modalEl, placeholders);
            });
          case 6:
            return _context.a(2);
        }
      }, _callee);
    }));
    return _openPollModal.apply(this, arguments);
  }
  function bindSummaryActions(postContainer) {
    if (postContainer.data('composer-poll-bound')) {
      return;
    }
    postContainer.data('composer-poll-bound', true);
    postContainer.on('click', '[data-action="composer-poll-edit"]', function (ev) {
      ev.preventDefault();
      openPollModal(postContainer);
    });
    postContainer.on('click', '[data-action="composer-poll-remove"]', function (ev) {
      ev.preventDefault();
      var uuid = postContainer.attr('data-uuid');
      setPoll(uuid, null);
      refreshSummary(postContainer, null);
      updateBadge(postContainer, null);
    });
  }
  function renderModal(_x2) {
    return _renderModal.apply(this, arguments);
  }
  function _renderModal() {
    _renderModal = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(_ref4) {
      var poll, placeholders, options, data, html;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            poll = _ref4.poll, placeholders = _ref4.placeholders;
            _context3.n = 1;
            return Promise.all(poll.options.map(/*#__PURE__*/function () {
              var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(option, index) {
                return _regenerator().w(function (_context2) {
                  while (1) switch (_context2.n) {
                    case 0:
                      return _context2.a(2, {
                        id: option.id,
                        text: option.text || '',
                        placeholder: placeholders[index] || placeholders[placeholders.length - 1],
                        position: index + 1
                      });
                  }
                }, _callee2);
              }));
              return function (_x1, _x10) {
                return _ref5.apply(this, arguments);
              };
            }()));
          case 1:
            options = _context3.v;
            data = {
              type: poll.type || DEFAULT_TYPE,
              options: options,
              visibility: poll.visibility || DEFAULT_VISIBILITY,
              closesAt: poll.closesAt || 0,
              closesAtISO: poll.closesAt ? timestampToInputValue(poll.closesAt) : '',
              maxOptions: MAX_OPTIONS
            };
            _context3.n = 2;
            return Benchpress.render('composer-polls/modal', data);
          case 2:
            html = _context3.v;
            return _context3.a(2, translate(html));
        }
      }, _callee3);
    }));
    return _renderModal.apply(this, arguments);
  }
  function attachModalHandlers(modalEl, placeholders, optionRemoveLabel) {
    modalEl.on('click', '.composer-polls-add-option', function () {
      var optionCount = modalEl.find('.composer-polls-option').length;
      if (optionCount >= MAX_OPTIONS) {
        return;
      }
      var placeholder = placeholders[optionCount] || placeholders[placeholders.length - 1];
      var safePlaceholder = utils.escapeHTML(placeholder);
      var safeRemoveLabel = utils.escapeHTML(optionRemoveLabel);
      var optionId = generateOptionId();
      var optionRow = $("<div class=\"input-group composer-polls-option\" data-option-id=\"".concat(optionId, "\">\n\t\t\t\t\t<span class=\"input-group-text\"></span>\n\t\t\t\t\t<input type=\"text\" class=\"form-control composer-polls-option-input\" maxlength=\"").concat(OPTION_MAX_LENGTH, "\" placeholder=\"").concat(safePlaceholder, "\">\n\t\t\t\t\t<button class=\"btn btn-outline-danger composer-polls-remove-option\" type=\"button\" aria-label=\"").concat(safeRemoveLabel, "\">\n\t\t\t\t\t\t<i class=\"fa fa-trash\"></i>\n\t\t\t\t\t</button>\n\t\t\t\t</div>"));
      modalEl.find('.composer-polls-options').append(optionRow);
      refreshOptionNumbering(modalEl, placeholders);
    });
    modalEl.on('click', '.composer-polls-remove-option', function () {
      var optionCount = modalEl.find('.composer-polls-option').length;
      if (optionCount <= MIN_OPTIONS) {
        return;
      }
      $(this).closest('.composer-polls-option').remove();
      refreshOptionNumbering(modalEl, placeholders);
    });
    modalEl.on('change', 'input[name="composer-polls-close-mode"]', function () {
      var selected = $(this).val();
      var input = modalEl.find('.composer-polls-close-input');
      input.prop('disabled', selected !== 'date');
    });
  }
  function refreshOptionNumbering(modalEl, placeholders) {
    var options = modalEl.find('.composer-polls-option');
    options.each(function (index, element) {
      var optionEl = $(element);
      optionEl.find('.input-group-text').text("".concat(index + 1, "."));
      var placeholder = placeholders[index] || placeholders[placeholders.length - 1];
      optionEl.find('.composer-polls-option-input').attr('placeholder', utils.escapeHTML(placeholder));
    });
    var addBtn = modalEl.find('.composer-polls-add-option');
    addBtn.prop('disabled', options.length >= MAX_OPTIONS);
    var removeButtons = modalEl.find('.composer-polls-remove-option');
    removeButtons.prop('disabled', options.length <= MIN_OPTIONS);
  }
  function createDefaultPoll() {
    return {
      type: DEFAULT_TYPE,
      options: Array.from({
        length: MIN_OPTIONS
      }, function () {
        return {
          id: generateOptionId(),
          text: ''
        };
      }),
      visibility: DEFAULT_VISIBILITY,
      closesAt: 0,
      allowRevote: true
    };
  }
  function enforceOptionBounds(poll) {
    if (!Array.isArray(poll.options)) {
      poll.options = [];
    }
    while (poll.options.length < MIN_OPTIONS) {
      poll.options.push({
        id: generateOptionId(),
        text: ''
      });
    }
    if (poll.options.length > MAX_OPTIONS) {
      poll.options.length = MAX_OPTIONS;
    }
  }
  function clonePoll(poll) {
    if (!poll) {
      return null;
    }
    return JSON.parse(JSON.stringify(poll));
  }
  function getPoll(uuid) {
    if (!uuid || !composer.posts || !composer.posts[uuid]) {
      return null;
    }
    return composer.posts[uuid].pollConfig || null;
  }
  function setPoll(uuid, poll) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    if (!uuid || !composer.posts || !composer.posts[uuid]) {
      return;
    }
    var postState = composer.posts[uuid];
    var silent = Boolean(options.silent);
    if (poll) {
      postState.pollConfig = clonePoll(poll);
      postState.pollRemoved = false;
    } else {
      delete postState.pollConfig;
      if (postState.composerPollInitial) {
        postState.pollRemoved = true;
      } else {
        delete postState.pollRemoved;
      }
    }
    if (!silent) {
      postState.modified = true;
    }
  }
  function generateOptionId() {
    return utils.generateUUID().replace(/[^a-z0-9]/gi, '').slice(0, 12) || "opt".concat(Date.now());
  }
  function timestampToInputValue(timestamp) {
    if (!timestamp) {
      return '';
    }
    var date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    var offset = date.getTimezoneOffset() * 60000;
    var local = new Date(timestamp - offset);
    return local.toISOString().slice(0, 16);
  }
  function inputValueToTimestamp(value) {
    if (!value) {
      return 0;
    }
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return 0;
    }
    return date.getTime();
  }
  function handleSave(_x3, _x4, _x5, _x6, _x7) {
    return _handleSave.apply(this, arguments);
  }
  function _handleSave() {
    _handleSave = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(dialog, uuid, postContainer, placeholders, summaryLabels) {
      var modalEl, collection, errorText;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            modalEl = dialog.find('.composer-polls-modal');
            collection = collectPollFromModal(modalEl);
            if (!collection.error) {
              _context4.n = 2;
              break;
            }
            // Check poll type validation
            if (!modalEl.find('input[name="composer-poll-type"]:checked').length) {
              // Target the Bootstrap button labels
              modalEl.find('.btn-outline-primary').css({
                'border-color': '#dc3545',
                'color': '#dc3545',
                'box-shadow': '0 0 0 0.2rem rgba(220, 53, 69, 0.25)'
              });
              setTimeout(function () {
                modalEl.find('.btn-outline-primary').css({
                  'border-color': '',
                  'color': '',
                  'box-shadow': ''
                });
              }, 2000);
            }

            // Check poll options validation
            modalEl.find('.composer-polls-option-input').each(function () {
              var _this = this;
              if (!$(this).val().trim()) {
                $(this).css('border', '2px solid #dc3545');
                setTimeout(function () {
                  $(_this).css('border', '');
                }, 2000);
              }
            });
            _context4.n = 1;
            return translate(collection.error);
          case 1:
            errorText = _context4.v;
            alerts.error(errorText);
            return _context4.a(2, false);
          case 2:
            setPoll(uuid, collection.poll);
            refreshSummary(postContainer, collection.poll, summaryLabels);
            updateBadge(postContainer, collection.poll);
            return _context4.a(2, true);
        }
      }, _callee4);
    }));
    return _handleSave.apply(this, arguments);
  }
  function collectPollFromModal(modalEl) {
    var type = modalEl.find('input[name="composer-poll-type"]:checked').val();
    if (!type) {
      return {
        error: '[[composer-polls:errors.type-required]]'
      };
    }
    var options = [];
    var optionError = null;
    modalEl.find('.composer-polls-option').each(function (index, element) {
      if (optionError) {
        return;
      }
      var optionEl = $(element);
      var text = optionEl.find('.composer-polls-option-input').val().trim();
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
        text: text
      });
    });
    if (optionError) {
      return {
        error: optionError
      };
    }
    if (options.length < MIN_OPTIONS) {
      return {
        error: '[[composer-polls:errors.option-required, ' + MIN_OPTIONS + ']]'
      };
    }
    if (options.length > MAX_OPTIONS) {
      return {
        error: '[[composer-polls:errors.option-limit, ' + MAX_OPTIONS + ']]'
      };
    }
    var visibility = modalEl.find('.composer-polls-visibility').val() || DEFAULT_VISIBILITY;
    var closeMode = modalEl.find('input[name="composer-polls-close-mode"]:checked').val();
    var closeInput = modalEl.find('.composer-polls-close-input').val();
    var closesAt = 0;
    if (closeMode === 'date') {
      var timestamp = inputValueToTimestamp(closeInput);
      if (!timestamp || timestamp <= Date.now()) {
        return {
          error: '[[composer-polls:errors.close-date]]'
        };
      }
      closesAt = timestamp;
    }
    return {
      poll: {
        type: type,
        options: options,
        visibility: visibility,
        closesAt: closesAt,
        allowRevote: true
      }
    };
  }
  function refreshSummary(_x8, _x9, _x0) {
    return _refreshSummary.apply(this, arguments);
  }
  function _refreshSummary() {
    _refreshSummary = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(postContainer, poll, labels) {
      var summaryEl, _yield$translateMany3, _yield$translateMany4, title, editLabel, removeLabel, typeLabel, visibilityLabel, optionsLabel, closeLabel, closeNever, noteLabel, typeValue, visibilityKey, visibilityValue, closeDisplay;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            summaryEl = ensureSummary(postContainer);
            _context5.n = 1;
            return translateMany(['[[composer-polls:summary.title]]', (labels === null || labels === void 0 ? void 0 : labels.editLabel) || '[[composer-polls:summary.edit]]', (labels === null || labels === void 0 ? void 0 : labels.removeSummaryLabel) || '[[composer-polls:summary.remove]]', '[[composer-polls:type.label]]', '[[composer-polls:visibility.label]]', '[[composer-polls:options.label]]', '[[composer-polls:close.label]]', '[[composer-polls:summary.never]]', (labels === null || labels === void 0 ? void 0 : labels.allowNote) || '[[composer-polls:note]]']);
          case 1:
            _yield$translateMany3 = _context5.v;
            _yield$translateMany4 = _slicedToArray(_yield$translateMany3, 9);
            title = _yield$translateMany4[0];
            editLabel = _yield$translateMany4[1];
            removeLabel = _yield$translateMany4[2];
            typeLabel = _yield$translateMany4[3];
            visibilityLabel = _yield$translateMany4[4];
            optionsLabel = _yield$translateMany4[5];
            closeLabel = _yield$translateMany4[6];
            closeNever = _yield$translateMany4[7];
            noteLabel = _yield$translateMany4[8];
            summaryEl.find('[data-role="summary-title"]').text(title);
            summaryEl.find('[data-action="composer-poll-edit"]').text(editLabel);
            summaryEl.find('[data-action="composer-poll-remove"]').text(removeLabel);
            if (poll) {
              _context5.n = 2;
              break;
            }
            summaryEl.addClass('d-none');
            summaryEl.find('[data-role="summary-type"]').empty();
            summaryEl.find('[data-role="summary-visibility"]').empty();
            summaryEl.find('[data-role="summary-options"]').empty();
            summaryEl.find('[data-role="summary-closes"]').empty();
            summaryEl.find('[data-role="summary-note"]').text(noteLabel);
            return _context5.a(2);
          case 2:
            summaryEl.removeClass('d-none');
            _context5.n = 3;
            return translate("[[composer-polls:type.".concat(poll.type, "]]"));
          case 3:
            typeValue = _context5.v;
            visibilityKey = poll.visibility === 'public' ? '[[composer-polls:visibility.named]]' : '[[composer-polls:visibility.anonymous]]';
            _context5.n = 4;
            return translate(visibilityKey);
          case 4:
            visibilityValue = _context5.v;
            summaryEl.find('[data-role="summary-type"]').text("".concat(typeLabel, ": ").concat(typeValue));
            summaryEl.find('[data-role="summary-visibility"]').text("".concat(visibilityLabel, ": ").concat(visibilityValue));
            summaryEl.find('[data-role="summary-options"]').text("".concat(optionsLabel, ": ").concat(poll.options.length));
            if (poll.closesAt) {
              closeDisplay = new Date(poll.closesAt).toLocaleString();
              summaryEl.find('[data-role="summary-closes"]').text("".concat(closeLabel, ": ").concat(closeDisplay));
            } else {
              summaryEl.find('[data-role="summary-closes"]').text(closeNever);
            }
            summaryEl.find('[data-role="summary-note"]').text(noteLabel);
          case 5:
            return _context5.a(2);
        }
      }, _callee5);
    }));
    return _refreshSummary.apply(this, arguments);
  }
  function ensureSummary(postContainer) {
    var summary = postContainer.find('.composer-polls-summary');
    if (!summary.length) {
      summary = $('<div class="composer-polls-summary alert alert-info d-flex flex-column gap-2 mt-3" data-role="poll-summary">' + '<div class="d-flex justify-content-between align-items-center gap-3">' + '<div class="d-flex align-items-center gap-2">' + '<i class="fa fa-pie-chart"></i>' + '<span data-role="summary-title"></span>' + '</div>' + '<div class="btn-group btn-group-sm">' + '<button type="button" class="btn btn-outline-primary" data-action="composer-poll-edit"></button>' + '<button type="button" class="btn btn-outline-danger" data-action="composer-poll-remove"></button>' + '</div>' + '</div>' + '<div class="small text-body-secondary" data-role="summary-type"></div>' + '<div class="small text-body-secondary" data-role="summary-visibility"></div>' + '<div class="small text-body-secondary" data-role="summary-options"></div>' + '<div class="small text-body-secondary" data-role="summary-closes"></div>' + '<div class="small text-muted fst-italic" data-role="summary-note"></div>' + '</div>');
      var insertTarget = postContainer.find('.imagedrop');
      if (insertTarget.length) {
        insertTarget.before(summary);
      } else {
        postContainer.append(summary);
      }
    }
    return summary;
  }
  function updateBadge(postContainer, poll) {
    var badge = postContainer.find('[data-format="polls"] .badge');
    if (!badge.length) {
      return;
    }
    if (poll) {
      badge.text(poll.options.length).removeClass('hidden');
    } else {
      badge.text('').addClass('hidden');
    }
  }
  function getPlaceholders() {
    return _getPlaceholders.apply(this, arguments);
  }
  function _getPlaceholders() {
    _getPlaceholders = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.n) {
          case 0:
            return _context6.a(2, Promise.all(Array.from({
              length: MAX_OPTIONS
            }, function (_, index) {
              return translate("[[composer-polls:options.placeholder, ".concat(index + 1, "]]"));
            })));
        }
      }, _callee6);
    }));
    return _getPlaceholders.apply(this, arguments);
  }
  function translate(str) {
    return new Promise(function (resolve) {
      translator.translate(str, resolve);
    });
  }
  function translateMany(keys) {
    return Promise.all(keys.map(function (key) {
      return translate(key);
    }));
  }
});