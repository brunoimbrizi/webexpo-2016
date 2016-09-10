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


var _ExampleRibbon = require('./examples/ExampleRibbon');

var _ExampleRibbon2 = _interopRequireDefault(_ExampleRibbon);

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
				_this.initExample();
			};

			this.sketch.update = function () {
				_this.example.update();
			};

			this.sketch.draw = function () {
				_this.example.draw();
			};

			this.sketch.resize = function () {
				_this.hw = _this.sketch.width / 2;
				_this.hh = _this.sketch.height / 2;
			};

			this.sketch.touchstart = function (e) {
				var touch = _this.sketch.touches[0];
			};

			this.sketch.touchmove = function () {};

			this.sketch.touchend = function () {};

			this.sketch.keyup = function (e) {
				if (e.keyCode === 67) _this.sketch.clear(); // C
			};
		}

		// initUI() {
		// this.ui = new AppUI(this);
		// }

	}, {
		key: 'initExample',
		value: function initExample() {
			this.example = new _ExampleRibbon2.default(this.sketch);
		}
	}, {
		key: 'initReveal',
		value: function initReveal() {
			var _this2 = this;

			Reveal.initialize({
				controls: false,
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
				{ src: 'scripts/reveal/plugin/highlight/highlight.js', async: true, callback: function callback() {
						hljs.initHighlightingOnLoad();
					} },
				// { src: 'reveal/plugin/zoom-js/zoom.js', async: true },
				{ src: 'scripts/reveal/plugin/notes/notes.js', async: true }]
			});

			Reveal.addEventListener('slidechanged', function (e) {
				// console.log('Reveal.slidechanged', e);
				var dataExample = e.currentSlide.attributes['data-example'];
				var state = dataExample ? parseInt(dataExample.value) : -1;

				_this2.example.setState(state);
			});
		}
	}]);

	return AppView;
}();

