/*!
    2018-8-12
    https://github.com/shixianqin/wx-touch
*/

/*

获取一条线相对于垂直的角度
@param {Object} a
@param {Object} b

*/
function getAngle(a, b) {
    return 180 / Math.PI * Math.atan2(b.clientX - a.clientX, b.clientY - a.clientY);
}

/*

获取两个点之间的距离
@param {Object} a
@param {Object} b

*/
function getDistance(a, b) {
    return Math.sqrt(Math.pow(a.clientX - b.clientX, 2) + Math.pow(a.clientY - b.clientY, 2));
}

/*

WxTouch
@param {Object} options

*/
class WxTouch {
    constructor(options) {

        // swipe 触发的阈值
        this.threshold = options.threshold >= 30 ? options.threshold : 30;

        // 把传递的处理器保存到实例中
        this.events = {
            swipe: options.swipe,
            drag: options.drag,
            rotate: options.rotate,
            pinch: options.pinch
        };
    }

    // @param {TouchEvent} evt
    start(evt) {
        let touches = evt.touches;

        // 标记已经开始触摸
        this.touched = true;

        // 标记开始触摸的时间
        this.timeStamp = Date.now();

        // 保存开始触摸的事件对象
        this.touches = touches;

        // 当触摸点有两个以上，要保存 rotate 开始的角度，和 pinch 开始的距离
        // 用于 move 的时候计算结果
        if (touches.length > 1) {
            if (this.events.rotate) {
                this.startAngle = getAngle(touches[0], touches[1]);
            }
            if (this.events.pinch) {
                this.startDistance = getDistance(touches[0], touches[1]);
            }
        }
    }

    // @param {TouchEvent} evt
    move(evt) {

        // 必须是 start 执行了，才会触发
        if (this.touched) {
            let startTouches = this.touches,
                moveTouches = evt.touches,
                events = this.events;

            // 当有两个以上的触摸点，就认为是 rotate 或者 pinch
            if (moveTouches.length > 1) {
                if (events.rotate) {
                    evt.rotateAngle = this.startAngle - getAngle(moveTouches[0], moveTouches[1]);
                    events.rotate(evt);
                }
                if (events.pinch) {
                    evt.scaling = getDistance(moveTouches[0], moveTouches[1]) / this.startDistance;
                    events.pinch(evt);
                }

                // 只有一个触摸点的时候，才会触发 drag 事件
            } else if (events.drag) {
                evt.distance = {
                    x: moveTouches[0].clientX - startTouches[0].clientX,
                    y: moveTouches[0].clientY - startTouches[0].clientY
                };
                events.drag(evt);
            }
        }
    }

    // @param {TouchEvent} evt
    end(evt) {

        // 必须是 start 执行了，才会触发
        if (this.touched) {
            this.touched = false;

            // 限制 swipe 滑动时长，当触摸时间过长，就不做处理
            if (Date.now() - this.timeStamp < 1000) {
                let endTouch = evt.changedTouches[0],
                    x = endTouch.clientX - this.touches[0].clientX,
                    y = endTouch.clientY - this.touches[0].clientY,
                    distanceX = Math.abs(x),
                    distanceY = Math.abs(y);

                // 判断滑动距离达到了阈值，可以触发 swipe 事件
                if (distanceX >= this.threshold || distanceY >= this.threshold) {

                    // 标记是否触发了 swipe
                    evt.swiped = true;

                    if (this.events.swipe) {

                        // 改变事件的名称，用于回调时候的方向判断
                        evt.type = distanceX > distanceY ? (x > 0 ? "swiperight" : "swipeleft") : y > 0 ? "swipedown" : "swipeup";
                        this.events.swipe(evt);
                    }
                }
            }
        }
    }

    // 假如可能被中断了触摸，就执行 end 事件
    // @param {TouchEvent} evt
    cancel(evt) {
        this.end(evt);
    }
}


/*

处理绑定到实例时太过冗余的方法
@param {Stirng} name
@param {WxTouch} event
@param {Object} options

*/
WxTouch.bindEvent = function(name, event, options) {
    let bind = {};
    if (!options) {
        options = {}
    }
    ["start", "move", "end", "cancel"].forEach(item => {
        bind[item + name] = options[item] || event[item].bind(event);
    });
    return bind;
};

//
export default WxTouch;
