var Background = Entity.extend(function(){
	this.currState=undefined; // estado atual;
	 

	this.states={
		background:'background'
	}


	this.constructor= function(spriteSheet,x,y){
		this.super();
		this.x=x;
		this.y=y;
		this.spriteSheet=spriteSheet;
		this.currState=this.states.background;
		this.currentFrame=0;
		this.vx=0;
		this.vy=0;
		setup();
	};

	this.update=function(){
		this.x+=this.vx;
		if((this.x )==Math.round(this.width/3*2)) this.x=0;

	};


	var setup=function(){
		this.eStates['background']=this.spriteSheet.getStats('background');   
		this.frames=this.eStates[this.currState]; 
		this.width=this.frames[0].width;  //atualizar a altura 
		this.height=this.frames[0].height;  // atualizar os 
	}.bind(this);

	this.walk=function(){
		this.vx=1;
	}

	this.idle=function(){
		this.vx=0;
	}

});


