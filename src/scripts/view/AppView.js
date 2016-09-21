// import AppUI from './AppUI';
import ExampleRibbon from './examples/ExampleRibbon';

export default class AppView {

	constructor(app) {
		this.audio = app.audio;
		
		this.initReveal();
		this.initSketch();
		this.initArrows();
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
			this.initExample();
		};

		this.sketch.update = () => {
			this.audio.update();
			this.example.update();
		};

		this.sketch.draw = () => {
			this.example.draw();
		};

		this.sketch.resize = () => {
			this.hw = this.sketch.width / 2;
			this.hh = this.sketch.height / 2;
		};

		this.sketch.touchstart = (e) => {
			const touch = this.sketch.touches[0];
		};

		this.sketch.touchmove = () => {
		};

		this.sketch.touchend = () => {
		};

		this.sketch.keyup = (e) => {
			if (e.keyCode === 67) this.sketch.clear(); // C
		};
	}

	// initUI() {
		// this.ui = new AppUI(this);
	// }

	initExample() {
		this.example = new ExampleRibbon(this.sketch, this.audio);
	}

	initReveal() {
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
			dependencies: [
				{ src: 'scripts/reveal/lib/js/classList.js', condition: function() { return !document.body.classList; } },
				// { src: 'reveal/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
				// { src: 'reveal/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
				{ src: 'scripts/reveal/plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
				// { src: 'reveal/plugin/zoom-js/zoom.js', async: true },
				{ src: 'scripts/reveal/plugin/notes/notes.js', async: true }
			]
		});

		Reveal.addEventListener('slidechanged', (e) => {
			// console.log('Reveal.slidechanged', e);
			const dataExample = e.currentSlide.attributes['data-example'];
			const state = (dataExample) ? parseInt(dataExample.value) : -1;
			
			this.example.setState(state);
		});
	}

	initArrows() {
		const prev = document.querySelector('.touch-arrows .prev');
		const next = document.querySelector('.touch-arrows .next');

		prev.addEventListener('touchstart', (e) => {
			Reveal.prev();
			e.preventDefault();
			return false;
		});

		next.addEventListener('touchstart', (e) => {
			Reveal.next();
			e.preventDefault();
			return false;
		});
	}
}
