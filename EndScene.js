class EndScene extends Phaser.Scene {
    constructor() {
      super({ key: 'EndScene' })
    }
  
    preload() {
      this.load.image('nkwins', 'assets/NKWinsBG.png');
      this.load.image('pwins', 'assets/PWinsBG.png');
    }
  
    create() {
      if (score >= 300) {
        screen = this.add.image(0, 0, 'pwins').setOrigin(0);
      } else {
        screen = this.add.image(0, 0, 'nkwins').setOrigin(0);
      }
      
  
      // Add code to reset global variables
      score = 0;
      compScore = 0;
      userTurns = 0;
    
      // Reset sprite positions
      userLocation = defaultLocation;
      compLocation = compDefaultLocation;
  
      this.input.on('pointerup', () => {
        this.scene.stop('EndScene');
        this.scene.start('GameScene');
      });
    }
  }
  
  
  
  