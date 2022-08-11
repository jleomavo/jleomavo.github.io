class StartScene extends Phaser.Scene {
    constructor() {
      super({ key: 'StartScene' })
    }
  
    preload() {
      this.load.image('start', 'assets/NKvPv2Background.png');
    }
  
    create() {
      const background = this.add.image(0, 0, 'start');
      background.setOrigin(0);
		  background.setScale(1);
      
      // on keypress any, transition to GameScene
      this.input.on('pointerup', () => {
        this.scene.stop('StartScene');
        this.scene.start('GameScene');
      });
    }
  }
  
  