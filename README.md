#  wx-touch
微信小程序的手势扩展，支持以下事件：
+ touchstart
+ touchmove
+ touchend
+ touchcancel
+ tap
+ doubletap
+ swipe: (up, right, down, left)
+ pressmove
+ rotate
+ pinch

## wxml
```
<view
    bindtouchstart='startEvent'
    bindtouchmove='moveEvent'
    bindtouchend='endEvent'
    bindtouchcancel='cancelEvent'
    bindtap='tapEvent'
>
    ...
</view>
```
## js
```javascript
import WxTouch from './wx-touch.js'

Page({
    ...
    ...WxTouch("Event", {
        swipe(evt){
            this.setData({
                ...
            })
        },
        rotate(evt){
            ...      
        },
        ...
    })
})
```

详细的文档，以及 demo 后续加上...
