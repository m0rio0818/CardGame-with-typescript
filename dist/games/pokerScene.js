import { BaseScene } from "./common/baseScene.js";
import { Button } from "./common/button.js";
export class PokerView extends BaseScene {
    constructor() {
        super(...arguments);
        this.width = 0;
        this.height = 0;
        this.table = null;
        this.callButton = null;
        this.raiseButton = null;
        this.foldButton = null;
        this.checkButton = null;
        this.allInButton = null;
        this.chipsInfo = null;
        this.nameInfo = null;
        this.handInfo = null;
        this.potInfo = null;
        this.actionButtons = [];
        this.playerhandsImages = [];
        this.playerNameInfo = [];
        this.playerChipsInfo = [];
        this.playerHandInfo = [];
        this.playerBetInfo = [];
    }
    create(data) {
        const { width, height } = this.cameras.main;
        this.width = width;
        this.height = height;
        super.create(data);
        this.table = data.table;
        this.playerGetCard();
        this.renderScene();
    }
    renderScene() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        this.PotInfo();
        this.playerInfo();
        const turnPlayer = this.table.getTurnPlayer();
        const beforePlayer = (_a = this.table) === null || _a === void 0 ? void 0 : _a.getoneBeforePlayer();
        console.log("THIS.TABLE.PHASE", (_b = this.table) === null || _b === void 0 ? void 0 : _b.gamePhase);
        if (((_c = this.table) === null || _c === void 0 ? void 0 : _c.gamePhase) == "betting" &&
            this.playerhandsImages[0] === undefined) {
            this.dealInitialHands();
            this.filpCard(0);
        }
        if (((_d = this.table) === null || _d === void 0 ? void 0 : _d.gamePhase) == "dealer turn") {
            console.log("ディーラーのターンです。");
            console.log(this.table.dealer.hand);
        }
        switch (turnPlayer.type) {
            case "player":
                if (((_e = this.table) === null || _e === void 0 ? void 0 : _e.gamePhase) != "blinding") {
                    if (turnPlayer.gameStatus == "fold" ||
                        turnPlayer.gameStatus == "allin") {
                        console.log("player は allIn or Fold");
                        setTimeout(() => {
                            var _a;
                            (_a = this.table) === null || _a === void 0 ? void 0 : _a.haveTurn();
                            this.renderScene();
                        }, 1000);
                        break;
                    }
                    if ((beforePlayer === null || beforePlayer === void 0 ? void 0 : beforePlayer.gameStatus) == "check" ||
                        ((_f = this.table) === null || _f === void 0 ? void 0 : _f.playerIndexCounter) ==
                            ((_g = this.table) === null || _g === void 0 ? void 0 : _g.dealerIndex) + 1) {
                        if (turnPlayer.chips < ((_h = this.table) === null || _h === void 0 ? void 0 : _h.betMoney)) {
                            this.createAllInButton(0, 0);
                            this.createCheckButton(0, 0);
                            this.createFoldButton(0, 0);
                        }
                        else {
                            this.createCallButton(0, 0);
                            this.createRaiseButton(0, 0);
                            this.createCheckButton(0, 0);
                            this.createFoldButton(0, 0);
                        }
                    }
                    else {
                        if (turnPlayer.chips < ((_j = this.table) === null || _j === void 0 ? void 0 : _j.betMoney)) {
                            this.createAllInButton(0, 0);
                            this.createFoldButton(0, 0);
                        }
                        else {
                            this.createCallButton(0, 0);
                            this.createRaiseButton(0, 0);
                            this.createFoldButton(0, 0);
                        }
                    }
                }
                else {
                    this.table.haveTurn();
                    this.renderScene();
                }
                break;
            default:
                setTimeout(() => {
                    var _a;
                    (_a = this.table) === null || _a === void 0 ? void 0 : _a.haveTurn();
                    this.renderScene();
                }, 1000);
                break;
        }
        console.log(turnPlayer);
    }
    dealInitialHands() {
        var _a;
        for (let i = 0; i < 2; i++) {
            let targetX = 0;
            let targetY = 0;
            for (let j = 0; j < ((_a = this.table) === null || _a === void 0 ? void 0 : _a.players.length); j++) {
                const player = this.table.players[j];
                const playerHand = player.hand;
                console.log(player.name, playerHand);
                const card = playerHand[i];
                if (j == 0) {
                    targetX =
                        i == 0 ? this.width / 2 - 50 : this.width / 2 + 50;
                    targetY = this.height - 80;
                }
                else if (j == 1) {
                    targetX = 80;
                    targetY =
                        i == 0 ? this.height / 2 - 40 : this.height / 2 + 40;
                }
                else if (j == 2) {
                    targetY = 80;
                    targetX =
                        i == 0 ? this.width / 2 - 30 : this.width / 2 + 50;
                }
                else {
                    targetX = this.width - 80;
                    targetY =
                        i == 0 ? this.height / 2 - 40 : this.height / 2 + 40;
                }
                const cardDeck = this.add.sprite(this.width / 2, this.height / 2, "back");
                cardDeck.setOrigin(0.5, 0.5);
                if (j == 1 || j == 3)
                    cardDeck.setRotation(1.5708);
                j == 0 ? cardDeck.setScale(1.5) : cardDeck.setScale(1.1);
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
                }
                else {
                    this.playerhandsImages[j].push(cardDeck);
                }
            }
        }
    }
    filpCard(i) {
        let playerHand = this.playerhandsImages[i];
        for (let i = 0; i < playerHand.length; i++) {
            const cardImage = playerHand[i];
            console.log("cardDetail :", playerHand[i]);
        }
    }
    setXPosition(i) {
        return i == 0
            ? this.width / 2 - 250
            : i == 1
                ? 50
                : i == 2
                    ? this.width / 2 + 100
                    : this.width - 150;
    }
    PotInfo() {
        var _a, _b;
        (_a = this.potInfo) === null || _a === void 0 ? void 0 : _a.destroy();
        const potInfo = this.add.text(990, 30, "Pot : " + String((_b = this.table) === null || _b === void 0 ? void 0 : _b.pot), {
            style: {
                fontSize: "60px",
                color: "#ffffff",
                fontFamily: "pixel",
            },
        });
        this.potInfo = potInfo;
    }
    playerInfo() {
        this.playerNameText();
        this.playerChipText();
        this.playerHandText();
    }
    playerNameText() {
        var _a, _b;
        this.playerNameInfo.forEach((name) => name.destroy());
        for (let i = 0; i < ((_a = this.table) === null || _a === void 0 ? void 0 : _a.players.length); i++) {
            const currPlayer = (_b = this.table) === null || _b === void 0 ? void 0 : _b.players[i];
            const playerInfo = this.add.text(this.setXPosition(i), i == 0
                ? this.height - 150
                : i == 1
                    ? this.height / 2 - 140
                    : i == 2
                        ? 40
                        : this.height / 2 + 100, "Name: " + (currPlayer === null || currPlayer === void 0 ? void 0 : currPlayer.name), {
                style: {
                    fontSize: "100px",
                    color: "#ffffff",
                    fontFamily: "pixel",
                },
            });
            this.playerNameInfo.push(playerInfo);
        }
    }
    playerHandText() {
        var _a, _b, _c, _d, _e;
        this.playerHandInfo.forEach((hand) => hand.destroy());
        if (((_a = this.table) === null || _a === void 0 ? void 0 : _a.gamePhase) == "evaluating") {
            for (let i = 0; i < ((_b = this.table) === null || _b === void 0 ? void 0 : _b.players.length); i++) {
                const currPlyer = (_c = this.table) === null || _c === void 0 ? void 0 : _c.players[i];
                const playerInfo = this.add.text(this.setXPosition(i), i == 0
                    ? this.height - 40
                    : i == 1
                        ? this.height / 2 - 120
                        : i == 2
                            ? 80
                            : this.height / 2 + 150, "Hand: " + (currPlyer === null || currPlyer === void 0 ? void 0 : currPlyer.playerHandStatus));
                this.playerHandInfo.push(playerInfo);
            }
        }
        else if (((_d = this.table) === null || _d === void 0 ? void 0 : _d.gamePhase) == "betting") {
            const currPlayer = (_e = this.table) === null || _e === void 0 ? void 0 : _e.players[0];
            const playerInfo = this.add.text(this.setXPosition(0), this.height - 110, "Hand: " + (currPlayer === null || currPlayer === void 0 ? void 0 : currPlayer.playerHandStatus));
            this.playerBetInfo.push(playerInfo);
        }
    }
    playerBetText() {
        this.playerBetInfo.forEach((bet) => bet.destroy());
    }
    playerChipText() {
        var _a, _b;
        this.playerChipsInfo.forEach((chip) => chip.destroy());
        for (let i = 0; i < ((_a = this.table) === null || _a === void 0 ? void 0 : _a.players.length); i++) {
            const currPlayer = (_b = this.table) === null || _b === void 0 ? void 0 : _b.players[i];
            const playerInfo = this.add.text(this.setXPosition(i), i == 0
                ? this.height - 130
                : i == 1
                    ? this.height / 2 - 110
                    : i == 2
                        ? 60
                        : this.height / 2 + 120, "CHIP: " + String(currPlayer === null || currPlayer === void 0 ? void 0 : currPlayer.chips), {
                style: {
                    fontSize: "50px",
                    color: "#ffffff",
                    fontFamily: "pixel",
                },
            });
            console.log(currPlayer === null || currPlayer === void 0 ? void 0 : currPlayer.chips);
            this.playerChipsInfo.push(playerInfo);
        }
    }
    playerGetCard() {
        var _a;
        if (((_a = this.table) === null || _a === void 0 ? void 0 : _a.gamePhase) == "blinding" &&
            this.table.playerIndexCounter == this.table.dealerIndex + 1) {
            for (let player of this.table.players) {
                console.log(player);
            }
        }
    }
    createCallButton(x, y) {
        const callButton = new Button(this, 750, 570, "call", "gray-button", () => {
            var _a;
            console.log("calll");
            (_a = this.table) === null || _a === void 0 ? void 0 : _a.haveTurn("call");
            this.renderScene();
            this.actionButtons.forEach((button) => button.destroy());
        });
        this.actionButtons.push(callButton);
    }
    createAllInButton(x, y) {
        const allInButton = new Button(this, 750, 690, "allIn", "gray-button", () => {
            var _a;
            console.log("allIn");
            (_a = this.table) === null || _a === void 0 ? void 0 : _a.haveTurn("allin");
            this.renderScene();
            this.actionButtons.forEach((button) => button.destroy());
        });
        this.actionButtons.push(allInButton);
    }
    createCheckButton(x, y) {
        const checkButton = new Button(this, 750, 650, "check", "gray-button", () => {
            var _a;
            console.log("check");
            (_a = this.table) === null || _a === void 0 ? void 0 : _a.haveTurn("check");
            this.renderScene();
            this.actionButtons.forEach((button) => button.destroy());
        });
        this.actionButtons.push(checkButton);
    }
    createFoldButton(x, y) {
        const foldButton = new Button(this, 750, 530, "fold", "gray-button", () => {
            var _a;
            console.log("fold");
            (_a = this.table) === null || _a === void 0 ? void 0 : _a.haveTurn("fold");
            this.renderScene();
            this.actionButtons.forEach((button) => button.destroy());
        });
        this.actionButtons.push(foldButton);
    }
    createRaiseButton(x, y) {
        this.raiseButton = new Button(this, 750, 610, "raise", "gray-button", () => {
            console.log("raise");
            this.actionButtons.forEach((button) => button.destroy());
        });
        this.actionButtons.push(this.raiseButton);
    }
}
//# sourceMappingURL=pokerScene.js.map