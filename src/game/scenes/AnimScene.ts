import Phaser from 'phaser'

export default class AnimScene extends Phaser.Scene {

    private trails: Phaser.GameObjects.Image[] = []

    constructor() {
        super('AnimScene')
    }

    preload() {
        this.load.atlas(
            'flares',
            '/src/assets/flares.png',
            '/src/assets/flares.json'
        )
        this.load.image("logo", "/src/assets/logo.png");
    }

    create() {
        const cx = this.cameras.main.centerX
        const cy = this.cameras.main.centerY
        const d = 150

        const posGreen = new Phaser.Math.Vector2(cx, cy - d)
        const posBlue  = new Phaser.Math.Vector2(cx - d, cy + d * 0.5)
        const posRed   = new Phaser.Math.Vector2(cx + d, cy + d * 0.5)
        const posWhite = new Phaser.Math.Vector2(cx, cy)
        // =========================
        //  Curve trail show up
        // =========================
        this.createCurveTrail(posGreen, posBlue, 'green', 2000, -0.9)
        this.createCurveTrail(posBlue, posRed, 'blue', 2000, -0.9)
        this.createCurveTrail(posRed, posGreen, 'red', 2000, -0.9)
        this.createCurveTrail(posWhite, posWhite, 'white', 2000, -0.9)
        // =========================
        //  White point show up
        // =========================
        this.createWhitePointAndCircle(cx, cy)
        // =========================
        //  fade trail
        // =========================
        this.time.delayedCall(3500, () => {
            this.fadeTrails()
        })
    }

    createCurveTrail(
        start: Phaser.Math.Vector2,
        end: Phaser.Math.Vector2,
        frame: string,
        duration: number,
        strength: number
    ) {
        const midX = (start.x + end.x) / 2
        const midY = (start.y + end.y) / 2

        const dx = end.x - start.x
        const dy = end.y - start.y

        // vector vuông góc
        const normalX = -dy
        const normalY = dx

        const control = new Phaser.Math.Vector2(
            midX + normalX * strength,
            midY + normalY * strength
        )

        const curve = new Phaser.Curves.QuadraticBezier(start, control, end)

        const t = { value: 0 }

        this.tweens.add({
            targets: t,
            value: 1,
            duration,
            ease: 'Sine.easeInOut',
            onUpdate: () => {
                const point = curve.getPoint(t.value)

                const trail = this.add.image(point.x, point.y, 'flares', frame)
                    .setBlendMode(Phaser.BlendModes.ADD)
                    .setScale(0.2)

                // tween làm trail mảnh + mượt
                this.tweens.add({
                    targets: trail,
                    scale: 0.05,
                    alpha: 0.7,
                    duration: 600
                })

                this.trails.push(trail)
            }
        })
    }

    fadeTrails() {
        let delay = 0

        this.trails.forEach((trail) => {
            this.tweens.add({
                targets: trail,
                alpha: 0,
                duration: 800,
                delay: delay,
                onComplete: () => trail.destroy()
            })

            delay += 2
        })
    }

    createWhitePointAndCircle(
        cx: number = this.cameras.main.centerX,
        cy: number = this.cameras.main.centerY
    ) {
     this.time.delayedCall(2000, () => {
            const circle = this.add.circle(cx, cy, 10)
                .setStrokeStyle(2, 0xffffff)

            this.tweens.add({
                targets: circle,
                radius: 175,
                duration: 1500,
                ease: 'Sine.easeOut',
                onComplete: () => {
                    //  fade out 
                    this.tweens.add({
                        targets: circle,
                        alpha: 0,
                        duration: 2800,
                        ease: 'Sine.easeIn',
                        onComplete: () => {
                            circle.destroy()
                            this.showEndScreen('logo')
                        }
                    })
                }
            })
        })
    }

    showEndScreen(textureKey: string) {
        const { width, height } = this.scale

        const img = this.add.image(width / 2, height / 2, textureKey)

        const scaleX = width / img.width
        const scaleY = height / img.height
        const scale = Math.max(scaleX, scaleY)

        img.setScale(0).setAlpha(0)

        // Tween logo xuất hiện mượt mà
        this.tweens.add({
            targets: img,
            scale: scale,
            alpha: 1,
            duration: 1000,
            ease: 'Sine.easeOut',
            onComplete: () => {
                // Delay rồi fade out
                this.time.delayedCall(2000, () => {
                    this.tweens.add({
                        targets: img,
                        alpha: 0,
                        duration: 2000,
                        ease: 'Sine.easeIn',
                        onComplete: () => {
                            img.destroy()
                            this.showRestartButton()
                        }
                    })
                })
            }
        })
    }
    
    showRestartButton() {
        const { width, height } = this.scale

        const btn = this.add.text(width / 2, height / 2, 'RESTART', {
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#000000'
        })
        .setOrigin(0.5)
        .setPadding(10)
        .setInteractive()

        // hover effect (optional nhưng nên có)
        btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#333333' }))
        btn.on('pointerout', () => btn.setStyle({ backgroundColor: '#000000' }))

        // click → restart GridScene
        btn.on('pointerdown', () => {
            this.scene.start('GridScene')
        })
    }
}