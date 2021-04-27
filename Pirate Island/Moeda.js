var Moeda = Entity.extend(function(){
    this.currState=undefined; // estado atual;

    this.states={
       MOEDA:'MOEDA'
    }


    this.constructor= function(spriteSheet,x,y){
        this.super();
        this.x=x;
        this.y=y;
        this.spriteSheet=spriteSheet;
        this.currState=this.states.MOEDA;
        this.currentFrame=0;
        this.active=true;
        setup();
    };


    this.update=function(){

        this.currentFrame=(this.currentFrame+1)% (this.frames.length);
        this.width=33.3333;    //atualizar a altura
        this.height=31.333333;  // atualizar os

    };

    this.getSprite=function(){
        return this.frames[this.currentFrame];
    };


    var setup= function(){
        this.eStates['MOEDA']=this.spriteSheet.getStats('Tropic Island Tileset_Collectable - Gold Coin_');
        this.frames=this.eStates[this.currState];

        this.width=33.3333;  //atualizar a altura
        this.height=31.333333;  // atualizar os

    }.bind(this);


    this.moeda=function(){
        toogleState(this.states.MOEDA);
    }

    var toogleState=function (theState){
        if(!this.active) return;
        if(this.currState!=theState){
            this.currState=theState;
            this.frames=this.eStates[theState];
            this.currentFrame=0;
        }
    }.bind(this);



});


