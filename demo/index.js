// pages/index/index.js
import WxTouch from "../../src/wx-touch.js"
let store = {};

Page({
    data: {
        deltaX: 0,
        deltaY: 0,
        angle: 0,
        scale: 1,
        direction: ""
    },

    ...WxTouch("Touch", {

        touchstart(evt) {

            // 保存已经存在的数据
            store.deltaX = this.data.deltaX;
            store.deltaY = this.data.deltaY;
            store.angle = this.data.angle;
            store.scale = this.data.scale;

            this.setData({
                transition: "none"
            })
        },

        touchmove(evt) {
            let undef, data = {};

            if (evt.deltaX !== undef) {
                data.deltaX = evt.deltaX;
                data.deltaY = evt.deltaY;
            }

            if (evt.angle !== undef) {
                data.angle = evt.angle;
            }

            if (evt.scale !== undef) {
                data.scale = evt.scale;
            }

            // 一次性调用 setData
            this.setData(data);
        },

        touchend(evt) {

            // 针对 pressmove 事件，保存已经平移的距离
            if (evt.touches.length) {
                store.deltaX = this.data.deltaX;
                store.deltaY = this.data.deltaY;
            }
        },

        swipe(evt) {
            this.setData({
                direction: evt.direction
            })
        },

        pressmove(evt) {

            // 仅仅设置数据，统一到 touchmove 处理器中调用 setData
            evt.deltaX += store.deltaX;
            evt.deltaY += store.deltaY;
        },

        rotate(evt) {

            // 仅仅设置数据，统一到 touchmove 处理器中调用 setData
            evt.angle += store.angle;
        },

        pinch(evt) {
            
            // 仅仅设置数据，统一到 touchmove 处理器中调用 setData
            evt.scale *= store.scale;
        },

        doubletap(evt) {
            this.setData({
                transition: "all 0.3s",
                scale: this.data.scale >= 1.3 ? 1 : 1.3
            })
        }
    })
})
