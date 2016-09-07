export default class ExampleRibbon {

	constructor(ctx) {
		this.ctx = ctx;

		this.rect = { x: 0.5, y: 0, w: 0.5, h: 1 };
		this.colorA = '#ffaa00';
		this.numPoints = 30;
		this.distance = 50;

		this.initPoints();
	}

	update() {
		switch(this.state) {
			case 0: {

			}
		}
	}

	draw() {
		this.ctx.save();
		this.ctx.fillStyle = this.colorA;

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

		for (let i = 0; i < this.points.length; i++) {
			const pp = (i === 0) ? this.points[0] : this.points[i - 1];
			this.ctx.lineTo(pp.x, pp.y);
		}

		this.ctx.strokeStyle = this.colorA;
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

		this.ctx.strokeStyle = this.colorA;
		this.ctx.stroke();
	}

	setState(state) {
		this.state = state;

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
					delay = (this.numPoints - p.index) * 0.02;
					TweenMax.to(p, time, { x: 0, y: p.index * this.distance, ease, delay });
				}
				break;
			case 4:
				for (let p of this.points) {
					delay = p.index * 0.02;
					TweenMax.to(p, time, { x: random(-25, 25), y: p.index * this.distance, ease, delay });
				}
				break;
		}
	}
}