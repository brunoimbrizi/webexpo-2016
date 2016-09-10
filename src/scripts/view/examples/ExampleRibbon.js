export default class ExampleRibbon {

	constructor(ctx) {
		this.ctx = ctx;

		this.rect = { x: 0.5, y: 0, w: 0.5, h: 1 };
		this.colorA = '#ffaa00';
		this.colorB = 'rgba(255, 170, 0, 0.1)';
		
		this.numPoints = 30;
		this.distance = 50;
		this.distanceSq = this.distance * this.distance;
		this.damp = 0.9;

		this.initPoints();
	}

	update() {
		switch(this.state) {
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

		switch(this.state) {
			case 0:
			case 1:
				this.moveToRect(true);
				this.drawPoints(true);
				break;
			case 2:
				this.moveToRect(true);
				this.drawPoints();
				break;
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
			case 8:
			case 9:
			case 10:
				this.moveToRect(true);
				this.drawPoints();
				this.drawLines();
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

	drawPoints(rect) {
		for (let p of this.points) {
			this.ctx.beginPath();
			if (rect) this.ctx.rect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
			else this.ctx.arc(p.x, p.y, p.radius, 0, TWO_PI);
			this.ctx.closePath();
			this.ctx.fill();
		}
	}

	drawLines() {
		this.ctx.beginPath();
		this.ctx.moveTo(this.points[0].x, this.points[0].y);

		for (let i = 0; i <= this.points.length; i++) {
			const pp = (i === 0) ? this.points[0] : this.points[i - 1];
			this.ctx.lineTo(pp.x, pp.y);
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
			const offset = 10;

			const cp1 = { x: pp.x + cos(pp.angle + HALF_PI) * offset, y: pp.y + sin(pp.angle + HALF_PI) * offset };
			const cp2 = { x: p.x - cos(p.angle + HALF_PI) * offset, y: p.y - sin(p.angle + HALF_PI) * offset };

			this.ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, p.x, p.y);
		}

		this.ctx.strokeStyle = this.color;
		this.ctx.stroke();
	}

	followMouse(follow, useRect) {
		document.querySelector('.reveal').style.pointerEvents = (follow) ? 'none' : '';
		if (!follow) return;

		if (useRect && this.ctx.mouse.x < this.rect.x * this.ctx.width) return;

		this.points[0].x = this.ctx.mouse.x - this.rect.x * this.ctx.width - this.rect.w * this.ctx.width * 0.5;
		this.points[0].y = this.ctx.mouse.y - this.rect.y * this.ctx.height - this.rect.h * this.ctx.height * 0.5;
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

	setState(state) {
		this.state = state;

		this.ctx.autoclear = true;
		this.colorFill = this.color = this.colorA;

		let time = 1;
		let ease = Quart.easeInOut;
		let delay = 0;

		switch(state) {
			case 0:
				for (let p of this.points) {
					TweenMax.to(p, time, { x: 0, y: 0, ease });
				}
				break;
			case 1:
			case 2:
			case 3:
				for (let p of this.points) {
					delay = (this.numPoints - p.index) * 0.05;
					ease = Back.easeOut;
					TweenMax.to(p, time, { x: 0, y: p.index * this.distance, ease, delay });
				}
				break;
			case 4:
				for (let p of this.points) {
					delay = p.index * 0.02;
					TweenMax.to(p, time, { x: random(-25, 25), y: p.index * this.distance, ease, delay });
				}
				break;
			case 10:
				this.ctx.clear();
				this.ctx.globalCompositeOperation = 'lighter';
				this.color = this.colorB;
			case 9:
				this.ctx.clear();
				this.ctx.autoclear = false;
				break;
		}
	}
}