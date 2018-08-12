//
function getDistance(a, b) {
    return Math.sqrt(Math.pow(a.clientX - b.clientX, 2) + Math.pow(a.clientY - b.clientY, 2));
}

export default class Scale {
    constructor(options) {
        this.isScale = false;
        this.startDistance = 0;
        this.events = {
            start: options.start,
            scale: options.scale,
            end: options.end,
            cancel: options.cancel
        }
    }

    start(evt) {
        let touches = evt.touches;
        if (touches.length >= 2) {
            this.isScale = true;
            this.startDistance = getDistance(touches[0], touches[1]);
            if (this.events.start) {
                this.events.start(evt);
            }
        }
    }

    move(evt) {
        if (this.isScale && this.events.scale) {
            let touches = evt.touches;
            evt.scale = getDistance(touches[0], touches[1]) / this.startDistance;
            this.events.scale(evt);
        }
    }

    end(evt) {
        if (this.isScale) {
            this.isScale = false;
            if (this.events.end) {
                this.events.end(evt);
            }
        }
    }

    cancel(evt) {
        if (this.isScale) {
            if (this.events.cancel) {
                this.events.cancel(evt);
            }
            this.end(evt);
        }
    }
}
