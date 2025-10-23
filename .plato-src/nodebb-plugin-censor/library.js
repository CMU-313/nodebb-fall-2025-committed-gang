'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var fs = require('fs');
var path = require('path');
var Topics = require.main.require('./src/topics');

//access nodeBB core modules
var meta = require.main.require("./src/meta");
var settings = require.main.require("./src/meta/settings");
var plugins = require.main.require("./src/plugins");
var settingsRoute = "/admin/plugins/censor/settings";
var PLUGIN_HASH = "nodebb-plugin-censor";
var CSV_PATH = path.join(__dirname, "profanity.csv");
var BACKUP_PATH = path.join(__dirname, "profanity.csv.bak");
var bannedWords = [];
var RX = null;
var replacement = '****';
var escapeRegExp = function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
var censorStats = {
  totalCensored: 0,
  lastCensoredAt: null,
  postsCensored: 0
};
var buildRegex = function buildRegex(words) {
  var list;
  if (!words) {
    list = [];
  } else if (Array.isArray(words)) {
    list = words;
  } else if (typeof words === 'string') {
    list = words.split(/[,\r?\n]+/);
  } else {
    // As a last resort, coerce object values to strings
    list = Object.values(words || {}).map(String);
  }
  var parts = list.map(function (w) {
    return String(w).trim();
  }).filter(Boolean).map(escapeRegExp).sort(function (a, b) {
    return b.length - a.length;
  });
  if (!parts.length) return null;
  return new RegExp("\\b(?:".concat(parts.join('|'), ")\\b"), 'gi');
};
var readCsvFile = function readCsvFile(csvPath) {
  try {
    var csv = fs.readFileSync(csvPath, "utf8");
    return csv.split(/\r?\n/).map(function (l) {
      return l.trim();
    }).filter(Boolean);
  } catch (e) {
    return [];
  }
};
var writeCsvFile = function writeCsvFile(csvPath, lines) {
  var data = lines.join("\n") + "\n";
  fs.writeFileSync(csvPath, data, "utf8");
};
function loadFromSettingsOrCsv() {
  return _loadFromSettingsOrCsv.apply(this, arguments);
}
function _loadFromSettingsOrCsv() {
  _loadFromSettingsOrCsv = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
    var values, raw, parts, _t5;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.p = _context0.n) {
        case 0:
          _context0.p = 0;
          _context0.n = 1;
          return settings.get(PLUGIN_HASH);
        case 1:
          values = _context0.v;
          if (!(values && values.bannedWords)) {
            _context0.n = 2;
            break;
          }
          raw = String(values.bannedWords || "");
          parts = raw.split(/[,\r?\n]+/).map(function (s) {
            return s.trim();
          }).filter(Boolean);
          bannedWords = parts;
          RX = buildRegex(bannedWords);
          console.log('[censor] loaded from settings:', bannedWords.length, 'words');
          return _context0.a(2, {
            from: 'settings',
            words: bannedWords
          });
        case 2:
          _context0.n = 4;
          break;
        case 3:
          _context0.p = 3;
          _t5 = _context0.v;
        case 4:
          bannedWords = readCsvFile(CSV_PATH);
          RX = buildRegex(bannedWords);
          console.log('[censor] loaded from CSV:', CSV_PATH, 'words:', bannedWords.length, 'rx?', !!RX);
          return _context0.a(2, {
            from: 'csv',
            words: bannedWords
          });
      }
    }, _callee0, null, [[0, 3]]);
  }));
  return _loadFromSettingsOrCsv.apply(this, arguments);
}
;
function persistSettingsToCsvIfRequested(_x) {
  return _persistSettingsToCsvIfRequested.apply(this, arguments);
}
function _persistSettingsToCsvIfRequested() {
  _persistSettingsToCsvIfRequested = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(values) {
    var lines, _t6;
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.p = _context1.n) {
        case 0:
          _context1.p = 0;
          if (values) {
            _context1.n = 1;
            break;
          }
          return _context1.a(2, false);
        case 1:
          if (!(values.persistCsv === 'on' && values.bannedWords)) {
            _context1.n = 2;
            break;
          }
          lines = String(values.bannedWords).split(/[,\r?\n]+/).map(function (s) {
            return s.trim();
          }).filter(Boolean); //backup existing csv if present
          try {
            if (fs.existsSync(CSV_PATH)) {
              fs.copyFileSync(CSV_PATH, BACKUP_PATH);
            }
          } catch (e) {
            // ignore
          }
          writeCsvFile(CSV_PATH, lines);
          bannedWords = lines;
          RX = buildRegex(bannedWords);
          return _context1.a(2, true);
        case 2:
          _context1.n = 4;
          break;
        case 3:
          _context1.p = 3;
          _t6 = _context1.v;
        case 4:
          return _context1.a(2, false);
      }
    }, _callee1, null, [[0, 3]]);
  }));
  return _persistSettingsToCsvIfRequested.apply(this, arguments);
}
function maskSkippingCode(text) {
  if (!text || !RX) return text;
  var codeRx = /(```[\s\S]*?```|`[^`]*`)/g;
  var out = [];
  var last = 0;
  var m;
  var hasCensored = false;
  var censorCount = 0;
  while ((m = codeRx.exec(text)) !== null) {
    var cleaned = text.slice(last, m.index).replace(RX, function (match) {
      censorCount++;
      hasCensored = true;
      return replacement;
    });
    out.push(cleaned);
    out.push(m[0]);
    last = codeRx.lastIndex;
  }
  out.push(text.slice(last).replace(RX, function (match) {
    censorCount++;
    hasCensored = true;
    return replacement;
  }));
  if (hasCensored) {
    censorStats.totalCensored += censorCount;
    censorStats.lastCensoredAt = new Date().toISOString();
    censorStats.postsCensored++;
  }
  return out.join('');
}

//initialize the csv file on load
loadFromSettingsOrCsv()["catch"](function (e) {
  console.error('[nodebb-plugin-censor] Failed to register ACP routes:', e);
});
var Plugin = {};

// Controller to render the admin settings template
function renderAdminPage(_x2, _x3) {
  return _renderAdminPage.apply(this, arguments);
} // Register admin route when plugin initializes
function _renderAdminPage() {
  _renderAdminPage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(req, res) {
    var stats, bannedWordsText, _t7;
    return _regenerator().w(function (_context10) {
      while (1) switch (_context10.p = _context10.n) {
        case 0:
          _context10.p = 0;
          console.log('[nodebb-plugin-censor] renderAdminPage called for', req.path, 'uid:', req.uid);
          // ensure stats and banned words are available to the template
          stats = {
            totalCensored: censorStats.totalCensored || 0,
            postsCensored: censorStats.postsCensored || 0,
            lastCensoredAt: censorStats.lastCensoredAt || ''
          };
          bannedWordsText = Array.isArray(bannedWords) ? bannedWords.join('\n') : String(bannedWords || '');
          res.render('admin/plugins/censor/settings', {
            title: 'Censor Settings',
            stats: stats,
            bannedWords: bannedWordsText,
            bannedWordsCount: (bannedWords || []).length || 0,
            config: {
              csrf_token: req.csrfToken && req.csrfToken()
            }
          });
          _context10.n = 2;
          break;
        case 1:
          _context10.p = 1;
          _t7 = _context10.v;
          console.error('[nodebb-plugin-censor] renderAdminPage error', _t7);
          return _context10.a(2, res.status(500).send('Server error'));
        case 2:
          return _context10.a(2);
      }
    }, _callee10, null, [[0, 1]]);
  }));
  return _renderAdminPage.apply(this, arguments);
}
Plugin.init = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(params) {
    var router, routeHelpers, jsonRoute, adminBaseRoute, routeHelpersApi, saveSettings, getSettings, debugRoute;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          console.log('[nodebb-plugin-censor] Plugin.init called');
          router = params.router;
          routeHelpers = require.main.require('./src/routes/helpers'); // Register page and API endpoint (GET for page, GET /api for ajax)
          // Register both the admin routes referenced by plugin.json and the
          // internal /admin/... path so links from the admin UI resolve.
          jsonRoute = '/plugins/censor';
          adminBaseRoute = '/admin/plugins/censor';
          routeHelpers.setupAdminPageRoute(router, jsonRoute, [], renderAdminPage);
          routeHelpers.setupAdminPageRoute(router, adminBaseRoute, [], renderAdminPage);
          routeHelpers.setupAdminPageRoute(router, settingsRoute, [], renderAdminPage);

          // Add a POST API endpoint for saving settings used by the admin JS
          routeHelpersApi = routeHelpers; // same helpers file contains setupApiRoute
          saveSettings = /*#__PURE__*/function () {
            var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
              var values, toSave, _t;
              return _regenerator().w(function (_context) {
                while (1) switch (_context.p = _context.n) {
                  case 0:
                    _context.p = 0;
                    values = req.body || {};
                    console.log('[nodebb-plugin-censor] saveSettings called, keys:', Object.keys(values));
                    // Don't persist CSRF token or any internal fields into plugin settings
                    toSave = _objectSpread({}, values);
                    delete toSave._csrf;
                    delete toSave.csrf_token;
                    // save to NodeBB settings
                    _context.n = 1;
                    return settings.set(PLUGIN_HASH, toSave);
                  case 1:
                    _context.n = 2;
                    return persistSettingsToCsvIfRequested(values);
                  case 2:
                    _context.n = 3;
                    return loadFromSettingsOrCsv();
                  case 3:
                    res.json({
                      success: true
                    });
                    _context.n = 5;
                    break;
                  case 4:
                    _context.p = 4;
                    _t = _context.v;
                    console.error('[nodebb-plugin-censor] saveSettings error', _t);
                    res.json({
                      success: false,
                      error: _t.message
                    });
                  case 5:
                    return _context.a(2);
                }
              }, _callee, null, [[0, 4]]);
            }));
            return function saveSettings(_x5, _x6) {
              return _ref2.apply(this, arguments);
            };
          }(); // Register both non-/api and /api POST endpoints so client-side (which posts to /api/...) reaches this handler
          routeHelpersApi.setupApiRoute(router, 'post', '/admin/plugins/censor/settings', [], saveSettings);
          routeHelpersApi.setupApiRoute(router, 'post', '/api/admin/plugins/censor/settings', [], saveSettings);

          // Admin-only GET endpoint for inspecting current saved settings (debug/verification)
          getSettings = /*#__PURE__*/function () {
            var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
              var current, _t2;
              return _regenerator().w(function (_context2) {
                while (1) switch (_context2.p = _context2.n) {
                  case 0:
                    _context2.p = 0;
                    _context2.n = 1;
                    return settings.get(PLUGIN_HASH);
                  case 1:
                    current = _context2.v;
                    res.json({
                      success: true,
                      settings: current
                    });
                    _context2.n = 3;
                    break;
                  case 2:
                    _context2.p = 2;
                    _t2 = _context2.v;
                    res.json({
                      success: false,
                      error: _t2.message
                    });
                  case 3:
                    return _context2.a(2);
                }
              }, _callee2, null, [[0, 2]]);
            }));
            return function getSettings(_x7, _x8) {
              return _ref3.apply(this, arguments);
            };
          }();
          routeHelpersApi.setupApiRoute(router, 'get', '/api/admin/plugins/censor/settings', [], getSettings);
          // Temporary debug route to inspect uid and privilege resolution
          debugRoute = /*#__PURE__*/function () {
            var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
              var _req$uid, uid, _path, privilege, can, _t3;
              return _regenerator().w(function (_context3) {
                while (1) switch (_context3.p = _context3.n) {
                  case 0:
                    _context3.p = 0;
                    uid = (_req$uid = req.uid) !== null && _req$uid !== void 0 ? _req$uid : -1;
                    _path = req.path.replace(/^(\/api)?(\/v3)?\/admin\/?/, '');
                    privilege = require.main.require('./src/privileges/admin').resolve(_path);
                    _context3.n = 1;
                    return require.main.require('./src/privileges/admin').can(privilege, uid);
                  case 1:
                    can = _context3.v;
                    res.json({
                      uid: uid,
                      path: _path,
                      privilege: privilege,
                      allowed: !!can
                    });
                    _context3.n = 3;
                    break;
                  case 2:
                    _context3.p = 2;
                    _t3 = _context3.v;
                    res.json({
                      error: _t3.message
                    });
                  case 3:
                    return _context3.a(2);
                }
              }, _callee3, null, [[0, 2]]);
            }));
            return function debugRoute(_x9, _x0) {
              return _ref4.apply(this, arguments);
            };
          }();
          routeHelpersApi.setupApiRoute(router, 'get', '/admin/plugins/censor/debug', [], debugRoute);
          // Register the public whoami debug route as well
          try {
            if (typeof Plugin._registerPublicDebug === 'function') {
              Plugin._registerPublicDebug({
                router: router
              });
            }
          } catch (e) {
            console.error('[nodebb-plugin-censor] error registering public debug route', e);
          }
        case 1:
          return _context4.a(2);
      }
    }, _callee4);
  }));
  return function (_x4) {
    return _ref.apply(this, arguments);
  };
}();

// Public debugging endpoint (non-admin) to show whether the browser session
// is recognized. Visit in the browser and paste the JSON response here.
Plugin._registerPublicDebug = function (params) {
  try {
    var router = params.router;
    var routeHelpers = require.main.require('./src/routes/helpers');
    var whoami = /*#__PURE__*/function () {
      var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(req, res) {
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              res.json({
                uid: req.uid || -1,
                loggedIn: !!req.loggedIn,
                sessionMeta: req.session && req.session.meta
              });
            case 1:
              return _context5.a(2);
          }
        }, _callee5);
      }));
      return function whoami(_x1, _x10) {
        return _ref5.apply(this, arguments);
      };
    }();
    // use setupPageRoute so middleware sets req.uid but does not force login
    routeHelpers.setupPageRoute(router, '/plugin-censor/whoami', [], whoami);
  } catch (e) {
    console.error('[nodebb-plugin-censor] failed to register public whoami route', e);
  }
};

// Add the plugin entry into the admin navigation (left-hand menu)
Plugin.addAdminNavigation = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(header) {
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.n) {
        case 0:
          header.plugins = header.plugins || [];
          header.plugins.push({
            route: '/plugins/censor',
            icon: 'fa-ban',
            name: 'Censor'
          });
          return _context6.a(2, header);
      }
    }, _callee6);
  }));
  return function (_x11) {
    return _ref6.apply(this, arguments);
  };
}();
Plugin.censorPost = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(data) {
    var uid, before, matchesBefore, after, matchesAfter;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.n) {
        case 0:
          try {
            if (data && data.content) {
              data.content = maskSkippingCode(data.content);
            }
            if (data && data.title) {
              data.title = maskSkippingCode(data.title);
            }
            if (data && data.topic && data.topic.title) {
              data.topic.title = maskSkippingCode(data.topic.title);
            }
          } catch (err) {
            console.error('[nodebb-plugin-censor] censorPost error', err);
          }
          uid = data && data.uid || -1;
          if (data && data.content) {
            before = String(data.content).slice(0, 200);
            matchesBefore = RX ? (String(data.content).match(RX) || []).length : 0;
            console.log('[nodebb-plugin-censor] censorPost uid:', uid, 'rx?', !!RX, 'matchesBefore:', matchesBefore, 'preview:', before);
            data.content = maskSkippingCode(data.content);
            after = String(data.content).slice(0, 200);
            matchesAfter = RX ? (String(after).match(RX) || []).length : 0;
            console.log('[nodebb-plugin-censor] censorPost uid:', uid, 'matchesAfter:', matchesAfter, 'previewAfter:', after);
          }
          if (data && data.title) {
            data.title = maskSkippingCode(data.title);
          }
          if (data && data.topic && data.topic.title) {
            data.topic.title = maskSkippingCode(data.topic.title);
          }
          return _context7.a(2, data);
      }
    }, _callee7);
  }));
  return function (_x12) {
    return _ref7.apply(this, arguments);
  };
}();
Plugin.censorParsed = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(payload) {
    var _payload$postData2;
    var _payload$postData, before, matchesBefore, after;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.n) {
        case 0:
          try {
            if (payload !== null && payload !== void 0 && (_payload$postData = payload.postData) !== null && _payload$postData !== void 0 && _payload$postData.content) {
              payload.postData.content = maskSkippingCode(payload.postData.content);
            }
          } catch (err) {
            console.error('[nodebb-plugin-censor] censorParsed error', err);
          }
          if (payload !== null && payload !== void 0 && (_payload$postData2 = payload.postData) !== null && _payload$postData2 !== void 0 && _payload$postData2.content) {
            before = String(payload.postData.content).slice(0, 200);
            matchesBefore = RX ? (String(payload.postData.content).match(RX) || []).length : 0;
            console.log('[nodebb-plugin-censor] censorParsed rx?', !!RX, 'matchesBefore:', matchesBefore, 'preview:', before);
            payload.postData.content = maskSkippingCode(payload.postData.content);
            after = String(payload.postData.content).slice(0, 200);
            console.log('[nodebb-plugin-censor] censorParsed matchesAfter:', RX ? (String(after).match(RX) || []).length : 0, 'previewAfter:', after);
          }
          return _context8.a(2, payload);
      }
    }, _callee8);
  }));
  return function (_x13) {
    return _ref8.apply(this, arguments);
  };
}();
Plugin.parseRaw = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(raw) {
    var _t4;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.p = _context9.n) {
        case 0:
          _context9.p = 0;
          console.log('[nodebb-plugin-censor] parseRaw called; RX?', !!RX);
          if (!(typeof raw === 'string' && RX)) {
            _context9.n = 1;
            break;
          }
          return _context9.a(2, maskSkippingCode(raw));
        case 1:
          _context9.n = 3;
          break;
        case 2:
          _context9.p = 2;
          _t4 = _context9.v;
          console.error('[nodebb-plugin-censor] parseRaw error', _t4);
        case 3:
          return _context9.a(2, raw);
      }
    }, _callee9, null, [[0, 2]]);
  }));
  return function (_x14) {
    return _ref9.apply(this, arguments);
  };
}();
module.exports = Plugin;