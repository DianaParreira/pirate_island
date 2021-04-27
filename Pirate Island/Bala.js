var Bala = Entity.extend(function () {
    this.damageLevel = 0;
    this.dir =1;

    this.states = {
        ATIVO: 'ATIVO'
    };

    this.constructor = function (spriteSheet, x, y, damageLevel,dir) {
        this.super();
        this.spriteSheet = spriteSheet; // spriteSheet
        this.x = x; //posX inicial
        this.y = y; // posY inicial
        this.currentState = this.states.ATIVO; //estado inicial
        this.currentFrame = 0; //frame inicial
        this.dir=dir;
        
        this.vy = 0;
        this.damageLevel = damageLevel;

        setup();

    };

    this.update = function () {
      
        if (this.dir==1){
            this.vx = Math.abs(this.vx);
        }else if (this.dir==-1){
            this.vx = -Math.abs(this.vx);
        }
        

        this.x+=this.vx;

   

        // passar � proxima frame e voltar a zero se chegar ao fim do array; M�todo mais eficiente pois utiliza s� opera��es
        // aritm�ticas e n�o recorre a condi��es
        this.currentFrame = (++this.currentFrame) % this.frames.length;

        this.width = Math.floor(this.frames[this.currentFrame].width * this.scaleFactor);
        this.height = Math.floor(this.frames[this.currentFrame].height * this.scaleFactor);

        

    };

    this.getSprite = function () {
        return this.frames[this.currentFrame];

    };

    var setup = function () {
        this.eStates[this.states.ATIVO] = this.spriteSheet.getStats('bullet');

        this.frames = this.eStates[this.currentState];
        this.width = this.frames[0].width;
        this.height = this.frames[0].height;
    }
    .bind(this);

  

    var toogleState = function (theState) {
        if (this.currState != theState) {
            this.currState = theState;
            this.frames = this.eStates[theState];
            this.currentFrame = 0;
        }
    }
    .bind(this);

});
