import { CardConfig } from "../../config/cardConfig.js";

export class PreloadScene extends Phaser.Scene {
    public progressBox: Phaser.GameObjects.Graphics | null = null;
    public progressBar: Phaser.GameObjects.Graphics | null = null;
    public loadText: Phaser.GameObjects.Text | null = null;
    public percentage: Phaser.GameObjects.Text | null = null;

    preload() {
        const { width, height } = this.cameras.main;
        console.log(width, height);

        // 新しいグラフィックスオブジェクトの作成

        // プログレス背景
        this.progressBox = this.add.graphics();
        this.progressBox.fillStyle(0x222222, 0.7);
        this.progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

        // プログレスバー
        this.progressBar = this.add.graphics();
        this.progressBox = this.add.graphics();
        this.percentage =
            // プログレスバーのテキスト
            this.loadText = this.make.text({
                x: width / 2,
                y: height / 2 - 50,
                text: "Loading....",
                style: {
                    font: "20px monospace",
                },
            });
        this.loadText.setOrigin(0.5, 0.5);

        // プログレス状況の読み込み
        // ロード中の進捗を監視
        this.load.on("progress", (value: number) => {
            if (this.percentage && this.progressBar) {
                this.percentage!.setText(`${Math.floor(value * 100)}%`);
                this.progressBar!.clear();
                this.progressBar!.fillStyle(0xffffff, 0.7);
                this.progressBar!.fillRect(
                    width / 2 - 150,
                    height / 2 - 15,
                    300 * value,
                    30
                );
            }
        });


        this.load.on("complete", function () {
            console.log("complete");
        });

        // アセットのロード
        // カード画像
        const suits = CardConfig.suits;
        const ranks = CardConfig.ranks;
        suits.forEach((suit) => {
            ranks.forEach((rank) => {
                this.load.image(
                    `${rank}${suit}`,
                    `public/assets/cards/${rank}${suit}.png`
                );
            });
        });

        this.load.image("background", "public/assets/ui/background.jpeg")
        this.load.image("gray-button", "public/assets/ui/gray-button.png")
        this.load.image("blue-button", "public/assets/ui/blue-button.png")
    }

    create(data: any) {
        this.percentage = this.make.text({
            x: this.cameras.main.width / 2,
            y: this.cameras.main.height / 2,
            text: "0%",
            style: {
                font: "16px monospace",
                fontFamily: "pixel",
            },
        });
        this.percentage.setOrigin(0.5, 0.5);

        console.log(data.table.gameType);
        this.progressBox?.destroy();
        this.progressBar?.destroy();
        this.loadText?.destroy();
        this.percentage?.destroy();
        if (data.table.gameType == "poker"){
            this.scene.start('poker', { table: data.table })
        }
    }
}
