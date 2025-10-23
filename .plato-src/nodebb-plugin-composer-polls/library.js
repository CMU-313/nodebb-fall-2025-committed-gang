'use strict';

function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var db = require.main.require('./src/database');
var utils = require.main.require('./src/utils');
var user = require.main.require('./src/user');
var privileges = require.main.require('./src/privileges');
var nconf = require.main.require('nconf');
var winston = require.main.require('winston');
var SocketPlugins = require.main.require('./src/socket.io/plugins');
var SOCKET_NAMESPACE = 'composerPolls';
var POLL_TYPES = new Set(['single', 'multi', 'ranked']);
var POLL_VISIBILITY = new Set(['anonymous', 'public']);
var POLL_MIN_OPTIONS = 2;
var POLL_MAX_OPTIONS = 10;
var OPTION_MAX_LENGTH = 120;
var plugin = {};
plugin.addPollFormattingOption = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(payload) {
    var alreadyPresent, defaultVisibility;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          if (!(!payload || !Array.isArray(payload.options))) {
            _context.n = 1;
            break;
          }
          return _context.a(2, payload);
        case 1:
          alreadyPresent = payload.options.some(function (option) {
            return option && option.name === 'polls';
          });
          if (!alreadyPresent) {
            defaultVisibility = payload.defaultVisibility || {
              mobile: true,
              desktop: true,
              main: true,
              reply: true
            };
            payload.options.push({
              name: 'polls',
              title: '[[composer-polls:add]]',
              className: 'fa fa-pie-chart',
              badge: true,
              visibility: _objectSpread(_objectSpread({}, defaultVisibility), {}, {
                reply: false
              })
            });
          }
          return _context.a(2, payload);
      }
    }, _callee);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

// 1. In plugin.handleComposerCheck (around line 75):
plugin.handleComposerCheck = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(payload) {
    var sanitized;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          if (!(!payload || !payload.data || !payload.data.poll)) {
            _context2.n = 1;
            break;
          }
          return _context2.a(2, payload);
        case 1:
          if (utils.isNumber(payload.data.uid)) {
            _context2.n = 2;
            break;
          }
          throw new Error('[[composer-polls:errors.invalid-author]]');
        case 2:
          sanitized = sanitizePollConfig(payload.data.poll, parseInt(payload.data.uid, 10));
          payload.data._poll = sanitized;
          delete payload.data.poll;
          return _context2.a(2, payload);
      }
    }, _callee2);
  }));
  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}();
plugin.handleTopicPost = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(data) {
    var sanitized;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          if (!(!data || !data.poll)) {
            _context3.n = 1;
            break;
          }
          return _context3.a(2, data);
        case 1:
          if (utils.isNumber(data.uid)) {
            _context3.n = 2;
            break;
          }
          throw new Error('[[composer-polls:errors.invalid-author]]');
        case 2:
          sanitized = sanitizePollConfig(data.poll, parseInt(data.uid, 10));
          data._poll = sanitized;
          delete data.poll;
          return _context3.a(2, data);
      }
    }, _callee3);
  }));
  return function (_x3) {
    return _ref3.apply(this, arguments);
  };
}();
plugin.onTopicPost = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(_ref4) {
    var topic, post, data, pollId, now, pollRecord, _t;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          topic = _ref4.topic, post = _ref4.post, data = _ref4.data;
          if (!(!data || !data._poll || !post || !topic)) {
            _context4.n = 1;
            break;
          }
          return _context4.a(2);
        case 1:
          pollId = String(post.pid);
          now = Date.now();
          pollRecord = {
            id: pollId,
            pid: String(post.pid),
            tid: String(topic.tid),
            uid: String(post.uid),
            type: data._poll.type,
            visibility: data._poll.visibility,
            allowRevote: data._poll.allowRevote ? 1 : 0,
            closesAt: data._poll.closesAt || 0,
            createdAt: now,
            updatedAt: now,
            options: JSON.stringify(data._poll.options),
            results: JSON.stringify(createEmptyResults(data._poll))
          };
          _context4.p = 2;
          _context4.n = 3;
          return db.setObject("poll:".concat(pollId), pollRecord);
        case 3:
          _context4.n = 4;
          return Promise.all([db.setObjectField("post:".concat(post.pid), 'pollId', pollId), db.setObjectField("topic:".concat(topic.tid), 'pollId', pollId)]);
        case 4:
          _context4.n = 9;
          break;
        case 5:
          _context4.p = 5;
          _t = _context4.v;
          winston.error("[composer-polls] Failed to save poll for post ".concat(post.pid, ": ").concat(_t.message));
          // Clean up any partial data
          _context4.n = 6;
          return db["delete"]("poll:".concat(pollId))["catch"](function () {});
        case 6:
          _context4.n = 7;
          return db.deleteObjectField("post:".concat(post.pid), 'pollId')["catch"](function () {});
        case 7:
          _context4.n = 8;
          return db.deleteObjectField("topic:".concat(topic.tid), 'pollId')["catch"](function () {});
        case 8:
          throw new Error('[[composer-polls:errors.save-failed]]');
        case 9:
          return _context4.a(2);
      }
    }, _callee4, null, [[2, 5]]);
  }));
  return function (_x4) {
    return _ref5.apply(this, arguments);
  };
}();

// Helpers for debugging composer post data

