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
			// history: true,
			// center: true,
			transition: 'slide', // none/fade/slide/convex/concave/zoom
			// transitionSpeed: 'fast',
			backgroundTransition: 'slide',
			width: '1280',
			height: '100%',
			dependencies: [
				{ src: 'scripts/reveal/lib/js/classList.js', condition: function() { return !document.body.classList; } },
				// { src: 'reveal/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
				// { src: 'reveal/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
				// { src: 'reveal/plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
				// { src: 'reveal/plugin/zoom-js/zoom.js', async: true },
				{ src: 'scripts/reveal/plugin/notes/notes.js', async: true }
			]
		});
	}
}