exports.default = AppView;

},{"./examples/ExampleRibbon":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ExampleRibbon = function () {
	function ExampleRibbon(ctx) {
		_classCallCheck(this, ExampleRibbon);

		this.ctx = ctx;

		this.rect = { x: 0.5, y: 0, w: 0.5, h: 1 };
		this.colorA = '#ffaa00';
		this.colorB = 'rgba(255, 170, 0, 0.1)';

		this.numPoints = 30;
		this.distance = 50;
		this.distanceSq = this.distance * this.distance;
		this.damp = 0.9;
		this.radius = 5;

		this.initPoints();
	}

	_createClass(ExampleRibbon, [{
		key: 'update',
		value: function update() {
			switch (this.state) {
				case 5:
					this.followMouse(true, true);
					break;
				case 6:
					this.followMouse(true, true);
					this.updateDry(0, 2);
					break;
				case 7:
					this.followMouse(true);
					this.updateDry(1, this.points.length);
					break;
				case 8:
				case 9:
				case 10:
				case 11:
					this.followMouse(true);
					this.updateElastic();
					break;
				default:
					this.followMouse(false);
					break;
			}
		}
	}, {
		key: 'draw',
		value: function draw() {
			this.ctx.save();
			this.ctx.fillStyle = this.color;

			this.moveToRect(true);

			switch (this.state) {
				case 0:
				case 1:
					this.drawPoints(true);
					break;
				case 2:
					this.drawPoints();
					break;
				case 3:
				case 4:
				case 5:
				case 6:
				case 7:
				case 8:
					this.drawPoints();
					this.drawLines();
					break;
				case 9:
				case 10:
				case 11:
					this.drawPoints();
					this.drawCurves();
					break;
				default:
					break;
			}

			this.ctx.restore();
		}
	}, {
		key: 'initPoints',
		value: function initPoints() {
			this.points = [];

			for (var i = 0; i < this.numPoints; i++) {
				var p = { x: 0, y: 0, vx: 0, vy: 0, angle: 0, radius: 5, index: i };
				this.points.push(p);
			}
		}
	}, {
		key: 'moveToRect',
		value: function moveToRect(center) {
			// move to rect
			this.ctx.translate(this.rect.x * this.ctx.width, this.rect.y * this.ctx.height);
			// center in the rect
			if (center) this.ctx.translate(this.rect.w * this.ctx.width * 0.5, this.rect.h * this.ctx.height * 0.5);
		}
	}, {
		key: 'drawPoints',
		value: function drawPoints(rect) {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var p = _step.value;

					this.ctx.beginPath();
					if (rect) this.ctx.rect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);else this.ctx.arc(p.x, p.y, this.radius, 0, TWO_PI);
					this.ctx.closePath();
					this.ctx.fill();
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
	}, {
		key: 'drawLines',
		value: function drawLines() {
			this.ctx.beginPath();
			this.ctx.moveTo(this.points[0].x, this.points[0].y);

			for (var i = 0; i <= this.points.length; i++) {
				var pp = i === 0 ? this.points[0] : this.points[i - 1];
				this.ctx.lineTo(pp.x, pp.y);
			}

			this.ctx.strokeStyle = this.color;
			this.ctx.stroke();
		}
	}, {
		key: 'drawCurves',
		value: function drawCurves() {
			this.ctx.beginPath();
			this.ctx.moveTo(this.points[0].x, this.points[0].y);

			for (var i = 0; i < this.points.length; i++) {
				var p = this.points[i];
				var pp = i === 0 ? p : this.points[i - 1];
				var offset = 10;

				var cp1 = { x: pp.x + cos(pp.angle + HALF_PI) * offset, y: pp.y + sin(pp.angle + HALF_PI) * offset };
				var cp2 = { x: p.x - cos(p.angle + HALF_PI) * offset, y: p.y - sin(p.angle + HALF_PI) * offset };

				this.ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, p.x, p.y);
			}

			this.ctx.strokeStyle = this.color;
			this.ctx.stroke();
		}
	}, {
		key: 'followMouse',
		value: function followMouse(follow, useRect) {
			document.querySelector('.reveal').style.pointerEvents = follow ? 'none' : '';
			if (!follow) return;

			if (useRect && this.ctx.mouse.x < this.rect.x * this.ctx.width) return;

			this.points[0].x = this.ctx.mouse.x - this.rect.x * this.ctx.width - this.rect.w * this.ctx.width * 0.5;
			this.points[0].y = this.ctx.mouse.y - this.rect.y * this.ctx.height - this.rect.h * this.ctx.height * 0.5;
		}
	}, {
		key: 'updateDry',
		value: function updateDry(start, end) {
			for (var i = start; i < end; i++) {
				var p = this.points[i];
				var pp = i === 0 ? p : this.points[i - 1];

				var dx = p.x - pp.x;
				var dy = p.y - pp.y;
				var dd = dx * dx + dy * dy;

				if (dd > this.distanceSq) {
					var a = atan2(dy, dx);

					p.x = pp.x + this.distance * cos(a);
					p.y = pp.y + this.distance * sin(a);
				}
			}
		}
	}, {
		key: 'updateElastic',
		value: function updateElastic() {
			for (var i = this.points.length - 1; i > 0; i--) {
				var p = this.points[i];
				var pp = i === 0 ? p : this.points[i - 1];

				p.vx *= this.damp;
				p.vy *= this.damp;

				p.x += p.vx;
				p.y += p.vy;

				var ox = p.x;
				var oy = p.y;

				var dx = p.x - pp.x;
				var dy = p.y - pp.y;
				var dd = dx * dx + dy * dy;

				if (dd > this.distanceSq) {
					var a = atan2(dy, dx);

					p.x = pp.x + this.distance * cos(a);
					p.y = pp.y + this.distance * sin(a);

					p.vx += (p.x - ox) * 0.1;
					p.vy += (p.y - oy) * 0.1;
				}
			}
		}
	}, {
		key: 'setState',
		value: function setState(state) {
			this.state = state;

			this.ctx.autoclear = true;
			this.colorFill = this.color = this.colorA;
			this.radius = 5;

			var time = 1;
			var ease = Quart.easeInOut;
			var delay = 0;

			switch (state) {
				case 0:
					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {
						for (var _iterator2 = this.points[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var p = _step2.value;

							TweenMax.to(p, time, { x: 0, y: 0, ease: ease });
						}
					} catch (err) {
						_didIteratorError2 = true;
						_iteratorError2 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion2 && _iterator2.return) {
								_iterator2.return();
							}
						} finally {
							if (_didIteratorError2) {
								throw _iteratorError2;
							}
						}
					}

					break;
				case 1:
				case 2:
				case 3:
					var _iteratorNormalCompletion3 = true;
					var _didIteratorError3 = false;
					var _iteratorError3 = undefined;

					try {
						for (var _iterator3 = this.points[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
							var _p = _step3.value;

							delay = (this.numPoints - _p.index) * 0.05;
							ease = Back.easeOut;
							TweenMax.to(_p, time, { x: 0, y: _p.index * this.distance, ease: ease, delay: delay });
						}
					} catch (err) {
						_didIteratorError3 = true;
						_iteratorError3 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion3 && _iterator3.return) {
								_iterator3.return();
							}
						} finally {
							if (_didIteratorError3) {
								throw _iteratorError3;
							}
						}
					}

					break;
				case 4:
					var _iteratorNormalCompletion4 = true;
					var _didIteratorError4 = false;
					var _iteratorError4 = undefined;

					try {
						for (var _iterator4 = this.points[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
							var _p2 = _step4.value;

							delay = _p2.index * 0.02;
							TweenMax.to(_p2, time, { x: random(-25, 25), y: _p2.index * this.distance, ease: ease, delay: delay });
						}
					} catch (err) {
						_didIteratorError4 = true;
						_iteratorError4 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion4 && _iterator4.return) {
								_iterator4.return();
							}
						} finally {
							if (_didIteratorError4) {
								throw _iteratorError4;
							}
						}
					}

					break;
				case 11:
					this.ctx.clear();
					this.ctx.globalCompositeOperation = 'lighter';
					this.color = this.colorB;
					this.radius = 2;
				case 10:
					this.ctx.clear();
					this.ctx.autoclear = false;
					break;
			}
		}
	}]);

	return ExampleRibbon;
}();

exports.default = ExampleRibbon;

},{}]},{},[2]);
