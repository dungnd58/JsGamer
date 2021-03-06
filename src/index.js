import 'pixi'
import 'p2'
import * as Phaser from 'phaser'

import BootState from './states/Boot'
import GameState from './states/Game'
import config from './config'

class Game extends Phaser.Game {
    constructor() {
        const docElement = document.documentElement;
        const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth;
        const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight;

        super(width, height, Phaser.AUTO, 'content', null);

        //Add each state.
        this.state.add('Boot', BootState, false);
        this.state.add('Game', GameState, false);

        //Start the game by calling boot state
        this.state.start('Boot')
    }
}

window.game = new Game();