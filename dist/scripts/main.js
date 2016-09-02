(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AppView = require('./view/AppView');

var _AppView2 = _interopRequireDefault(_AppView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
  function App(el) {
    _classCallCheck(this, App);

    this.el = el;
    this.listeners = {};

    this.initView();
  }

  _createClass(App, [{
    key: 'initView',
    value: function initView() {
      this.view = new _AppView2.default();
    }
  }, {
    key: 'on',
    value: function on(type, cb) {
      this.listeners[type] = this.listeners[type] || [];
      if (this.listeners[type].indexOf(cb) === -1) {
        this.listeners[type].push(cb);
      }
    }
  }, {
    key: 'off',
    value: function off(type, cb) {
      if (this.listeners[type]) {
        if (cb) {
          var index = this.listeners[type].indexOf(cb);
          if (index !== -1) {
            this.listeners[type].splice(index, 1);
          }
        } else this.listeners[type] = [];
      }
    }
  }, {
    key: 'trigger',
    value: function trigger(type, args) {
      if (this.listeners[type]) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.listeners[type][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var cb = _step.value;

            cb(args);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }
  }]);

  return App;
}();

exports.default = App;

},{"./view/AppView":3}],2:[function(require,module,exports){
'use strict';

var _App = require('./App');

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(function () {
  var app = new _App2.default();
  window.app = app;
});

},{"./App":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // import AppUI from './AppUI';


var _Ribbon = require('./ribbon/Ribbon');

var _Ribbon2 = _interopRequireDefault(_Ribbon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppView = function () {
	function AppView() {
		_classCallCheck(this, AppView);

		this.initReveal();
		this.initSketch();
	}

	_createClass(AppView, [{
		key: 'initSketch',
		value: function initSketch() {
			var _this = this;

			this.sketch = Sketch.create({
				type: Sketch.CANVAS,
				container: document.getElementById('container'),
				autopause: false,
				retina: window.devicePixelRatio >= 2,
				fullscreen: true
			});

			this.sketch.setup = function () {
				// this.initUI();
				_this.initRibbon();
			};

			this.sketch.update = function () {
				_this.ribbon.update();
			};

			this.sketch.draw = function () {
				_this.ribbon.draw();
			};

			this.sketch.resize = function () {
				_this.hw = _this.sketch.width / 2;
				_this.hh = _this.sketch.height / 2;

				// this.three.resize();
			};

			this.sketch.touchstart = function (e) {
				var touch = _this.sketch.touches[0];
			};

			this.sketch.touchmove = function () {};

			this.sketch.touchend = function () {};
		}

		// initUI() {
		// this.ui = new AppUI(this);
		// }

	}, {
		key: 'initRibbon',
		value: function initRibbon() {
			this.ribbon = new _Ribbon2.default(this.sketch);
		}
	}, {
		key: 'initReveal',
		value: function initReveal() {
			Reveal.initialize({
				controls: true,
				progress: true,
				// history: true,
				// center: true,
				transition: 'slide', // none/fade/slide/convex/concave/zoom
				// transitionSpeed: 'fast',
				backgroundTransition: 'slide',
				width: '1280',
				height: '100%',
				dependencies: [{ src: 'scripts/reveal/lib/js/classList.js', condition: function condition() {
						return !document.body.classList;
					} },
				// { src: 'reveal/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
				// { src: 'reveal/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
				// { src: 'reveal/plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
				// { src: 'reveal/plugin/zoom-js/zoom.js', async: true },
				{ src: 'scripts/reveal/plugin/notes/notes.js', async: true }]
			});
		}
	}]);

	return AppView;
}();

exports.default = AppView;

},{"./ribbon/Ribbon":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ribbon = function () {
	function Ribbon(ctx) {
		_classCallCheck(this, Ribbon);

		this.ctx = ctx;

		this.colorA = '#ffaa00';
	}

	_createClass(Ribbon, [{
		key: 'update',
		value: function update() {}
	}, {
		key: 'draw',
		value: function draw() {
			this.ctx.fillStyle = this.colorA;
			this.ctx.fillRect(0, 0, 10, 10);
		}
	}]);

	return Ribbon;
}();

exports.default = Ribbon;

},{}]},{},[2]);
