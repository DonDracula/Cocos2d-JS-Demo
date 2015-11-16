var background;
var gameLayer;
var scrollSpeed = 1;
//add ship para
var ship;
var gameGravity = -0.05;
//add ship control
var gameThrust = 0.1;
//add emitter
var emitter;


var gameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        gameLayer = new game();
        gameLayer.init();
        this.addChild(gameLayer);
    }
});

var game = cc.Layer.extend({
    init:function () {
        this._super();
        //add listener
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: function(event){
                ship.engineOn = true;
            },
            onMouseUp: function(event){
                ship.engineOn = false;
            }
        },this)
        background = new ScrollingBG();
        this.addChild(background);
        this.scheduleUpdate();
        this.schedule(this.addAsteroid,0.5);
        //init ship
        ship = new Ship();
        this.addChild(ship);
        emitter = cc.ParticleSun.create();
        this.addChild(emitter,1);
        var myTexture = cc.textureCache.addImage(res.particle_png);
        emitter.setTexture(myTexture);
        emitter.setStartSize(2);
        emitter.setEndSize(4);
    },
    update:function(dt){
        background.scroll();
        ship.updateY();
    },
    addAsteroid:function(event){
        var asteroid = new Asteroid();
        this.addChild(asteroid,1);
    },
    removeAsteroid:function(asteroid){
        this.removeChild(asteroid);
    }
});

var ScrollingBG = cc.Sprite.extend({
    ctor:function() {
        this._super();
        this.initWithFile(res.background_jpg);
    },
    onEnter:function() {
        this.setPosition(512,160);
    },
    scroll:function(){
        this.setPosition(this.getPosition().x-scrollSpeed,this.getPosition().y);
        if(this.getPosition().x<0){
            this.setPosition(this.getPosition().x+512,this.getPosition().y);
        }
    }
});

//ship class
var Ship = cc.Sprite.extend({
    ctor:function() {
        this._super();
        this.initWithFile(res.ship_png);
        this.ySpeed = 0;
        //init engine state
        this.engineOn = false;
        this.invulnerability = 0;
    },
    onEnter:function() {
        this.setPosition(60,160);
    },
    updateY:function() {
        if(this.engineOn){
            this.ySpeed += gameThrust;
            emitter.setPosition(this.getPosition().x- 25,this.getPosition().y);
        }
        else{
            emitter.setPosition(this.getPosition().x- 250,this.getPosition().y);
        }
        if(this.invulnerability>0){
            this.invulnerability ;
            this.setOpacity(255- this.getOpacity());
        }
        this.setPosition(this.getPosition().x,this.getPosition().y+this.ySpeed);
        this.ySpeed += gameGravity;
        if(this.getPosition().y<0 || this.getPosition().y>320){
            restartGame();
        }
    }
});
//asteroid class
var Asteroid = cc.Sprite.extend({
    ctor:function() {
        this._super();
        this.initWithFile(res.asteroid_png);
    },
    onEnter:function() {
        this._super();
        this.setPosition(600,Math.random()*320);
        var moveAction= cc.MoveTo.create(3, new cc.Point(-100,Math.random()*320));
        this.runAction(moveAction);
        this.scheduleUpdate();
    },
    update:function(dt){
        var shipBoundingBox = ship.getBoundingBox();
        var asteroidBoundingBox = this.getBoundingBox();
        if(cc.rectIntersectsRect(shipBoundingBox,asteroidBoundingBox)&&ship.invulnerability==0){
            gameLayer.removeAsteroid(this);
            restartGame();
        }
        if(this.getPosition().x<-50){
            gameLayer.removeAsteroid(this)
        }
    }
});
//restart method
function restartGame(){
    ship.ySpeed = 0;
    ship.setPosition(ship.getPosition().x,160);
    ship.invulnerability=100;
}
