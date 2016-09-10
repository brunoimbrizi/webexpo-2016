(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AppAudio = require('./audio/AppAudio');

var _AppAudio2 = _interopRequireDefault(_AppAudio);

var _AppView = require('./view/AppView');

var _AppView2 = _interopRequireDefault(_AppView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
	function App(el) {
		_classCallCheck(this, App);

		this.el = el;
		this.listeners = {};

		this.initAudio();
		this.initView();
	}

	_createClass(App, [{
		key: 'initAudio',
		value: function initAudio() {
			this.audio = new _AppAudio2.default(this);
		}
	}, {
		key: 'initView',
		value: function initView() {
			this.view = new _AppView2.default(this);
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

},{"./audio/AppAudio":2,"./view/AppView":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AppAudio = function () {
	_createClass(AppAudio, [{
		key: 'FFT_SIZE',
		get: function get() {
			return 512;
		}
	}, {
		key: 'BINS',
		get: function get() {
			return 128;
		}
	}], [{
		key: 'AUDIO_LOAD',
		get: function get() {
			return 'audio-load';
		}
	}, {
		key: 'AUDIO_DECODE',
		get: function get() {
			return 'audio-decode';
		}
	}, {
		key: 'AUDIO_PLAY',
		get: function get() {
			return 'audio-play';
		}
	}, {
		key: 'AUDIO_PAUSE',
		get: function get() {
			return 'audio-pause';
		}
	}, {
		key: 'AUDIO_END',
		get: function get() {
			return 'audio-end';
		}
	}, {
		key: 'AUDIO_RESTART',
		get: function get() {
			return 'audio-restart';
		}
	}]);

	function AppAudio(app) {
		_classCallCheck(this, AppAudio);

		this.app = app;
		this.paused = true;
		this.pausedAt = 0;

		this.initContext();
		this.initGain();
		this.initAnalyser();

		this.load('sounds/201151_SOUNDDOGS__tu.mp3');
	}

	_createClass(AppAudio, [{
		key: 'initContext',
		value: function initContext() {
			if (window.AudioContext === void 0) window.AudioContext = window.webkitAudioContext;
			this.ctx = new AudioContext();
		}
	}, {
		key: 'initGain',
		value: function initGain() {
			this.gainNode = this.ctx.createGain();
			this.gainNode.gain.value = 1.0;
			this.gainNode.connect(this.ctx.destination);
		}
	}, {
		key: 'initAnalyser',
		value: function initAnalyser() {
			this.values = [];
			this.selectedIndices = [20, 30, 40, 50, 60, 70, 75, 80, 85, 90];
			this.selectedValues = [];
			this.oldValues = [];

			this.threshold = 1.0;
			this.kickThreshold = 0.1;

			this.analyserNode = this.ctx.createAnalyser();
			this.analyserNode.smoothingTimeConstant = 0.9;
			this.analyserNode.fftSize = this.FFT_SIZE;
			this.analyserNode.connect(this.gainNode);
			// this.analyserNode.connect(this.ctx.destination); // comment out to start mute
		}

		// ---------------------------------------------------------------------------------------------
		// PUBLIC
		// ---------------------------------------------------------------------------------------------

	}, {
		key: 'load',
		value: function load(url) {
			var request = new XMLHttpRequest();
			request.open('GET', url, true);
			request.responseType = 'arraybuffer';
			request.onprogress = this.onRequestProgress.bind(this);
			request.onload = this.onRequestLoad.bind(this);
			request.send();
		}
	}, {
		key: 'play',
		value: function play(loop) {
			// if (this.ended) window.dispatchEvent(new Event(this.EVENT_AUDIO_RESTARTED));

			this.sourceNode = this.ctx.createBufferSource();
			this.sourceNode.onended = this.onSourceEnded.bind(this);
			this.sourceNode.connect(this.analyserNode);
			this.sourceNode.buffer = this.buffer;
			this.ended = false;
			this.paused = false;
			this.loop = loop;

			this.startedAt = Date.now() - this.pausedAt;
			this.sourceNode.start(0, this.pausedAt / 1000);

			this.app.trigger(AppAudio.AUDIO_PLAY, { currentTime: this.pausedAt });
		}
	}, {
		key: 'pause',
		value: function pause() {
			this.sourceNode.stop(0);
			this.pausedAt = Date.now() - this.startedAt;
			this.paused = true;

			this.app.trigger(AppAudio.AUDIO_PAUSE, { currentTime: this.pausedAt });
		}
	}, {
		key: 'seek',
		value: function seek(time) {
			if (time == undefined) return;
			if (time > this.buffer.duration) return;

			this.ended = false;

			if (!this.paused) {
				this.sourceNode.onended = null;
				this.sourceNode.stop(0);
			}
			this.pausedAt = time * 1000;
			if (!this.paused) this.play();
		}
	}, {
		key: 'update',
		value: function update() {
			var freqData = new Uint8Array(this.analyserNode.frequencyBinCount);
			this.analyserNode.getByteFrequencyData(freqData);
			var length = freqData.length;

			this.oldValues = this.values.concat();

			var bin = Math.ceil(length / this.BINS);
			for (var i = 0; i < this.BINS; i++) {
				var sum = 0;
				for (var j = 0; j < bin; j++) {
					sum += freqData[i * bin + j];
				}

				// Calculate the average frequency of the samples in the bin
				var average = sum / bin;

				// Divide by number of bins to normalize
				// this.values[i] = (average / this.BINS) / this.playbackRate;
				this.values[i] = average / this.BINS;
			}

			for (var _i = 0; _i < this.selectedIndices.length; _i++) {
				var index = this.selectedIndices[_i];
				this.selectedValues[_i] = this.values[index];
			}

			// set current time
			if (this.loaded && !this.ended) {
				this.currentTime = this.paused ? this.pausedAt : Date.now() - this.startedAt;
				// this.currentTime *= this.playbackRate;
			}
		}

		// ---------------------------------------------------------------------------------------------
		// EVENT HANDLERS
		// ---------------------------------------------------------------------------------------------

	}, {
		key: 'onRequestProgress',
		value: function onRequestProgress(e) {
			// console.log('AppAudio.onRequestProgress', e)
		}
	}, {
		key: 'onRequestLoad',
		value: function onRequestLoad(e) {
			// console.log('AppAudio.onRequestLoad', e);

			this.ctx.decodeAudioData(e.target.response, this.onBufferLoaded.bind(this), this.onBufferError.bind(this));

			this.app.trigger(AppAudio.AUDIO_LOAD);
		}
	}, {
		key: 'onBufferLoaded',
		value: function onBufferLoaded(buffer) {
			this.buffer = buffer;

			this.loaded = true;
			this.duration = this.buffer.duration * 1000;
			// this.play();

			this.app.trigger(AppAudio.AUDIO_DECODE);
		}
	}, {
		key: 'onBufferError',
		value: function onBufferError(e) {
			// console.log('AppAudio.onBufferError', e)
		}
	}, {
		key: 'onSourceEnded',
		value: function onSourceEnded(e) {
			// console.log('AppAudio.onSourceEnded', this.paused)
			if (this.paused) return;
			this.currentTime = this.duration;
			this.ended = true;
			this.paused = true;
			this.pausedAt = 0;

			if (this.loop) this.play(this.loop);

			// window.dispatchEvent(new Event(this.EVENT_AUDIO_ENDED));
		}
	}]);

	return AppAudio;
}();

exports.default = AppAudio;

},{}],3:[function(require,module,exports){
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

},{"./App":1}],4:[function(require,module,exports){
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
	function AppView(app) {
		_classCallCheck(this, AppView);

		this.audio = app.audio;

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
				_this.audio.update();
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
			this.example = new _ExampleRibbon2.default(this.sketch, this.audio);
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

},{"./examples/ExampleRibbon":5}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ExampleRibbon = function () {
	function ExampleRibbon(ctx, audio) {
		_classCallCheck(this, ExampleRibbon);

		this.ctx = ctx;
		this.audio = audio;

		this.rect = { x: 0.5, y: 0, w: 0.5, h: 1 };
		this.colorA = '#ffaa00';
		this.colorB = 'rgba(255, 170, 0, 0.1)';
		this.colorC = 'rgba(255, 190, 0, 0.4)';

		this.numPoints = 30;
		this.distance = 50;
		this.distanceSq = this.distance * this.distance;
		this.damp = 0.9;

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
				case 12:
					this.updateAudio();
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
				case 12:
					this.drawPoints(false, true);
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
		value: function drawPoints(rect, outline) {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var p = _step.value;

					// fill
					this.ctx.beginPath();
					if (rect) this.ctx.rect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);else this.ctx.arc(p.x, p.y, p.radius, 0, TWO_PI);
					this.ctx.closePath();
					this.ctx.fill();

					// stroke
					if (!outline) continue;
					this.ctx.strokeStyle = this.colorA;
					this.ctx.beginPath();
					this.ctx.arc(p.x, p.y, p.radius * p.radius, 0, TWO_PI);
					this.ctx.closePath();
					this.ctx.stroke();
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
				var np = i === this.points.length - 1 ? p : this.points[i + 1];
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
			if (!this.ctx.mouse.x && !this.ctx.mouse.y) return;

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
		key: 'updateAudio',
		value: function updateAudio() {
			for (var i = 0; i < this.points.length; i++) {
				var p = this.points[i];
				p.radius = this.audio.values[i + 2] * 15;

				if (!(i % 4)) p.radius = this.audio.values[3] * this.audio.values[3] * 18;
				if (!(i % 5)) p.radius = this.audio.values[10] * 15;
			}
		}
	}, {
		key: 'setState',
		value: function setState(state) {
			this.state = state;

			this.ctx.autoclear = true;
			this.colorFill = this.color = this.colorA;
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = this.points[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var _p4 = _step2.value;
					_p4.radius = 5;
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

			this.ctx.globalCompositeOperation = 'source-over';

			if (!this.audio.paused) this.audio.pause();

			var time = 1;
			var ease = Quart.easeInOut;
			var delay = 0;

			switch (state) {
				case 0:
					var _iteratorNormalCompletion3 = true;
					var _didIteratorError3 = false;
					var _iteratorError3 = undefined;

					try {
						for (var _iterator3 = this.points[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
							var p = _step3.value;

							TweenMax.to(p, time, { x: 0, y: 0, ease: ease });
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
				case 1:
				case 2:
				case 3:
					var _iteratorNormalCompletion4 = true;
					var _didIteratorError4 = false;
					var _iteratorError4 = undefined;

					try {
						for (var _iterator4 = this.points[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
							var _p = _step4.value;

							delay = (this.numPoints - _p.index) * 0.05;
							ease = Back.easeOut;
							TweenMax.to(_p, time, { x: 0, y: _p.index * this.distance, ease: ease, delay: delay });
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
				case 4:
					var _iteratorNormalCompletion5 = true;
					var _didIteratorError5 = false;
					var _iteratorError5 = undefined;

					try {
						for (var _iterator5 = this.points[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
							var _p2 = _step5.value;

							delay = _p2.index * 0.02;
							TweenMax.to(_p2, time, { x: random(-50, 50), y: _p2.index * this.distance, ease: ease, delay: delay });
						}
					} catch (err) {
						_didIteratorError5 = true;
						_iteratorError5 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion5 && _iterator5.return) {
								_iterator5.return();
							}
						} finally {
							if (_didIteratorError5) {
								throw _iteratorError5;
							}
						}
					}

					break;
				case 11:
					this.ctx.clear();
					this.ctx.globalCompositeOperation = 'lighter';
					this.color = this.colorB;
					var _iteratorNormalCompletion6 = true;
					var _didIteratorError6 = false;
					var _iteratorError6 = undefined;

					try {
						for (var _iterator6 = this.points[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
							var _p3 = _step6.value;
							_p3.radius = 2;
						}
					} catch (err) {
						_didIteratorError6 = true;
						_iteratorError6 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion6 && _iterator6.return) {
								_iterator6.return();
							}
						} finally {
							if (_didIteratorError6) {
								throw _iteratorError6;
							}
						}
					}

				case 10:
					this.ctx.clear();
					this.ctx.autoclear = false;
					break;
				case 12:
					this.audio.play(true);
					break;
			}
		}
	}]);

	return ExampleRibbon;
}();

exports.default = ExampleRibbon;

},{}]},{},[3]);
