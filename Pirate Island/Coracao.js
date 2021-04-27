var Coracao = Entity.extend(function(){
    this.currState=undefined; // estado atual;

    this.states={
        CORACAO:'CORACAO'
    }


    this.constructor= function(spriteSheet,x,y){
        this.super();
        this.x=x;
        this.y=y;
        this.spriteSheet=spriteSheet;
        this.currState=this.states.CORACAO;
        this.currentFrame=0;
        this.active=true;
        setup();
    };


    this.update=function(){

        this.currentFrame=(this.currentFrame+1)% (this.frames.length);
        this.width=this.frames[this.currentFrame].width/10;    //atualizar a altura
        this.height=this.frames[this.currentFrame].height/10;  // atualizar os

    };

    this.getSprite=function(){
        return this.frames[this.currentFrame];
    };


    var setup= function(){
        console.log(this.spriteSheet.sprites);
        this.eStates['CORACAO']=this.spriteSheet.getStats('Tropic Island Tileset_Collectable - Heart');
        this.frames=this.eStates[this.currState];

        this.width=this.frames[0].width;  //atualizar a altura
        this.height=this.frames[0].height;  // atualizar os

    }.bind(this);


    this.moeda=function(){
        toogleState(this.states.CORACAO);
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


