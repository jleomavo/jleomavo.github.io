let timeLeft = 1000;
let score = 0;
let compScore = 0;
let isPaused = false;
let userTurns = 0;

// Stores the current "key" location of the USER AND COMPUTER
let userGuess;
let compGuess;
let userMove;
let compMove;
let currentComputerKey;
let currentUserKey;
let nextLocationKey;
let currentXCoord;
let currentYCoord;


const defaultLocation = {
	key: 'a',
	x: 245,
	y: 480,
}

const compDefaultLocation = {
	key: 'k',
	x: 245,
	y: 152,
}

let userLocation = defaultLocation;
let compLocation = compDefaultLocation;


let gameState = {    
  snow: [],
  fontStyle: {
		font: '45px Impact',
		color: '#3D548F',
		//backgroundColor: '#ffffff',						
	  },
  currentTurn: '',
  }
  
  



class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });

      this.ComputerLocations = [{
			key: 'k',
			x: 220,
			y: 130,
		},
		{
			key: 'j',
			x: 85,
			y: 130,
		},
		{
			key: 'l',
			x: 345,
			y: 130,
		}];

		this.userLocations = [{
			
				key: 's',
				x: 220,
				y: 400,
			},
			{
				key: 'a',
				x: 85,
				y: 400,
			},
			{
				key: 'd',
				x: 365,
				y: 400,
			//Code to acess center this.userLocations[0].x
		}];


    
  }

  preload() {
    this.load.image('bg', 'assets/snowybackground.png');

    this.load.image('green_bar_bg', 'assets/User interfaces/Green_Bar_Bg.png');
    this.load.image('green_bar', 'assets/User interfaces/Green_Bar.png');
    this.load.image('red_bar_bg', 'assets/User interfaces/red_Bar_Bg.png');
    this.load.image('red_bar', 'assets/User interfaces/red_Bar.png');

    this.load.image('scoreBox', 'assets/UserScore.png');
    this.load.image('nkScoreBox', 'assets/NKScore.png');

    this.load.image('userMoveNotification', 'assets/UserMoveNoti.png');
    this.load.image('userGuessNotification', 'assets/UserGuessNoti.png');

    

    this.load.image('platform', 'https://content.codecademy.com/courses/learn-phaser/physics/platform.png');
  

    this.load.spritesheet('mole',
    'https://codecademy-content.s3.amazonaws.com/courses/learn-phaser/mole-unearther/mole-sprite.png',
    { frameWidth: 198, frameHeight: 250 });

    this.load.spritesheet('predator',
			'assets/PredatorIdleSpriteSheet.png',
			{ frameWidth: 230, frameHeight: 450 });

    this.load.spritesheet('predatorFire',
			'assets/PredatorFireSpriteSheet.png',
			{ frameWidth: 500, frameHeight: 500 });

    this.load.spritesheet('nightking',
			'.assets/NightKingIdleSpriteSheet.png',
			{ frameWidth: 1000, frameHeight: 900 }); 

    this.load.spritesheet('nightKingSlashing',
			'assets/NightKingSlashingSpritesheet.png',
			{ frameWidth: 1000, frameHeight: 900 }); 
    

    this.load.atlas('knight', 'assets/KnightIdleSpriteSheet.png', 'assets/KnightSprites.json');
    
    
  }

  create() {
    

    //CREATE BACKGROUND
    this.initializeBackground();

    //CREATE SNOW CODE
    this.initializeSnow();

    //CREATES USER SCORE BOX, COMPUTER SCORE BOX AND USER TURNS
    this.initializeScoreText();

    //CREATES HEALTH BARS FOR USER AND COMPUTER
    //this.initializeHealthBars();
    
    //CREATE ANIMATIONS
    this.initializeAnimations();

    //CREATES USER KEY HANDLERS AND DISPLAYS USER POSITIONS
    this.initializeUserInput();

    //CREATES COMPUTER KEY HANDLERS AND DISPLAYS USER POSITIONS
    this.initializeComputerInput();
        
    //Creates USER CHARACTER
    this.initializeUserCharacter();
    
    //Creates Computer Character
    this.initializeComputerCharacter();

    //STARTS USER TURN
    this.initializeUserTurn();    

    //this.initializePlatforms();
  }

  update() {
    //ANIMATES SNOW 
    this.animateSnow();
    const playGame = () => {		
      compGuess = this.getComputerGuess();

      
      
      //CHECKS IF COMPUTER GUESSED CORRECTLY UPDATES SCORE IF USER GUESSED CORRECTLY
      if (userMove === compGuess){
        compScore += 100;
        score -= 50;
        this.updateCompScoreText();
        this.updateScoreText(); 
      } else {
        gameState.compGuessedCorrectly = false;
      }      
      
      if (userGuess === compMove) {					
				score += 100;
        compScore -= 50;									
				this.updateCompScoreText();
        this.updateScoreText();
			} else {				
				//this.relocateMole();
			}
      /*
      userTurns += 1;
      this.updateUserTurns();  
      */    
    };

    const onCompPosition = (key) => {
      
      userGuess = key;
			nextLocationKey = this.getRandomBurrow();
			compMove = nextLocationKey.key;					
			
			// check if user has successfully hit the mole's current burrow, moves mole then displays user guessed correctly 
			
			playGame();
      this.userAttack();
      this.computerAttack();

			//Relocates opponent to new position
      this.updateOpponent();      
      gameState.opponent.setPosition(nextLocationKey.x, nextLocationKey.y);
     
      
      //ENDS THE TURN AND STARTS OVER    
      gameState.currentTurn = 'user';
      this.updateMoveBox();
		};

    const onUserMove = (key) => {
      gameState.currentTurn = 'computer';
      this.updateMoveBox();
      userMove = key;
      this.updateUser();
      if (key === 'd') {     
        currentXCoord = this.userLocations[2].x;
        currentYCoord = this.userLocations[2].y;
        gameState.predator.setPosition(this.userLocations[2].x, this.userLocations[2].y);        
      } else if (key === 'a') {
        currentXCoord = this.userLocations[1].x;
        currentYCoord = this.userLocations[1].y;
        gameState.predator.setPosition(this.userLocations[1].x, this.userLocations[1].y);
      } else {
        currentXCoord = this.userLocations[0].x;
        currentYCoord = this.userLocations[0].y;
        gameState.predator.setPosition(this.userLocations[0].x, this.userLocations[0].y);
      }
			
      
		};

    if (isPaused === false && gameState.currentTurn === 'user') {
			if (Phaser.Input.Keyboard.JustDown(gameState.aKey)) {
				// USER ACTIVITY: Call the key handler
				onUserMove('a');
			} else if (Phaser.Input.Keyboard.JustDown(gameState.sKey)) {
				// USER ACTIVITY: Call the key handler
				onUserMove('s');
			} else if (Phaser.Input.Keyboard.JustDown(gameState.dKey)) {
				// USER ACTIVITY: Call the key handler
				onUserMove('d');
			}
		} else if  (isPaused === false && gameState.currentTurn === 'computer') {
      if (Phaser.Input.Keyboard.JustDown(gameState.jKey)) {
				// USER ACTIVITY: Call the key handler
				onCompPosition('j');
			} else if (Phaser.Input.Keyboard.JustDown(gameState.kKey)) {
				// USER ACTIVITY: Call the key handler
				onCompPosition('k');
			} else if (Phaser.Input.Keyboard.JustDown(gameState.lKey)) {
				// USER ACTIVITY: Call the key handler
				onCompPosition('l');
    }       
    
  }

		const togglePause = () => {
			if (isPaused === true) {
				isPaused = false;
				this.removePauseScreen();
			} else {
				isPaused = true;
				this.displayPauseScreen();
			}
		};		
    
    if (score >= 300 || compScore >= 300) {
      this.endGame();
    }
  }

  initializeBackground() {
    const background = this.add.image(0, 0, 'bg');
		background.setScale(1);
		background.setOrigin(0, 0);

		// create box for the score and timer
    gameState.scoreBoxNew = this.add.image(120,40, 'scoreBox');		
		gameState.nkScoreBox = this.add.image(380,40, 'nkScoreBox');    
		
  }  

  initializeAnimations() {
    this.anims.create({
			key: 'bye',
			frames: this.anims.generateFrameNumbers('mole', { frames: [7, 8] }),
			frameRate: 10,
		});	

    this.anims.create({
			key: 'disappear',
			frames: this.anims.generateFrameNumbers('mole', { frames: [7, 8] }),
			frameRate: 10,
		});	

    this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNames('knight', {prefix: 'breathing', end: 7, zeroPad:4}),
			repeat: -1,
		});

    this.anims.create({
			key: 'predatorIdle',
			frames: this.anims.generateFrameNumbers('predator', { frames: [0, 1, 2] }),
			frameRate: 5,
			repeat: -1,
		});

    this.anims.create({
			key: 'predatorFire',
			frames: this.anims.generateFrameNumbers('predatorFire', { frames: [0, 1, 3, 4, 2, 5, 8, 9] }),
			frameRate: 20,
			repeat: 0,
		});

    this.anims.create({
			key: 'nightKingIdle',
			frames: this.anims.generateFrameNumbers('nightking', { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17] }),
			frameRate: 10,
			repeat: -1,
		});

    this.anims.create({
			key: 'nightKingSlashing',
			frames: this.anims.generateFrameNumbers('nightKingSlashing', { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] }),
			frameRate: 20,
			repeat: 0,
		});

    

    
  }//END OF ANIMATIONS

  initializeSnow() {
		const numOfFlakes = 50;
		const defaultX = 10;
		const defaultY = 10;
		const defaultRadius = 2;		
		const snowColor = 0x9FB9E6;		
		let nextY = 0;

		for (let x = 0; x < numOfFlakes; x++) {
			
			if (x === 0) {
				gameState.snow[x] = this.add.circle(defaultX, defaultY, defaultRadius, snowColor);				
				nextY += 15;
			} else {
				const randomX = Math.floor(Math.random() * 480);
				gameState.snow[x] = this.add.circle(randomX, nextY, defaultRadius, snowColor);				
				nextY += 25;
			}						
		}	
	}//END OF initialize SNOW

  animateSnow() {
    for (let x = 0; x < gameState.snow.length; x++) {
			gameState.snow[x].y += 1;
			if (gameState.snow[x].y === 550) {
				gameState.snow[x].y = 5;			
			} 
		}
  }//End of snow
  /*
  initializePlatforms() {
    const platforms = this.physics.add.staticGroup();
    platforms.create(200, 550, 'platform');
    this.physics.add.collider(gameState.predator, platforms);
    this.physics.add.collider(gameState.opponent, platforms);
    this.physics.add.collider(gameState.opponent, gameState.predator);
  }*/

  initializeComputerInput() {
		// set up listeners at the burrow's assigned key that will tell us when user input at that key occurs
		gameState.jKey = this.input.keyboard.addKey('j');
		gameState.kKey = this.input.keyboard.addKey('k');
		gameState.lKey = this.input.keyboard.addKey('l');
		
/*
		// set up text to identify which key belongs to which burrow
		this.ComputerLocations.forEach((location) => {       
    
      this.add.rectangle(location.x + 13, location.y + 80, 25, 25, 0xFFFFFF, 0.5);
      this.add.text(location.x + 6, location.y + 70, location.key.toUpperCase(), {
				fontSize: 32,
				color: '#FFFFFF',
			});
		});

		*/
	}
	// LABELS EACH USER BURROW WITH DESIGNATED KEY
	initializeUserInput(){
		gameState.aKey = this.input.keyboard.addKey('a');
		gameState.sKey = this.input.keyboard.addKey('s');
		gameState.dKey = this.input.keyboard.addKey('d');

    /*
		this.userLocations.forEach((location) => {
      this.add.rectangle(location.x + 7, location.y + 110, 25, 25, 0xFFFFFF, 0.5);
			this.add.text(location.x, location.y + 100, location.key.toUpperCase(), {
				fontSize: 24,
				color: '#3D548F',
			});
		});
    */
	}

  initializeUserCharacter() {
    const defaultXcoord = this.userLocations[0].x;
    const defaultYcoord = this.userLocations[0].y;   

    gameState.predator = this.physics.add.sprite(defaultXcoord, defaultYcoord, 'predator');
    gameState.predator.setScale(0.3, 0.3);
    gameState.predator.setCollideWorldBounds(true);

    gameState.predator.anims.play('predatorIdle');

    // update the current user key to the new user's key
		currentUserKey = this.userLocations.key;		

		//update User 
		this.updateUser();

		// after user fires weapon, run idle animation
		gameState.predator.on('animationcomplete-predatorFire', () => {
			gameState.predator.anims.play('predatorIdle');
		});
    // after user appears, run the idel animation
    gameState.predator.on('animationcomplete-bye', () => {
			gameState.predator.anims.play('predatorIdle');
		});
    
  }//END OF USER CHAR

  initializeComputerCharacter() {
    currentComputerKey = this.ComputerLocations[0];
    const defaultXcoord = this.ComputerLocations[0].x;
    const defaultYcoord = this.ComputerLocations[0].y;
    gameState.opponent = this.physics.add.sprite(defaultXcoord, defaultYcoord, 'nightking');
    gameState.opponent.setScale(0.2, 0.2);
    
    
    gameState.opponent.anims.play('nightKingIdle');

    this.updateOpponent();    

    gameState.opponent.on('animationcomplete-disappear', () => {
			gameState.opponent.anims.play('nightKingIdle');
		});

   

  }//END OF COMPUTER CHAR

  userAttack() { 
    let attackLocation;
    if (userGuess === 'k') {
      attackLocation = this.ComputerLocations[0];
    } else if (userGuess === 'j') {
      attackLocation = this.ComputerLocations[1];
    } else {
      attackLocation = this.ComputerLocations[2];
    }
    this.updateUser();
    gameState.predator.destroy();
    gameState.predator = this.physics.add.sprite(attackLocation.x - 30, attackLocation.y, 'predator');
    gameState.predator.setScale(0.3, 0.3);
    gameState.predator.setCollideWorldBounds(true);
    gameState.predator.anims.play('predatorFire');    
    gameState.predator.on('animationcomplete-predatorFire', () => {
			gameState.predator.anims.play('bye');
		});

    gameState.predator.on('animationcomplete-bye', () => {
      gameState.predator.setPosition(currentXCoord, currentYCoord);
			gameState.predator.anims.play('predatorIdle');      
		});
    

  }

  computerAttack() {  
    //Contains the location where the computer guessed the user would be and assigns x,y coordinates  
    let attackLocation;

    if (compGuess === 's') {
      attackLocation = this.userLocations[0];
    } else if (compGuess === 'a') {
      attackLocation = this.userLocations[1];
    } else {
      attackLocation = this.userLocations[2];
    }
    //Moves Computer for the attack    

    /*
    gameState.opponent = this.physics.add.sprite(attackLocation.x - 60, attackLocation.y, 'nightking');
    gameState.opponent.setScale(0.2, 0.2); 
    

    gameState.opponent.anims.play('nightKingSlashing');   

    gameState.opponent.on('animationcomplete-nightKingSlashing', () => {
			gameState.opponent.anims.play('disappear');
		});

    gameState.opponent.on('animationcomplete-disappear', () => {
      gameState.opponent.setPosition(nextLocationKey.x, nextLocationKey.y);
			gameState.opponent.anims.play('nightKingIdle');
		});*/
    let currentKnightY = this.userLocations[0].y
    gameState.knight = this.physics.add.sprite(0, currentKnightY, 'knight');
    gameState.knight.anims.play('idle');
    gameState.knight.destroy();
    
    

/*
    while (gameState.knight.x != attackLocation.x) {
      gameState.knight.x += 10;      
    }*/

     
  }

  updateUser() {		
		// play animation to make user appear
		gameState.predator.anims.play('bye');			
	}

  updateOpponent() {
    gameState.opponent.anims.play('disappear');
  }
    
  initializeUserTurn() {   
    const boxScale = 1;
    const xCoord = 100;
    const yCoord = 250; 
    gameState.currentTurn = 'user';
    gameState.moveNotification = this.add.image(0,0, 'userMoveNotification');
    gameState.moveNotification.setOrigin(0,0);
    gameState.moveNotification.setScale(boxScale);
    gameState.moveNotification.setPosition(xCoord, yCoord);
  }    
	
	updateScoreText() {
		gameState.scoreText.setText(`${score}`);
	}
	
	updateCompScoreText() {
		gameState.compScoreText.setText(`${compScore}`);

	}

  updateMoveBox() {
    gameState.moveNotification.destroy();

    const boxScale = 1;
    const xCoord = 100;
    const yCoord = 250;

    

    if (gameState.currentTurn === 'user') {      
      gameState.moveNotification = this.add.image(0,0, 'userMoveNotification');
      gameState.moveNotification.setOrigin(0,0);
      gameState.moveNotification.setScale(boxScale);
      gameState.moveNotification.setPosition(xCoord, yCoord);
      //gameState.currentTurnBox.setText(`User Move: \nPress the A, S, or D key`);
    } else {
      gameState.moveNotification = this.add.image(0,0, 'userGuessNotification');
      gameState.moveNotification.setOrigin(0,0);
      gameState.moveNotification.setScale(boxScale);
      gameState.moveNotification.setPosition(xCoord, yCoord);
      //gameState.currentTurnBox.setText(`User Guess: \nPress the J, K, or L key`);
    }

    
  }

  initializeScoreText() {
		gameState.scoreText = this.add.text(130, 12, `${score}`, gameState.fontStyle);	
		//gameState.userTurns = this.add.text(230, 20, `${userTurns}`, gameState.fontStyle);  
    gameState.compScoreText = this.add.text(310, 12, `${compScore}`, gameState.fontStyle);  
		   
	}

  initializeHealthBars() {
    //SCALES HEALTH BAR IMAGES
    const barScale = .3;

    //USER HEALTH BAR
    const userbarXCoord = 25;
    const userbarYCoord = 40;

    gameState.healthBarBackground = this.add.image(0, 0, 'green_bar_bg');
    gameState.healthBarBackground.setOrigin(0,0);
    gameState.healthBarBackground.setScale(barScale);
    gameState.healthBarBackground.setPosition(userbarXCoord, userbarYCoord);

    gameState.healthBar = this.add.image(0, 0, 'green_bar');
    gameState.healthBar.setOrigin(0,0);
    gameState.healthBar.setScale(barScale);
    gameState.healthBar.setPosition(userbarXCoord + 5, userbarYCoord + 2);
    
    //COMPUTER HEALTH BAR
    const computerBarXCoord = 305;
    const computerBarYCoord = 40;

    gameState.opponentHealthBarBackground = this.add.image(0, 0, 'red_bar_bg');
    gameState.opponentHealthBarBackground.setOrigin(0,0);
    gameState.opponentHealthBarBackground.setScale(barScale);
    gameState.opponentHealthBarBackground.setPosition(computerBarXCoord, computerBarYCoord);

    gameState.opponentHealthBar = this.add.image(0, 0, 'red_bar');
    gameState.opponentHealthBar.setOrigin(0,0);
    gameState.opponentHealthBar.setScale(barScale);
    gameState.opponentHealthBar.setPosition(computerBarXCoord + 3, computerBarYCoord + 2);
  }
    
  updateUserTurns() {
		gameState.userTurns.setText(`${userTurns}`);
	}

  getRandomBurrow() {
		return Phaser.Utils.Array.GetRandom(this.ComputerLocations);
	}

  getComputerGuess() {
		let randomNum = Math.floor(Math.random() * 3);
		switch (randomNum) {
		  case 0:
			return 'a';
		  case 1:
			return 's';
		  case 2:
			return 'd';
		}//end of switch statement
	  }

  // Class function that ends current Game and transitions to End Scene
  endGame() {
    // Stop sprites moving
    this.physics.pause();
    // Transition to end scene w/fade
    this.cameras.main.fade(800, 0, 0, 0, false, function (camera, progress) {
      if (progress > .5) {
        this.scene.stop('GameScene');
        this.scene.start('EndScene');
      }
    });
  }
}
