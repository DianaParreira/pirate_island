
(function(){ //não apagar
    var canvas;
    var drawingSurface;
    var entities=[];
	var piratas = [];
	var teclas= new Array(255);
	var gameWorld=undefined;
	var camera=undefined;

	var umPirata=undefined;
	var background=undefined;
	var assetsLoaded=0;

	window.addEventListener("load",init, false);

	function init(){
		canvas = document.querySelector("canvas");
        drawingSurface = canvas.getContext("2d");
        canvas.width=1280;
        canvas.height=720; // Vai buscar a resolução do cliente e aplica ao canvas

		// 1 -  criar o gameWorld
		gameWorld= new GameWorld(0,0,canvas.width,canvas.height);

		// 2 - criar e configurar a c�mara
		camera= new Camera(0, gameWorld.height/2,Math.floor(gameWorld.width),gameWorld.height/2);

		// 3 - carregar a spriteSheet do tanque
		var sp= new SpriteSheet(); 
		sp.load("assets//Personagens//pirata1.png", "assets//Personagens//pirata1.json",loaded);
		// 3 - carregar a spriteSheet do background
		var spBackground= new SpriteSheet(); 
		spBackground.load("assets//Mapa//Background//background.png", "assets//Mapa//Background//background.json",loaded);

	}

	function startGame(){

		// 1 - criar a entidade tanque
		umPirata= new Pirata(gSpriteSheets['assets//Personagens//pirata1.png'], canvas.width/2, canvas.height-80);

		// 2 - criar a entidade background 
		background= new Background(gSpriteSheets['assets//Mapa//Background//background.png'],-5000, 0);

		// 3 - configurar o background
		background.x=Math.floor((background.width/3)*-2);

		// 4 colocar as entidades no array de entidades
		entities.push(background); 
		entities.push(umPirata); 


		//Update the sprite as soon as the image has been loaded
		setInterval(update,1000/50);
		//update();

		window.addEventListener("keydown",keyDownHandler,false);
		window.addEventListener("keyup",keyUpHandler,false);
	}

	function loaded(){
		// if(Object.keys(gSpriteSheets).length<2) return;		
		assetsLoaded++;
		if(assetsLoaded==2)startGame();
		console.log("loaded:"+assetsLoaded);
	}

	function keyDownHandler(e){
		var codTecla=e.keyCode;
		teclas[codTecla]=true;  
	}

	function keyUpHandler(e){
		var codTecla=e.keyCode;
		teclas[codTecla]=false;  

		switch(codTecla){
		case  keyboard.KPAD_PLUS  :  umPirata.vx =umPirata.vy+=3; break;
        case  keyboard.KPAD_MINUS :  umPirata.vx =umPirata.vy-=3; break;
		}
		umPirata.idle();
		background.idle();

	}


	function update(){
		//Create the animation loop


		if(teclas[keyboard.LEFT]) 	{
			if (umPirata.isRunning){
				umPirata.run();
				umPirata.vx=50;
			}else {
				umPirata.walk();
				umPirata.vx=3;

			}
			umPirata.x-=umPirata.vx;

			if (umPirata.dir===1){
				umPirata.flipHorizontal();
			}
			umPirata.dir=-1;


		}
		if(teclas[keyboard.RIGHT]) 	{
			if (umPirata.isRunning){
				umPirata.run();
				umPirata.vx=50;

			}else {
				umPirata.walk();
				umPirata.vx=3;

			}
			umPirata.x+=umPirata.vx;

			if (umPirata.dir===-1){
				umPirata.flipHorizontal();
			}
			umPirata.dir=1;


		}
		if(teclas[keyboard.UP]) {

			umPirata.y-=umPirata.vy;
			umPirata.jump();

		}
		if(teclas[keyboard.DOWN]) {
			umPirata.y += umPirata.vy;


		}
		if(teclas[keyboard.SPACE]) {
			umPirata.attack();
                //som attack
		}

		if(teclas[keyboard.LSHIFT]) {
			teclas[keyboard.LSHIFT]=false;

			umPirata.isRunning = !umPirata.isRunning;

			//som attack
		}


		for (var i=0; i< entities.length;i++){
			entities[i].update();
		}

		// 1 - calcular 1/3 do tamanho do background
		var bk3= Math.floor(background.width/3);

		// 2 -  reposicionar o background consoante a sua posi��o atual e a sua dire��o
		if(umPirata.dir===-1){ 
			if (background.x >=0) background.x = Math.floor((background.width/3)*-2);

		}else if(umPirata.dir===1){
			if (background.x <=bk3*(-2)) background.x = 0; 
		}

		// 3 - animar o background se o tanque atingir os limites interiores da c�mara
		//     a uma velocidade de 1/3 da velocidade do tanque	
		if(umPirata.x < camera.leftInnerBoundary()) {
			umPirata.x = camera.leftInnerBoundary();
			background.vx=umPirata.vx/3;
		}

		if(umPirata.x+umPirata.width > camera.rightInnerBoundary()) {
			umPirata.x = camera.rightInnerBoundary()-umPirata.width ;
			background.vx=umPirata.vx/3*-1;
		}

	//	else background.idle();

		/*  if(umTanque.x + umTanque.width > camera.rightInnerBoundary())
    	umTanque.x = camera.leftInnerBoundary()+umTanque.width;
	 else background.parar();*/



		//window.requestAnimationFrame(update);

		render();
	}

	function render(){ 
		//Clear the previous animation frame

//		demulF++;
		//if(demulF%2!=0)return;   
		drawingSurface.clearRect(0, 0, canvas.width, canvas.height);

		for(var i=0; i<entities.length; i++){ 

            var entity=entities[i];
           // console.log(entity.x);
			entity.render(drawingSurface,false)
        }
		umPirata.drawColisionBoundaries(drawingSurface,true,false,"yellow","blue");
		camera.drawFrame(drawingSurface, true);
	}
	
	
})();// não apagar
