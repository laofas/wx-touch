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

touchstart, touchmove, touchend, touchcancel, tap 这五个事件，原生就支持，为什么还要添加？
因为当调用 `WxTouch` 方法的时候，创建了一个对象，返回五个方法，分别是： start[Name], move[Name], end[Name], cancel[Name], tap[Name]，
[Name] 是创建的时候传递的第一个参数，就是给事件定义的名称，这五个方法是方便直接绑定到 wxml 元素的，因此需要自定义这些事件的时候，还要多包一层函数，为了明确区分事件类型，所以就添加了

### 绑定事件

在需要触发事件的 wxml 元素上面  **必须**  要绑定 bindtouchstart, bindtouchmove, bindtouchend, bindtouchcancel 这四个事件，
tap 事件是可选的，当需要触发 doubletap 再去绑定 bindtap 事件

```
<view
    bindtouchstart='startEventName'
    bindtouchmove='moveEventName'
    bindtouchend='endEventName'
    bindtouchcancel='cancelEventName'
    bindtap='tapEventName'
>
    ...
</view>
```

### 使用方法

```javascript
// 导入 wx-touch.js
import WxTouch from './wx-touch.js'

// 创建事件
// 第一个参数为事件名称，必填，事件名称的第一个字母建议使用大写
// 第二个参数为事件选项，以及定义事件处理器，处理器的 this 对象指向的是当前的页面对象，因此你可以直接使用 this.setData 方法
let event = WxTouch('MyEvent', {
    
    // touchstart 事件，当手指开始触摸屏幕时触发
    
    touchstart(evt){
        // do something...
    },
    
    
    // touchmove 事件，当手指在屏幕上滑动时触发
    
    // 由于微信小程序的 setData 特性，move 事件又是高频发事件，并且 pressmove,rotate,pinch 都依赖于这一事件
    // 如果每个处理器里面都有一个 setData，那么程序就会出现明显的卡顿
    // 假如你同时定义了 pressmove,rotate,pinch 事件或者其中的两个
    // 你可以再事件处理器中处理好数据，再等到 touchmove 处理器中执行时调用 setData，这样性能会有所提高
    // 注意避免在依赖 touchmove 的事件处理器中同时多次调用 setData
    // 因此 touchmove 事件是最后执行到的，在它之前会先触发 pressmove,rotate,pinch 这三个事件
    // evt 事件对象就保留了一些数据：

    // evt.deltaX: pressmove 事件 X 轴平移距离，如果定义了 pressmove 事件，并且触发才会有此属性
    // evt.deltaY: pressmove 事件 Y 轴平移距离，如果定义了 pressmove 事件，并且触发才会有此属性
    // evt.angle: rotate 事件旋转的角度，如果定义了 rotate 事件，并且触发才会有此属性
    // evt.scale: pinch 事件缩放比例，如果定义了 pinch 事件，并且触发才会有此属性
    
    touchmove(evt){
        console.log(evt)
    },
    
    
    
    // touchend 事件，当手指离开屏幕时触发
    // 它也是最后一个触发的事件，在它之前会先触发 swipe 事件
    
    // evt.direction: swipe 事件的方向，如果定义了 swipe 事件，并且触发才会有此属性
    
    touchend(evt){
        console.log(evt)
    },
    
    
    
    // touchcancel 事件，当触摸屏幕被打断时触发，比如来电话，消息弹框
    // 这其实只是一个兼容备用事件，内部将它引进了 touchend 事件
    // 如果被打断，我们将假定是手指离开屏幕，并且执行 touchend 的一系列行为
    
    touchcancel(evt){
        // do something...
    },
    
    
    
    // tap 事件，手指单击屏幕时触发
    
    tap(evt){
        // do something...
    }
    
    
    
    // doubletap 事件，手指双击屏幕时触发
    
    doubletap(){
        // do something...
    },
    
    
    
    // swipe 事件，手指滑动时触发
    
    // evt.direction: 滑动的方向 (up, right, bottom, left)
    
    swipe(evt){
        console.log(evt)
    },
    
    
    
    // pressmove 事件，手指拖拽时触发
    
    // evt.deltaX: X 轴平移距离
    // evt.deltaY: Y 轴平移距离
    
    pressmove(evt){
        console.log(evt)
    },
    
    
    
    // rotate 事件，双指旋转时触发
    
    // evt.angle: 旋转的角度
    
    rotate(evt){
        console.log(evt)
    },
    
    
    
    // pinch 事件，双指缩放时触发
    
    // evt.scale: 缩放的比例
    
    pinch(evt){
        console.log(evt)
    }
    
})
```

### 方法返回

方法返回五个处理器，分别对应 `touchstart`,`touchmove`,`touchend`,`touchcancel`,`tap` 五个事件类型

处理器名称后面的 "MyEvent" 是创建时传递的第一个参数值

```javascript
{
    startMyEvent: Function,
    moveMyEvent: Function,
    endMyEvent: Function,
    cancelMyEvent: Function,
    tapMyEvent: Function
}
```

### 注册到 Page

```javascript
Page({
    data: {
        
    },
    
    //...
    
    // 1. 使用 es6 的扩展运算符直接绑定
    
    ...event,
    
    // 2. 创建 + 注册
    
    ...WxTouch('EventName', {
        //...
    }),
    
    // 3. 自定义绑定，不推荐
    // 使用 call 绑定作用域为当前页面，当然你不使用也是可以的，只是在事件处理器里面不能使用 this.setData 而已
    
    start(evt){
        event.startMyEvent.call(this, evt)
    },
    move(evt){
        event.moveMyEvent.call(this, evt)
    },
    end(evt){
        event.endMyEvent.call(this, evt)
    },
    cancel(evt){
        event.cancelMyEvent.call(this, evt)
    },
    tap(evt){
        event.tapMyEvent.call(this, evt)
    }

})

```

### 评估添加的选项
+ swipe 事件触发时间限制，目前不限制
+ swipe 事件触发距离限制，目前为 10px
+ pinch 事件触发距离限制，目前为不限制
+ doubletap 事件触发时间限制，目前为 500ms
+ 要不要改变 event.type 为当前触发的事件名称，目前不改变
