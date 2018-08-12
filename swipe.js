
//
export default class Swiper {
    constructor(options) {
        this.touch = {};
        this.timeStamp = 0;
        this.touched = false;
        this.threshold = options.threshold || 30;
        this.events = {
            start: options.start,
            move: options.move,
            end: options.end,
            cancel: options.cancel,
            swipe: options.swipe
        }
    }

    start(evt) {
        this.touched = true;
        this.timeStamp = Date.now();
        this.touch = evt.changedTouches[0];
        if (this.events.start) {
            this.events.start(evt);
        }
    }

    move(evt) {
        if (this.touched && this.events.move) {
            let moveTouch = evt.changedTouches[0];
            evt.distance = {
                x: moveTouch.clientX - this.touch.clientX,
                y: moveTouch.clientY - this.touch.clientY
            };
            this.events.move(evt);
        }
    }

    end(evt) {
        if (this.touched) {
            this.touched = false;
            if (Date.now() - this.timeStamp < 1000) {
                let endTouch = evt.changedTouches[0],
                    x = endTouch.clientX - this.touch.clientX,
                    y = endTouch.clientY - this.touch.clientY,
                    distanceX = Math.abs(x),
                    distanceY = Math.abs(y);

                if (distanceX >= this.threshold || distanceY >= this.threshold) {
                    evt.swiped = true;
                    if (this.events.swipe) {
                        evt.type = distanceX > distanceY ? (x > 0 ? "swiperight" : "swipeleft") : y > 0 ? "swipedown" : "swipeup";
                        this.events.swipe(evt);
                    }
                }
            }

            if (this.events.end) {
                evt.type = "touchend";
                this.events.end(evt);
            }
        }
    }

    cancel(evt) {
        if (this.touched) {
            if (this.events.cancel) {
                this.events.cancel(evt);
            }
            this.end(evt);
        }
    }
}