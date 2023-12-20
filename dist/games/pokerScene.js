import { BaseScene } from "./common/baseScene.js";
import { Button } from "./common/button.js";
export class PokerView extends BaseScene {
    constructor() {
        super(...arguments);
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
        var _a, _b, _c, _d, _e, _f;
        this.PotInfo();
        this.playerInfo();
        const turnPlayer = this.table.getTurnPlayer();
        const beforePlayer = (_a = this.table) === null || _a === void 0 ? void 0 : _a.getoneBeforePlayer();
        switch (turnPlayer.type) {
            case "player":
                if (((_b = this.table) === null || _b === void 0 ? void 0 : _b.gamePhase) != "blinding") {
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
                        ((_c = this.table) === null || _c === void 0 ? void 0 : _c.playerIndexCounter) ==
                            ((_d = this.table) === null || _d === void 0 ? void 0 : _d.dealerIndex) + 1) {
                        if (turnPlayer.chips < ((_e = this.table) === null || _e === void 0 ? void 0 : _e.betMoney)) {
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
                        if (turnPlayer.chips < ((_f = this.table) === null || _f === void 0 ? void 0 : _f.betMoney)) {
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
    setXPosition(i) {
        return i == 0
            ? this.width / 2 - 160
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
                ? this.height - 200
                : i == 1
                    ? this.height / 2 - 100
                    : i == 2
                        ? 40
                        : this.height / 2 + 50, "Name: " + (currPlayer === null || currPlayer === void 0 ? void 0 : currPlayer.name), {
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
        var _a, _b;
        this.playerHandInfo.forEach((hand) => hand.destroy());
        for (let i = 0; i < ((_a = this.table) === null || _a === void 0 ? void 0 : _a.players.length); i++) {
            const currPlyer = (_b = this.table) === null || _b === void 0 ? void 0 : _b.players[i];
            const playerInfo = this.add.text(this.setXPosition(i), i == 0
                ? this.height - 160
                : i == 1
                    ? this.height / 2 - 50
                    : i == 2
                        ? 80
                        : this.height / 2 + 90, "Hand: " + (currPlyer === null || currPlyer === void 0 ? void 0 : currPlyer.playerHandStatus));
            this.playerHandInfo.push(playerInfo);
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
                ? this.height - 180
                : i == 1
                    ? this.height / 2 - 70
                    : i == 2
                        ? 60
                        : this.height / 2 + 70, "CHIP: " + String(currPlayer === null || currPlayer === void 0 ? void 0 : currPlayer.chips), {
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
        const callButton = new Button(this, 800, 520, "call", "gray-button", () => {
            var _a;
            console.log("calll");
            (_a = this.table) === null || _a === void 0 ? void 0 : _a.haveTurn("call");
            this.renderScene();
            this.actionButtons.forEach((button) => button.destroy());
        });
        this.actionButtons.push(callButton);
    }
    createAllInButton(x, y) {
        const allInButton = new Button(this, 800, 640, "allIn", "gray-button", () => {
            var _a;
            console.log("allIn");
            (_a = this.table) === null || _a === void 0 ? void 0 : _a.haveTurn("allin");
            this.renderScene();
            this.actionButtons.forEach((button) => button.destroy());
        });
        this.actionButtons.push(allInButton);
    }
    createCheckButton(x, y) {
        const checkButton = new Button(this, 800, 600, "check", "gray-button", () => {
            var _a;
            console.log("check");
            (_a = this.table) === null || _a === void 0 ? void 0 : _a.haveTurn("check");
            this.renderScene();
            this.actionButtons.forEach((button) => button.destroy());
        });
        this.actionButtons.push(checkButton);
    }
    createFoldButton(x, y) {
        const foldButton = new Button(this, 800, 480, "fold", "gray-button", () => {
            var _a;
            console.log("fold");
            (_a = this.table) === null || _a === void 0 ? void 0 : _a.haveTurn("fold");
            this.renderScene();
            this.actionButtons.forEach((button) => button.destroy());
        });
        this.actionButtons.push(foldButton);
    }
    createRaiseButton(x, y) {
        this.raiseButton = new Button(this, 800, 560, "raise", "gray-button", () => {
            console.log("raise");
            this.actionButtons.forEach((button) => button.destroy());
        });
        this.actionButtons.push(this.raiseButton);
    }
}
//# sourceMappingURL=pokerScene.js.map