plugin.attachPollToPosts = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(hookData) {
    var posts, uid, pollIds, pollRecords, pollMap, viewerUid, viewerVotes, voterLookups, publicPolls, voterIds, users;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.n) {
        case 0:
          posts = hookData.posts, uid = hookData.uid;
          if (!(!Array.isArray(posts) || !posts.length)) {
            _context6.n = 1;
            break;
          }
          return _context6.a(2, hookData);
        case 1:
          pollIds = Array.from(new Set(posts.filter(function (post) {
            return post && post.pollId;
          }).map(function (post) {
            return String(post.pollId);
          })));
          if (pollIds.length) {
            _context6.n = 2;
            break;
          }
          return _context6.a(2, hookData);
        case 2:
          _context6.n = 3;
          return Promise.all(pollIds.map(function (id) {
            return db.getObject("poll:".concat(id));
          }));
        case 3:
          pollRecords = _context6.v;
          pollMap = new Map();
          pollRecords.forEach(function (record) {
            if (!record) {
              return;
            }
            var poll = normalisePollRecord(record);
            pollMap.set(String(poll.id), poll);
          });
          if (pollMap.size) {
            _context6.n = 4;
            break;
          }
          return _context6.a(2, hookData);
        case 4:
          viewerUid = utils.isNumber(uid) ? String(uid) : null;
          viewerVotes = new Map();
          voterLookups = new Map();
          publicPolls = Array.from(pollMap.values()).filter(function (poll) {
            return poll.visibility === 'public';
          });
          if (!publicPolls.length) {
            _context6.n = 6;
            break;
          }
          voterIds = new Set();
          publicPolls.forEach(function (poll) {
            Object.values(poll.results.options || {}).forEach(function (result) {
              if (Array.isArray(result.voters)) {
                result.voters.forEach(function (voter) {
                  if (voter) {
                    voterIds.add(String(voter));
                  }
                });
              }
            });
          });
          if (!voterIds.size) {
            _context6.n = 6;
            break;
          }
          _context6.n = 5;
          return user.getUsersFields(Array.from(voterIds), ['username', 'userslug']);
        case 5:
          users = _context6.v;
          users.forEach(function (userData, index) {
            var uidValue = Array.from(voterIds)[index];
            if (!userData) {
              return;
            }
            voterLookups.set(uidValue, {
              uid: uidValue,
              username: userData.username || uidValue,
              userslug: userData.userslug || '',
              profileUrl: userData.userslug ? "".concat(nconf.get('relative_path') || '', "/user/").concat(userData.userslug) : null
            });
          });
        case 6:
          if (!viewerUid) {
            _context6.n = 7;
            break;
          }
          _context6.n = 7;
          return Promise.all(Array.from(pollMap.keys()).map(/*#__PURE__*/function () {
            var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(pollId) {
              var vote;
              return _regenerator().w(function (_context5) {
                while (1) switch (_context5.n) {
                  case 0:
                    _context5.n = 1;
                    return getUserVote(pollId, viewerUid);
                  case 1:
                    vote = _context5.v;
                    viewerVotes.set(pollId, vote);
                  case 2:
                    return _context5.a(2);
                }
              }, _callee5);
            }));
            return function (_x6) {
              return _ref7.apply(this, arguments);
            };
          }()));
        case 7:
          posts.forEach(function (post) {
            if (!post || !post.pollId) {
              return;
            }
            var poll = pollMap.get(String(post.pollId));
            if (!poll) {
              return;
            }
            if (poll.visibility === 'public') {
              Object.values(poll.results.options || {}).forEach(function (result) {
                if (!Array.isArray(result.voters)) {
                  return;
                }
                result.voters = result.voters.map(function (voterUid) {
                  var profile = voterLookups.get(String(voterUid));
                  if (!profile) {
                    return {
                      uid: String(voterUid),
                      username: String(voterUid)
                    };
                  }
                  return profile;
                });
              });
            }
            var viewerVote = viewerUid ? viewerVotes.get(String(poll.id)) : null;
            post.poll = preparePollForView(poll, viewerUid, viewerVote);
          });
          return _context6.a(2, hookData);
      }
    }, _callee6);
  }));
  return function (_x5) {
    return _ref6.apply(this, arguments);
  };
}();
plugin.handlePostEdit = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(hookData) {
    var data, pid, context, editorUid, canEdit, pollProvided, removeRequested, ownerCandidate, ownerUid, sanitized;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.n) {
        case 0:
          data = hookData.data;
          if (!(!data || !utils.isNumber(data.pid))) {
            _context7.n = 1;
            break;
          }
          return _context7.a(2, hookData);
        case 1:
          pid = parseInt(data.pid, 10);
          _context7.n = 2;
          return getPostContext(pid);
        case 2:
          context = _context7.v;
          if (!(!context || !context.isMain)) {
            _context7.n = 3;
            break;
          }
          delete data.poll;
          delete data.pollRemoved;
          return _context7.a(2, hookData);
        case 3:
          // Check if user has permission to edit the post (respects category/topic restrictions)
          editorUid = parseInt(data.uid, 10);
          _context7.n = 4;
          return privileges.posts.canEdit(pid, editorUid);
        case 4:
          canEdit = _context7.v;
          if (canEdit.flag) {
            _context7.n = 5;
            break;
          }
          winston.warn("[composer-polls] User ".concat(editorUid, " attempted to edit poll on post ").concat(pid, " without permission"));
          throw new Error('[[error:no-privileges]]');
        case 5:
          pollProvided = Object.prototype.hasOwnProperty.call(data, 'poll');
          removeRequested = data.pollRemoved === true;
          if (!(!pollProvided && removeRequested)) {
            _context7.n = 6;
            break;
          }
          data._removePoll = true;
          delete data.pollRemoved;
          return _context7.a(2, hookData);
        case 6:
          if (pollProvided) {
            _context7.n = 7;
            break;
          }
          delete data.pollRemoved;
          return _context7.a(2, hookData);
        case 7:
          ownerCandidate = utils.isNumber(context.postUid) ? parseInt(context.postUid, 10) : parseInt(data.uid, 10);
          ownerUid = utils.isNumber(ownerCandidate) ? ownerCandidate : parseInt(data.uid, 10);
          if (utils.isNumber(ownerUid)) {
            _context7.n = 8;
            break;
          }
          throw new Error('[[composer-polls:errors.invalid-author]]');
        case 8:
          sanitized = sanitizePollConfig(data.poll, ownerUid);
          data._poll = sanitized;
          data._pollContext = context;
          delete data.poll;
          delete data.pollRemoved;
          return _context7.a(2, hookData);
      }
    }, _callee7);
  }));
  return function (_x7) {
    return _ref8.apply(this, arguments);
  };
}();
plugin.onPostEdit = /*#__PURE__*/function () {
  var _ref0 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(_ref9) {
    var post, data, pid, context, pollId, now, existingRecord, mergedResults, createdAt, pollRecord, _t2;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.n) {
        case 0:
          post = _ref9.post, data = _ref9.data;
          if (!(!post || !data || !utils.isNumber(post.pid))) {
            _context8.n = 1;
            break;
          }
          return _context8.a(2);
        case 1:
          pid = parseInt(post.pid, 10);
          _t2 = data._pollContext;
          if (_t2) {
            _context8.n = 3;
            break;
          }
          _context8.n = 2;
          return getPostContext(pid);
        case 2:
          _t2 = _context8.v;
        case 3:
          context = _t2;
          if (!(!context || !context.isMain)) {
            _context8.n = 4;
            break;
          }
          return _context8.a(2);
        case 4:
          if (!data._removePoll) {
            _context8.n = 6;
            break;
          }
          _context8.n = 5;
          return removePollRecord(String(pid), context.tid);
        case 5:
          return _context8.a(2);
        case 6:
          if (data._poll) {
            _context8.n = 7;
            break;
          }
          return _context8.a(2);
        case 7:
          pollId = String(pid);
          now = Date.now();
          _context8.n = 8;
          return db.getObject("poll:".concat(pollId));
        case 8:
          existingRecord = _context8.v;
          mergedResults = mergeResultsForEdit(data._poll, existingRecord);
          createdAt = parseInt(existingRecord === null || existingRecord === void 0 ? void 0 : existingRecord.createdAt, 10) || now;
          pollRecord = {
            id: pollId,
            pid: pollId,
            tid: String(context.tid),
            uid: String(data._poll.ownerUid),
            type: data._poll.type,
            visibility: data._poll.visibility,
            allowRevote: data._poll.allowRevote ? 1 : 0,
            closesAt: data._poll.closesAt || 0,
            createdAt: createdAt,
            updatedAt: now,
            options: JSON.stringify(data._poll.options),
            results: JSON.stringify(mergedResults)
          };
          _context8.n = 9;
          return Promise.all([db.setObject("poll:".concat(pollId), pollRecord), db.setObjectField("post:".concat(pid), 'pollId', pollId), context.tid ? db.setObjectField("topic:".concat(context.tid), 'pollId', pollId) : Promise.resolve()]);
        case 9:
          return _context8.a(2);
      }
    }, _callee8);
  }));
  return function (_x8) {
    return _ref0.apply(this, arguments);
  };
}();
plugin.onPostsPurge = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(_ref1) {
    var posts;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.n) {
        case 0:
          posts = _ref1.posts;
          if (!(!Array.isArray(posts) || !posts.length)) {
            _context0.n = 1;
            break;
          }
          return _context0.a(2);
        case 1:
          _context0.n = 2;
          return Promise.all(posts.map(/*#__PURE__*/function () {
            var _ref11 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(post) {
              var pid, pollId, tid, _t3, _t4, _t5;
              return _regenerator().w(function (_context9) {
                while (1) switch (_context9.n) {
                  case 0:
                    if (!(!post || !utils.isNumber(post.pid))) {
                      _context9.n = 1;
                      break;
                    }
                    return _context9.a(2);
                  case 1:
                    pid = parseInt(post.pid, 10);
                    _context9.n = 2;
                    return db.getObjectField("post:".concat(pid), 'pollId');
                  case 2:
                    pollId = _context9.v;
                    if (pollId) {
                      _context9.n = 3;
                      break;
                    }
                    return _context9.a(2);
                  case 3:
                    if (!utils.isNumber(post.tid)) {
                      _context9.n = 4;
                      break;
                    }
                    _t3 = parseInt(post.tid, 10);
                    _context9.n = 7;
                    break;
                  case 4:
                    _t5 = parseInt;
                    _context9.n = 5;
                    return db.getObjectField("post:".concat(pollId), 'tid');
                  case 5:
                    _t4 = _t5(_context9.v, 10);
                    if (_t4) {
                      _context9.n = 6;
                      break;
                    }
                    _t4 = null;
                  case 6:
                    _t3 = _t4;
                  case 7:
                    tid = _t3;
                    _context9.n = 8;
                    return removePollRecord(String(pollId), tid);
                  case 8:
                    return _context9.a(2);
                }
              }, _callee9);
            }));
            return function (_x0) {
              return _ref11.apply(this, arguments);
            };
          }()));
        case 2:
          return _context0.a(2);
      }
    }, _callee0);
  }));
  return function (_x9) {
    return _ref10.apply(this, arguments);
  };
}();
plugin.onTopicPurge = /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(_ref12) {
    var topic, tid, pollId;
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.n) {
        case 0:
          topic = _ref12.topic;
          if (!(!topic || !utils.isNumber(topic.tid))) {
            _context1.n = 1;
            break;
          }
          return _context1.a(2);
        case 1:
          tid = parseInt(topic.tid, 10);
          pollId = topic.pollId;
          if (pollId) {
            _context1.n = 3;
            break;
          }
          _context1.n = 2;
          return db.getObjectField("topic:".concat(tid), 'pollId');
        case 2:
          pollId = _context1.v;
        case 3:
          if (pollId) {
            _context1.n = 4;
            break;
          }
          return _context1.a(2);
        case 4:
          _context1.n = 5;
          return removePollRecord(String(pollId), tid);
        case 5:
          return _context1.a(2);
      }
    }, _callee1);
  }));
  return function (_x1) {
    return _ref13.apply(this, arguments);
  };
}();
plugin.onPostMove = /*#__PURE__*/function () {
  var _ref15 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(_ref14) {
    var post, tid, pid, newTid, pollId, pollRecord, oldTid;
    return _regenerator().w(function (_context10) {
      while (1) switch (_context10.n) {
        case 0:
          post = _ref14.post, tid = _ref14.tid;
          if (!(!post || !utils.isNumber(post.pid) || !utils.isNumber(tid))) {
            _context10.n = 1;
            break;
          }
          return _context10.a(2);
        case 1:
          pid = parseInt(post.pid, 10);
          newTid = parseInt(tid, 10); // Check if this post has a poll
          _context10.n = 2;
          return db.getObjectField("post:".concat(pid), 'pollId');
        case 2:
          pollId = _context10.v;
          if (pollId) {
            _context10.n = 3;
            break;
          }
          return _context10.a(2);
        case 3:
          _context10.n = 4;
          return db.getObject("poll:".concat(pollId));
        case 4:
          pollRecord = _context10.v;
          if (!(!pollRecord || String(pollRecord.pid) !== String(pid))) {
            _context10.n = 5;
            break;
          }
          return _context10.a(2);
        case 5:
          // Update the poll's topic reference
          oldTid = parseInt(pollRecord.tid, 10);
          _context10.n = 6;
          return Promise.all([db.setObjectField("poll:".concat(pollId), 'tid', String(newTid)), db.setObjectField("poll:".concat(pollId), 'updatedAt', Date.now()),
          // Remove pollId from old topic, add to new topic
          oldTid ? db.deleteObjectField("topic:".concat(oldTid), 'pollId') : Promise.resolve(), db.setObjectField("topic:".concat(newTid), 'pollId', pollId)]);
        case 6:
          return _context10.a(2);
      }
    }, _callee10);
  }));
  return function (_x10) {
    return _ref15.apply(this, arguments);
  };
}();
plugin.onTopicMerge = /*#__PURE__*/function () {
  var _ref17 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11(_ref16) {
    var mergeIntoTid, otherTids, mainTid, mainPollId, _iterator, _step, tid, numericTid, pollId, _t6;
    return _regenerator().w(function (_context11) {
      while (1) switch (_context11.p = _context11.n) {
        case 0:
          mergeIntoTid = _ref16.mergeIntoTid, otherTids = _ref16.otherTids;
          if (!(!utils.isNumber(mergeIntoTid) || !Array.isArray(otherTids))) {
            _context11.n = 1;
            break;
          }
          return _context11.a(2);
        case 1:
          mainTid = parseInt(mergeIntoTid, 10); // Check if the main topic already has a poll
          _context11.n = 2;
          return db.getObjectField("topic:".concat(mainTid), 'pollId');
        case 2:
          mainPollId = _context11.v;
          // Check each merged topic for polls
          _iterator = _createForOfIteratorHelper(otherTids);
          _context11.p = 3;
          _iterator.s();
        case 4:
          if ((_step = _iterator.n()).done) {
            _context11.n = 12;
            break;
          }
          tid = _step.value;
          if (utils.isNumber(tid)) {
            _context11.n = 5;
            break;
          }
          return _context11.a(3, 11);
        case 5:
          numericTid = parseInt(tid, 10);
          _context11.n = 6;
          return db.getObjectField("topic:".concat(numericTid), 'pollId');
        case 6:
          pollId = _context11.v;
          if (pollId) {
            _context11.n = 7;
            break;
          }
          return _context11.a(3, 11);
        case 7:
          if (!mainPollId) {
            _context11.n = 9;
            break;
          }
          _context11.n = 8;
          return db.setObject("poll:".concat(pollId), {
            closesAt: Date.now(),
            updatedAt: Date.now()
          });
        case 8:
          _context11.n = 10;
          break;
        case 9:
          _context11.n = 10;
          return Promise.all([db.setObjectField("poll:".concat(pollId), 'tid', String(mainTid)), db.setObjectField("poll:".concat(pollId), 'updatedAt', Date.now()), db.setObjectField("topic:".concat(mainTid), 'pollId', pollId)]);
        case 10:
          _context11.n = 11;
          return db.deleteObjectField("topic:".concat(numericTid), 'pollId');
        case 11:
          _context11.n = 4;
          break;
        case 12:
          _context11.n = 14;
          break;
        case 13:
          _context11.p = 13;
          _t6 = _context11.v;
          _iterator.e(_t6);
        case 14:
          _context11.p = 14;
          _iterator.f();
          return _context11.f(14);
        case 15:
          return _context11.a(2);
      }
    }, _callee11, null, [[3, 13, 14, 15]]);
  }));
  return function (_x11) {
    return _ref17.apply(this, arguments);
  };
}();

