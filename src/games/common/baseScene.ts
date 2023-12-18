export class BaseScene extends Phaser.Scene {
    create(data: any) {
        console.log(data);

        const table = data.table;
        this.add.image(0, 0, "background").setOrigin(0);
        this.createGameZone();
        this.createNameText(table.players[0].name);
    }

    createGameZone() {
        const zone = this.add
            .zone(0, 0, 800, 600)
            .setOrigin(0)
            .setInteractive();
    }

    createNameText(username: string) {
        this.add.text(300, 600, `${username}`, {
            style: {
                fontSize: "20px",
                color: "#ffffff",
                fontFamily: "pixel",
            },
        });
    }
}
