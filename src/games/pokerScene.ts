import pokerTable from "../model/poker/pokerTable.js";
import { BaseScene } from "./common/baseScene.js";
import { Button } from "./common/button.js";
import Text = Phaser.GameObjects.Text;
import Image = Phaser.GameObjects.Image;
import Sprite = Phaser.GameObjects.Sprite;
import Phaser from "phaser";
export class PokerView extends BaseScene {
    private width: number = 0;
    private height: number = 0;
    private table: pokerTable | null = null;

    // button
    private callButton: Button | null = null;
    private raiseButton: Button | null = null;
    private foldButton: Button | null = null;
    private checkButton: Button | null = null;
    private allInButton: Button | null = null;

    // playerInfo
    private chipsInfo: Text | null = null;
    private nameInfo: Text | null = null;
    private handInfo: Text | null = null;
    private potInfo: Text | null = null;

    // destroyするためのlist
    private actionButtons: Button[] = [];
    private playerhandsImages: Sprite[][] = [];
    private playerNameInfo: Text[] = [];
    private playerChipsInfo: Text[] = [];
    private playerHandInfo: Text[] = [];
    private playerBetInfo: Text[] = [];

    create(data: any) {
        // reset all the scene
        const { width, height } = this.cameras.main;
        this.width = width;
        this.height = height;
        super.create(data);
        this.table = data.table;

        this.playerGetCard();
        this.renderScene();
    }

    renderScene() {
        this.PotInfo();
        this.playerInfo();
        const turnPlayer = this.table!.getTurnPlayer();
        const beforePlayer = this.table?.getoneBeforePlayer();

        if (
            this.table?.gamePhase == "betting" &&
            this.playerhandsImages[0] === undefined
        ) {
            this.dealInitialHands();
        }
        switch (turnPlayer.type) {
            case "player":
                if (this.table?.gamePhase != "blinding") {
                    if (
                        turnPlayer.gameStatus == "fold" ||
                        turnPlayer.gameStatus == "allin"
                    ) {
                        // 何もボタンは表示しない.
                        console.log("player は allIn or Fold");
                        setTimeout(() => {
                            this.table?.haveTurn();
                            this.renderScene();
                        }, 1000);
                        break;
                    }
                    if (
                        beforePlayer?.gameStatus == "check" ||
                        this.table?.playerIndexCounter ==
                            this.table?.dealerIndex! + 1
                    ) {
                        if (turnPlayer.chips < this.table?.betMoney!) {
                            this.createAllInButton(0, 0);
                            this.createCheckButton(0, 0);
                            this.createFoldButton(0, 0);
                        } else {
                            // チェックも選択肢にあり
                            this.createCallButton(0, 0);
                            this.createRaiseButton(0, 0);
                            this.createCheckButton(0, 0);
                            this.createFoldButton(0, 0);
                        }
                    } else {
                        if (turnPlayer.chips < this.table?.betMoney!) {
                            this.createAllInButton(0, 0);
                            this.createFoldButton(0, 0);
                        } else {
                            this.createCallButton(0, 0);
                            this.createRaiseButton(0, 0);
                            this.createFoldButton(0, 0);
                        }
                    }
                } else {
                    this.table.haveTurn();
                    this.renderScene();
                }
                break;
            default:
                setTimeout(() => {
                    this.table?.haveTurn();
                    this.renderScene();
                }, 1000);
                break;
        }
        console.log(turnPlayer);
    }

