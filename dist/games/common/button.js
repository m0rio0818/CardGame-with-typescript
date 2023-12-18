var Image = Phaser.GameObjects.Image;
var Text = Phaser.GameObjects.Text;
export class Button extends Phaser.GameObjects.Container {
    constructor(scene, x, y, text, key, callback) {
        super(scene, x, y);
        this.text = new Text(scene, 0, 0, text, {
            style: {
                color: "#ffffff",
                fontSize: "10px",
                fontFamily: "pixel",
            },
        });
        this.image = new Image(scene, 0, 0, key);
        this.image.setInteractive();
        this.image.on("pointerdown", () => {
            this.image.y += 4;
            this.text.y += 4;
            callback();
        });
        this.image.on("pointerup", () => {
            this.image.y -= 4;
            this.text.y -= 4;
            callback();
        });
        this.image.on("pointerover", () => {
            this.image.setTint(0xcccccc);
        });
        this.image.on("pointerout", () => {
            this.image.clearTint();
        });
        const { width, height } = this.text;
        this.image.displayWidth = width + 100;
        this.image.displayHeight = height + 23;
        this.text.x = -width / 2;
        this.text.y = -height / 2;
        this.add(this.image);
        this.add(this.text);
        scene.add.existing(this);
    }
}
//# sourceMappingURL=button.js.map