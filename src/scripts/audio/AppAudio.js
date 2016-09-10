export default class AppAudio {

	get FFT_SIZE() { return 512; }
	get BINS() { return 128; }

	static get AUDIO_LOAD() { return 'audio-load'; }
	static get AUDIO_DECODE() { return 'audio-decode'; }
	static get AUDIO_PLAY() { return 'audio-play'; }
	static get AUDIO_PAUSE() { return 'audio-pause'; }
	static get AUDIO_END() { return 'audio-end'; }
	static get AUDIO_RESTART() { return 'audio-restart'; }

	constructor(app) {
		this.app = app;
		this.paused = true;
		this.pausedAt = 0;

		this.initContext();
		this.initGain();
		this.initAnalyser();

		this.load('sounds/201151_SOUNDDOGS__tu.mp3');
	}

	initContext() {
		if (window.AudioContext === void 0) window.AudioContext = window.webkitAudioContext;
		this.ctx = new AudioContext();
	}

	initGain() {
		this.gainNode = this.ctx.createGain();
		this.gainNode.gain.value = 1.0;
		this.gainNode.connect(this.ctx.destination);
	}

	initAnalyser() {
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

	load(url) {
		const request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';
		request.onprogress = this.onRequestProgress.bind(this);
		request.onload = this.onRequestLoad.bind(this);
		request.send();
	}

	play(loop) {
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

	pause() {
		this.sourceNode.stop(0);
		this.pausedAt = Date.now() - this.startedAt;
		this.paused = true;

		this.app.trigger(AppAudio.AUDIO_PAUSE, { currentTime: this.pausedAt });
	}

	seek(time) {
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

	update() {
		const freqData = new Uint8Array(this.analyserNode.frequencyBinCount);
		this.analyserNode.getByteFrequencyData(freqData);
		const length = freqData.length;

		this.oldValues = this.values.concat();

		const bin = Math.ceil(length / this.BINS);
		for (let i = 0; i < this.BINS; i++) {
			let sum = 0;
			for (let j = 0; j < bin; j++) {
				sum += freqData[(i * bin) + j];
			}

			// Calculate the average frequency of the samples in the bin
			const average = sum / bin;

			// Divide by number of bins to normalize
			// this.values[i] = (average / this.BINS) / this.playbackRate;
			this.values[i] = (average / this.BINS);
		}

		for (let i = 0; i < this.selectedIndices.length; i++) {
			const index = this.selectedIndices[i]
			this.selectedValues[i] = this.values[index];
		}

		// set current time
		if (this.loaded && !this.ended) {
			this.currentTime = (this.paused) ? this.pausedAt : Date.now() - this.startedAt;
			// this.currentTime *= this.playbackRate;
		}
	}

	// ---------------------------------------------------------------------------------------------
	// EVENT HANDLERS
	// ---------------------------------------------------------------------------------------------

	onRequestProgress(e) {
		// console.log('AppAudio.onRequestProgress', e)
	}

	onRequestLoad(e) {
		// console.log('AppAudio.onRequestLoad', e);

		this.ctx.decodeAudioData(e.target.response, this.onBufferLoaded.bind(this), this.onBufferError.bind(this));

		this.app.trigger(AppAudio.AUDIO_LOAD);
	}

	onBufferLoaded(buffer) {
		this.buffer = buffer;

		this.loaded = true;
		this.duration = this.buffer.duration * 1000;
		// this.play();

		this.app.trigger(AppAudio.AUDIO_DECODE);
	}

	onBufferError(e) {
		// console.log('AppAudio.onBufferError', e)
	}

	onSourceEnded(e) {
		// console.log('AppAudio.onSourceEnded', this.paused)
		if (this.paused) return;
		this.currentTime = this.duration;
		this.ended = true;
		this.paused = true;
		this.pausedAt = 0;

		if (this.loop) this.play(this.loop);

		// window.dispatchEvent(new Event(this.EVENT_AUDIO_ENDED));
	}

}
