import Phaser from 'phaser'
import GridItem from '../objects/GridItem'

export default class GridScene extends Phaser.Scene {
    private items: GridItem[] = []
    private maxItems = 100
    private col = 10
    private size!: number

    constructor() {
        super('GridScene')
    }

    create() {
        // Reset data khi start scene
        this.items.forEach(item => item.destroy())
        this.items = []

        const availableWidth = this.scale.width - 100
        const availableHeight = this.scale.height - 150
        const sizeFromWidth = availableWidth / this.col
        const sizeFromHeight = availableHeight / 10 // giả sử max 10 hàng
        this.size = Math.min(sizeFromWidth, sizeFromHeight)

        this.scale.on('resize', this.onResize, this)

        this.createButtons()
    }

    createButtons() {
        const addBtn = this.add.text(50, 20, 'Add', {
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setInteractive()

        addBtn.on('pointerover', () => addBtn.setStyle({ backgroundColor: '#333333' }))
        addBtn.on('pointerout', () => addBtn.setStyle({ backgroundColor: '#000000' }))
        addBtn.on('pointerdown', () => {
            this.tweens.add({ targets: addBtn, scale: 0.9, duration: 100, yoyo: true, ease: 'Sine.easeInOut' })
            this.addItem()
        })

        const removeBtn = this.add.text(120, 20, 'Remove', {
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setInteractive()

        removeBtn.on('pointerover', () => removeBtn.setStyle({ backgroundColor: '#333333' }))
        removeBtn.on('pointerout', () => removeBtn.setStyle({ backgroundColor: '#000000' }))
        removeBtn.on('pointerdown', () => {
            this.tweens.add({ targets: removeBtn, scale: 0.9, duration: 100, yoyo: true, ease: 'Sine.easeInOut' })
            this.removeSelected()
        })

        const nextBtn = this.add.text(220, 20, 'Next', {
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setInteractive()

        nextBtn.on('pointerover', () => nextBtn.setStyle({ backgroundColor: '#333333' }))
        nextBtn.on('pointerout', () => nextBtn.setStyle({ backgroundColor: '#000000' }))
        nextBtn.on('pointerdown', () => {
            this.tweens.add({ targets: nextBtn, scale: 0.9, duration: 100, yoyo: true, ease: 'Sine.easeInOut' })
            this.scene.start('AnimScene')
        })
    }

    addItem() {
        if (this.items.length >= this.maxItems) return

        let nextIndex = 1;
        if (this.items.length > 0) {
            nextIndex = Math.max(...this.items.map(item => item.index)) + 1;
        }

        const item = new GridItem(this, nextIndex, this.size - 10)
        this.items.push(item)

        this.relayout()
    }

    removeSelected() {
        this.items = this.items.filter(item => {
            if (item.selected) {
                item.destroy()
                return false
            }
            return true
        })

        this.relayout()
    }

    relayout() {
        this.items.forEach((item, index) => {
            const x = 50 + (index % this.col) * this.size
            const y = 100 + Math.floor(index / this.col) * this.size

            // smooth animation (bonus điểm)
            this.tweens.add({
                targets: item,
                x,
                y,
                duration: 200
            })
        })
    }

    onResize(gameSize: Phaser.Structs.Size) {
        const availableWidth = gameSize.width - 100
        const availableHeight = gameSize.height - 150
        const sizeFromWidth = availableWidth / this.col
        const sizeFromHeight = availableHeight / 10
        this.size = Math.min(sizeFromWidth, sizeFromHeight)

        this.relayout()
    }
}