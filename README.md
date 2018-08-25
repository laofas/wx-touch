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
`touchstart``touchmove``touchend``touchcancel``tap` 这五个事件，原生就支持，为什么还要添加？因为当调用 `WxTouch` 方法的时候，创建了一个对象，返回五个方法，分别是 `start[Name]``move[Name]``end[Name]``cancel[Name]``tap[Name]`，`[Name]`是创建的时候传递的第一个参数，就是给事件定义的名称，
这五个方法是方便直接绑定到 `wxml` 元素的，导致需要自定义这些事件的时候，还要多包一层函数

## 绑定事件
在需要触发事件的 wxml 元素上面一定要绑定 touchstart,touchmove,touchend,touchcancel 这四个事件类型，tap 事件是可选的，你需要触发 doubletap 才要绑定 tap 事件。
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
    // ...
    
    ...WxTouch("Event", {
        swipe(evt){
            this.setData({
                // ...
            })
        },
        rotate(evt){
            // ...      
        },
        
        // ...
    })
})
```

详细的文档，以及 demo 后续加上...
