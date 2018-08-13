//index.js
import WxTouch from "./wx-touch.js"

// 创建事件
let event = new WxTouch({

    // swipe 滑动的阈值，到达了这个值才会触发 swipe 事件，默认是 >=30
    threshold: 30,
    
    // swipe 滑动事件，
    swipe(evt){
        console.log(evt.type)   // swipeup | swiperight | swipedown | swipeleft
        console.log(evt.swiped)     // 是否触发了 swipe 事件标记，当你需要做特殊处理的时候，这将很有用
    },
    
    // drag 拖拽事件
    drag(evt){
        console.log(evt.distance)   // {x: Number, y: Number}, evt.distance 拖动的距离，包含 X 轴和 Y 轴
    },
    
    // rotate 旋转事件
    rotate(evt){
        console.log(evt.rotateAngle)    // 当前的旋转角度
    },
    
    // pinch 缩放事件
    pinch(evt){
        console.log(evt.scaling)    // 缩放的比例值
    }
});


Page({
    // ...
    
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
    
    // 如果你需要自定义，或者做一些别的操作
    ...WxTouch.bindEvent("Event", event, {
        start(evt){
            // do some thing...         // 这里的 this 是当前的页面实例对象，不是 WxTouch 实例对象
        },
        move(){},
        end(){},
        cancel(){}
    })
});
