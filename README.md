# !!!!!!!!!!!!!! 通过今天的实际使用，已发现一些问题，目前正在全面改写，以下文档即将失效 !!!!!!!!!!!!!!

#### wx-touch
微信小程序的手势扩展，拥有 swiper(up,right,down,left), rotate, pinch, drag 四个事件

#### wxml
在需要触发事件的 wxml 元素里必须绑定这四个事件，这是一定要干的事
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
使用 WxTouch.bindEvent 方法可以简洁的将事件绑定到实例里面，当然这需要配合 es6 的扩展运算符(...)
```javascript
import WxTouch from "./wx-touch.js"

// 创建事件
let event = new WxTouch({

    // swipe 滑动的阈值，到达了这个值才会触发 swipe 事件，默认是 >=30
    threshold: 30,
    
    // swipe 滑动事件，
    swipe(evt){
        console.log(evt.type)   // String, swipeup | swiperight | swipedown | swipeleft
        console.log(evt.swiped)     // Boolean, 是否触发了 swipe 事件标记，当你需要做特殊处理的时候，这将很有用
    },
    
    // drag 拖拽事件
    drag(evt){
        console.log(evt.distance)   // {x: Number, y: Number}, evt.distance 拖动的距离，包含 X 轴和 Y 轴
    },
    
    // rotate 旋转事件
    rotate(evt){
        console.log(evt.rotateAngle)    // Number, 当前的旋转角度
    },
    
    // pinch 缩放事件
    pinch(evt){
        console.log(evt.scaling)    // Number, 缩放的比例值
    }
});


Page({
    ...
    
    // 第一种绑定事件的方法，直接绑定的时候，需要使用 bind 把作用域调整到 event 对象
    startEvent: event.start.bind(event),
    moveEvent: event.move.bind(event),
    endEvent: event.end.bind(event),
    cancelEvent: event.cancel.bind(event),
    
    
    // 第二种绑定事件的方法
    startEvent(evt){
        // do some thing...
        event.start(evt);
    },
    moveEvent(evt){
        // do some thing...
        event.move(evt);
    },
    endEvent(evt){
        // do some thing...
        event.end(evt);
    },
    cancelEvent(evt){
        // do some thing...
        event.cancel(evt);
    },
    
    
    // 推荐使用，第三种绑定事件的方法，使用 WxTouch.bindEvent
    ...WxTouch.bindEvent("Event", event),   // {startEvent(){}, moveEvent(){}, endEvent(){}, cancelEvent(){} }
    
    
    // 如果你需要自定义，或者做一些别的操作，自定义事件的第二个参数是 WxTouch 实例对象
    ...WxTouch.bindEvent("Event", event, {
        start(evt, wxTouch){
            
            // 这里的 this 是当前的页面实例对象
            this.setData({
                index: this.data.index + 1
            });
            
            // 需要手动去执行 start 事件，这样可以灵活的控制它是在操作前面执行，还是后面执行
            wxTouch.start(evt);
        },
        move(evt, wxTouch){},
        end(evt, wxTouch){},
        cancel(evt, wxTouch){}
    })
});

```
