# wx-touch
微信小程序的手势库，扩展了 swiper(up,right,down,left), rotate, scale 事件，
创建事件的参数 start,end,cancel 是事件开始触发，结束，打断的事件，
因为你绑定的时候直接使用了比如：swipe.start.bind(swipe)，少了自定义原生事件，这里只是一个兼容的做法，当然也可以不这么做，
如果你是直接调用比如：swipe.start(event)，那么你需要传递事件对象 event，就不需要使用 bind 指向作用域了，
在 wxml 元素绑定事件的时候 touchstart,touchmove,touchend,touchcancel 都是必须要绑定的。

swipe 事件比较特殊，它可以传递 move 事件，它保存了当前拖到的距离数据，可以做拖动效果
还可以传递 threshold，它是触发事件的阈值，当滑动大于了这个值，才会触发 swipe 事件

## Swipe
```javascript
let swipe = new Swiper({
    threshold: 30,
    start(evt){
        // do some thing...
    },
    move(evt){
        console.log(evt.distance)   // {x: 100， y: 100}
        // do some thing...
    },
    end(evt){
        // do some thing...
    },
    cancel(evt){
        // do some thing...
    },
    swiper(evt){
        console.log(evt.type)   //swipeup, swiperight, swipedown, swipeleft
        // do some thing...
    }
});

Page({
    ...
    
    start: swiper.start.bind(swipe),
    move: swiper.move.bind(swipe),
    end: swiper.end.bind(swipe),
    cancel: swiper.cancel.bind(swipe)
});
```
```html
<view bindtouchstart='start' bindtouchmove='move' bindtouchend='end' bindtouchcancel='cancel'>
    ...
</view>
```

## Rotate
```javascript
let rotate = new Rotate({
    start(evt){
        // do some thing...
    },
    end(evt){
        // do some thing...
    },
    cancel(evt){
        // do some thing...
    },
    rotate(evt){
        console.log(evt.angle)   // 0 ~ 360
        // do some thing...
    }
});

Page({
    ...
    
    start: rotate.start.bind(rotate),
    move: rotate.move.bind(rotate),
    end: rotate.end.bind(rotate),
    cancel: rotate.cancel.bind(rotate)
});
```

```html
<view bindtouchstart='start' bindtouchmove='move' bindtouchend='end' bindtouchcancel='cancel'>
    ...
</view>
```

## Scale
```javascript
let scale = new Scale({
    start(evt){
        // do some thing...
    },
    end(evt){
        // do some thing...
    },
    cancel(evt){
        // do some thing...
    },
    scale(evt){
        console.log(evt.scale)   // > 0
        // do some thing...
    }
});

Page({
    ...
    
    start: scale.start.bind(scale),
    move: scale.move.bind(scale),
    end: scale.end.bind(scale),
    cancel: scale.cancel.bind(scale)
});
```

```html
<view bindtouchstart='start' bindtouchmove='move' bindtouchend='end' bindtouchcancel='cancel'>
    ...
</view>
```
