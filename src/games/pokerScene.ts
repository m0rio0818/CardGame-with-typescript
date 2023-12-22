import pokerTable from "../model/poker/pokerTable.js";
import { BaseScene } from "./common/baseScene.js";
import { Button } from "./common/button.js";
import Text = Phaser.GameObjects.Text;
import Image = Phaser.GameObjects.Image;
import Sprite = Phaser.GameObjects.Sprite;
import Phaser from "phaser";
import { shallowReactive } from "vue";
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
    private turnData: Text | nulls = null;

    // destroyするためのlist
    private actionButtons: Button[] = [];
    private playerhandsImages: Sprite[][] = [];
    private playerNameInfo: Text[] = [];
    private playerChipsInfo: Text[] = [];
    private playerHandInfo: Text[] = [];
    private playerBetInfo: Text[] = [];
    private dealerHandInfo: Sprite[] = [];

    create(data: any) {
        // reset all the scene
        this.actionButtons = [];
        this.playerhandsImages = [];
        this.playerNameInfo = [];
        this.playerChipsInfo = [];
        this.playerHandInfo = [];
        this.playerBetInfo = [];
        this.playerHandInfo = [];

        const { width, height } = this.cameras.main;
        this.width = width;
        this.height = height;
        super.create(data);
        this.table = data.table;

        this.playerGetCard();
        this.renderScene();
    }

    renderScene() {
        this.turnInfo();
        this.PotInfo();
        this.playerInfo();
        const turnPlayer = this.table!.getTurnPlayer();
        const beforePlayer = this.table?.getoneBeforePlayer();
        console.log("THIS.TABLE.PHASE", this.table?.gamePhase);
        if (
            this.table?.gamePhase == "betting" &&
            this.playerhandsImages[0] === undefined
        ) {
            this.dealInitialHands();
            this.filpCard(0);
        }
        if (this.table?.gamePhase == "evaluating") {
            console.log("評価中だよ〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜評価中だ！");
            this.claerDealerCard();
        }
        if (this.table?.gamePhase == "dealer turn") {
            console.log("ディーラーのターンですよおおお。");
            this.setDealerCard();
            console.log(turnPlayer.name, this.table.dealer.hand);
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

    claerDealerCard() {
        this.dealerHandInfo.forEach((hand) => hand.destroy());
    }

    setDealerCard() {
        if (this.table?.turnCounter == 1) {
            for (let i = 0; i < this.table?.dealer.hand.length!; i++) {
                const delaerCard = this.table?.dealer.hand[i];
                const dealerHand = this.add.sprite(
                    this.width,
                    0,
                    `${delaerCard?.rank}${delaerCard?.suit}`
                );

                dealerHand.setScale(1.5);
                this.add.tween({
                    targets: dealerHand,
                    x: 320 + i * 100,
                    y: this.height / 2,
                    duration: 1000,
                });
                this.dealerHandInfo.push(dealerHand);
            }
        } else {
            let i = this.table?.dealer.hand.length! - 1;
            const delaerCard = this.table?.dealer.hand[i];
            const dealerHand = this.add.sprite(
                this.width,
                0,
                `${delaerCard?.rank}${delaerCard?.suit}`
            );

            dealerHand.setScale(1.5);
            this.add.tween({
                targets: dealerHand,
                x: 320 + i * 100,
                y: this.height / 2,
                duration: 1000,
            });
            this.dealerHandInfo.push(dealerHand);
        }
    }

    dealInitialHands() {
        console.log("今からプレイヤーにカード配るおおおおお");
        for (let i = 0; i < 2; i++) {
            let targetX: number = 0;
            let targetY: number = 0;
            for (let j = 0; j < this.table?.players.length!; j++) {
                const player = this.table!.players[j];
                const playerHand = player.hand;

                console.log(player.name, playerHand);
                const card = playerHand[i];

                if (j == 0) {
                    targetX =
                        i == 0 ? this.width / 2 - 50 : this.width / 2 + 50;
                    targetY = this.height - 80;
                } else if (j == 1) {
                    targetX = 80;
                    targetY =
                        i == 0 ? this.height / 2 - 40 : this.height / 2 + 40;
                } else if (j == 2) {
                    targetY = 80;
                    targetX =
                        i == 0 ? this.width / 2 - 30 : this.width / 2 + 50;
                } else {
                    targetX = this.width - 80;
                    targetY =
                        i == 0 ? this.height / 2 - 40 : this.height / 2 + 40;
                }

                const cardDeck = this.add.sprite(
                    this.width / 2,
                    this.height / 2,
                    "back"
                );

                cardDeck.setOrigin(0.5, 0.5);
                if (j == 1 || j == 3) cardDeck.setRotation(1.5708);
                j == 0 ? cardDeck.setScale(1.5) : cardDeck.setScale(1.1);
                // カードを移動させてくる
                this.add.tween({
                    targets: cardDeck,
                    x: targetX,
                    y: targetY,
                    duration: 1000,
                });

                if (j == 0) {
                    setTimeout(() => {
                        cardDeck.setScale(1.5);
                        this.add.tween({
                            targets: cardDeck,
                            scaleY: 0,
                            duration: 500,
                            ease: "linear",
                            onComplete: () => {
                                cardDeck.setScale(1.5);
                                cardDeck.setTexture(`${card.rank}${card.suit}`);
                                this.add.tween({
                                    targets: cardDeck,
                                    scaleY: 1,
                                    duration: 500,
                                    ease: "linear",
                                });
                            },
                        });
                    }, 1000);
                }
                if (this.playerhandsImages[j] == undefined) {
                    this.playerhandsImages.push([cardDeck]);
                } else {
                    this.playerhandsImages[j].push(cardDeck);
                }
            }
        }
    }

    filpCard(i: number) {
        let playerHand = this.playerhandsImages[i];
        for (let i = 0; i < playerHand.length; i++) {
            const cardImage = playerHand[i];
            console.log("cardDetail :", playerHand[i]);
        }
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

    turnInfo() {
        this.turnData?.destroy();
        const turnInfo = this.add.text(
            990,
            40,
            "turn: " + String(this.table?.roundCounter!),
            {
                style: {
                    fontSize: "60px",
                    color: "#ffffff",
                    fontFamily: "pixel",
                },
            }
        );
        this.turnData = turnInfo;
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
                    ? this.height - 150
                    : i == 1
                    ? this.height / 2 - 140
                    : i == 2
                    ? 40
                    : this.height / 2 + 100,
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
        console.log("HANDNDDDDD  ", this.playerHandInfo);
        this.playerHandInfo.forEach((hand) => hand.destroy());
        if (this.table?.gamePhase == "evaluating") {
            for (let i = 0; i < this.table?.players.length; i++) {
                const currPlyer = this.table?.players[i];
                const playerInfo = this.add.text(
                    this.setXPosition(i),
                    i == 0
                        ? this.height - 110
                        : i == 1
                        ? this.height / 2 - 120
                        : i == 2
                        ? 80
                        : this.height / 2 + 150,
                    "Hand: " + currPlyer?.playerHandStatus
                );
                this.playerHandInfo.push(playerInfo);
            }
        }
        if (
            this.table?.gamePhase == "betting" ||
            this.table?.gamePhase == "dealer turn"
        ) {
            const currPlayer = this.table?.players[0];
            const playerInfo = this.add.text(
                this.setXPosition(0),
                this.height - 110,
                "Hand: " + currPlayer?.playerHandStatus
            );
            this.playerHandInfo.push(playerInfo);
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
                    ? this.height - 130
                    : i == 1
                    ? this.height / 2 - 110
                    : i == 2
                    ? 60
                    : this.height / 2 + 120,
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
                this.playerInfo();
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
                this.playerInfo();
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
                this.playerInfo();
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
                this.playerInfo();
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
                this.table?.haveTurn("raise");
                this.renderScene();
                this.actionButtons.forEach((button) => button.destroy());
                this.playerInfo();
            }
        );
        this.actionButtons.push(this.raiseButton);
    }
}
