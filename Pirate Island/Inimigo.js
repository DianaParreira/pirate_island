var Inimigo = Entity.extend(function(){
	this.currState=undefined; // estado atual;
	var vida=100;
	var lastAttack;


	this.states={
			WALK:'WALK',
			ATTACK:'ATTACK',
			IDLE:'IDLE',
			DIE:'DIE'

	}



	this.constructor= function(spriteSheet,x,y){
		this.super();
		this.x=x;
		this.y=y;
		this.spriteSheet=spriteSheet;
		this.currState=this.states.IDLE;
		this.currentFrame=0;
		this.active=true;
		this.lastAttack=new Date();
		this.dir=1;

		setup();
	};


	this.update=function(){

		if(this.currState!=this.states.DIE){
			this.currentFrame=(this.currentFrame+1)% (this.frames.length);
			
		}
		this.width=this.frames[this.currentFrame].width/10;    //atualizar a altura
		this.height=this.frames[this.currentFrame].height/10;  // atualizar os

		if(this.currState===this.states.ATTACK && this.currentFrame===this.frames.length-1){
			this.idle();
		}
		if(this.currState==this.states.DIE && this.currentFrame!=this.frames.length-1 ){
			this.currentFrame=(this.currentFrame+1)% (this.frames.length);
			
			
		}
		

	};
	this.virar=function(){

		if (this.dir === 1) {
			this.flipHorizontal();
			this.dir = -1;
		}else {
			this.flipHorizontal();
			this.dir = 1;
		}


	}

	this.getSprite=function(){
		return this.frames[this.currentFrame];
	};


	var setup= function(){
		this.eStates['WALK']=this.spriteSheet.getStats('2_entity_000_WALK');
		this.eStates['ATTACK']=this.spriteSheet.getStats('2_entity_000_ATTACK');
		this.eStates['IDLE']=this.spriteSheet.getStats('2_entity_000_IDLE');
		this.eStates['DIE']=this.spriteSheet.getStats('2_entity_000_DIE');

		this.frames=this.eStates[this.currState]; 
	

		this.width=this.frames[0].width;  //atualizar a altura
		this.height=this.frames[0].height;  // atualizar os

		// atualizar o array de frames atual

	}.bind(this);


	this.walk=function(){
		toogleState(this.states.WALK);
	}

	this.idle=function(){
		toogleState(this.states.IDLE);
	}

	this.run=function(){
		toogleState(this.states.RUN);
	}
	
	this.attack=function(){
		toogleState(this.states.ATTACK);
	}

	this.die=function(){
		toogleState(this.states.DIE);
	}

	var toogleState=function (theState){
		if(this.killed) return;
		if(this.currState!=theState){
			this.currState=theState;
			this.frames=this.eStates[theState];
			this.currentFrame=0;
		} 
	}.bind(this);

	

});


