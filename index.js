//index.js

import Swipe from "./swipe.js"
import Rotate from "./rotate.js"
import Scale from "./scale.js"

let _this, data = {},

    swipe = new Swipe({
        start(evt){
            data.left = _this.data.left;
            data.top = _this.data.top;
        },
        move(evt){
            _this.setData({
                left: evt.distance.x + data.left,
                top: evt.distance.y + data.top
            })
        }
    }),

    rotate = new Rotate({
        start(evt){
            data.rotate = _this.data.rotate;
        },
        rotate(evt){
            _this.setData({
                rotate: evt.angle + data.rotate
            })
        }
    }),

    scale = new Scale({
        start(evt){
            data.scale = _this.data.scale;
        },
        scale(evt){
            _this.setData({
                scale: evt.scale * data.scale
            })
        }
    })

Page({
    data: {
        left: 0,
        top: 0,
        rotate: 0,
        scale: 1
    },

    onLoad(){
        _this = this;
    },

    start(evt){
        // swipe.start(evt);
        rotate.start(evt);
        scale.start(evt);
    },

    move(evt){
        // swipe.move(evt);
        rotate.move(evt);
        scale.move(evt);
    },

    end(evt){
        // swipe.end(evt);
        rotate.end(evt);
        scale.end(evt);
    },

    cancel(evt){
        // swipe.cancel(evt);
        rotate.cancel(evt);
        scale.cancel(evt);
    }
})
