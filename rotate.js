//
function getAngle(a, b) {
	return 180 / Math.PI * Math.atan2(b.clientX - a.clientX, b.clientY - a.clientY);
}

export default class Rotate {
	constructor(options) {
		this.isRotate = false;
		this.startAngle = 0;
		this.events = {
			start: options.start,
			rotate: options.rotate,
			end: options.end,
			cancel: options.cancel
		}
	}

	start(evt) {
		let touches = evt.touches;
		if (touches.length >= 2) {
			this.isRotate = true;
			this.startAngle = getAngle(touches[0], touches[1]);
			if (this.events.start) {
				this.events.start(evt);
			}
		}
	}

	move(evt) {
		if (this.isRotate && this.events.rotate) {
			let touches = evt.touches;
			evt.angle = this.startAngle - getAngle(touches[0], touches[1]);
			this.events.rotate(evt);
		}
	}

	end(evt) {
		if (this.isRotate) {
			this.isRotate = false;
			if (this.events.end) {
				this.events.end(evt);
			}
		}
	}

	cancel(evt) {
		if (this.isRotate) {
			if (this.events.cancel) {
				this.events.cancel(evt);
			}
			this.end(evt);
		}
	}
}
