//index.js

import WxTouch from "../src/wx-touch.js"


Page({

    data: {
        btns: ["Swipe", "Drag", "Rotate", "Pinch", "All"],
        type: "Swipe",

        swipe: {
            x: 0,
            y: 0
        },

        drag: {
            x: 0,
            y: 0
        },

        angle: 0,
        scale: 1,

        all: {
            swipe: {
                x: 0,
                y: 0
            },

            drag: {
                x: 0,
                y: 0
            },

            angle: 0,
            scale: 1
        }
    },

    changeType(evt) {
        this.setData({
            type: evt.currentTarget.dataset.type
        })
    },


    // 创建 swipe 滑动事件
    ...WxTouch({

        // swipe 事件超时限制，默认 1000ms，最小 300ms，传递 false 则不限制
        // timeout: 1000,

        // swipe 事件拖动阈值，到达这个值后，才能触发 swipe 事件，默认 >=30
        // threshold: 30,

        // 必填，事件的名称，这将得到 {startSwipe, moveSwipe, endSwipe, cancelSwipe}
        // 返回值为以上格式，绑定对应的名字到 wxml 元素的 touch 事件上
        name: "Swipe",

        // 事件处理器
        // evt 对象有 $touch 是当前的 WxTouch 实例对象
        // 函数的作用域是当前页面的 this 对象，你可以直接使用 this.setData 操作数据
        swipe(evt) {
            let x = 0,
                y = 0,
                value = 50;

            // evt.swiped，是否触发了滑动事件标记，当你自定义 end 事件的时候，可能会很有用

            // evt.direction，当前滑动触发的方向标记
            switch (evt.direction) {
                case "right":
                    x = value;
                    break;
                case "left":
                    x = -value;
                    break;
                case "down":
                    y = value;
                    break;
                case "up":
                    y = -value;
                    break;
            }

            this.setData({
                swipe: {
                    x: this.data.swipe.x + x,
                    y: this.data.swipe.y + y
                }
            })
        }
    }),

    // 创建 drag 拖拽事件
    ...WxTouch({
        name: "Drag",

        // 原始事件扩展，有 start，move，end，cancel 四种原始事件
        // 当你注册了原始事件，必须要执行 $touch 对应的事件方法，比如: evt.$touch.start.call(this, evt)
        // 使用 call 方法绑定作用域，这样在之后的事件处理器中才可以直接使用当前页面的 this 对象
        // evt.$touch 是当前的 WxTouch 实例对象
        // 如果你需要再上面添加一些数据，需要再 $touch.data 对象上面添加
        // 不建议直接添加，因为你可能不小心把实例 必要的属性方法 覆盖了，除非你已经非常了解这个对象
        start(evt) {
            evt.$touch.data.drag = {
                x: this.data.drag.x,
                y: this.data.drag.y
            };
            evt.$touch.start.call(this, evt);
        },

        // evt.distance，当前拖到的距离位置对象
        drag(evt) {
            this.setData({
                drag: {
                    x: evt.distance.x + evt.$touch.data.drag.x,
                    y: evt.distance.y + evt.$touch.data.drag.y
                }
            })
        }
    }),

    // 创建 rotate 旋转事件
    ...WxTouch({
        name: "Rotate",

        start(evt){
            evt.$touch.data.angle = this.data.angle;
            evt.$touch.start.call(this, evt);
        },

        // evt.rotateAngle，当前旋转过了的角度
        rotate(evt) {
            this.setData({
                angle: evt.rotateAngle + evt.$touch.data.angle
            })
        }
    }),

    // 创建 pinch 缩放事件
    ...WxTouch({
        name: "Pinch",

        start(evt) {
            evt.$touch.data.scale = this.data.scale;
            evt.$touch.start.call(this, evt);
        },

        // evt.scaling，当前缩放的比例
        pinch(evt) {
            this.setData({
                scale: evt.scaling * evt.$touch.data.scale
            })
        }
    }),


    // 组合事件，这几个事件都依赖同样的执行流程，因此它们可以同时触发
    // 但是因为体验问题，当有两个触摸点的时候，将不触发 swipe 和 drag 事件
    ...WxTouch({
        name: "All",

        start(evt){
            evt.$touch.data.all = JSON.parse(JSON.stringify(this.data.all));
            evt.$touch.start.call(this, evt);
        },

        swipe(evt){
            let x = 0,
                y = 0,
                value = 50;

            switch (evt.direction) {
                case "right":
                    x = value;
                    break;
                case "left":
                    x = -value;
                    break;
                case "down":
                    y = value;
                    break;
                case "up":
                    y = -value;
                    break;
            }

            this.setData({
                "all.swipe": {
                    x: this.data.all.swipe.x + x,
                    y: this.data.all.swipe.y + y
                }
            });
        },

        drag(evt){
            let data = evt.$touch.data.all;
            this.setData({
                "all.drag": {
                    x: evt.distance.x + data.drag.x,
                    y: evt.distance.y + data.drag.y
                }
            })
        },

        rotate(evt) {
            this.setData({
                "all.angle": evt.rotateAngle + evt.$touch.data.all.angle
            })
        },

        pinch(evt) {
            this.setData({
                "all.scale": evt.scaling * evt.$touch.data.all.scale
            })
        }
    }),

})