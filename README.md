# wx-touch
微信小程序的手势库

## Swipe
```javascript
let swipe = new Swiper({
    start(evt){
        // do some thing...
    },
    move(evt){
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
