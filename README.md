# wx-touch
微信小程序的手势扩展，拥有 `swiper(up,right,down,left)`, `rotate`, `pinch`, `drag` 四个手势事件

#### wxml
在需要触发事件的 `wxml` 元素里必须绑定这四个事件，这是一定要干的事，事件的名称对应的是创建实例时传递的 `name` 属性
```html
<view
    bindtouchstart='startEvent'
    bindtouchmove='moveEvent'
    bindtouchend='endEvent'
    bindtouchcancel='cancelEvent'
>
    ...
</view>
```

#### js
1. 创建事件，回调的事件对象 `TouchEvent` 的 `$touch` 是当前的 `WxTouch` 实例对象
```javascript
import WxTouch from "./wx-touch.js"

let event = WxTouch({

    // 必填，事件的名称
    name: "Event",

    // swipe 事件超时限制，触摸超过这个值，将不触发 swipe 事件，默认是 1000ms，最小为 300ms，传递 false 则不限制
    timeout: false,

    // swipe 阈值，当滑动距离达到了这个值，才会触发 swipe 事件，默认 >= 30
    shreshold: 30,

    // 选填，开始触摸触发事件，替代原始的 touchstart 事件
    start(evt){
        // do some thing before...

        // evt.$touch 是当前的 WxTouch 实例对象
        // 如果要添加一些数据，需要添加到此对象的 data 对象上，不建议直接添加，因为你可能不小心覆盖了它必要的属性和方法
        evt.$touch.data.isTouchStart = true;

        evt.$touch.start.call(this, evt);   // 监听 start，必须执行这个事件，使用 call 绑定当前实例对象，传递到之后的回调中，并传递当前的 TouchEvent 对象作为第一个参数

        // do some thing after...
    },

    // 选填，触摸移动触发事件，替代原始的 touchmove 事件
    move(evt){
        // do some thing before...

        evt.$touch.move.call(this, evt);    // 监听 move，必须执行这个事件，使用 call 绑定当前实例对象，传递到之后的回调中，并传递当前的 TouchEvent 对象作为第一个参数

        // do some thing after...
    },

    // 选填，触摸结束触发事件，替代原始的 touchend 事件
    end(evt){
        // do some thing before...

        evt.$touch.end.call(this, evt);     // 监听 end，必须执行这个事件，使用 call 绑定当前实例对象，传递到之后的回调中，并传递当前的 TouchEvent 对象作为第一个参数

        // do some thing after...
    },

    // 选填，触摸被打断触发事件，替代原始的 touchcancel 事件
    cancel(evt){
        // do some thing before...

        evt.$touch.cancel.call(this, evt);      // 监听 cancel，必须执行这个事件，使用 call 绑定当前实例对象，传递到之后的回调中，并传递当前的 TouchEvent 对象作为第一个参数

        // do some thing after...
    },

    // swipe 滑动事件回调
    swipe(evt){

        // 当前滑动的方向
        console.log(evt.direction)      // up | right | down | up

        this.setData({
            value: 1
        });

        // do some thing...
    },

    // drag 拖拽事件回调
    drag(evt){
        
        // 当前拖动的距离位置对象
        console.log(evt.distance)       // {x: 0, y: 0}

        this.setData({
            value: 1
        });

        // do some thing...
    },

    // rotate 旋转事件回调
    rotate(evt){
        
        console.log(evt.rotateAngle)        // 当前旋转的了角度

        this.setData({
            value: 1
        });

        // do some thing...
    },

    // pinch 缩放事件回调
    pinch(evt){

        console.log(evt.scaling)        // 当前缩放的比例

        this.setData({
            value: 1
        });

        // do some thing...
    }
});


// 返回四个方法，方法名为 start,move,end,cancel 加上创建时传递的 name 属性
{
    startEvent: Function,
    moveEvent: Function,
    endEvent: Function,
    cancelEvent: Function
}
```
2. 绑定到实例
```javascript

Page({
    ...

    // 方式1，es6 扩展运算符直接绑定
    ...event,

    
    // 方式2，手动一个一个对应绑定
    startEvent: event.startEvent,
    moveEvent: event.moveEvent,
    endEvent: event.endEvent,
    cancelEvent: event.cancelEvent,

    
    // 方式3，创建 + 绑定
    ...WxTouch({
        ...
    })
})


```