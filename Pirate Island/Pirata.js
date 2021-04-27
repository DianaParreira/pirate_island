var Pirata = Entity.extend(function(){
	this.currState=undefined; // estado atual;
	var moedas=0;
	var vida=100;
	var onGround=false;

	this.states={
			WALK:'WALK',
			ATTACK:'ATTACK',
			IDLE:'IDLE',
			HURT:'HURT',
			DIE:'DIE',
			JUMP:'JUMP',
			RUN:'RUN',

	}



	this.constructor= function(spriteSheet,x,y){
		this.super();
		this.x=x;
		this.y=y;
		this.spriteSheet=spriteSheet;
		this.currState=this.states.IDLE;
		this.currentFrame=0;
		this.active=true;
		this.isRunning=false;
		this.lastAttack=new Date();
		this.dir=1;
		this.vida=100;
		this.moedas=0;
		setup();
	};


	this.update=function(){

		if(this.currState==this.states.HURT&& this.currentFrame==this.frames.length-1){
			this.idle();
		}
		
		if(this.currState==this.states.DIE&& this.currentFrame==this.frames.length-1){
		this.active=false;
			
		}
		if (this.currState===this.states.JUMP && this.currentFrame===this.frames.length-1){
			this.jump();
		}

		this.currentFrame=(this.currentFrame+1)% (this.frames.length);
		this.width=this.frames[this.currentFrame].width/10;    //atualizar a altura
		this.height=this.frames[this.currentFrame].height/10;  // atualizar os

		if(this.currState===this.states.ATTACK && this.currentFrame===this.frames.length-1){
			this.idle();
		}
		

		this.y+=this.vy;

	};

	this.getSprite=function(){
		return this.frames[this.currentFrame];
	};


	var setup= function(){
		console.log(this.spriteSheet.sprites);
		this.eStates['WALK']=this.spriteSheet.getStats('1_entity_000_WALK');
		this.eStates['ATTACK']=this.spriteSheet.getStats('1_entity_000_ATTACK');
		this.eStates['IDLE']=this.spriteSheet.getStats('1_entity_000_IDLE');
		this.eStates['HURT']=this.spriteSheet.getStats('1_entity_000_HURT');
		this.eStates['DIE']=this.spriteSheet.getStats('1_entity_000_DIE');
		this.eStates['JUMP']=this.spriteSheet.getStats('1_entity_000_JUMP');
		this.eStates['RUN']=this.spriteSheet.getStats('1_entity_000_RUN');
		this.frames=this.eStates[this.currState]; 
	

		this.width=this.frames[0].width;  //atualizar a altura
		this.height=this.frames[0].height;  // atualizar os
		this.x=40;
		this.y=200;
		// atualizar o array de frames atual

	}.bind(this);



	this.walk=function(){
		toogleState(this.states.WALK);
	}
	this.hurt=function(){
		toogleState(this.states.HURT);
	}

	this.idle=function(){
		toogleState(this.states.IDLE);
	}

	this.attack=function(){
		toogleState(this.states.ATTACK);
		this.lastAttack=new Date();
	}

	this.die=function(){
		toogleState(this.states.DIE);
	}

	this.run=function(){
		toogleState(this.states.RUN);
	}

	this.jump=function(){
		toogleState(this.states.JUMP);


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


