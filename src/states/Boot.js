import Phaser from 'phaser'

export default class extends Phaser.State {
    init() {}

    preload() {
        this.load.image('sky', 'assets/images/sky.png');
        this.load.image('ground', 'assets/images/platform.png');
        this.load.image('star', 'assets/images/poop.png');
        this.load.spritesheet('dude', 'assets/images/dude_2.png', 32, 48);
    }

    render() {
        this.state.start('Game');
    }
}