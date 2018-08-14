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


class WxTouch {

    // @param {Object} options
    constructor(options) {
        this.data = {};
        this.$threshold = options.threshold >= 30 ? options.threshold : 30;
        this.$timeout = options.timeout === false ? false : options.timeout >= 300 ? options.timeout : 1000;
        this.$events = {
            swipe: options.swipe,
            drag: options.drag,
            rotate: options.rotate,
            pinch: options.pinch
        }
    }

    // @param {TouchEvent} evt
    start(evt) {
        let touch = evt.$touch,
            touches = evt.touches;

        touch.$touched = true;
        touch.$startTime = Date.now();
        touch.$touches = touches;

        // 当触摸点有两个以上，要保存 rotate 开始的角度，和 pinch 开始的距离
        // 用于 move 的时候计算结果
        if (touches.length > 1) {
            if (touch.$events.rotate) {
                touch.$startAngle = getAngle(touches[0], touches[1]);
            }
            if (touch.$events.pinch) {
                touch.$startDistance = getDistance(touches[0], touches[1]);
            }
        }
    }

    // @param {TouchEvent} evt
    move(evt) {

        // evt.$touch 是当前的 WxTouch 事件实例对象
        let touch = evt.$touch;

        if (touch.$touched) {
            let startTouches = touch.$touches,
                moveTouches = evt.touches,
                events = touch.$events;

            // 当有两个以上的触摸点，就认为是 rotate 或者 pinch
            if (moveTouches.length > 1) {
                if (events.rotate) {
                    evt.rotateAngle = touch.$startAngle - getAngle(moveTouches[0], moveTouches[1]);
                    events.rotate.call(this, evt);
                }
                if (events.pinch) {
                    evt.scaling = getDistance(moveTouches[0], moveTouches[1]) / touch.$startDistance;
                    events.pinch.call(this, evt);
                }

                // 只有一个触摸点的时候，才会触发 drag 事件
            } else if (events.drag) {
                evt.distance = {
                    x: moveTouches[0].clientX - startTouches[0].clientX,
                    y: moveTouches[0].clientY - startTouches[0].clientY
                };
                events.drag.call(this, evt);
            }
        }
    }

    // @param {TouchEvent} evt
    end(evt) {
        let touch = evt.$touch,
            touches = touch.$touches;

        // 必须是 start 执行了，才会触发
        // 结束触摸后重置这个标记，以防误触
        if (touch.$touched) {
            touch.$touched = false;

            // 当触摸点有两个以上时，不触发 swipe 事件
            // 限制 swipe 滑动时长，当触摸时间过长，就不做处理
            // 如果传递 timeout === false 就不限制
            if (touches.length == 1 && (touch.$timeout === false || Date.now() - touch.$startTime < touch.$timeout)) {
                let endTouch = evt.changedTouches[0],
                    x = endTouch.clientX - touches[0].clientX,
                    y = endTouch.clientY - touches[0].clientY,
                    distanceX = Math.abs(x),
                    distanceY = Math.abs(y);

                // 判断滑动距离达到了阈值，可以触发 swipe 事件
                if (distanceX >= touch.$threshold || distanceY >= touch.$threshold) {

                    // 标记是否触发了滑动事件
                    evt.swiped = true;

                    if (touch.$events.swipe) {

                        // 回调时候判断方向作相应处理
                        evt.direction = distanceX > distanceY ? (x > 0 ? "right" : "left") : y > 0 ? "down" : "up";
                        touch.$events.swipe.call(this, evt);
                    }
                }
            }
        }
    }

    // 假如可能被中断了触摸，就执行 end 事件
    // @param {TouchEvent} evt
    cancel(evt) {
        evt.$touch.end.call(this, evt);
    }
}



/*

创建事件
返回的对象包括 {start[Name], move[Name], end[Name], cancel[Name]}
使用 es6 扩展运算符直接绑定到实例里面

@param {Object} options

*/
export default function(options) {
    let touch = new WxTouch(options),
        mergeEvents = {},
        events = {},
        bindTypes = ["start", "move", "end", "cancel"];

    bindTypes.forEach(type => {
        let name = type + options.name;
        mergeEvents[name] = options[type] ? options[type] : touch[type];
        events[name] = function(evt) {
            evt.$touch = touch;
            mergeEvents[name].call(this, evt);
        }
    });

    return events;
}
