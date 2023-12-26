import { pokerIndexOfNum, } from "../../config/pokerConfig.js";
import Table from "../common/Table.js";
import pokerPlayer from "./pokerPlayer.js";
export default class pokerTable extends Table {
    constructor(gameType, maxTurn) {
        super(gameType);
        this.dealer = new pokerPlayer("Dealer", "dealer", gameType);
        this.gamePhase = "blinding";
        this.players = [
            new pokerPlayer("p1", "player", gameType),
            new pokerPlayer("p2", "ai", gameType),
            new pokerPlayer("p3", "ai", gameType),
            new pokerPlayer("p4", "ai", gameType),
        ];
        this.dealerIndex = 0;
        this.playerIndexCounter = this.dealerIndex + 1;
        this.betIndex = (this.dealerIndex + 2) % this.players.length;
        this.minbet = 5;
        this.smallBlind = Math.floor(this.minbet / 2);
        this.bigBlind = Math.floor(this.minbet);
        this.betMoney = this.minbet;
        this.pot = 0;
        this.maxTurn = maxTurn;
    }
    assignPlayerHands() {
        for (let player of this.players) {
            player.hand.push(this.deck.drawCard());
            player.hand.push(this.deck.drawCard());
        }
    }
    sortPlayerScore() {
        let sortedPlayers = this.players.sort((a, b) => {
            return a.chips - b.chips;
        });
        return sortedPlayers;
    }
    clearPlayerHandsAndBets() {
        for (let player of this.players) {
            player.hand = [];
            player.bet = 0;
            player.gameStatus = "blind";
            player.parisOfCardList = [];
            player.pairsOfFourList = [];
            player.pairsOfThreeList = [];
            player.pairsOfTwoList = [];
        }
        this.dealer.hand = [];
        this.pot = 0;
        this.turnCounter = 0;
    }
    clearPlayerBet() {
        for (let player of this.players) {
            player.bet = 0;
        }
    }
    evaluateAndGetRoundResults() {
        let winners = [];
        let roundLog = "";
        const hashMap = new Map();
        hashMap.set("royal flush", 0);
        hashMap.set("straight flush", 0);
        hashMap.set("four card", 0);
        hashMap.set("full house", 0);
        hashMap.set("flush", 0);
        hashMap.set("straight", 0);
        hashMap.set("three card", 0);
        hashMap.set("two pair", 0);
        hashMap.set("one pair", 0);
        hashMap.set("no pair", 0);
        hashMap.set("fold", 0);
        console.log("ログ、勝敗判定します");
        this.players.map((player) => {
            if (player.gameStatus != "fold") {
                hashMap.set(player.playerHandStatus, hashMap.get(player.playerHandStatus) + 1);
            }
        });
        let heighRole = "";
        for (const [key, value] of hashMap) {
            if (value > 0) {
                heighRole = key;
                break;
            }
        }
        console.log(heighRole, hashMap.get(heighRole));
        if (hashMap.get(heighRole) > 1) {
            let winnerPlayer = this.players.filter((player) => player.playerHandStatus == heighRole);
            winnerPlayer.map((player) => {
                console.log(player.name, player.pairsOfTwoList, player.pairsOfThreeList, player.parisOfCardList);
            });
            console.log("複数人います。", winnerPlayer.map((player) => player.playerHandStatus));
            if (winnerPlayer[0].playerHandStatus == "four card") {
            }
            else if (winnerPlayer[0].playerHandStatus == "full house" ||
                winnerPlayer[0].playerHandStatus == "three card") {
                let maxThreeCard = winnerPlayer[0].pairsOfThreeList[0];
                let maxThreeCardIndex = 0;
                for (let i = 1; i < winnerPlayer.length; i++) {
                    if (pokerIndexOfNum.indexOf(maxThreeCard) <
                        pokerIndexOfNum.indexOf(winnerPlayer[i].pairsOfThreeList[0])) {
                        maxThreeCard = winnerPlayer[i].pairsOfThreeList[0];
                        maxThreeCardIndex = i;
                    }
                }
            }
            else if (winnerPlayer[0].playerHandStatus == "two pair" ||
                winnerPlayer[0].playerHandStatus == "one pair") {
                let startPlayer = winnerPlayer[0];
                let currHand = startPlayer.pairsOfTwoList[startPlayer.pairsOfTwoList.length - 1];
                let currIndex = 0;
                console.log("currHand", currHand);
                let flag = false;
                for (let j = startPlayer.pairsOfTwoList.length - 1; j >= 0; j--) {
                    currHand = startPlayer.pairsOfTwoList[j];
                    for (let i = 0; i < winnerPlayer.length; i++) {
                        let currPlayerHand = winnerPlayer[i].pairsOfTwoList[j];
                        console.log("currHand", currHand, "playerHand", currPlayerHand);
                        if (currHand != currPlayerHand) {
                            flag = true;
                            if (pokerIndexOfNum.indexOf(currHand) <
                                pokerIndexOfNum.indexOf(currPlayerHand)) {
                                winnerPlayer;
                                currHand = currPlayerHand;
                                currIndex = i;
                                console.log("currHand", currHand, "currIndex", currIndex, "flag", flag);
                            }
                        }
                    }
                    console.log("currhand:", currHand);
                    if (flag) {
                        winnerPlayer = winnerPlayer.filter((player) => player.pairsOfTwoList[j] == currHand);
                    }
                }
                if (winnerPlayer.length == 1) {
                    console.log("Winner", winnerPlayer[0].name);
                    winners.push(winnerPlayer[0]);
                    for (let i = 0; i < this.players.length; i++) {
                        roundLog +=
                            this.players[i].chips +
                                (i != this.players.length - 1 ? "," : "");
                    }
                    return roundLog;
                }
                else {
                    flag = false;
                    if (!flag) {
                        for (let j = winnerPlayer[0].parisOfCardList.length - 1; j >= 0; j--) {
                            currHand = winnerPlayer[0].parisOfCardList[j];
                            for (let i = 0; i < winnerPlayer.length; i++) {
                                let currPlayerHand = winnerPlayer[i].parisOfCardList[j];
                                console.log(currIndex, currHand, currPlayerHand);
                                if (currHand != currPlayerHand) {
                                    flag = true;
                                    if (pokerIndexOfNum.indexOf(currHand) <
                                        pokerIndexOfNum.indexOf(currPlayerHand)) {
                                        currHand = currPlayerHand;
                                        currIndex = i;
                                        console.log("currHand", currHand, "currIndex", currIndex, flag);
                                    }
                                }
                            }
                            if (flag)
                                break;
                        }
                    }
                }
                if (!flag) {
                    console.log("引き分け");
                    for (let player of winnerPlayer) {
                        console.log(player, player.name);
                        player.chips += Math.floor(this.pot / winnerPlayer.length);
                    }
                }
                else {
                    winnerPlayer[currIndex].chips += this.pot;
                }
                console.log(currIndex, winnerPlayer[currIndex].name, flag);
            }
            else {
                let currHand = winnerPlayer[0].pairsOfTwoList[winnerPlayer[0].pairsOfTwoList.length - 1];
                let currIndex = 0;
                let flag = false;
                for (let j = winnerPlayer[0].parisOfCardList.length - 1; j >= 0; j--) {
                    currHand = winnerPlayer[0].parisOfCardList[j];
                    for (let i = 0; i < winnerPlayer.length; i++) {
                        let currPlayerHand = winnerPlayer[i].parisOfCardList[j];
                        console.log(currIndex, currHand, currPlayerHand);
                        if (currHand != currPlayerHand) {
                            flag = true;
                            if (pokerIndexOfNum.indexOf(currHand) <
                                pokerIndexOfNum.indexOf(currPlayerHand)) {
                                currHand = currPlayerHand;
                                currIndex = i;
                                console.log("currHand", currHand, "currIndex", currIndex, flag);
                            }
                        }
                    }
                    if (flag)
                        break;
                }
                if (!flag) {
                    for (let player of winnerPlayer) {
                        console.log(player, player.name);
                        player.chips += Math.floor(this.pot / winnerPlayer.length);
                    }
                }
                else {
                    winnerPlayer[currIndex].chips += this.pot;
                }
                console.log(currIndex, winnerPlayer[currIndex].name, flag);
            }
            winnerPlayer.map((player) => {
                console.log(player.name, player.pairsOfTwoList, player.pairsOfThreeList, player.parisOfCardList);
            });
        }
        else {
            let winnerPlayer = this.players.filter((player) => player.playerHandStatus == heighRole);
            console.log(winnerPlayer);
            winnerPlayer[0].chips += this.pot;
            this.pot = 0;
        }
        for (let i = 0; i < this.players.length; i++) {
            roundLog +=
                this.players[i].chips +
                    (i != this.players.length - 1 ? "," : "");
        }
        return roundLog;
    }
    compairPairsOfTwo(playerList) {
        let currHand;
        let currIndex = 0;
        let flag = false;
        for (let j = playerList[0].pairsOfTwoList.length - 1; j >= 0; j--) {
            currHand = playerList[0].pairsOfTwoList[j];
            for (let i = 0; i < playerList.length; i++) {
                let currPlayerHand = playerList[i].pairsOfTwoList[j];
                console.log(currIndex, currHand, currPlayerHand);
                if (currHand != currPlayerHand) {
                    flag = true;
                    if (pokerIndexOfNum.indexOf(currHand) <
                        pokerIndexOfNum.indexOf(currPlayerHand)) {
                        currHand = currPlayerHand;
                        currIndex = i;
                        console.log("currHand", currHand, "currIndex", currIndex, flag);
                    }
                }
            }
            if (flag)
                break;
        }
        return flag;
    }
    evaluateMove(player, userData) {
        if (player.type == "dealer") {
            if (this.turnCounter == 0) {
                this.dealer.hand.push(this.deck.drawCard());
                this.dealer.hand.push(this.deck.drawCard());
                this.dealer.hand.push(this.deck.drawCard());
            }
            else if (this.turnCounter < 3) {
                this.dealer.hand.push(this.deck.drawCard());
            }
            console.log("turnCounter !!: ", this.turnCounter);
            this.turnCounter++;
            if (this.turnCounter == 4) {
                console.log("最終ラウンドまで来た。");
                this.gamePhase = "evaluating";
            }
            this.clearPlayerBet();
            this.changePlayerStatusToBet();
            this.playerIndexCounter = this.dealerIndex + 1;
            this.betMoney = this.minbet;
            console.log("ディーラーのhand", this.dealer.hand);
            console.log("次のラウンドの開始person", this.getTurnPlayer().name);
            this.printPlayerStatus();
        }
        else {
            console.log("PLAYERINDEXCOUNTER ", this.playerIndexCounter, "BETINDEX", this.betIndex, player.name, player.gameStatus, player.chips);
            if (this.onLastPlayer() &&
                player.gameStatus != "bet" &&
                player.gameStatus != "blind") {
                console.log("一周してきました。ディーラーに移行");
                this.gamePhase = "dealer turn";
                return;
            }
            console.log("userData", userData);
            let gameDecision = player.promptPlayer(userData, this.betMoney);
            console.log(gameDecision);
            if (this.gamePhase != "blinding") {
                console.log("player Info: ", player.getHandScore(this.dealer));
            }
            switch (gameDecision.action) {
                case "bet":
                    console.log("ベットできてません。もう一度選択してください");
                    break;
                case "blind":
                    console.log(this.playerIndexCounter, this.dealerIndex);
                    if (this.playerIndexCounter == this.dealerIndex + 1)
                        this.assignPlayerHands();
                    console.log(player.name, "before blind", player);
                    player.bet =
                        this.playerIndexCounter == this.dealerIndex + 1
                            ? this.smallBlind
                            : this.bigBlind;
                    console.log("player Blind bet money", player.bet);
                    player.chips -= player.bet;
                    this.pot += player.bet;
                    player.gameStatus = "bet";
                    console.log(player.name, "after blind", player);
                    if (this.playerIndexCounter == this.dealerIndex + 2) {
                        this.gamePhase = "betting";
                        this.changePlayerStatusToBet();
                    }
                    break;
                case "call":
                    if (this.getoneBeforePlayer().gameStatus == "check") {
                        this.betIndex = this.playerIndexCounter;
                        this.changePlayerStatusToBet();
                    }
                    console.log(player.name, "before call", player);
                    let playercallMoney = gameDecision.amount;
                    let callBet = player.bet;
                    console.log("call前のbet", player.bet);
                    let playerHaveToCall = playercallMoney - callBet;
                    player.bet += playerHaveToCall;
                    console.log("call後のbet", player.bet);
                    player.chips -= playerHaveToCall;
                    this.pot += playerHaveToCall;
                    player.gameStatus = "call";
                    console.log(player.name, "after call", player);
                    break;
                case "raise":
                    console.log(player.chips);
                    console.log(player.name, "before raise", player);
                    let playerRaiseMoney = gameDecision.amount;
                    this.betMoney = gameDecision.amount;
                    let raiseBet = player.bet;
                    let playerHaveToRaise = playerRaiseMoney - raiseBet;
                    this.pot += playerHaveToRaise;
                    player.chips -= playerHaveToRaise;
                    this.betIndex = this.playerIndexCounter;
                    this.changePlayerStatusToBet();
                    player.gameStatus = "raise";
                    this.printPlayerStatus();
                    console.log(player.name, "after raise", player);
                    console.log(player.chips);
                    break;
                case "allin":
                    if (player.gameStatus == "allin")
                        break;
                    this.pot += gameDecision.amount;
                    player.chips -= gameDecision.amount;
                    player.gameStatus = "allin";
                    break;
                case "check":
                    console.log(player.name, "before check", player);
                    player.gameStatus = "check";
                    console.log(player.name, "after check", player);
                    break;
                case "fold":
                    console.log(player.name, "降ります。");
                    player.gameStatus = "fold";
                    break;
            }
            console.log("Pot Money", this.pot);
        }
    }
    haveTurn(userData) {
        if (this.gamePhase == "dealer turn")
            this.gamePhase = "betting";
        else if (this.gamePhase == "evaluating") {
            console.log("ROUND  OWARI!!!!");
            this.resultsLog.push(this.evaluateAndGetRoundResults());
            this.clearPlayerHandsAndBets();
            this.roundCounter++;
            this.gamePhase = "blinding";
            console.log("ラウンド終了次はblinding", this.gamePhase);
            return;
        }
        let player = this.getTurnPlayer();
        let playerBefore = this.getoneBeforePlayer();
        console.log("currPlayer: ", player.name);
        this.printPlayerStatus();
        if (this.allPlayerActionResolved()) {
            this.gamePhase = "dealer turn";
            this.evaluateMove(this.dealer);
            console.log("this.gamePhase: ", "ディーラーのターンです。", this.gamePhase);
        }
        else {
            if ((userData == "check" && player.type == "player") &&
                (playerBefore.gameStatus == "check" ||
                    (this.playerIndexCounter == this.betIndex &&
                        player.gameStatus == "bet")) ||
                (userData == "check" && player.type == "player")) {
                console.log(playerBefore.gameStatus, this.playerIndexCounter, this.betIndex, player.gameStatus, "checkできる!");
                if (userData == "check")
                    this.evaluateMove(player, "check");
                else
                    this.evaluateMove(player, userData);
            }
            else if (player.gameStatus == "fold" ||
                player.gameStatus == "allin") {
                console.log(player.name + "はこのゲームでは何もできません。");
                this.evaluateMove(player, player.gameStatus);
            }
            else if (player.chips == 0) {
                this.evaluateMove(player, "fold");
            }
            else if (player.chips < this.betMoney) {
                console.log(player.name, "の所持金が最小ベット額より少ないです！！", this.betMoney, player.chips);
                this.evaluateMove(player, "allin");
            }
            else if (player.chips < this.betMoney * 2 &&
                player.chips > 0 &&
                userData == "raise") {
                console.log("所持金足りないからRAISEできませんよ!!!!!");
                console.log("強制call");
                this.evaluateMove(player, "call");
            }
            else {
                player.type == "player"
                    ? this.evaluateMove(player, userData)
                    :
                        this.gamePhase == "betting"
                            ? this.evaluateMove(player, "bet")
                            : this.evaluateMove(player);
            }
            this.printPlayerStatus();
            this.moveToNextPlayer();
        }
    }
    playerActionResolved(player) {
        return (player.gameStatus == "call" ||
            player.gameStatus == "check" ||
            player.gameStatus == "fold" ||
            player.gameStatus == "raise" ||
            player.gameStatus == "allin");
    }
    allPlayerActionResolved() {
        for (let player of this.players) {
            if (!this.playerActionResolved(player))
                return false;
        }
        return true;
    }
    printPlayerStatus() {
        for (let player of this.players) {
            console.log(player.type, player.name, player.gameStatus, player.chips);
        }
    }
    onLastPlayer() {
        return this.playerIndexCounter == this.betIndex;
    }
    moveToNextPlayer() {
        this.playerIndexCounter++;
        this.playerIndexCounter %= this.players.length;
    }
    changePlayerStatusToBet() {
        for (let player of this.players) {
            if (player.gameStatus != "fold" && player.gameStatus != "allin")
                player.gameStatus = "bet";
        }
    }
    getTurnPlayer() {
        return this.players[this.playerIndexCounter % this.players.length];
    }
    getoneBeforePlayer() {
        return this.players[(this.playerIndexCounter + this.players.length - 1) %
            this.players.length];
    }
}
//# sourceMappingURL=pokerTable.js.map