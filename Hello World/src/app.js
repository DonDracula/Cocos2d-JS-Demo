var gameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var gameLayer = new game();
        gameLayer.init();
        this.addChild(gameLayer);
    }
});

var backgroundLayer;
var game = cc.Layer.extend({
    init:function() {
        this._super();
        backgroundLayer = cc.LayerColor.create(new cc.Color(40, 40, 40, 255), 640, 480);
        this.addChild(backgroundLayer);
        var target = cc.Sprite.create(res.target_png);
        var cat = cc.Sprite.create(res.cat_jpg);

        backgroundLayer.addChild(target, 1);
        backgroundLayer.addChild(cat,0);
        target.setPosition(320, 240);
        cat.setPosition(320,240);

        setTimeout(function () {
            backgroundLayer.removeChild(target);
        }, 3000);
    }
});