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
		// if mobile device, show nav arrows
		const isMobileDevice = /(iphone|ipod|ipad|android)/gi.test(navigator.userAgent);
		if (!isMobileDevice) return;
		// return;

		document.querySelector('.mobile-controls').style.display = 'block';
		// document.querySelector('.reveal').style.display = 'none';
		// document.querySelector('#container').style.display = 'none';
		// return;

		/*
		const prev = document.querySelector('.mobile-controls .prev');
		const next = document.querySelector('.mobile-controls .next');

		prev.addEventListener('touchstart', (e) => {
			// e.preventDefault();
			// return false;
		});

		next.addEventListener('touchstart', (e) => {
			// e.preventDefault();
			// return false;
		});

		prev.addEventListener('touchend', (e) => {
			// Reveal.prev();
			const index = parseInt(window.location.hash.substr(2)) || 0;
			prev.setAttribute('href', window.location.origin + '/#/' + (index - 1));
			// e.preventDefault();
			return true;
		});

		next.addEventListener('touchend', (e) => {
			// Reveal.next();
			const index = parseInt(window.location.hash.substr(2)) || 0;
			next.setAttribute('href', window.location.origin + '/#/' + (index + 1));
   			// return true;
			// e.preventDefault();
			return true;
		});
		*/
	}

	toggleDoge() {
		if (this.dogeOn) this.hideDoge();
		else this.showDoge();
	}

	showDoge() {
		this.dogeOn = true;
		const doge = document.querySelector('.doge');

		const rnd = Math.random();

		if (rnd > 0.5) TweenMax.to(doge, 0.5, { bottom: -10, ease: Bounce.easeOut });
		else TweenMax.to(doge, 1.5, { bottom: -200, ease: Quart.easeOut });
	}

	hideDoge() {
		this.dogeOn = false;
		const doge = document.querySelector('.doge');
		TweenMax.to(doge, 0.5, { bottom: -768, ease: Expo.easeIn });
	}

}