// Sanitization and normalization functions

function sanitizePollConfig(rawPoll, ownerUid) {
  if (!rawPoll || _typeof(rawPoll) !== 'object') {
    throw new Error('[[composer-polls:errors.invalid]]');
  }
  var type = typeof rawPoll.type === 'string' ? rawPoll.type.trim() : '';
  if (!POLL_TYPES.has(type)) {
    throw new Error('[[composer-polls:errors.type-required]]');
  }
  var rawOptions = Array.isArray(rawPoll.options) ? rawPoll.options : [];
  if (rawOptions.length < POLL_MIN_OPTIONS) {
    throw new Error('[[composer-polls:errors.option-required, ' + POLL_MIN_OPTIONS + ']]');
  }
  if (rawOptions.length > POLL_MAX_OPTIONS) {
    throw new Error('[[composer-polls:errors.option-limit, ' + POLL_MAX_OPTIONS + ']]');
  }
  var usedIds = new Set();
  var options = rawOptions.map(function (rawOption, index) {
    var option = sanitizeOption(rawOption, index);

    // Guarantee every option has a unique id even if duplicates were supplied.
    var uniqueId = option.id;
    var counter = 1;
    while (usedIds.has(uniqueId)) {
      uniqueId = "".concat(option.id, "-").concat(counter);
      counter += 1;
    }
    usedIds.add(uniqueId);
    return {
      id: uniqueId,
      text: option.text
    };
  });
  var closesAt = 0;
  if (rawPoll.closesAt) {
    var parsed = Number(rawPoll.closesAt);
    if (Number.isNaN(parsed) || parsed <= Date.now()) {
      throw new Error('[[composer-polls:errors.close-date]]');
    }
    closesAt = Math.round(parsed);
  }
  var visibility = typeof rawPoll.visibility === 'string' ? rawPoll.visibility.trim() : 'anonymous';
  if (!POLL_VISIBILITY.has(visibility)) {
    visibility = 'anonymous';
  }
  return {
    type: type,
    options: options,
    visibility: visibility,
    allowRevote: true,
    closesAt: closesAt,
    ownerUid: ownerUid
  };
}
function sanitizeOption(rawOption, index) {
  var text = typeof (rawOption === null || rawOption === void 0 ? void 0 : rawOption.text) === 'string' ? rawOption.text.trim() : '';
  if (!text) {
    throw new Error('[[composer-polls:errors.option-text]]');
  }
  if (text.length > OPTION_MAX_LENGTH) {
    throw new Error('[[composer-polls:errors.option-length, ' + OPTION_MAX_LENGTH + ']]');
  }
  var suppliedId = typeof (rawOption === null || rawOption === void 0 ? void 0 : rawOption.id) === 'string' ? rawOption.id.trim() : '';
  var baseId = suppliedId && /^[a-zA-Z0-9_-]+$/.test(suppliedId) ? suppliedId.slice(0, 24) : "opt".concat(index + 1);

  // Sanitize HTML to prevent XSS attacks
  var sanitizedText = utils.escapeHTML(text);
  return {
    id: baseId,
    text: sanitizedText
  };
}
function normalisePollRecord(record) {
  var options = [];
  try {
    options = JSON.parse(record.options || '[]');
  } catch (err) {
    options = [];
  }
  if (!Array.isArray(options)) {
    options = [];
  }
  options = options.map(function (option) {
    return {
      id: typeof (option === null || option === void 0 ? void 0 : option.id) === 'string' ? option.id : String((option === null || option === void 0 ? void 0 : option.id) || ''),
      text: typeof (option === null || option === void 0 ? void 0 : option.text) === 'string' ? option.text : ''
    };
  }).filter(function (option) {
    return option.id && option.text;
  });
  var closesAt = parseInt(record.closesAt, 10) || 0;
  var poll = {
    id: String(record.id || record.pid),
    pid: parseInt(record.pid, 10),
    tid: parseInt(record.tid, 10),
    ownerUid: parseInt(record.uid, 10),
    type: record.type,
    visibility: record.visibility,
    allowRevote: parseInt(record.allowRevote, 10) === 1,
    closesAt: closesAt > 0 ? closesAt : null,
    createdAt: parseInt(record.createdAt, 10) || null,
    updatedAt: parseInt(record.updatedAt, 10) || null,
    options: options
  };
  var rawResults = {};
  try {
    rawResults = JSON.parse(record.results || '{}');
  } catch (err) {
    rawResults = {};
  }
  poll.results = ensureResultsStructure(rawResults, poll);
  return poll;
}
function getUserVote(_x12, _x13) {
  return _getUserVote.apply(this, arguments);
}
function _getUserVote() {
  _getUserVote = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15(pollId, uid) {
    var raw;
    return _regenerator().w(function (_context15) {
      while (1) switch (_context15.n) {
        case 0:
          if (uid) {
            _context15.n = 1;
            break;
          }
          return _context15.a(2, null);
        case 1:
          _context15.n = 2;
          return db.getObjectField("pollVotes:".concat(pollId), String(uid));
        case 2:
          raw = _context15.v;
          return _context15.a(2, parseVoteRecord(raw));
      }
    }, _callee15);
  }));
  return _getUserVote.apply(this, arguments);
}
function preparePollForView(poll, viewerUid, viewerVote) {
  var resultsForViewer = prepareResultsForViewer(poll);
  var hasVoted = Boolean(viewerVote);
  var isClosed = isPollClosed(poll);
  var numericViewerUid = utils.isNumber(viewerUid) ? parseInt(viewerUid, 10) : null;
  var canManage = numericViewerUid !== null && numericViewerUid === poll.ownerUid;
  var canVote = Boolean(viewerUid) && !isClosed && (!hasVoted || poll.allowRevote);
  var canRevote = Boolean(viewerUid) && !isClosed && hasVoted && poll.allowRevote;
  return {
    id: poll.id,
    pid: poll.pid,
    tid: poll.tid,
    ownerUid: poll.ownerUid,
    type: poll.type,
    visibility: poll.visibility,
    allowRevote: poll.allowRevote,
    closesAt: poll.closesAt,
    createdAt: poll.createdAt,
    updatedAt: poll.updatedAt,
    options: poll.options,
    results: resultsForViewer,
    totalParticipants: resultsForViewer.totalParticipants,
    canManage: canManage,
    hasVoted: hasVoted,
    canVote: canVote,
    canRevote: canRevote,
    isClosed: isClosed,
    userSelections: viewerVote ? viewerVote.selections : [],
    userLastVoteAt: viewerVote ? viewerVote.castAt : null
  };
}
function prepareResultsForViewer(poll) {
  var cloned = cloneResults(poll.results);
  var results = ensureResultsStructure(cloned, poll);
  if (poll.visibility !== 'public') {
    Object.values(results.options).forEach(function (optionResult) {
      if (optionResult && _typeof(optionResult) === 'object') {
        delete optionResult.voters;
      }
    });
  }
  return results;
}
function createEmptyResults(poll) {
  return ensureResultsStructure({}, poll);
}
function ensureResultsStructure(rawResults, poll) {
  var safePoll = poll || {};
  var options = Array.isArray(safePoll.options) ? safePoll.options : [];
  var results = {
    totalParticipants: 0,
    options: {}
  };
  var total = parseInt(rawResults === null || rawResults === void 0 ? void 0 : rawResults.totalParticipants, 10);
  results.totalParticipants = Number.isFinite(total) && total > 0 ? total : 0;
  options.forEach(function (option) {
    var _rawResults$options;
    var optionId = typeof (option === null || option === void 0 ? void 0 : option.id) === 'string' ? option.id : String((option === null || option === void 0 ? void 0 : option.id) || '');
    if (!optionId) {
      return;
    }
    var optionData = (rawResults === null || rawResults === void 0 || (_rawResults$options = rawResults.options) === null || _rawResults$options === void 0 ? void 0 : _rawResults$options[optionId]) || {};
    results.options[optionId] = normaliseOptionResult(optionData, safePoll);
  });
  return results;
}
function normaliseOptionResult(optionResult, poll) {
  var normalised = {
    count: parseInt(optionResult === null || optionResult === void 0 ? void 0 : optionResult.count, 10) || 0
  };
  if (poll.type === 'ranked') {
    normalised.points = parseInt(optionResult === null || optionResult === void 0 ? void 0 : optionResult.points, 10) || 0;
  }
  if (poll.visibility === 'public') {
    var voters = Array.isArray(optionResult === null || optionResult === void 0 ? void 0 : optionResult.voters) ? optionResult.voters.map(function (val) {
      return String(val);
    }) : [];
    normalised.voters = Array.from(new Set(voters.filter(Boolean)));
  }
  return normalised;
}
function cloneResults(results) {
  try {
    return JSON.parse(JSON.stringify(results || {}));
  } catch (err) {
    return {
      totalParticipants: 0,
      options: {}
    };
  }
}
function ensureOptionResult(results, optionId, poll) {
  if (!results.options[optionId]) {
    results.options[optionId] = normaliseOptionResult({}, poll);
  }
  if (poll.visibility === 'public' && !Array.isArray(results.options[optionId].voters)) {
    results.options[optionId].voters = [];
  }
  if (poll.type === 'ranked' && typeof results.options[optionId].points !== 'number') {
    results.options[optionId].points = 0;
  }
  if (typeof results.options[optionId].count !== 'number') {
    results.options[optionId].count = 0;
  }
  return results.options[optionId];
}
function addVoteToResults(results, poll, selections, voterUid, incrementParticipants) {
  if (incrementParticipants) {
    results.totalParticipants = (results.totalParticipants || 0) + 1;
  }
  if (poll.type === 'ranked') {
    var length = selections.length;
    selections.forEach(function (optionId, index) {
      var entry = ensureOptionResult(results, optionId, poll);
      var score = length - index;
      entry.points = (entry.points || 0) + score;
      if (poll.visibility === 'public' && Array.isArray(entry.voters) && !entry.voters.includes(voterUid)) {
        entry.voters.push(voterUid);
      }
    });
    return;
  }
  selections.forEach(function (optionId) {
    var entry = ensureOptionResult(results, optionId, poll);
    entry.count = (entry.count || 0) + 1;
    if (poll.visibility === 'public' && Array.isArray(entry.voters) && !entry.voters.includes(voterUid)) {
      entry.voters.push(voterUid);
    }
  });
}
function removeVoteFromResults(results, poll, selections, voterUid, decrementParticipants) {
  if (decrementParticipants) {
    results.totalParticipants = Math.max(0, (results.totalParticipants || 0) - 1);
  }
  if (poll.type === 'ranked') {
    var length = selections.length;
    selections.forEach(function (optionId, index) {
      var entry = ensureOptionResult(results, optionId, poll);
      var score = length - index;
      entry.points = Math.max(0, (entry.points || 0) - score);
      if (poll.visibility === 'public' && Array.isArray(entry.voters)) {
        entry.voters = entry.voters.filter(function (voter) {
          return voter !== voterUid;
        });
      }
    });
    return;
  }
  selections.forEach(function (optionId) {
    var entry = ensureOptionResult(results, optionId, poll);
    entry.count = Math.max(0, (entry.count || 0) - 1);
    if (poll.visibility === 'public' && Array.isArray(entry.voters)) {
      entry.voters = entry.voters.filter(function (voter) {
        return voter !== voterUid;
      });
    }
  });
}
function normaliseSelections(poll, rawSelections) {
  var options = Array.isArray(poll.options) ? poll.options : [];
  var optionSet = new Set(options.map(function (option) {
    return option.id;
  }));
  if (!optionSet.size) {
    throw new Error('[[composer-polls:errors.option-required, ' + POLL_MIN_OPTIONS + ']]');
  }
  if (poll.type === 'single') {
    var choice = Array.isArray(rawSelections) ? rawSelections[0] : rawSelections;
    var value = typeof choice === 'string' ? choice.trim() : '';
    if (!value) {
      throw new Error('[[composer-polls:errors.vote-required]]');
    }
    if (!optionSet.has(value)) {
      throw new Error('[[composer-polls:errors.option-invalid]]');
    }
    return [value];
  }
  if (poll.type === 'multi') {
    var selectionArray = Array.isArray(rawSelections) ? rawSelections : [rawSelections];
    var seen = new Set();
    var cleaned = [];
    selectionArray.forEach(function (value) {
      if (typeof value !== 'string') {
        return;
      }
      var trimmed = value.trim();
      if (!trimmed || seen.has(trimmed)) {
        return;
      }
      if (!optionSet.has(trimmed)) {
        throw new Error('[[composer-polls:errors.option-invalid]]');
      }
      seen.add(trimmed);
      cleaned.push(trimmed);
    });
    if (!cleaned.length) {
      throw new Error('[[composer-polls:errors.vote-required]]');
    }
    return cleaned;
  }
  if (poll.type === 'ranked') {
    if (!Array.isArray(rawSelections)) {
      throw new Error('[[composer-polls:errors.vote-ranked-min]]');
    }
    var _seen = new Set();
    var _cleaned = [];
    rawSelections.forEach(function (value) {
      if (typeof value !== 'string') {
        return;
      }
      var trimmed = value.trim();
      if (!trimmed || _seen.has(trimmed)) {
        return;
      }
      if (!optionSet.has(trimmed)) {
        throw new Error('[[composer-polls:errors.option-invalid]]');
      }
      _seen.add(trimmed);
      _cleaned.push(trimmed);
    });
    if (_cleaned.length < 2) {
      throw new Error('[[composer-polls:errors.vote-ranked-min]]');
    }
    return _cleaned;
  }
  throw new Error('[[composer-polls:errors.invalid]]');
}
function parseVoteRecord(raw) {
  if (!raw) {
    return null;
  }
  try {
    var parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!Array.isArray(parsed === null || parsed === void 0 ? void 0 : parsed.selections)) {
      return null;
    }
    return {
      selections: parsed.selections.map(function (value) {
        return String(value);
      }).filter(Boolean),
      castAt: parseInt(parsed.castAt, 10) || 0
    };
  } catch (err) {
    return null;
  }
}
function isPollClosed(poll) {
  if (!poll || !poll.closesAt) {
    return false;
  }
  return poll.closesAt <= Date.now();
}
function castVote(_x14, _x15, _x16) {
  return _castVote.apply(this, arguments);
}
function _castVote() {
  _castVote = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16(pollId, voterUid, rawSelections) {
    var pollRecord, poll, selections, voteKey, voterKey, existingRaw, existingVote, timeSinceLastVote, minVoteInterval, waitTime, results, now, voteRecord;
    return _regenerator().w(function (_context16) {
      while (1) switch (_context16.n) {
        case 0:
          _context16.n = 1;
          return db.getObject("poll:".concat(pollId));
        case 1:
          pollRecord = _context16.v;
          if (pollRecord) {
            _context16.n = 2;
            break;
          }
          winston.warn("[composer-polls] Vote attempt on non-existent poll: ".concat(pollId, " by user: ").concat(voterUid));
          throw new Error('[[composer-polls:errors.not-found]]');
        case 2:
          poll = normalisePollRecord(pollRecord);
          if (!isPollClosed(poll)) {
            _context16.n = 3;
            break;
          }
          winston.info("[composer-polls] Vote attempt on closed poll: ".concat(pollId, " by user: ").concat(voterUid));
          throw new Error('[[composer-polls:errors.closed]]');
        case 3:
          selections = normaliseSelections(poll, rawSelections);
          voteKey = "pollVotes:".concat(pollId);
          voterKey = String(voterUid);
          _context16.n = 4;
          return db.getObjectField(voteKey, voterKey);
        case 4:
          existingRaw = _context16.v;
          existingVote = parseVoteRecord(existingRaw);
          if (!(existingVote && !poll.allowRevote)) {
            _context16.n = 5;
            break;
          }
          throw new Error('[[composer-polls:errors.revoting-disabled]]');
        case 5:
          if (!(existingVote && poll.allowRevote)) {
            _context16.n = 6;
            break;
          }
          timeSinceLastVote = Date.now() - existingVote.castAt;
          minVoteInterval = 5000; // 5 seconds minimum between votes
          if (!(timeSinceLastVote < minVoteInterval)) {
            _context16.n = 6;
            break;
          }
          waitTime = Math.ceil((minVoteInterval - timeSinceLastVote) / 1000);
          throw new Error("[[composer-polls:errors.vote-too-soon, ".concat(waitTime, "]]"));
        case 6:
          results = cloneResults(poll.results);
          results = ensureResultsStructure(results, poll);
          if (existingVote) {
            removeVoteFromResults(results, poll, existingVote.selections, voterKey, false);
          }
          addVoteToResults(results, poll, selections, voterKey, !existingVote);
          now = Date.now();
          voteRecord = {
            selections: selections,
            castAt: now
          };
          _context16.n = 7;
          return Promise.all([db.setObjectField(voteKey, voterKey, JSON.stringify(voteRecord)), db.setObject("poll:".concat(pollId), {
            results: JSON.stringify(results),
            updatedAt: now
          })]);
        case 7:
          poll.results = ensureResultsStructure(results, poll);
          poll.updatedAt = now;
          return _context16.a(2, preparePollForView(poll, voterKey, voteRecord));
      }
    }, _callee16);
  }));
  return _castVote.apply(this, arguments);
}
function getPostContext(_x17) {
  return _getPostContext.apply(this, arguments);
}
function _getPostContext() {
  _getPostContext = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17(pid) {
    var postKey, _yield$Promise$all, _yield$Promise$all2, postRecord, tidValue, tid, topicRecord, mainPid;
    return _regenerator().w(function (_context17) {
      while (1) switch (_context17.n) {
        case 0:
          postKey = "post:".concat(pid);
          _context17.n = 1;
          return Promise.all([db.getObject(postKey), db.getObjectField(postKey, 'tid')]);
        case 1:
          _yield$Promise$all = _context17.v;
          _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 2);
          postRecord = _yield$Promise$all2[0];
          tidValue = _yield$Promise$all2[1];
          tid = utils.isNumber(tidValue) ? parseInt(tidValue, 10) : null;
          if (!(!postRecord || !utils.isNumber(pid) || !utils.isNumber(tid))) {
            _context17.n = 2;
            break;
          }
          return _context17.a(2, null);
        case 2:
          _context17.n = 3;
          return db.getObject("topic:".concat(tid));
        case 3:
          topicRecord = _context17.v;
          mainPid = utils.isNumber(topicRecord === null || topicRecord === void 0 ? void 0 : topicRecord.mainPid) ? parseInt(topicRecord.mainPid, 10) : null;
          return _context17.a(2, {
            pid: pid,
            tid: tid,
            postUid: postRecord.uid,
            isMain: utils.isNumber(mainPid) && mainPid === pid,
            pollId: postRecord.pollId ? String(postRecord.pollId) : null
          });
      }
    }, _callee17);
  }));
  return _getPostContext.apply(this, arguments);
}
function mergeResultsForEdit(newPoll, existingRecord) {
  if (!existingRecord) {
    return createEmptyResults(newPoll);
  }
  try {
    var existingPoll = normalisePollRecord(existingRecord);
    var typeChanged = existingPoll.type !== newPoll.type;
    var visibilityChanged = existingPoll.visibility !== newPoll.visibility;
    if (typeChanged || visibilityChanged) {
      return createEmptyResults(newPoll);
    }
    var merged = createEmptyResults(newPoll);
    merged.totalParticipants = existingPoll.results.totalParticipants || 0;
    newPoll.options.forEach(function (option) {
      var existing = existingPoll.results.options[option.id];
      if (existing) {
        merged.options[option.id] = {
          count: existing.count || 0
        };
        if (newPoll.type === 'ranked') {
          merged.options[option.id].points = existing.points || 0;
        }
        if (newPoll.visibility === 'public') {
          merged.options[option.id].voters = Array.isArray(existing.voters) ? existing.voters.slice() : [];
        }
      }
    });
    return ensureResultsStructure(merged, newPoll);
  } catch (err) {
    return createEmptyResults(newPoll);
  }
}
function removePollRecord(_x18, _x19) {
  return _removePollRecord.apply(this, arguments);
}
function _removePollRecord() {
  _removePollRecord = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18(pollId, tid) {
    var key;
    return _regenerator().w(function (_context18) {
      while (1) switch (_context18.n) {
        case 0:
          if (pollId) {
            _context18.n = 1;
            break;
          }
          return _context18.a(2);
        case 1:
          key = String(pollId);
          _context18.n = 2;
          return Promise.all([db["delete"]("poll:".concat(key)), db["delete"]("pollVotes:".concat(key)), db.deleteObjectField("post:".concat(key), 'pollId'), tid ? db.deleteObjectField("topic:".concat(tid), 'pollId') : Promise.resolve()]);
        case 2:
          return _context18.a(2);
      }
    }, _callee18);
  }));
  return _removePollRecord.apply(this, arguments);
}
function handleGetPoll(_x20, _x21) {
  return _handleGetPoll.apply(this, arguments);
}
function _handleGetPoll() {
  _handleGetPoll = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee19(socket, payload) {
    var pid, permission, context, pollKey, pollRecord, poll;
    return _regenerator().w(function (_context19) {
      while (1) switch (_context19.n) {
        case 0:
          if (!(!socket || !utils.isNumber(socket.uid))) {
            _context19.n = 1;
            break;
          }
          throw new Error('[[composer-polls:errors.login-required]]');
        case 1:
          pid = utils.isNumber(payload === null || payload === void 0 ? void 0 : payload.pid) ? parseInt(payload.pid, 10) : null;
          if (pid) {
            _context19.n = 2;
            break;
          }
          throw new Error('[[composer-polls:errors.invalid]]');
        case 2:
          _context19.n = 3;
          return privileges.posts.canEdit(pid, socket.uid);
        case 3:
          permission = _context19.v;
          if (!(!permission || permission.flag !== true)) {
            _context19.n = 4;
            break;
          }
          throw new Error((permission === null || permission === void 0 ? void 0 : permission.message) || '[[error:no-privileges]]');
        case 4:
          _context19.n = 5;
          return getPostContext(pid);
        case 5:
          context = _context19.v;
          if (!(!context || !context.isMain)) {
            _context19.n = 6;
            break;
          }
          return _context19.a(2, null);
        case 6:
          pollKey = context.pollId ? "poll:".concat(context.pollId) : "poll:".concat(pid);
          _context19.n = 7;
          return db.getObject(pollKey);
        case 7:
          pollRecord = _context19.v;
          if (pollRecord) {
            _context19.n = 8;
            break;
          }
          return _context19.a(2, null);
        case 8:
          poll = normalisePollRecord(pollRecord);
          return _context19.a(2, {
            poll: {
              type: poll.type,
              visibility: poll.visibility,
              allowRevote: poll.allowRevote,
              closesAt: poll.closesAt || 0,
              options: poll.options.map(function (option) {
                return {
                  id: option.id,
                  text: option.text
                };
              })
            }
          });
      }
    }, _callee19);
  }));
  return _handleGetPoll.apply(this, arguments);
}
function handleManagePoll(_x22, _x23) {
  return _handleManagePoll.apply(this, arguments);
}
function _handleManagePoll() {
  _handleManagePoll = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee20(socket, payload) {
    var pollId, pollRecord, pid, permission, action, now, updates, updatedRecord, poll, voterVote;
    return _regenerator().w(function (_context20) {
      while (1) switch (_context20.n) {
        case 0:
          if (!(!socket || !utils.isNumber(socket.uid))) {
            _context20.n = 1;
            break;
          }
          throw new Error('[[composer-polls:errors.login-required]]');
        case 1:
          pollId = typeof (payload === null || payload === void 0 ? void 0 : payload.pollId) === 'string' || typeof (payload === null || payload === void 0 ? void 0 : payload.pollId) === 'number' ? String(payload.pollId).trim() : '';
          if (pollId) {
            _context20.n = 2;
            break;
          }
          throw new Error('[[composer-polls:errors.invalid]]');
        case 2:
          _context20.n = 3;
          return db.getObject("poll:".concat(pollId));
        case 3:
          pollRecord = _context20.v;
          if (pollRecord) {
            _context20.n = 4;
            break;
          }
          throw new Error('[[composer-polls:errors.not-found]]');
        case 4:
          pid = parseInt(pollRecord.pid, 10);
          _context20.n = 5;
          return privileges.posts.canEdit(pid, socket.uid);
        case 5:
          permission = _context20.v;
          if (!(!permission || permission.flag !== true)) {
            _context20.n = 6;
            break;
          }
          throw new Error((permission === null || permission === void 0 ? void 0 : permission.message) || '[[error:no-privileges]]');
        case 6:
          action = typeof (payload === null || payload === void 0 ? void 0 : payload.action) === 'string' ? payload.action.trim().toLowerCase() : '';
          if (['close', 'reopen'].includes(action)) {
            _context20.n = 7;
            break;
          }
          throw new Error('[[composer-polls:errors.invalid]]');
        case 7:
          now = Date.now();
          updates = {
            updatedAt: now
          };
          if (action === 'close') {
            updates.closesAt = now;
          } else if (action === 'reopen') {
            updates.closesAt = 0;
          }
          _context20.n = 8;
          return db.setObject("poll:".concat(pollId), updates);
        case 8:
          _context20.n = 9;
          return db.getObject("poll:".concat(pollId));
        case 9:
          updatedRecord = _context20.v;
          poll = normalisePollRecord(updatedRecord);
          _context20.n = 10;
          return getUserVote(pollId, String(socket.uid));
        case 10:
          voterVote = _context20.v;
          return _context20.a(2, preparePollForView(poll, String(socket.uid), voterVote));
      }
    }, _callee20);
  }));
  return _handleManagePoll.apply(this, arguments);
}
function registerSocketHandlers() {
  if (!SocketPlugins[SOCKET_NAMESPACE]) {
    SocketPlugins[SOCKET_NAMESPACE] = {};
  }
  if (!SocketPlugins[SOCKET_NAMESPACE].vote) {
    SocketPlugins[SOCKET_NAMESPACE].vote = /*#__PURE__*/function () {
      var _ref18 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(socket) {
        var payload,
          callback,
          response,
          _args12 = arguments,
          _t7;
        return _regenerator().w(function (_context12) {
          while (1) switch (_context12.p = _context12.n) {
            case 0:
              payload = _args12.length > 1 && _args12[1] !== undefined ? _args12[1] : {};
              callback = _args12.length > 2 ? _args12[2] : undefined;
              _context12.p = 1;
              _context12.n = 2;
              return handleVote(socket, payload);
            case 2:
              response = _context12.v;
              if (typeof callback === 'function') {
                callback(null, response);
              }
              return _context12.a(2, response);
            case 3:
              _context12.p = 3;
              _t7 = _context12.v;
              winston.error("[composer-polls] Vote error - User: ".concat(socket.uid, ", Poll: ").concat(payload === null || payload === void 0 ? void 0 : payload.pollId, ", Error: ").concat(_t7.message));
              if (typeof callback === 'function') {
                callback(_t7);
              }
              throw _t7;
            case 4:
              return _context12.a(2);
          }
        }, _callee12, null, [[1, 3]]);
      }));
      return function (_x24) {
        return _ref18.apply(this, arguments);
      };
    }();
  }
  if (!SocketPlugins[SOCKET_NAMESPACE].get) {
    SocketPlugins[SOCKET_NAMESPACE].get = /*#__PURE__*/function () {
      var _ref19 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13(socket) {
        var payload,
          callback,
          response,
          _args13 = arguments,
          _t8;
        return _regenerator().w(function (_context13) {
          while (1) switch (_context13.p = _context13.n) {
            case 0:
              payload = _args13.length > 1 && _args13[1] !== undefined ? _args13[1] : {};
              callback = _args13.length > 2 ? _args13[2] : undefined;
              _context13.p = 1;
              _context13.n = 2;
              return handleGetPoll(socket, payload);
            case 2:
              response = _context13.v;
              if (typeof callback === 'function') {
                callback(null, response);
              }
              return _context13.a(2, response);
            case 3:
              _context13.p = 3;
              _t8 = _context13.v;
              winston.error("[composer-polls] Get poll error - User: ".concat(socket.uid, ", Poll: ").concat(payload === null || payload === void 0 ? void 0 : payload.pollId, ", Error: ").concat(_t8.message));
              if (typeof callback === 'function') {
                callback(_t8);
              }
              throw _t8;
            case 4:
              return _context13.a(2);
          }
        }, _callee13, null, [[1, 3]]);
      }));
      return function (_x25) {
        return _ref19.apply(this, arguments);
      };
    }();
  }
  if (!SocketPlugins[SOCKET_NAMESPACE].manage) {
    SocketPlugins[SOCKET_NAMESPACE].manage = /*#__PURE__*/function () {
      var _ref20 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14(socket) {
        var payload,
          callback,
          response,
          _args14 = arguments,
          _t9;
        return _regenerator().w(function (_context14) {
          while (1) switch (_context14.p = _context14.n) {
            case 0:
              payload = _args14.length > 1 && _args14[1] !== undefined ? _args14[1] : {};
              callback = _args14.length > 2 ? _args14[2] : undefined;
              _context14.p = 1;
              _context14.n = 2;
              return handleManagePoll(socket, payload);
            case 2:
              response = _context14.v;
              if (typeof callback === 'function') {
                callback(null, response);
              }
              return _context14.a(2, response);
            case 3:
              _context14.p = 3;
              _t9 = _context14.v;
              winston.error("[composer-polls] Manage poll error - User: ".concat(socket.uid, ", Poll: ").concat(payload === null || payload === void 0 ? void 0 : payload.pollId, ", Action: ").concat(payload === null || payload === void 0 ? void 0 : payload.action, ", Error: ").concat(_t9.message));
              if (typeof callback === 'function') {
                callback(_t9);
              }
              throw _t9;
            case 4:
              return _context14.a(2);
          }
        }, _callee14, null, [[1, 3]]);
      }));
      return function (_x26) {
        return _ref20.apply(this, arguments);
      };
    }();
  }
}
function handleVote(_x27, _x28) {
  return _handleVote.apply(this, arguments);
}
function _handleVote() {
  _handleVote = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee21(socket, payload) {
    var pollId;
    return _regenerator().w(function (_context21) {
      while (1) switch (_context21.n) {
        case 0:
          if (!(!socket || !utils.isNumber(socket.uid))) {
            _context21.n = 1;
            break;
          }
          throw new Error('[[composer-polls:errors.login-required]]');
        case 1:
          pollId = typeof (payload === null || payload === void 0 ? void 0 : payload.pollId) === 'string' || typeof (payload === null || payload === void 0 ? void 0 : payload.pollId) === 'number' ? String(payload.pollId).trim() : '';
          if (pollId) {
            _context21.n = 2;
            break;
          }
          throw new Error('[[composer-polls:errors.invalid]]');
        case 2:
          return _context21.a(2, castVote(pollId, String(socket.uid), payload === null || payload === void 0 ? void 0 : payload.selections));
      }
    }, _callee21);
  }));
  return _handleVote.apply(this, arguments);
}
registerSocketHandlers();
module.exports = plugin;