//
function getAngle(a, b) {
	return 180 / Math.PI * Math.atan2(b.clientX - a.clientX, b.clientY - a.clientY);
}

export default class Rotate {
	constructor(handler) {
		this.isRotate = false;
		this.startAngle = 0;
		this.handler = handler;
	}

	start(evt) {
		let touches = evt.touches;
		if (touches.length >= 2) {
			this.isRotate = true;
			this.startAngle = getAngle(touches[0], touches[1]);
		}
	}

	move(evt) {
		if (this.isRotate && this.handler) {
			let touches = evt.touches;
			evt.angle = this.startAngle - getAngle(touches[0], touches[1]);
			this.handler(evt);
		}
	}

	end(evt) {
		if (this.isRotate) {
			this.isRotate = false;
		}
	}

	cancel(evt) {
		if (this.isRotate) {
			this.end(evt);
		}
	}
}