    dealInitialHands() {
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < this.table?.players.length!; j++) {
                const player = this.table!.players[j];
                const playerHand = player.hand;
                console.log(player.name, playerHand);

                const card = playerHand[i];
                const targetX =
                    i == 0 ? this.width / 2 - 50 : this.width / 2 + 70;
                const targetY = this.height - 100;
                const cardDeck = this.add.sprite(
                    this.width / 2,
                    this.height / 2,
                    "back"
                );
                cardDeck.setScale(1.5);
                // カードを移動させてくる
                this.add.tween({
                    targets: cardDeck,
                    x: targetX,
                    y: targetY,
                    duration: 1000,
                    // Additional logic after the animation completes, if needed
                    onComplete: () => {
                        cardDeck.setTexture(`${card.rank}${card.suit}`);
                        this.add.tween({
                            targets: cardDeck,
                            duration: 3000,
                            ease: "Power2",
                        });
                    },
                });

                console.log("before ",this.playerhandsImages, j, this.playerhandsImages[j]);
                if (this.playerhandsImages[j] == undefined){
                    this.playerhandsImages.push([cardDeck])
                }
                else {
                    this.playerhandsImages[j].push(cardDeck);
                }
                console.log("after ",this.playerhandsImages, j, this.playerhandsImages[j]);
            }
        }
        // for (let i = 0; i < this.table?.players.length!; i++) {
        //     const player = this.table!.players[i];
        //     const playerHands = player.hand;
        //     for (let j=0; j<)
        //     if (i == 0) {
        //         for (let j = 0; j < playerHands.length; j++) {
        //             const card = playerHands[j];
        //             const targetX =
        //                 j == 0 ? this.width / 2 - 50 : this.width / 2 + 70;
        //             const targetY = this.height - 150;
        //             const cardImage = this.add.sprite(
        //                 this.width / 2,
        //                 this.height / 2,
        //                 card.getImageKey()
        //             );
        //             cardImage.setScale(1.5);
        //             const tweenConfig = {
        //                 targets: cardImage,
        //                 x: targetX,
        //                 y: targetY,
        //                 duration: 1000,
        //             };
        //             console.log("X:", targetX);
        //             this.add.tween(tweenConfig);
        //         }
        //     } else {
        //         for (let i = 0; i < playerHands.length; i++) {}
        //     }
        // }
    }

    setXPosition(i: number): number {
        return i == 0
            ? this.width / 2 - 250
            : i == 1
            ? 50
            : i == 2
            ? this.width / 2 + 100
            : this.width - 150;
    }

    PotInfo() {
        this.potInfo?.destroy();
        const potInfo = this.add.text(
            990,
            30,
            "Pot : " + String(this.table?.pot!),
            {
                style: {
                    fontSize: "60px",
                    color: "#ffffff",
                    fontFamily: "pixel",
                },
            }
        );
        this.potInfo = potInfo;
    }

    playerInfo() {
        this.playerNameText();
        this.playerChipText();
        this.playerHandText();
    }

    playerNameText() {
        this.playerNameInfo.forEach((name) => name.destroy());
        for (let i = 0; i < this.table?.players.length!; i++) {
            const currPlayer = this.table?.players![i];
            const playerInfo = this.add.text(
                // x
                this.setXPosition(i),
                // y
                i == 0
                    ? this.height - 200
                    : i == 1
                    ? this.height / 2 - 100
                    : i == 2
                    ? 40
                    : this.height / 2 + 50,
                "Name: " + currPlayer?.name!,
                {
                    style: {
                        fontSize: "100px",
                        color: "#ffffff",
                        fontFamily: "pixel",
                    },
                }
            );
            this.playerNameInfo.push(playerInfo);
        }
    }

    playerHandText() {
        this.playerHandInfo.forEach((hand) => hand.destroy());
        if (this.table?.gamePhase == "evaluating") {
            for (let i = 0; i < this.table?.players.length; i++) {
                const currPlyer = this.table?.players[i];
                const playerInfo = this.add.text(
                    this.setXPosition(i),
                    i == 0
                        ? this.height - 160
                        : i == 1
                        ? this.height / 2 - 50
                        : i == 2
                        ? 80
                        : this.height / 2 + 90,
                    "Hand: " + currPlyer?.playerHandStatus
                );
                this.playerHandInfo.push(playerInfo);
            }
        } else if (this.table?.gamePhase == "betting") {
            const currPlayer = this.table?.players[0];
            const playerInfo = this.add.text(
                this.setXPosition(0),
                this.height - 160,
                "Hand: " + currPlayer?.playerHandStatus
            );
            this.playerBetInfo.push(playerInfo);
        }
    }

    playerBetText() {
        this.playerBetInfo.forEach((bet) => bet.destroy());
    }

    playerChipText() {
        this.playerChipsInfo.forEach((chip) => chip.destroy());

        for (let i = 0; i < this.table?.players.length!; i++) {
            const currPlayer = this.table?.players![i];
            const playerInfo = this.add.text(
                // x
                this.setXPosition(i),
                // y
                i == 0
                    ? this.height - 180
                    : i == 1
                    ? this.height / 2 - 70
                    : i == 2
                    ? 60
                    : this.height / 2 + 70,
                "CHIP: " + String(currPlayer?.chips!),
                {
                    style: {
                        fontSize: "50px",
                        color: "#ffffff",
                        fontFamily: "pixel",
                    },
                }
            );
            console.log(currPlayer?.chips);
            this.playerChipsInfo.push(playerInfo);
        }
    }

    playerGetCard() {
        // 初期プレイヤーカードをもらうアニメーションを追加。
        if (
            this.table?.gamePhase == "blinding" &&
            this.table.playerIndexCounter == this.table.dealerIndex + 1
        ) {
            for (let player of this.table.players) {
                console.log(player);
            }
        }
    }

    createCallButton(x: number, y: number) {
        const callButton = new Button(
            this,
            750,
            570,
            "call",
            "gray-button",
            () => {
                console.log("calll");
                this.table?.haveTurn("call");
                this.renderScene();
                this.actionButtons.forEach((button) => button.destroy());
            }
        );
        this.actionButtons.push(callButton);
    }

    createAllInButton(x: number, y: number) {
        const allInButton = new Button(
            this,
            750,
            690,
            "allIn",
            "gray-button",
            () => {
                console.log("allIn");
                this.table?.haveTurn("allin");
                this.renderScene();
                this.actionButtons.forEach((button) => button.destroy());
            }
        );
        this.actionButtons.push(allInButton);
    }

    createCheckButton(x: number, y: number) {
        const checkButton = new Button(
            this,
            750,
            650,
            "check",
            "gray-button",
            () => {
                console.log("check");
                this.table?.haveTurn("check");
                this.renderScene();
                this.actionButtons.forEach((button) => button.destroy());
            }
        );
        this.actionButtons.push(checkButton);
    }

    createFoldButton(x: number, y: number) {
        const foldButton = new Button(
            this,
            750,
            530,
            "fold",
            "gray-button",
            () => {
                console.log("fold");
                this.table?.haveTurn("fold");
                this.renderScene();
                this.actionButtons.forEach((button) => button.destroy());
            }
        );

        this.actionButtons.push(foldButton);
    }

    createRaiseButton(x: number, y: number) {
        this.raiseButton = new Button(
            this,
            750,
            610,
            "raise",
            "gray-button",
            () => {
                console.log("raise");
                this.actionButtons.forEach((button) => button.destroy());
            }
        );
        this.actionButtons.push(this.raiseButton);
    }
}
