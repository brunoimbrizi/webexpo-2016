// import AppUI from './AppUI';

export default class AppView {

	constructor() {
		this.initReveal();
		this.initSketch();
	}

	initSketch() {
		this.sketch = Sketch.create({
			type: Sketch.CANVAS,
			container: document.getElementById('container'),
			autopause: false,
			retina: (window.devicePixelRatio >= 2),
			fullscreen: true
		});

		this.sketch.setup = () => {
			// this.initUI();
		};

		this.sketch.update = () => {
			// this.three.update();
		};

		this.sketch.draw = () => {
			// this.three.draw();
		};

		this.sketch.resize = () => {
			this.hw = this.sketch.width / 2;
			this.hh = this.sketch.height / 2;

			// this.three.resize();
		};

		this.sketch.touchstart = (e) => {
			const touch = this.sketch.touches[0];
		};

		this.sketch.touchmove = () => {
		};

		this.sketch.touchend = () => {
		};
	}

	// initUI() {
		// this.ui = new AppUI(this);
	// }

	initReveal() {
		Reveal.initialize({
			controls: true,
			progress: true,
			history: true,
			center: true,
			transition: 'slide', // none/fade/slide/convex/concave/zoom
			// More info https://github.com/hakimel/reveal.js#dependencies
			dependencies: [
				// { src: 'lib/js/classList.js', condition: function() { return !document.body.classList; } },
				// { src: 'plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
				// { src: 'plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
				// { src: 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
				// { src: 'plugin/zoom-js/zoom.js', async: true },
				// { src: 'plugin/notes/notes.js', async: true }
			]
		});
	}
}
