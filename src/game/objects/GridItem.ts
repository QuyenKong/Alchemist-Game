import Phaser from 'phaser'

export default class GridItem extends Phaser.GameObjects.Container {
    public selected: boolean = false
    public index: number
    private bg: Phaser.GameObjects.Rectangle
    private label: Phaser.GameObjects.Text

    constructor(scene: Phaser.Scene, id: number,size: number = 80) {
        super(scene, 0, 0)
        this.index = id
        this.bg = scene.add.rectangle(0, 0, size, size, 0xaaaaaa)
            .setOrigin(0.5)

        this.label = scene.add.text(0, 0, id.toString(), {
            color: '#000'
        }).setOrigin(0.5)

        this.add([this.bg, this.label])
        this.setSize(size, size)
        this.setInteractive()

        this.on('pointerdown', this.toggleSelect, this)

        scene.add.existing(this)
    }

    toggleSelect() {
        this.selected = !this.selected
        this.bg.setFillStyle(this.selected ? 0xff0000 : 0xaaaaaa)
    }

    setIndex(index: number) {
        this.index = index
        this.label.setText(index.toString())
    }
}