export default class Ribbon {

	constructor(ctx) {
		this.ctx = ctx;

		this.colorA = '#ffaa00';
	}

	update() {
	}

	draw() {
		this.ctx.fillStyle = this.colorA;
		this.ctx.fillRect(0, 0, 10, 10);
	}
}