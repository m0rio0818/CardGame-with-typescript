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
        this.setInteractive();
        this.image.on("pointeron", () => {
            console.log("down");
            callback();
        });
        this.image.on("pointerdown", () => {
            console.log("down");
            callback();
        });
        this.image.on("pointerover", () => {
            console.log("aaa");
        });
        this.image.on("pointerout", () => {
            console.log("aaa");
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