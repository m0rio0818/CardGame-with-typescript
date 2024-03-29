var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseScene } from "./common/baseScene.js";
import { Button } from "./common/button.js";
export class PokerView extends BaseScene {
    constructor() {
        super(...arguments);
        this.width = 0;
        this.height = 0;
        this.table = null;
        this.potInfo = null;
        this.turnData = null;
        this.currBetInfo = null;
        this.actionButtons = [];
        this.playerhandsImages = [];
        this.playerNameInfo = [];
        this.playerChipsInfo = [];
        this.playerHandInfo = [];
        this.playerBetInfo = [];
        this.dealerHandInfo = [];
        this.dealerCoinInfo = [];
    }
    create(data) {
        this.actionButtons = [];
        this.playerhandsImages = [];
        this.playerNameInfo = [];
        this.playerChipsInfo = [];
        this.playerHandInfo = [];
        this.playerBetInfo = [];
        this.playerHandInfo = [];
        this.dealerCoinInfo = [];
        const { width, height } = this.cameras.main;
        this.width = width;
        this.height = height;
        super.create(data);
        this.table = data.table;
        this.renderScene();
    }
    getResultTableData() {
        var _a, _b, _c, _d;
        let tableData = [[]];
        for (let i = 0; i < ((_a = this.table) === null || _a === void 0 ? void 0 : _a.maxTurn) + 1; i++) {
            if (i == 0) {
                tableData[0].push("Name");
            }
            else {
                tableData[0].push(`Round${i}`);
            }
        }
        for (let i = 0; i < ((_b = this.table) === null || _b === void 0 ? void 0 : _b.players.length); i++) {
            let currPlayer = this.table.players[i];
            tableData.push([currPlayer.name]);
        }
        for (let i = 0; i < ((_c = this.table) === null || _c === void 0 ? void 0 : _c.resultsLog.length); i++) {
            let currResult = (_d = this.table) === null || _d === void 0 ? void 0 : _d.resultsLog[i];
            let round_i = currResult === null || currResult === void 0 ? void 0 : currResult.split(",");
            for (let i = 0; i < (round_i === null || round_i === void 0 ? void 0 : round_i.length); i++) {
                tableData[i + 1].push(round_i[i]);
            }
        }
        return tableData;
    }
    renderResultLog() {
        this.destroyAllInfo();
        const tableData = this.getResultTableData();
        const cellWidth = 100;
        const cellHeight = 40;
        const tableWidth = tableData[0].length * cellWidth;
        const tableHeight = tableData.length * cellHeight;
        const tableX = this.width / 2 - tableWidth / 2;
        const tableY = this.height / 2 - tableHeight / 2;
        for (let i = 0; i < tableData.length; i++) {
            for (let j = 0; j < tableData[i].length; j++) {
                const cellX = tableX + j * cellWidth;
                const cellY = tableY + i * cellHeight;
                const cellText = this.add.text(cellX + cellWidth / 2, cellY + cellHeight / 2, tableData[i][j], {
                    fontFamily: "Arial",
                    fontSize: "18px",
                    color: "#ffffff",
                });
                cellText.setOrigin(0.5, 0.5);
                const cellBackground = this.add.rectangle(cellX + cellWidth / 2, cellY + cellHeight / 2, cellWidth, cellHeight);
                cellBackground.setStrokeStyle(2, 0xffffff);
            }
        }
    }
    destroyAllInfo() {
        var _a, _b, _c;
        this.playerNameInfo.forEach((name) => name.destroy());
        this.playerChipsInfo.forEach((chip) => chip.destroy());
        this.playerHandInfo.forEach((hand) => hand.destroy());
        this.actionButtons.forEach(button => button.destroy());
        this.playerBetInfo.forEach(bet => bet.destroy());
        this.dealerHandInfo.forEach(hand => hand.destroy());
        this.dealerCoinInfo.forEach(coin => coin.destroy());
        (_a = this.potInfo) === null || _a === void 0 ? void 0 : _a.destroy();
        (_b = this.currBetInfo) === null || _b === void 0 ? void 0 : _b.destroy();
        (_c = this.turnData) === null || _c === void 0 ? void 0 : _c.destroy();
    }
    renderScene() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        console.log("ROUNDCOUNTER", this.table.roundCounter, "MAXTURN", this.table.maxTurn);
        if (this.table.roundCounter == this.table.maxTurn) {
            this.renderResultLog();
        }
        else {
            this.playerInfo();
            this.tableInfo();
            setTimeout(() => {
                this.putDealerCoin();
            }, 300);
            const turnPlayer = this.table.getTurnPlayer();
            const beforePlayer = (_a = this.table) === null || _a === void 0 ? void 0 : _a.getoneBeforePlayer();
            console.log("THIS.TABLE.PHASE", (_b = this.table) === null || _b === void 0 ? void 0 : _b.gamePhase);
            console.log("現在のdelarIndx", (_c = this.table) === null || _c === void 0 ? void 0 : _c.dealerIndex);
            if (((_d = this.table) === null || _d === void 0 ? void 0 : _d.gamePhase) == "betting" &&
                this.playerhandsImages[0] === undefined) {
                this.dealInitialHands();
            }
            if (((_e = this.table) === null || _e === void 0 ? void 0 : _e.gamePhase) == "evaluating") {
                setTimeout(() => {
                    this.filpCard();
                    setTimeout(() => {
                        this.clearAllHand();
                        this.clearDealerCard();
                        this.clearDealrCoin();
                        setTimeout(() => {
                            var _a;
                            (_a = this.table) === null || _a === void 0 ? void 0 : _a.haveTurn();
                            this.renderScene();
                        }, 1000);
                    }, 2000);
                }, 1000);
                return;
            }
            if (((_f = this.table) === null || _f === void 0 ? void 0 : _f.gamePhase) == "dealer turn") {
                console.log("ディーラーきた", turnPlayer.name, this.table.dealer.hand);
                setTimeout(() => {
                    this.setDealerCard();
                    setTimeout(() => {
                        var _a;
                        this.playerHandText();
                        (_a = this.table) === null || _a === void 0 ? void 0 : _a.haveTurn();
                        this.renderScene();
                    }, 2000);
                }, 1000);
                return;
            }
            if ((_g = this.table) === null || _g === void 0 ? void 0 : _g.allplayerAllInOrFold()) {
                console.log("PLPAYER全員が何もできない状況です。");
                (_h = this.table) === null || _h === void 0 ? void 0 : _h.haveTurn();
                this.renderScene();
            }
            switch (turnPlayer.type) {
                case "player":
                    console.log("PLAYER", turnPlayer.name, "STATUS", turnPlayer.gameStatus, (_j = this.table) === null || _j === void 0 ? void 0 : _j.turnCounter, (_k = this.table) === null || _k === void 0 ? void 0 : _k.dealerIndex);
                    if (this.table.allPlayerActionResolved()) {
                        setTimeout(() => {
                            var _a;
                            (_a = this.table) === null || _a === void 0 ? void 0 : _a.haveTurn();
                            this.renderScene();
                        }, 500);
                        break;
                    }
                    if (((_l = this.table) === null || _l === void 0 ? void 0 : _l.gamePhase) != "blinding") {
                        if (turnPlayer.gameStatus == "fold" ||
                            turnPlayer.gameStatus == "allin" ||
                            turnPlayer.chips == 0) {
                            console.log("player は allIn or Fold");
                            setTimeout(() => {
                                var _a;
                                (_a = this.table) === null || _a === void 0 ? void 0 : _a.haveTurn();
                                this.renderScene();
                            }, 500);
                            break;
                        }
                        if ((beforePlayer === null || beforePlayer === void 0 ? void 0 : beforePlayer.gameStatus) == "check" ||
                            ((_m = this.table) === null || _m === void 0 ? void 0 : _m.playerIndexCounter) ==
                                ((_o = this.table) === null || _o === void 0 ? void 0 : _o.dealerIndex) + 1) {
                            if (turnPlayer.chips <= ((_p = this.table) === null || _p === void 0 ? void 0 : _p.betMoney)) {
                                this.createCheckButton(600);
                                this.createAllInButton(640);
                                this.createFoldButton(690);
                            }
                            else {
                                this.createCheckButton(570);
                                this.createCallButton(610);
                                this.createRaiseButton(650);
                                this.createFoldButton(690);
                            }
                        }
                        else {
                            if (turnPlayer.chips <= ((_q = this.table) === null || _q === void 0 ? void 0 : _q.betMoney)) {
                                this.createAllInButton(630);
                                this.createFoldButton(670);
                            }
                            else if (turnPlayer.chips * 2 <=
                                ((_r = this.table) === null || _r === void 0 ? void 0 : _r.betMoney)) {
                                this.createAllInButton(630);
                                this.createFoldButton(670);
                            }
                            else {
                                if (turnPlayer.gameStatus == "bet" &&
                                    ((_s = this.table) === null || _s === void 0 ? void 0 : _s.playerIndexCounter) ==
                                        (((_t = this.table) === null || _t === void 0 ? void 0 : _t.dealerIndex) + 2) %
                                            ((_u = this.table) === null || _u === void 0 ? void 0 : _u.players.length) &&
                                    this.table.turnCounter == 0) {
                                    this.createPassButton(610);
                                    this.createRaiseButton(650);
                                    this.createFoldButton(690);
                                }
                                else {
                                    this.createCallButton(600);
                                    this.createRaiseButton(640);
                                    this.createFoldButton(690);
                                }
                            }
                        }
                    }
                    else {
                        if (this.table.allPlayerActionResolved()) {
                            setTimeout(() => {
                                var _a;
                                (_a = this.table) === null || _a === void 0 ? void 0 : _a.haveTurn();
                                this.renderScene();
                            }, 500);
                            break;
                        }
                        else {
                            setTimeout(() => {
                                var _a;
                                (_a = this.table) === null || _a === void 0 ? void 0 : _a.haveTurn();
                                this.renderScene();
                            }, 1000);
                        }
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
        }
    }
    putDealerCoin() {
        var _a, _b, _c;
        if (((_a = this.table) === null || _a === void 0 ? void 0 : _a.dealerIndex) == 0) {
            const dealerCoin = this.add.sprite(this.setXPosition(0) + 30, this.height - 50, "orange-button");
            dealerCoin.setOrigin(0.5, 0.5);
            this.dealerCoinInfo.push(dealerCoin);
        }
        else if (((_b = this.table) === null || _b === void 0 ? void 0 : _b.dealerIndex) == 1) {
            const dealerCoin = this.add.sprite(this.setXPosition(1) + 120, this.height / 2 - 120, "orange-button");
            dealerCoin.setOrigin(0.5, 0.5);
            this.dealerCoinInfo.push(dealerCoin);
        }
        else if (((_c = this.table) === null || _c === void 0 ? void 0 : _c.dealerIndex) == 2) {
            const dealerCoin = this.add.sprite(this.setXPosition(2) + 30, 130, "orange-button");
            dealerCoin.setOrigin(0.5, 0.5);
            this.dealerCoinInfo.push(dealerCoin);
        }
        else {
            const dealerCoin = this.add.sprite(this.setXPosition(3) - 45, this.height / 2 + 120, "orange-button");
            dealerCoin.setOrigin(0.5, 0.5);
            this.dealerCoinInfo.push(dealerCoin);
        }
    }
    allPlayerActionResolved() {
        var _a, _b;
        for (let player of (_a = this.table) === null || _a === void 0 ? void 0 : _a.players) {
            if (!((_b = this.table) === null || _b === void 0 ? void 0 : _b.playerActionResolved(player)))
                return false;
        }
        return true;
    }
    clearDealerCard() {
        this.dealerHandInfo.forEach((hand) => hand.destroy());
    }
    clearDealrCoin() {
        this.dealerCoinInfo.forEach((hand) => hand.destroy());
    }
    setDealerCard() {
        var _a, _b, _c, _d, _e;
        if (((_a = this.table) === null || _a === void 0 ? void 0 : _a.turnCounter) == 1) {
            for (let i = 0; i < ((_b = this.table) === null || _b === void 0 ? void 0 : _b.dealer.hand.length); i++) {
                const delaerCard = (_c = this.table) === null || _c === void 0 ? void 0 : _c.dealer.hand[i];
                const dealerHand = this.add.sprite(this.width, 0, `${delaerCard === null || delaerCard === void 0 ? void 0 : delaerCard.rank}${delaerCard === null || delaerCard === void 0 ? void 0 : delaerCard.suit}`);
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
        else {
            let i = ((_d = this.table) === null || _d === void 0 ? void 0 : _d.dealer.hand.length) - 1;
            const delaerCard = (_e = this.table) === null || _e === void 0 ? void 0 : _e.dealer.hand[i];
            const dealerHand = this.add.sprite(this.width, 0, `${delaerCard === null || delaerCard === void 0 ? void 0 : delaerCard.rank}${delaerCard === null || delaerCard === void 0 ? void 0 : delaerCard.suit}`);
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
        var _a;
        for (let i = 0; i < 2; i++) {
            let targetX = 0;
            let targetY = 0;
            for (let j = 0; j < ((_a = this.table) === null || _a === void 0 ? void 0 : _a.players.length); j++) {
                const player = this.table.players[j];
                const playerHand = player.hand;
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
                    cardDeck.setScale(1.5);
                    cardDeck.setOrigin(0.5, 0.5);
                    setTimeout(() => {
                        this.add.tween({
                            targets: cardDeck,
                            scaleY: 0,
                            duration: 500,
                            ease: "Linear",
                            onComplete: () => {
                                cardDeck.setTexture(`${card.rank}${card.suit}`);
                                this.add.tween({
                                    targets: cardDeck,
                                    scaleY: 1.5,
                                    duration: 500,
                                    ease: "Linear",
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
    filpCard() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 1; i < ((_a = this.table) === null || _a === void 0 ? void 0 : _a.players.length); i++) {
                let currHand = (_b = this.table) === null || _b === void 0 ? void 0 : _b.players[i].hand;
                let currImages = this.playerhandsImages[i];
                for (let j = 0; j < 2; j++) {
                    let currImage = currImages[j];
                    this.add.tween({
                        targets: currImages[j],
                        scaleY: 0,
                        duration: 500,
                        ease: "linear",
                        onComplete: () => {
                            currImage.setTexture(`${currHand[j].rank}${currHand[j].suit}`);
                            this.add.tween({
                                targets: currImage,
                                scaleY: 1,
                                duration: 500,
                                ease: "linear",
                            });
                        },
                    });
                }
            }
        });
    }
    clearAllHand() {
        return __awaiter(this, void 0, void 0, function* () {
            this.playerhandsImages.forEach((player) => player.forEach((hand) => hand.destroy()));
            this.playerHandInfo.forEach((hand) => hand.destroy());
            this.playerhandsImages = [];
            this.playerHandInfo = [];
        });
    }
    setXPosition(i) {
        return i == 0
            ? this.width / 2 - 250
            : i == 1
                ? 50
                : i == 2
                    ? this.width / 2 + 100
                    : this.width - 120;
    }
    turnInfo() {
        var _a, _b;
        (_a = this.turnData) === null || _a === void 0 ? void 0 : _a.destroy();
        const turnInfo = this.add.text(990, 55, "Round: " + String((_b = this.table) === null || _b === void 0 ? void 0 : _b.roundCounter), {
            fontSize: "15px",
            color: "#ffffff",
            fontFamily: "pixel",
        });
        this.turnData = turnInfo;
    }
    PotInfo() {
        var _a, _b;
        (_a = this.potInfo) === null || _a === void 0 ? void 0 : _a.destroy();
        const potInfo = this.add.text(990, 30, "Pot : " + String((_b = this.table) === null || _b === void 0 ? void 0 : _b.pot), {
            fontSize: "20px",
            color: "#ffffff",
            fontFamily: "pixel",
        });
        this.potInfo = potInfo;
    }
    BetInfo() {
        var _a, _b;
        (_a = this.currBetInfo) === null || _a === void 0 ? void 0 : _a.destroy();
        const betInfo = this.add.text(990, 70, "Bet: " + String((_b = this.table) === null || _b === void 0 ? void 0 : _b.betMoney), {
            fontSize: "15px",
            color: "#ffffff",
            fontFamily: "pixel",
        });
        this.currBetInfo = betInfo;
    }
    playerInfo() {
        this.playerNameText();
        this.playerChipText();
        setTimeout(() => {
            this.playerHandText();
        }, 2000);
    }
    tableInfo() {
        this.turnInfo();
        this.PotInfo();
        this.BetInfo();
    }
    playerNameText() {
        var _a, _b, _c;
        this.playerNameInfo.forEach((name) => name.destroy());
        for (let i = 0; i < ((_a = this.table) === null || _a === void 0 ? void 0 : _a.players.length); i++) {
            const currPlayer = (_b = this.table) === null || _b === void 0 ? void 0 : _b.players[i];
            const playerInfo = this.add.text(this.setXPosition(i), i == 0
                ? this.height - 150
                : i == 1
                    ? this.height / 2 - 160
                    : i == 2
                        ? 40
                        : this.height / 2 + 100, "Name: " + (currPlayer === null || currPlayer === void 0 ? void 0 : currPlayer.name), {
                fontSize: "15px",
                color: "#ffffff",
                fontFamily: "pixel",
            });
            if (((_c = this.table) === null || _c === void 0 ? void 0 : _c.playerIndexCounter) == i &&
                ((currPlayer === null || currPlayer === void 0 ? void 0 : currPlayer.gameStatus) == "bet" ||
                    (currPlayer === null || currPlayer === void 0 ? void 0 : currPlayer.gameStatus) == "blind")) {
                playerInfo.setFont("bold 17px pixel");
                playerInfo.setColor("#ffd700");
            }
            this.playerNameInfo.push(playerInfo);
        }
    }
    playerHandText() {
        var _a, _b, _c, _d, _e, _f;
        this.playerHandInfo.forEach((hand) => hand.destroy());
        if (((_a = this.table) === null || _a === void 0 ? void 0 : _a.gamePhase) == "evaluating") {
            for (let i = 0; i < ((_b = this.table) === null || _b === void 0 ? void 0 : _b.players.length); i++) {
                const currPlayer = (_c = this.table) === null || _c === void 0 ? void 0 : _c.players[i];
                const playerInfo = this.add.text(this.setXPosition(i), i == 0
                    ? this.height - 110
                    : i == 1
                        ? this.height / 2 - 110
                        : i == 2
                            ? 80
                            : this.height / 2 + 150, currPlayer.gameStatus == "fold"
                    ? "fold"
                    : "Hand: " +
                        (currPlayer === null || currPlayer === void 0 ? void 0 : currPlayer.getHandScore(this.table.dealer)), {
                    fontSize: "15px",
                    color: "#ffffff",
                    fontFamily: "pixel",
                });
                this.playerHandInfo.push(playerInfo);
            }
        }
        if (((_d = this.table) === null || _d === void 0 ? void 0 : _d.gamePhase) == "betting" ||
            ((_e = this.table) === null || _e === void 0 ? void 0 : _e.gamePhase) == "dealer turn") {
            const currPlayer = (_f = this.table) === null || _f === void 0 ? void 0 : _f.players[0];
            const playerInfo = this.add.text(this.setXPosition(0), this.height - 110, currPlayer.gameStatus == "fold"
                ? "fold"
                : "Hand: " + (currPlayer === null || currPlayer === void 0 ? void 0 : currPlayer.playerHandStatus), {
                fontSize: "15px",
                color: "#ffffff",
                fontFamily: "pixel",
            });
            this.playerHandInfo.push(playerInfo);
        }
    }
    playerBetText() {
        this.playerBetInfo.forEach((bet) => bet.destroy());
    }
    playerChipText() {
        var _a, _b, _c;
        this.playerChipsInfo.forEach((chip) => chip.destroy());
        for (let i = 0; i < ((_a = this.table) === null || _a === void 0 ? void 0 : _a.players.length); i++) {
            const currPlayer = (_b = this.table) === null || _b === void 0 ? void 0 : _b.players[i];
            const playerInfo = this.add.text(this.setXPosition(i), i == 0
                ? this.height - 130
                : i == 1
                    ? this.height / 2 - 130
                    : i == 2
                        ? 60
                        : this.height / 2 + 120, "CHIP: " + String(currPlayer === null || currPlayer === void 0 ? void 0 : currPlayer.chips), {
                fontSize: "15px",
                color: "#ffffff",
                fontFamily: "pixel",
            });
            if (((_c = this.table) === null || _c === void 0 ? void 0 : _c.playerIndexCounter) == i &&
                ((currPlayer === null || currPlayer === void 0 ? void 0 : currPlayer.gameStatus) == "bet" ||
                    (currPlayer === null || currPlayer === void 0 ? void 0 : currPlayer.gameStatus) == "blind")) {
                playerInfo.setFont("bold 17px pixel");
                playerInfo.setColor("#ffd700");
            }
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
    createPassButton(y) {
        const callButton = new Button(this, 750, y, "pass", "gray-button", () => {
            var _a;
            console.log("pass");
            (_a = this.table) === null || _a === void 0 ? void 0 : _a.haveTurn("call");
            this.renderScene();
            this.actionButtons.forEach((button) => button.destroy());
            this.playerInfo();
        });
        this.actionButtons.push(callButton);
    }
    createCallButton(y) {
        const callButton = new Button(this, 750, y, "call", "gray-button", () => {
            var _a;
            console.log("calll");
            (_a = this.table) === null || _a === void 0 ? void 0 : _a.haveTurn("call");
            this.renderScene();
            this.actionButtons.forEach((button) => button.destroy());
            this.playerInfo();
        });
        this.actionButtons.push(callButton);
    }
    createAllInButton(y) {
        const allInButton = new Button(this, 750, y, "allIn", "gray-button", () => {
            var _a;
            console.log("allIn");
            (_a = this.table) === null || _a === void 0 ? void 0 : _a.haveTurn("allin");
            this.renderScene();
            this.actionButtons.forEach((button) => button.destroy());
            this.playerInfo();
        });
        this.actionButtons.push(allInButton);
    }
    createCheckButton(y) {
        const checkButton = new Button(this, 750, y, "check", "gray-button", () => {
            var _a;
            console.log("check");
            (_a = this.table) === null || _a === void 0 ? void 0 : _a.haveTurn("check");
            this.renderScene();
            this.actionButtons.forEach((button) => button.destroy());
            this.playerInfo();
        });
        this.actionButtons.push(checkButton);
    }
    createFoldButton(y) {
        const foldButton = new Button(this, 750, y, "fold", "gray-button", () => {
            var _a;
            console.log("fold");
            (_a = this.table) === null || _a === void 0 ? void 0 : _a.haveTurn("fold");
            this.renderScene();
            this.actionButtons.forEach((button) => button.destroy());
            this.playerInfo();
        });
        this.actionButtons.push(foldButton);
    }
    createRaiseButton(y) {
        const raiseButton = new Button(this, 750, y, "raise", "gray-button", () => {
            var _a;
            console.log("raise");
            (_a = this.table) === null || _a === void 0 ? void 0 : _a.haveTurn("raise");
            this.renderScene();
            this.actionButtons.forEach((button) => button.destroy());
            this.playerInfo();
        });
        this.actionButtons.push(raiseButton);
    }
}
//# sourceMappingURL=pokerScene.js.map