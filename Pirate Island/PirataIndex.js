(function () {

	var canvases = {
		background: {
			canvas: null,
			ctx: null
		}, // canvas, drawingSurface (contex2d)
		entities: {
			canvas: null,
			ctx: null
		},
		components: {
			canvas: null,
			ctx: null
		}
	};

	var entities = [];
	var umPirata;
	var asCercas = [];
	var asPlataformas = [];
	var asMoedas = [];
	var osCoracoes = [];
	var assets = [];
	var osInimigos = [];
	var asBalas = [];

	var repetir=false;
	var currentLevel = 1;
	var camera;
	var teclas = new Array(255);
	var vidaPirata = undefined;
	var moedasApanhadas = undefined;
	var tileBackground;
	var offscreenBackground;
	var moedasUp;

	var animationHandler;

	var loadInfo = undefined;
	var assetsLoadInfo = undefined;
	var assetsLoaded = 0;

	var GameSounds = {
		AMBIENTE: {},
		BACKGROUND: {},
		PIRATA: {}
	};


	var GameStates = {
		RUNNING: 1,
		PAUSED: 2,
		STOPED: 3,
		LOADING: 4,
		LOADED: 5
	}

	var tx = 0;
	var ty = 0;


	var gameState = undefined;

	window.addEventListener("load", init, false);

	function init() {
		canvases.background.canvas = document.querySelector("#canvasBack");
		canvases.background.ctx = canvases.background.canvas.getContext("2d");

		canvases.entities.canvas = document.querySelector("#canvasEnt");
		canvases.entities.ctx = canvases.entities.canvas.getContext("2d");

		canvases.components.canvas = document.querySelector("#canvasComp");
		canvases.components.ctx = canvases.components.canvas.getContext("2d");

		camera = new Camera(0, 0, Math.floor(window.innerWidth), window.innerHeight);

		load("nivel1.json");
	}

	function load(level) {
		assets=[];
		tileBackground=null;
		asPlataformas = [];
		asBalas = [];
		asCercas = [];
		osInimigos = [];
		osCoracoes = [];
		entities = [];
		vidaPirata = undefined
		asMoedas = [];
		camera.x = 0;
		camera.y = 0;
		tx=0;
		canvases.background.ctx.clearRect(0, 0, canvases.background.canvas.width, canvases.background.canvas.height); //limpa o canvas
		canvases.entities.ctx.clearRect(0, 0, canvases.entities.canvas.width, canvases.entities.canvas.height); //limpa o canvas
		umPirata = undefined;


		loadInfo = document.querySelector("#loadInfo");
		assetsLoadInfo = document.querySelector("#assetLoaded");
		gameState = GameStates.LOADING;


		//Cria um novo tiledMap, que est?? no diret??rio colocado na variavel level
		tileBackground = new TiledMap();
		tileBackground.load('./data', level, loaded);
		assets.push(tileBackground);

		//Carregar a SpriteSheet das balas e colocala no array dos assets
		var spBala = new SpriteSheet();
		spBala.load("assets//Ambiente//bullet.png", "assets//Ambiente//bullet.json", loaded);
		loaded("assets//Ambiente//bullet.json");
		assets.push(spBala);

		//Carregar a SpriteSheet das moedas e colocala no array dos assets
		var spMoeda = new SpriteSheet();
		spMoeda.load("assets//Ambiente//Coin//coin.png", "assets//Ambiente//Coin//coin.json", loaded);
		assets.push(spMoeda);

		//Carregar a SpriteSheet do pirata e colocala no array dos assets
		var spPirata = new SpriteSheet();
		spPirata.load("assets//Personagens//pirata1.png", "assets//Personagens//pirata1.json", loaded);
		assets.push(spPirata);

		//Carregar a SpriteSheet dos cora????es e colocala no array dos assets
		var spCoracao = new SpriteSheet();
		spCoracao.load("assets//Ambiente//env.png", "assets//Ambiente//env.json", loaded);
		assets.push(spCoracao);

		//Carregar a SpriteSheet dos Inimigos e colocala no array dos assets
		var spInimigo = new SpriteSheet();
		spInimigo.load("assets//Personagens//inimigo.png", "assets//Personagens//inimigo.json", loaded);
		assets.push(spInimigo);

		//Guardar o som das coins no objeto GameSounds
		gSoundManager.loadAsync("sounds/coin.wav", function (so) {
			GameSounds.AMBIENTE.COIN = so;
			loaded("sounds/coin.wav");
		});
		assets.push(GameSounds.AMBIENTE.COIN);


		//Guardar a m??sica do background no objeto GameSounds
		gSoundManager.loadAsync("sounds/backgroundMusic.wav", function (so) {
			GameSounds.BACKGROUND.BACKGROUND = so;
			loaded("sounds/backgroundMusic.wav");
		});
		assets.push(GameSounds.BACKGROUND.BACKGROUND);

		//Guardar o som de ataque no objeto GameSounds
		gSoundManager.loadAsync("sounds/Attack.flac", function (so) {
			GameSounds.PIRATA.ATTACK = so;
			loaded("sounds/Attack.flac");
		});
		assets.push(GameSounds.PIRATA.ATTACK);

		//Guardar o som de apanhar o cora????o no objeto GameSounds
		gSoundManager.loadAsync("sounds/coracao.wav", function (so) {
			GameSounds.PIRATA.CORACAO = so;
			loaded("sounds/coracao.wav");
		});
		assets.push(GameSounds.PIRATA.CORACAO);

		//Guardar o som do salto do pirata no objeto GameSounds
		gSoundManager.loadAsync("sounds/Jump.wav", function (so) {
			GameSounds.PIRATA.JUMP = so;
			loaded("sounds/Jump.wav");
		});
		assets.push(GameSounds.PIRATA.JUMP);

		//Guardar o som do gameOver no objeto GameSounds
		gSoundManager.loadAsync("sounds/GameOver.mp3", function (so) {
			GameSounds.PIRATA.GAMEOVER = so;
			loaded("sounds/GameOver.mp3");
		});
		assets.push(GameSounds.PIRATA.GAMEOVER);

		//Guardar o som do dano sofrido no objeto GameSounds
		gSoundManager.loadAsync("sounds/hurt.wav", function (so) {
			GameSounds.PIRATA.HURT = so;
			loaded("sounds/hurt.wav");
		});
		assets.push(GameSounds.PIRATA.HURT);

		//Guardar o som da vitoria no objeto GameSounds
		gSoundManager.loadAsync("sounds/vitoria.mp3", function (so) {
			GameSounds.PIRATA.VITORIA = so;
			loaded("sounds/vitoria.mp3");
		});
		assets.push(GameSounds.PIRATA.VITORIA);

	}

	function loaded(assetName) {
		if (assetName == undefined)
		return;

		assetsLoaded++;
		assetsLoadInfo.innerHTML = "Loading: " + assetName;
		assetsLoadInfo.innerHTML+= "<br><br>Instru????es:";
		assetsLoadInfo.innerHTML+= "<br> Para passar de n??vel ?? necess??rio apanhar todas as moedas.";
		assetsLoadInfo.innerHTML+= "<br> Cada tiro sofrido tira 50 de vida e cada cora????o aumenta 50 de vida.";
		assetsLoadInfo.innerHTML+= "<br> S?? d?? para apanhar cora????es se a vida n??o estiver cheia.";
		assetsLoadInfo.innerHTML+= "<br> As cercas atrasam o movimento do pirata.";
		assetsLoadInfo.innerHTML+= "<br><br> ?? recomendado ativar a corrida.";
		assetsLoadInfo.innerHTML+= "<br><br> Space - Atacar (1s em 1s) ; LSHIFT - Toogle corrida.";
		assetsLoadInfo.innerHTML+= "<br> Setas direcionais (Top,Left,Right) - Movimento";


		if (assetsLoaded < assets.length) return;
		assets.splice(0);

		gameState = GameStates.LOADED;
		if (currentLevel == 1 && repetir==false) {
			window.addEventListener("keypress", setupGame, false);
		} else if (currentLevel == 2 ) {
			setupGame();
		} else if(currentLevel == 1 && repetir==true){
			setupGame();
		}
	}

	function setupGame() {

		window.removeEventListener("keypress", setupGame, false);

		if (currentLevel == 1) {//Se n??o estivermos no primeiro nivel, n??o vai aparecer o ecr?? de loading.
			loadInfo.classList.toggle("hidden");
		}

		//Definir as dimens??es dos canvas
		canvases.background.canvas.width = window.innerWidth;			
		canvases.background.canvas.height = window.innerHeight;

		canvases.background.canvas.style.backgroundColor = "#b8dcfe";

		canvases.entities.canvas.width = window.innerWidth;
		canvases.entities.canvas.height = window.innerHeight;
		canvases.components.canvas.width = window.innerWidth;
		canvases.components.canvas.height = window.innerHeight;


		//Cria????o do canvas que n??o ?? mostrado no html, para desenhar o background
		offscreenBackground = document.createElement("canvas");
		offscreenBackground.width = tileBackground.getWidth();
		offscreenBackground.height = tileBackground.getHeight();

		tileBackground.draw(offscreenBackground.getContext("2d"));

		//Iterar pelo level.json e criar as plataformas que l?? est??o apresentadas
		if (tileBackground.currMapData == null)
		return;
		let platObjs = tileBackground.getLayerByName("plataforma").objects;
		for (po of platObjs) {
			let umaPlataforma = new Plataforma(po.x, po.y, po.width, po.height);
			asPlataformas.push(umaPlataforma); //Colocar essas plataformas no array asPlataformas
		}

		//Iterar pelo level.json e criar as cercas que l?? est??o apresentadas
		let platCercas = tileBackground.getLayerByName("Cercas").objects;
		for (ce of platCercas) {
			let umaCerca = new Plataforma(ce.x, ce.y, ce.width, ce.height);
			asCercas.push(umaCerca);//Colocar essas cercas no array platCercas
		}

		//Iterar pelo level.json e criar os inimigos que l?? est??o apresentadas
		let inimigoObjs = tileBackground.getLayerByName("inimigo").objects;
		for (ini of inimigoObjs) {
			let umInimigo = new Inimigo(gSpriteSheets['assets//Personagens//inimigo.png'], ini.x, ini.y + 50);
			umInimigo.virar();//Na cria????o dos inimigos os mesmos t??o virados para direita, logo come??amos por os virar
			osInimigos.push(umInimigo);//Colocar esses inimigos no array osInimigos
		}

		//Iterar pelo level.json e criar as coins que l?? est??o apresentadas
		let coins = tileBackground.getLayerByName("moeda").objects;
		for (coin of coins) {
			let umaCoin = new Moeda(gSpriteSheets['assets//Ambiente//Coin//coin.png'], coin.x, coin.y);
			asMoedas.push(umaCoin);//Colocar essas coins no array asMoedas
		}

		//Iterar pelo level.json e criar os cora????es que l?? est??o apresentadas
		let coracoes = tileBackground.getLayerByName("coracao").objects;
		for (cor of coracoes) {
			let umCoracao = new Coracao(gSpriteSheets['assets//Ambiente//env.png'], cor.x, cor.y);
			osCoracoes.push(umCoracao);//Colocar essas cora????es no array osCoracoes
		}

		//Criar a personagem controlada pelo utilizador, o Pirata
		umPirata = new Pirata(gSpriteSheets['assets//Personagens//pirata1.png'], 20,20);
		entities.push(umPirata);

		//Cria????o da classe MoedasApanhadas, que ir?? traduzir a quantidade moedas apanhas / as que faltam apanhar por nivel
		moedasApanhadas = new MoedasApanhadas(window.innerWidth - 125, 5, 120, 12, canvases.components.ctx, "Moedas ", "black", "black", "yellow", asMoedas.length);
		//Primeiro rendere desta classe
		moedasApanhadas.render(canvases.components.ctx);

		//Cria????o da classe LifeBar, que ir?? traduzir a vida do pirata ao longo do jogo
		vidaPirata = new LifeBar(5, 5, 120, 12, canvases.components.ctx, "Vida-pirata", "black", "black", "red");
		//Primeiro rendere desta classe
		vidaPirata.render(canvases.components.ctx);

		//Mudar o gameState para running
		gameState = GameStates.RUNNING;

		window.addEventListener("keydown", keyDownHandler, false);
		window.addEventListener("keyup", keyUpHandler, false);

		 moedasUp =setInterval(function () {
			for (moeda of asMoedas) { //Colocar o update das moedas fora do update do jogo, para que a sua anima????o seja mais apelativa
				moeda.update();
			}
		}, 1000 / 20);		//Escolha dos fps para a atualiza????o

		//Colocar o som de background a tocar
		GameSounds.BACKGROUND.BACKGROUND.play(true, 0.1);
		
		//Chamar a fun????o de update
		update();



	}

	//Quando a tecla ?? pressionada coloca-a como true no array das teclas
	function keyDownHandler(e) {
		var codTecla = e.keyCode;
		teclas[codTecla] = true;
	}

	//Quando a tecla deixa de ser pressionada coloca-a como false no array das teclas e o pirata na anima????o idle
	function keyUpHandler(e) {
		var codTecla = e.keyCode;
		teclas[codTecla] = false;
		umPirata.idle();
	}

	function update() {

		let collisionB = 0; //Colis??es com a parte inferior das plataformas
		let collisionT = 0;	//Colis??es com a parte superior das plataformas
		let collisionC = 0; //Colis??es com as cercas



		for (let i = 0; i < asPlataformas.length; i++) {
			if (umPirata.blockRectangle(asPlataformas[i]) == 'BOTTOM') { //Por cada plataforma que existe colis??o inferior
				collisionB++;											 //Incrementar o collisionB
			}
			if (umPirata.blockRectangle(asPlataformas[i]) == 'TOP') {	//Por cada plataforma que existe colis??o superior
				collisionT++; 											//Incrementar o collisionB
			}
		}

		for (let i = 0; i < asCercas.length; i++) {		
			if (umPirata.hitTestRectangle(asCercas[i])) {				//Por cada cerca se o exister colis??o	
				collisionC++;											//Incrementar o collisionC
			}
		}

		if (collisionB == 0) {											//Se n??o existirem colis??es com a parte inferior
																		//Das plataformas, consideramos que o pirata n??o
			umPirata.onGround = false;									//est?? no ch??o, logo umPirata.onGround=false

		} else if (collisionB > 0) {									//Caso existam colis??es com a parte inferior das
			umPirata.vy = 0;											//plataformas, o vy do pirata passa a ser 0
			umPirata.onGround = true;									//e o pirata est?? no ch??o, logo umPirata.onGround=true
				if (umPirata.currState === 'JUMP') {					//Se este estiver no ch??o com a anima????o de Jump
					umPirata.idle();									//Coloca-lo na anima????o de Idle
				}
		}

		if (collisionT > 0) {										//Caso exista colis??o com a parte superior das plataformas
			umPirata.vy = umPirata.gravidade;							//A velocidade do pirata vai ser igual a sua gravidade;
		}


		if (collisionC == 0) {											//Caso exista colis??o com uma cerca 
			umPirata.atrito = 1;
		} else {
			umPirata.atrito = 0.6;
			collisionC = 0;
		}

		//Colis??o balas com plataformas
		let balasToRemove = [];											//Instanciar array que mais tarde ira possuir o index das balas a remover
		for (let j = 0; j < asPlataformas.length; j++) {				//Iterar pelas plataformas
			for (let i = 0; i < asBalas.length; i++) {					//Iterar pelas balas
				if (asBalas[i].hitTestRectangle(asPlataformas[j])) {	//Se existir colis??o entre as plataformas e as balas
					balasToRemove.push(i);								//Colocar o index da bala no array balasToRemove
				}
			}
		}

		//Remover balas que colidiram com as plataformas
		for (let i = 0; i < balasToRemove.length; i++) {				//Iterar pelo array balasToRemove e remover as balas com o certo indice
			asBalas = asBalas.slice(0, balasToRemove[i]).concat(asBalas.slice(balasToRemove[i] + 1, asBalas.length));
		}

		//Cair abaixo do mapa
		if (umPirata.y > camera.height + 50 && umPirata.vida != 0) {	//Caso o Y do pirata seja maior do que o da camera, ou seja,
			umPirata.vida = 0;											//O pirata caiu do mapa, logo a sua vida fica a 0 e come??a a anima????o
			umPirata.die();												//da sua morte

			setTimeout(function () {									//?? colocado um setTimeout para o fim do jogo para que seja poss??vel ver
				GameSounds.PIRATA.GAMEOVER.play(false, 0.4);			//A anima????o da morte ?? tamb??m reproduzido o som do GameOver
				stopGame();
			}, 200);

		}


		//Cria????o de balas
		for (ini of osInimigos) { 											//Iterar pelos inimigos
			if (ini.currState != 'DIE') {									//Se os inimigos n??o estiverem mortos
				if (ini.x >= camera.x && ini.x < camera.x + camera.width) { //Se os inimigos estiverem dentro das boundries da camera
					if (new Date() - ini.lastAttack > 1500) {				//Se desde o ultimo ataque n??o tiver passado 1.5s
						//Cria????o de uma bala
						let umaBala = new Bala(gSpriteSheets['assets//Ambiente//bullet.png'], ini.x, ini.y + 25, 50, ini.dir);
						umaBala.vx = 15;									//Dar-lhe uma velocidade 15
						ini.attack();										//Colocar a anima????o do inimigo atacar
						ini.lastAttack = new Date();						//Colocar o ultimo ataque como o tempo no presente
						asBalas.push(umaBala);								//Colocar a bala no array asBalas
					}
				}
			}
		}


		
		//Colis??o com as moedas
		for (let i = 0; i < asMoedas.length; i++) {
			if (umPirata.hitTestPoint(asMoedas[i].x, asMoedas[i].y)) {		//Se um pirata colidir com a moeda
				asMoedas = asMoedas.slice(0, i).concat(asMoedas.slice(i + 1, asMoedas.length)); //Remvoer essa moeda do array asMoedas
				umPirata.moedas++;											//Incrementar as moedas dum pirata
				moedasApanhadas.update(umPirata.moedas);					//Dar update das moedas do pirata no componente que desenha as suas moedas
				moedasApanhadas.render(canvases.components.ctx);			//Desenhar o componente que apresenta as moedas do pirata
				GameSounds.AMBIENTE.COIN.play(false, 0.3);					//Tocar o som de apanhar a moeda

			}
		}

		//Colis??o com os cora????es
		for (let i = 0; i < osCoracoes.length; i++) {								//Iterar pelos cora????es
			if (umPirata.hitTestCircle(osCoracoes[i]) && umPirata.vida < 100) {		//Caso exista colis??o
				osCoracoes = osCoracoes.slice(0, i).concat(osCoracoes.slice(i + 1, osCoracoes.length));//Remover esse cora????o do array
				umPirata.vida += 50;												//Incrementar a vida do pirata por 50
				vidaPirata.update(umPirata.vida);									//Dar update da vida do pirata no componente que desenha a sua vida
				vidaPirata.render(canvases.components.ctx);							//Desenhar o componente que apresenta a vida do pirata
				GameSounds.PIRATA.CORACAO.play(false, 0.5);							//Tocar o som de apanhar o cora????o
			}
		}

		//Colis??o Pirata e inimigo 
		for (let i = 0; i < osInimigos.length; i++) {								//Iterar pelos inimigos
			if (umPirata.hitTestRectangle(osInimigos[i]) &&							//Se existir colis??o e o estado do Pirata for o de
			umPirata.currState == 'ATTACK') {										//Ataque
				osInimigos[i].die();												//Alterar a anima????o do inimigo para Die
				osInimigos[i].y += 7;												//Colocar o inimigo num y maior, para que pareca ficar no ch??o
			}
		}
		//Acelera????o de queda
		if (!umPirata.onGround && !umPirata.isJumping) {							//Se um Pirata estiver no ar e n??o estiver a saltar, ou seja,
			umPirata.vy += umPirata.atritoGravidade;								//se estiver a cair o seu vy ser?? incrementado pela variavel
		}																			//atritoGravidade, para dar um efeito de acelera????o
		//Ligar ou desligar a corrida do pirata
		if (teclas[keyboard.LSHIFT]) {												//Se primir a tecla left-Shift 
			if (umPirata.isRunning) {												//Se o pirata estiver a correr 
				umPirata.isRunning = false;											//A corida fica desligada
			} else {																//Se n??o estiver a correr
				umPirata.isRunning = true;											//A corrida fica ligada
			}
			teclas[keyboard.LSHIFT] = false;										//For??ar desativa????o da tecla 
		}
		//Efetuar ataque do pirata	
		if (teclas[keyboard.SPACE]) {												//Se primir a tecla left-Shift
			if (umPirata.currState !== 'HURT') {									//Se o estado do pirata for diferente de 'HURT'
				if (umPirata.currState !== 'DIE') {									//Se o estado do pirata for diferente de 'DIE'
					if (new Date() - umPirata.lastAttack > 1000) {					//Se o ataque do pirata tiver acontecido ?? mais do que um segundo
						umPirata.attack();											//A anima????o do pirata passa para ataque
						GameSounds.PIRATA.ATTACK.play(false, 1);					//Tocar o som de ataque
						umPirata.lastAttack = new Date();							//Dizer	que o novo ataque do pirata foi efetuado no presente 
					}
				}	
			}
		}

	
		//Movimentar pirata para a esquerda 	
		if (teclas[keyboard.LEFT]) {												//Se primir a tecla esquerda
			if (umPirata.currState !== 'HURT') {									//Se o estado do pirata for diferente de 'HURT'
				if (umPirata.currState !== 'DIE') {									//Se o estado do pirata for diferente de 'DIE'
					if (umPirata.isRunning) {										//Se o pirata estiver a correr
						umPirata.run();												//A anima????o do pirata passa para correr		
						umPirata.vx = 10 * umPirata.atrito;							//Atualiza a velocidade do pirata
					} else {														//Se n??o estiver a correr
						umPirata.walk();											//A anima????o do pirata passa para andar		
						umPirata.vx = 3 * umPirata.atrito;							//Atualiza a velocidade do pirata
					}
					umPirata.x -= umPirata.vx;										//Atualiza a posi????o do pirata
					if (umPirata.dir === 1) {										//Se a dire????o do pirata for 1
						umPirata.flipHorizontal();									//Virar o pirata
					}
					umPirata.dir = -1;												//Colocar posi????o do pirata a -1
				}
			}
		}
		//Movimentar pirata para a direita 				
		if (teclas[keyboard.RIGHT]) {												//Se primir a tecla direita
			if (umPirata.currState !== 'HURT') {									//Se o estado do pirata for diferente de 'HURT'				
				if (umPirata.currState !== 'DIE') { 								//Se o estado do pirata for diferente de 'DIE'
					if (umPirata.isRunning) {										//Se o pirata estiver a correr
						umPirata.run();												//A anima????o do pirata passa para correr
						umPirata.vx = 10 * umPirata.atrito;							//Atualiza a velocidade do pirata
					} else {														//Se n??o estiver a correr
						umPirata.walk();											//A anima????o do pirata passa para andar	
						umPirata.vx = 3 * umPirata.atrito;							//Atualiza a velocidade do pirata
					}
					umPirata.x += umPirata.vx;										//Atualiza a posi????o do pirata
					if (umPirata.dir === -1) {										//Se a dire????o do pirata for -1
						umPirata.flipHorizontal();									//Virar o pirata
					}
					umPirata.dir = 1;												//Colocar posi????o do pirata a -1
				}
			}
		}

		//Efetuar salto do pirata	
		if (teclas[keyboard.UP] && umPirata.onGround) {								//Se primir a tecla cima e estiver no ch??o
			if (umPirata.currState !== 'HURT') {									//Se o estado do pirata for diferente de 'HURT'	
				if (umPirata.currState !== 'DIE') {									//Se o estado do pirata for diferente de 'DIE'
					umPirata.isJumping = true;										//Se o pirata estiver a saltar
					GameSounds.PIRATA.JUMP.play(false, 0.4);						//Tocar o som do salto
					umPirata.vy -= umPirata.jumpForce;								//Alterar a velocidade do salto
					umPirata.onGround = false;										//Alterar a variavel de salto para false
					umPirata.jump();												//A anima????o do pirata passa para saltar

				}
			}
		}


		//Diminuir a velocidade do pirata durante o salto
		if (umPirata.isJumping && !umPirata.onGround) {								//Se o pirata estiver a saltar e n??o estiver no ch??o
			umPirata.vy += umPirata.atritoSalto;									//Altera a velocidade do salto do pirata
			umPirata.jump();														//Alterar o estado do pirata para jump
			if (umPirata.vy >= 0) {													//Se a velocidade de salto for maior do que 0
				umPirata.isJumping = false;											//Alterar o valor da vari??vel para false 
			}
		}

		//Verifica se as balas atingem o pirata
		for (let i = 0; i < asBalas.length; i++) {									//Percorrer o array que cont??m as balas
			if (asBalas[i].hitTestCircle(umPirata)) {								//Se a bala colidir como pirata
				umPirata.vida -= asBalas[i].damageLevel;							//A vida do pirata diminui
				vidaPirata.update(umPirata.vida);									//Atualizar a vida do pirata 
				vidaPirata.render();												//Desenhar a vida do pirata
				asBalas = asBalas.slice(0, i).concat(asBalas.slice(i + 1, asBalas.length)); 	//Remover a bala, que atingiu o pirata, do array	
				if (umPirata.vida <= 0) {											//Se a vida do pirata for  menor do que 0			
					umPirata.die();													//O estado do pirata muda para morto
					GameSounds.PIRATA.GAMEOVER.play(false, 0.4);					//O som do piarata toca
				} else if (umPirata.vida > 0) {										//Se a vida do piarata for maior do que 0
					GameSounds.PIRATA.HURT.play(false, 0.4);						//Tocar o som do pirata ao sofrer dano 
					umPirata.hurt();												//Mudar o estado do pirata para 'HURT'
				}

			}
		}
		
		//Verificar se o pirata colide com o lado esquerdo da camera
		if (umPirata.x < camera.leftInnerBoundary()) {
			if (tx < 0) {
				tx += umPirata.vx;
				camera.x = Math.floor(umPirata.x - (camera.width * 0.25)); 			//Mexer a posi????o da camera de acordo com o movimento do pirata
			} else if (umPirata.x <= 0) {											//Verificar se o pirata saiu do mapa pelo da esquerdo
				umPirata.x = 0;														//Mudar a posi????o do pirata para 0
			}
		}
		//Verificar se o pirata colide com o lado direita da camera
		if (umPirata.x + umPirata.width > camera.rightInnerBoundary()) {			
			if (tx > -6784) {
				tx -= umPirata.vx;													
				camera.x = Math.floor(umPirata.x + umPirata.width - (camera.width * 0.75));	//Mexer a posi????o da camera de acordo com o movimento do pirata
			}

		}

		//Apagar as balas que estejam fora da camera
		for (let i = 0; i < asBalas.length; i++) {
			if (asBalas[i].x > camera.x + camera.width || asBalas[i].x < camera.x) {
				asBalas = asBalas.slice(0, i).concat(asBalas.slice(i + 1, asBalas.length));
			}
		}
		//Apagar inimigos do mapa que estejam fora da camera e que o estado seja morto
		for (let i = 0; i < osInimigos.length; i++) {
			if ((osInimigos[i].x > camera.x + camera.width || osInimigos[i].x < camera.x) && osInimigos[i].currState == "DIE") {
				osInimigos = osInimigos.slice(0, i).concat(osInimigos.slice(i + 1, osInimigos.length));
			}
		}

		//Dar update das balas 
		for (bala of asBalas) {
			bala.update();
		}

		//Dar update das entidades 
		for (entity of entities) {
			entity.update();
		}

		//Altera????o da posi????o dos inimigos consoante a posi????o do pirata
		for (entityI of osInimigos) {
			if (entityI.currState != 'DIE') {				
				if (umPirata.x > entityI.x && entityI.dir == -1) {	//Se o pirata estiver a direita do inimigo ele vira-se para a direita
					entityI.virar();								//Alterar dire????o do inimigo
				}
				if (umPirata.x < entityI.x && entityI.dir == 1) {	//Se o pirata estiver a esquerda do inimigo ele vira-se para a esquerda
					entityI.virar();								//Alterar dire????o do inimigo
				}
			}
			entityI.update();										//Dar update dos inimigos
		}

		//Chamar fun????o update 
		animationHandler = requestAnimationFrame(update);
		
		//Efetuar morte do pirata
		if (umPirata.currState == 'DIE' || umPirata.vida == 0) {
			setTimeout(stopGame, 550);
			cancelAnimationFrame(animationHandler);

		}
		//Desenhar os elementos no canvas	
		render();
		
		//Verificar se o pirata conoseguiu vencer
		if (umPirata.x > camera.width + camera.x && currentLevel == 1 && asMoedas.length == 0) {		//Se a posi????o do pirata for a pretendida e se ele tiver apanhado as moedas todas
			GameSounds.PIRATA.VITORIA.play(false, 0.5);													//Tocar som de vit??ria
			cancelAnimationFrame(animationHandler);														//N??o chamar mais a fun????o update
			currentLevel = 2;																			//Aterar o nivel
			GameSounds.BACKGROUND.BACKGROUND.stop();													//Desligar a m??sica de fundo
			clearInterval(moedasUp);																	//Limpar interval que d?? update ??s moedas para evitar repeti????o de moedas
			load("nivel2.json");																		//Carregar o nivel 2	
		}

		if (umPirata.x > camera.width + camera.x && currentLevel == 2 && asMoedas.length == 0) {		//Se a posi????o do pirata for a pretendida e se ele tiver apanhado as moedas todas
			GameSounds.PIRATA.VITORIA.play(false, 0.5);													//Tocar som de vit??ria
			cancelAnimationFrame(animationHandler);														//N??o chamar mais a fun????o update
			GameSounds.BACKGROUND.BACKGROUND.stop();													//Desligar a m??sica de fundo
			gameState = GameStates.STOPED;
			loadInfo.classList.toggle("hidden");
			document.getElementById("loader").parentNode.removeChild(document.getElementById("loader"));
			assetsLoadInfo.innerHTML= "Parab??ns ganhaste.";
		}
	
	}
	

	//Reiniciar o jogo
	function stopGame() {
		cancelAnimationFrame(animationHandler);
		GameSounds.BACKGROUND.BACKGROUND.stop();
		clearInterval(moedasUp);																		//Limpar interval que d?? update ??s moedas para evitar repeti????o de moedas
		repetir=true;			
		if	(currentLevel==2){
			currentLevel=1;
		}																								//Permitir reiniciar o nivel ao morrer
		load("nivel1.json");																			//Carregar novamente o nivel 1 
	}

	//Desenhar elementos do jogo no seu canvas correspondente	
	function render() {
		canvases.background.ctx.clearRect(0, 0, canvases.background.canvas.width, canvases.background.canvas.height); //limpa o canvas
		canvases.entities.ctx.clearRect(0, 0, canvases.entities.canvas.width, canvases.entities.canvas.height); //limpa o canvas
		canvases.background.ctx.save();

		canvases.entities.ctx.save();

		canvases.background.ctx.translate(-camera.x, -camera.y);

		canvases.entities.ctx.translate(-camera.x, -camera.y);

		canvases.background.ctx.drawImage(offscreenBackground,
			0, 0, offscreenBackground.width, offscreenBackground.height,
			0, 0, offscreenBackground.width, offscreenBackground.height
		);

		/*
		for (let p of asPlataformas) {
			p.drawColisionBoundaries(canvases.entities.ctx, true, false, "red", "blue");
		}*/

		//Desenhar moedas
		for (let c of asMoedas) {
			c.render(canvases.entities.ctx);
			//c.drawColisionBoundaries(canvases.entities.ctx, false, true, "red", "blue");
		}
		//Desenhar coracoes
		for (let c of osCoracoes) {
			c.render(canvases.entities.ctx);
			//c.drawColisionBoundaries(canvases.entities.ctx, false, true, "red", "blue");
		}
		//Desenhar inimigos
		for (let ini of osInimigos) {
			ini.render(canvases.entities.ctx);
		//	ini.drawColisionBoundaries(canvases.entities.ctx, true, "red", "red");
		}
		//Desenhar balas
		for (let bala of asBalas) {
			bala.render(canvases.entities.ctx);
		//	bala.drawColisionBoundaries(canvases.entities.ctx, true, "red", "red");
		}
		//Desenhar entidades
		for (let entity of entities) {
			entity.render(canvases.entities.ctx);
			//entity.drawColisionBoundaries(canvases.entities.ctx, true, "red", "red");
		}

		//camera.drawFrame(canvases.entities.ctx, true);
		canvases.entities.ctx.restore();
		canvases.background.ctx.restore();

	}

})();