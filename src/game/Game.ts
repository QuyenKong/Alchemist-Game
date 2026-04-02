import Phaser from 'phaser'
import GridScene from './scenes/GridScene'
import AnimScene from './scenes/AnimScene'

export default class Game extends Phaser.Game {
    constructor() {
        super({
            type: Phaser.AUTO,
            width: 1024 ,
            height: 768,
            backgroundColor: '#1d1d1d',
            parent: 'app',
            scene: [GridScene, AnimScene]
        })
    }
}