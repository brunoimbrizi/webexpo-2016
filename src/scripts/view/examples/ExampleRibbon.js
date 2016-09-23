export default class ExampleRibbon {

	constructor(ctx, audio) {
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

	update() {
		switch(this.state) {
			case 5:
				this.followMouse(true);
				break;
			case 6:
				this.followMouse(true);
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

	draw() {
		this.ctx.save();
		this.ctx.fillStyle = this.color;

		this.moveToRect(true);

		switch(this.state) {
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

	initPoints() {
		this.points = [];

		for (let i = 0; i < this.numPoints; i++) {
			const p = { x: 0, y: 0, vx: 0, vy: 0, angle: 0, radius: 5, index: i };
			this.points.push(p);
		}
	}

	moveToRect(center) {
		// move to rect
		this.ctx.translate(this.rect.x * this.ctx.width, this.rect.y * this.ctx.height);
		// center in the rect
		if (center) this.ctx.translate(this.rect.w * this.ctx.width * 0.5, this.rect.h * this.ctx.height * 0.5);
	}

	drawPoints(rect, outline) {
		for (let p of this.points) {
			// fill
			this.ctx.beginPath();
			if (rect) this.ctx.rect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
			else this.ctx.arc(p.x, p.y, p.radius, 0, TWO_PI);
			this.ctx.closePath();
			this.ctx.fill();

			// stroke
			if (!outline) continue;
			const radius = p.radius * sqrt(p.vx);
			this.ctx.strokeStyle = this.colorA;
			this.ctx.beginPath();
			this.ctx.arc(p.x, p.y, radius, 0, TWO_PI);
			this.ctx.closePath();
			this.ctx.stroke();
		}
	}

	drawLines() {
		this.ctx.beginPath();
		this.ctx.moveTo(this.points[0].x, this.points[0].y);

		for (let i = 1; i < this.points.length; i++) {
			const p = this.points[i];
			const pp = this.points[i - 1];
			this.ctx.lineTo(p.x, p.y);
		}

		this.ctx.strokeStyle = this.color;
		this.ctx.stroke();
	}

	drawCurves() {
		this.ctx.beginPath();
		this.ctx.moveTo(this.points[0].x, this.points[0].y);

		for (let i = 0; i < this.points.length; i++) {
			const p = this.points[i];
			const pp = (i === 0) ? p : this.points[i - 1];
			const np = (i === this.points.length - 1) ? p : this.points[i + 1];
			const offset = 20;

			const cp1 = { x: pp.x + cos(pp.angle + HALF_PI) * offset, y: pp.y + sin(pp.angle + HALF_PI) * offset };
			const cp2 = { x: p.x - cos(p.angle + HALF_PI) * offset, y: p.y - sin(p.angle + HALF_PI) * offset };
			this.ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, p.x, p.y);
		}

		this.ctx.strokeStyle = this.color;
		this.ctx.stroke();
	}

	followMouse(follow, useRect) {
		// if mobile device, show nav arrows
		const isMobileDevice = /(iphone|ipod|ipad|android)/gi.test(navigator.userAgent);
		document.querySelector('.touch-arrows').style.display = (follow && isMobileDevice) ? 'block' : 'none';

		document.querySelector('.reveal').style.pointerEvents = (follow) ? 'none' : '';
		if (!follow) return;

		if (!this.ctx.touches[0]) return;

		const touch = { x: this.ctx.touches[0].x, y: this.ctx.touches[0].y };

		touch.x /= window.devicePixelRatio;
		touch.y /= window.devicePixelRatio;

		if (useRect && touch.x < this.rect.x * this.ctx.width) return;
		if (!touch.x && !touch.y) return;

		this.points[0].x = touch.x - this.rect.x * this.ctx.width - this.rect.w * this.ctx.width * 0.5;
		this.points[0].y = touch.y - this.rect.y * this.ctx.height - this.rect.h * this.ctx.height * 0.5;
	}

	updateDry(start, end) {
		for (let i = start; i < end; i++) {
			const p = this.points[i];
			const pp = (i === 0) ? p : this.points[i - 1];

			const dx = p.x - pp.x;
			const dy = p.y - pp.y;
			const dd = dx * dx + dy * dy;

			if (dd > this.distanceSq) {
				const a = atan2(dy, dx);

				p.x = pp.x + this.distance * cos(a);
				p.y = pp.y + this.distance * sin(a);
			}
		}
	}

	updateElastic() {
		for (let i = this.points.length - 1; i > 0; i--) {
			const p = this.points[i];
			const pp = (i === 0) ? p : this.points[i - 1];

			p.vx *= this.damp;
			p.vy *= this.damp;

			p.x += p.vx;
			p.y += p.vy;

			const ox = p.x;
			const oy = p.y;

			const dx = p.x - pp.x;
			const dy = p.y - pp.y;
			const dd = dx * dx + dy * dy;

			if (dd > this.distanceSq) {
				const a = atan2(dy, dx);

				p.x = pp.x + this.distance * cos(a);
				p.y = pp.y + this.distance * sin(a);

				p.vx += (p.x - ox) * 0.1;
				p.vy += (p.y - oy) * 0.1;
			}
		}
	}

	updateAudio() {
		for (let i = 0; i < this.points.length; i++) {
			const p = this.points[i];
			p.radius = this.audio.values[i + 2] * 15;

			if (!(i % 4)) p.radius = this.audio.values[3] * this.audio.values[3] * 18;
			if (!(i % 5)) p.radius = this.audio.values[10] * 15;
		}
	}

	setState(state) {
		this.state = state;

		this.ctx.autoclear = true;
		this.colorFill = this.color = this.colorA;
		for (let p of this.points) { p.radius = 5; }
		this.ctx.globalCompositeOperation = 'source-over';

		if (!this.audio.paused) this.audio.pause();

		let time = 1;
		let ease = Quart.easeInOut;
		let delay = 0;

		switch(state) {
			case 0:
				for (let p of this.points) {
					TweenMax.to(p, time, { x: 0, y: 0, ease, overwrite: 1 });
				}
				break;
			case 1:
				for (let p of this.points) {
					delay = (this.numPoints - p.index) * 0.05;
					ease = Back.easeOut;
					TweenMax.to(p, time, { x: 0, y: p.index * this.distance, ease, delay });
				}
				break;
			case 2:
				for (let p of this.points) {
					delay = p.index * 0.05;
					ease = Back.easeOut;
					TweenMax.to(p, 0.1, { radius: 15, ease, delay, onComplete: () => {
						TweenMax.to(p, time, { x: 0, radius: 5, ease, overwrite: 0 });
					} });
				}
				break;
			case 3:
				for (let p of this.points) {
					delay = p.index * 0.02;
					TweenMax.to(p, time, { x: 0, y: p.index * this.distance, ease, delay });
				}
				break;
			case 4:
				for (let p of this.points) {
					delay = p.index * 0.02;
					TweenMax.to(p, time, { x: random(-50, 50), y: p.index * this.distance, ease, delay });
				}
				break;
			case 11:
				this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
				this.ctx.globalCompositeOperation = 'lighter';
				this.color = this.colorB;
				for (let p of this.points) { p.radius = 2; }
			case 10:
				this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
				this.ctx.autoclear = false;
				break;
			case 12:
				this.audio.play(true);
				break;
		}
	}
}