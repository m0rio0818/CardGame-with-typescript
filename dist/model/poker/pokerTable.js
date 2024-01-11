import { pokerIndexOfNum, } from "../../config/pokerConfig.js";
import Card from "../common/Card.js";
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
        this.dealerIndex = 2;
        this.playerIndexCounter = this.dealerIndex + 1;
        this.betIndex = (this.dealerIndex + 2) % this.players.length;
        this.minbet = 5;
        this.smallBlind = Math.floor(this.minbet / 2);
        this.bigBlind = Math.floor(this.minbet);
        this.betMoney = this.minbet;
        this.blindCounter = 0;
        this.pot = 0;
        this.maxTurn = maxTurn;
    }
    assignPlayerHands() {
        for (let i = 0; i < this.players.length; i++) {
            if (i == 0) {
                this.players[i].hand.push(new Card("H", "10"));
                this.players[i].hand.push(new Card("D", "4"));
            }
            else if (i == 1) {
                this.players[i].hand.push(new Card("C", "4"));
                this.players[i].hand.push(new Card("H", "9"));
            }
            else if (i == 2) {
                this.players[i].hand.push(new Card("H", "K"));
                this.players[i].hand.push(new Card("S", "2"));
            }
            else {
                this.players[i].hand.push(new Card("D", "2"));
                this.players[i].hand.push(new Card("S", "K"));
            }
        }
    }
    sortPlayerScore() {
        let sortedPlayers = this.players.sort((a, b) => {
            return a.chips - b.chips;
        });
        return sortedPlayers;
    }
    clearPlayerHandsAndBets() {
        this.players.map((player) => {
            player.bet = 0;
            player.gameStatus = "blind";
            player.hand = [];
            player.Cards = [];
            player.parisOfCardList = [];
            player.pairsOfFourList = [];
            player.pairsOfThreeList = [];
            player.pairsOfTwoList = [];
        });
        this.dealer.hand = [];
        this.blindCounter = 0;
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
            console.log(player.name, player.playerHandStatus);
        });
        this.players.map((player) => {
            if (player.gameStatus != "fold") {
                hashMap.set(player.playerHandStatus, hashMap.get(player.playerHandStatus) + 1);
            }
        });
        let highRole = "";
        for (const [key, value] of hashMap) {
            if (value > 0) {
                highRole = key;
                break;
            }
        }
        console.log(highRole, hashMap.get(highRole));
        let winnerPlayer = this.players.filter((player) => player.playerHandStatus == highRole);
        let strongestHand = winnerPlayer[0].playerHandStatus;
        if (winnerPlayer.length > 1) {
            winnerPlayer.map((player) => {
                console.log(player.name, player.pairsOfTwoList, player.pairsOfThreeList, player.parisOfCardList);
            });
            console.log("複数人います。");
            if (strongestHand == "four card") {
                let maxFourCard = winnerPlayer[0].pairsOfFourList[0];
                let maxFourCardIndex = 0;
                for (let i = 1; i < winnerPlayer.length; i++) {
                    let currPlayer = winnerPlayer[i];
                    if (pokerIndexOfNum.indexOf(maxFourCard) <
                        pokerIndexOfNum.indexOf(currPlayer.pairsOfFourList[0])) {
                        maxFourCard = currPlayer.pairsOfFourList[0];
                        maxFourCardIndex = i;
                    }
                }
                if (winnerPlayer[0].pairsOfFourList[0] != maxFourCard) {
                    winnerPlayer[maxFourCardIndex].chips += this.pot;
                }
                else {
                    winnerPlayer = winnerPlayer.filter((player) => player.pairsOfFourList[0] == maxFourCard);
                    this.drawSplitChip(winnerPlayer);
                }
            }
            else if (strongestHand == "full house" ||
                strongestHand == "three card") {
                let maxThreeCard = winnerPlayer[0].pairsOfThreeList[0];
                let maxThreeCardIndex = 0;
                let maxTwoCard = winnerPlayer[0].pairsOfTwoList[0];
                let maxTwoCardIndex = 0;
                for (let i = 1; i < winnerPlayer.length; i++) {
                    let currPlayer = winnerPlayer[i];
                    if (strongestHand == "full house") {
                        if (pokerIndexOfNum.indexOf(maxTwoCard) <
                            pokerIndexOfNum.indexOf(currPlayer.pairsOfTwoList[0])) {
                            maxTwoCard = currPlayer.pairsOfTwoList[0];
                            maxTwoCardIndex = i;
                        }
                    }
                    if (pokerIndexOfNum.indexOf(maxThreeCard) <
                        pokerIndexOfNum.indexOf(currPlayer.pairsOfThreeList[0])) {
                        maxThreeCard = currPlayer.pairsOfThreeList[0];
                        maxThreeCardIndex = i;
                    }
                }
                if (winnerPlayer[0].pairsOfThreeList[0] != maxThreeCard) {
                    console.log("最大pairsOfTwo 判断", maxThreeCardIndex, maxThreeCard);
                    winnerPlayer[maxThreeCardIndex].chips += this.pot;
                }
                else {
                    if (strongestHand == "three card") {
                        winnerPlayer = winnerPlayer.filter((player) => player.pairsOfThreeList[0] == maxThreeCard);
                        this.drawSplitChip(winnerPlayer);
                    }
                    else {
                        if (winnerPlayer[0].pairsOfTwoList[0] != maxTwoCard) {
                            console.log("最大pairsOfTwo 判断", maxTwoCardIndex, maxTwoCard);
                            winnerPlayer[maxTwoCardIndex].chips += this.pot;
                        }
                        else {
                            winnerPlayer = winnerPlayer.filter((player) => player.pairsOfTwoList[0] == maxTwoCard);
                            this.drawSplitChip(winnerPlayer);
                        }
                    }
                }
            }
            else if (strongestHand == "two pair" ||
                strongestHand == "one pair") {
                console.log("paris of two pair || one pair");
                for (let j = winnerPlayer[0].pairsOfTwoList.length - 1; j >= 0; j--) {
                    let currHand = winnerPlayer[0].pairsOfTwoList[j];
                    for (let i = 0; i < winnerPlayer.length; i++) {
                        let currPlayerHand = winnerPlayer[i].pairsOfTwoList[j];
                        console.log(currHand, currPlayerHand);
                        if (currHand != currPlayerHand) {
                            if (pokerIndexOfNum.indexOf(currHand) <
                                pokerIndexOfNum.indexOf(currPlayerHand)) {
                                currHand = currPlayerHand;
                            }
                        }
                    }
                    winnerPlayer = winnerPlayer.filter((player) => player.pairsOfTwoList[j] == currHand);
                    if (winnerPlayer.length == 1)
                        break;
                }
                console.log("two pairの判定終了", winnerPlayer);
                if (winnerPlayer.length > 1) {
                    for (let j = winnerPlayer[0].parisOfCardList.length - 1; j >= 0; j--) {
                        let currHand = winnerPlayer[0].parisOfCardList[j];
                        for (let i = 0; i < winnerPlayer.length; i++) {
                            let currPlayerHand = winnerPlayer[i].parisOfCardList[j];
                            console.log(currHand, currPlayerHand);
                            if (currHand != currPlayerHand) {
                                if (pokerIndexOfNum.indexOf(currHand) <
                                    pokerIndexOfNum.indexOf(currPlayerHand)) {
                                    currHand = currPlayerHand;
                                }
                            }
                        }
                        winnerPlayer = winnerPlayer.filter((player) => player.parisOfCardList[j] == currHand);
                        if (winnerPlayer.length == 1)
                            break;
                    }
                }
                winnerPlayer.length > 1
                    ? this.drawSplitChip(winnerPlayer)
                    : (winnerPlayer[0].chips += this.pot);
            }
            else {
                for (let j = winnerPlayer[0].parisOfCardList.length - 1; j >= 0; j--) {
                    let currHand = winnerPlayer[0].parisOfCardList[j];
                    for (let i = 0; i < winnerPlayer.length; i++) {
                        let currPlayerHand = winnerPlayer[i].parisOfCardList[j];
                        if (currHand != currPlayerHand) {
                            if (pokerIndexOfNum.indexOf(currHand) <
                                pokerIndexOfNum.indexOf(currPlayerHand)) {
                                currHand = currPlayerHand;
                            }
                        }
                    }
                    winnerPlayer = winnerPlayer.filter((player) => player.parisOfCardList[j] == currHand);
                    if (winnerPlayer.length == 1)
                        break;
                }
                winnerPlayer.length > 1
                    ? this.drawSplitChip(winnerPlayer)
                    : (winnerPlayer[0].chips += this.pot);
            }
        }
        else {
            let winnerPlayer = this.players.filter((player) => player.playerHandStatus == highRole);
            console.log(winnerPlayer);
            winnerPlayer[0].chips += this.pot;
        }
        for (let i = 0; i < this.players.length; i++) {
            roundLog +=
                this.players[i].chips +
                    (i != this.players.length - 1 ? "," : "");
        }
        return roundLog;
    }
    drawSplitChip(winnerPlayers) {
        winnerPlayers.map((player) => (player.chips += Math.floor(this.pot / winnerPlayers.length)));
    }
    checkAllOtherPlayerStatus(player) {
        for (let i = 0; i < this.players.length; i++) {
            let currPlayer = this.players[i];
            if (currPlayer != player) {
                if (currPlayer.gameStatus != "allin" &&
                    currPlayer.gameStatus != "fold") {
                    return true;
                }
            }
        }
        return false;
    }
    evaluateMove(player, userData) {
        if (player.type == "dealer") {
            if (this.turnCounter == 0) {
                this.dealer.hand.push(new Card("S", "9"));
                this.dealer.hand.push(new Card("C", "3"));
                this.dealer.hand.push(new Card("D", "4"));
            }
            else if (this.turnCounter == 1) {
                this.dealer.hand.push(new Card("H", "3"));
            }
            else if (this.turnCounter == 2) {
                this.dealer.hand.push(new Card("S", "10"));
            }
            console.log("turnCounter !!: ", this.turnCounter);
            this.turnCounter++;
            if (this.turnCounter == 4) {
                console.log("最終ラウンドまで来た。");
                this.gamePhase = "evaluating";
            }
            this.clearPlayerBet();
            this.changePlayerStatusToBet();
            this.updatePlayerHandStatus();
            this.playerIndexCounter = this.dealerIndex + 1;
            this.betMoney = this.minbet;
            console.log("ディーラーのhand", this.dealer.hand);
            console.log("次のラウンドの開始person", this.getTurnPlayer().name);
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
            if (this.gamePhase != "blinding" && player.gameStatus != "fold") {
                console.log(player.name, "Info: ", player.getHandScore(this.dealer));
            }
            switch (gameDecision.action) {
                case "bet":
                    console.log("ベットできてません。もう一度選択してください");
                    break;
                case "blind":
                    console.log(this.playerIndexCounter, this.dealerIndex);
                    if (this.blindCounter == 0)
                        this.assignPlayerHands();
                    console.log(player.name, "before blind", player);
                    player.bet =
                        this.blindCounter == 0
                            ? this.smallBlind
                            : this.bigBlind;
                    this.blindCounter++;
                    console.log("player Blind bet money", player.bet);
                    player.chips -= player.bet;
                    this.pot += player.bet;
                    player.gameStatus = "bet";
                    console.log(player.name, "after blind", player);
                    if (this.blindCounter == 2) {
                        this.gamePhase = "betting";
                        this.changePlayerStatusToBet();
                        this.blindCounter = 0;
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
                    console.log(player.name, "after raise", player);
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
        if (this.checkchipsEqualsZero()) {
            this.gamePhase == "evaluating";
        }
        if (this.gamePhase == "dealer turn")
            this.gamePhase = "betting";
        else if (this.gamePhase == "evaluating") {
            console.log("ROUND  OWARI!!!!");
            this.resultsLog.push(this.evaluateAndGetRoundResults());
            this.clearPlayerHandsAndBets();
            this.roundCounter++;
            this.deck.resetDeck();
            this.moveToNextDealer();
            this.gamePhase = "blinding";
            console.log("ラウンド終了次はblinding", this.gamePhase);
            console.log(this.resultsLog);
            return;
        }
        let player = this.getTurnPlayer();
        this.checkAllOtherPlayerStatus(player);
        let playerBefore = this.getoneBeforePlayer();
        console.log("currPlayer: ", player.name);
        if (this.allPlayerActionResolved()) {
            this.gamePhase = "dealer turn";
            this.evaluateMove(this.dealer);
            console.log("this.gamePhase: ", "ディーラーのターンです。", this.gamePhase);
        }
        else {
            if ((userData == "check" &&
                player.type == "player" &&
                (playerBefore.gameStatus == "check" ||
                    (this.playerIndexCounter == this.betIndex &&
                        player.gameStatus == "bet"))) ||
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
            else if (player.chips <= this.betMoney && player.chips > 0) {
                console.log(player.name, "の所持金が最小ベット額より少ないです！！", this.betMoney, player.chips);
                this.evaluateMove(player, "allin");
            }
            else if (player.chips <= this.betMoney * 2 &&
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
            console.log("after action...");
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
    playerallFoldorAllIn(player) {
        return player.gameStatus == "allin" || player.gameStatus == "fold";
    }
    updatePlayerHandStatus() {
        for (let player of this.players) {
            if (player.gameStatus != "fold") {
                player.getHandScore(this.dealer);
            }
        }
    }
    allPlayerActionResolved() {
        for (let player of this.players) {
            if (!this.playerActionResolved(player))
                return false;
        }
        return true;
    }
    allplayerAllInOrFold() {
        for (let player of this.players) {
            if (!this.playerallFoldorAllIn(player))
                return false;
        }
        return true;
    }
    printPlayerStatus() {
        for (let player of this.players) {
            console.log(player.type, player.name, player.gameStatus, player.chips);
        }
    }
    checkchipsEqualsZero() {
        let player = this.players.filter((player) => player.chips == 0);
        return player.length == 1;
    }
    onLastPlayer() {
        return this.playerIndexCounter == this.betIndex;
    }
    moveToNextDealer() {
        this.dealerIndex++;
        this.dealerIndex %= this.players.length;
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