import { CardConfig } from "../../config/cardConfig.js";
export class PreloadScene extends Phaser.Scene {
    constructor() {
        super(...arguments);
        this.progressBox = null;
        this.progressBar = null;
        this.loadText = null;
        this.percentage = null;
    }
    preload() {
        const { width, height } = this.cameras.main;
        console.log(width, height);
        this.progressBox = this.add.graphics();
        this.progressBox.fillStyle(0x222222, 0.7);
        this.progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);
        this.progressBar = this.add.graphics();
        this.loadText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: "Loading....",
            style: {
                font: "20px monospace",
            },
        });
        this.loadText.setOrigin(0.5, 0.5);
        this.load.on("progress", (value) => {
            if (this.percentage && this.progressBar) {
                console.log("Loading progress:", value);
                this.percentage.setText(`${Math.floor(value * 100)}%`);
                this.progressBar.clear();
                this.progressBar.fillStyle(0xffffff, 1);
                this.progressBar.fillRect(width / 2, height / 2, 300 * value, 30);
            }
        });
        this.load.on("progress", (value) => {
            if (this.percentage && this.progressBar) {
                this.percentage.setText(`${Math.floor(value * 100)}%`);
                this.progressBar.clear();
                this.progressBar.fillStyle(0xffffff, 1);
                this.progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
            }
        });
        const suits = CardConfig.suits;
        const ranks = CardConfig.ranks;
        suits.forEach(suit => {
            ranks.forEach(rank => {
                this.load.image(`${rank}${suit}`, `public/assets/cards/${rank}${suit}.png`);
            });
        });
    }
    create(data) {
        var _a, _b, _c, _d;
        this.percentage = this.make.text({
            x: this.cameras.main.width / 2,
            y: this.cameras.main.height / 2,
            text: "0",
            style: {
                font: "16px monospace",
            },
        });
        this.percentage.setOrigin(0.5, 0.5);
        (_a = this.progressBox) === null || _a === void 0 ? void 0 : _a.destroy();
        (_b = this.progressBar) === null || _b === void 0 ? void 0 : _b.destroy();
        (_c = this.loadText) === null || _c === void 0 ? void 0 : _c.destroy();
        (_d = this.percentage) === null || _d === void 0 ? void 0 : _d.destroy();
        console.log(data);
    }
}
//# sourceMappingURL=preloadScene.js.map