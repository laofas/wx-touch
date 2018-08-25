//


let TOUCH_TYPES = ["start", "move", "end", "cancel", "tap"],
    EVENT_TYPES = ["touchstart", "touchmove", "touchend", "touchcancel", "swipe", "pressmove", "rotate", "pinch", "tap", "doubletap"];

function getAngle(a, b) {
    return 180 / Math.PI * Math.atan2(b.clientX - a.clientX, b.clientY - a.clientY);
}

function getDistance(a, b) {
    return Math.sqrt(Math.pow(a.clientX - b.clientX, 2) + Math.pow(a.clientY - b.clientY, 2));
}


class WxTouch {


    constructor(options) {

        this.touched = false;
        // this.startTime = 0;
        this.startAngle = 0;
        this.startScale = 0;
        this.startTouches = null;
        this.tapCount = 0;
        this.startTabTime = 0;
        this.events = {};

        EVENT_TYPES.forEach(item => {
            if (options[item]) {
                this.events[item] = options[item];
            }
        });
    }



    start(evt, context) {

        let events = this.events,
            touches = this.startTouches = evt.touches;

        this.touched = true;
        // this.startTime = Date.now();

        if (touches.length > 1) {
            if (events.rotate) {
                this.startAngle = getAngle(touches[0], touches[1]);
            }
            if (events.pinch) {
                this.startScale = getDistance(touches[0], touches[1]);
            }
        }

        if (events.touchstart) {
            events.touchstart.call(context, evt);
        }
    }



    move(evt, context) {
        if (this.touched) {

            let events = this.events,
                startTouch = this.startTouches[0],
                moveTouches = evt.touches;

            if (events.pressmove) {
                evt.deltaX = moveTouches[0].clientX - startTouch.clientX;
                evt.deltaY = moveTouches[0].clientY - startTouch.clientY;
                events.pressmove.call(context, evt);
            }

            if (moveTouches.length > 1) {

                if (events.rotate) {
                    evt.angle = this.startAngle - getAngle(moveTouches[0], moveTouches[1]);
                    events.rotate.call(context, evt);
                }

                if (events.pinch) {
                    evt.scale = getDistance(moveTouches[0], moveTouches[1]) / this.startScale;
                    events.pinch.call(context, evt);
                }
            }
        }

        if (events.touchmove) {
            events.touchmove.call(context, evt);
        }
    }



    end(evt, context) {
        if (this.touched) {

            // let now = Date.now(),
            let events = this.events,
                startTouch = this.startTouches[0];

            if (evt.touches.length == 0) {
                this.touched = false;
            }

            // if (events.swipe && (now - this.startTime < 300)) {
            if (events.swipe) {
                let endTouch = evt.changedTouches[0],
                    deltaX = endTouch.clientX - startTouch.clientX,
                    deltaY = endTouch.clientY - startTouch.clientY,
                    distanceX = Math.abs(deltaX),
                    distanceY = Math.abs(deltaY);

                if (distanceX >= 10 || distanceY >= 10) {
                    evt.direction = distanceX > distanceY ? (deltaX > 0 ? "right" : "left") : deltaY > 0 ? "down" : "up";
                    events.swipe.call(context, evt);
                }
            }
        }

        if (events.touchend) {
            events.touchend.call(context, evt);
        }
    }



    cancel(evt, context) {
        if (this.events.cancel) {
            this.events.cancel.call(context, evt);
        }
        // this.end(evt, context);
    }


    tap(evt, context) {
        let events = this.events;

        if (events.doubletap) {
            let now = Date.now();
            
            if (this.tapCount > 0 && now - this.startTabTime < 500) {
                this.tapCount = -1;
                events.doubletap.call(context, evt);
            } else {
                this.tapCount = 0;
            }
            this.startTabTime = now;
            this.tapCount++;
        }

        if (events.tap) {
            events.tap.call(context, evt);
        }
    }
}



export default function(name, options) {
    let touch = new WxTouch(options),
        events = {};

    return TOUCH_TYPES.forEach(function(item) {
        events[item + name] = function(evt) {
            touch[item](evt, this);
        }
    }), events;
}
