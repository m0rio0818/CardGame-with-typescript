import Table from "../common/Table.js";
import pokerPlayer from "./pokerPlayer.js";
export default class pokerTable extends Table {
    constructor(gameType) {
        super(gameType);
        this.betDenominations = [5, 10, 20, 50, 100];
        this.dealer = new pokerPlayer("Dealer", "dealer", gameType);
        this.gamePhase = "blinding";
        this.players = [
            new pokerPlayer("p1", "player", gameType),
            new pokerPlayer("p2", "player", gameType),
            new pokerPlayer("p3", "player", gameType),
            new pokerPlayer("p4", "player", gameType),
        ];
        this.dealerIndex = 0;
        this.turnCounter = this.dealerIndex + 1;
        this.betIndex = (this.dealerIndex + 2) % this.players.length;
        this.minbet = 5;
        this.smallBlind = Math.floor(this.minbet / 2);
        this.bigBlind = Math.floor(this.minbet);
        this.betMoney = this.minbet;
        this.pot = 0;
    }
    assignPlayerHands() {
        for (let player of this.players) {
            player.hand.push(this.deck.drawCard());
            player.hand.push(this.deck.drawCard());
        }
    }
    clearPlayerHandsAndBets() {
        for (let player of this.players) {
            player.hand = [];
            player.bet = 0;
        }
        this.dealer.hand = [];
        this.pot = 0;
    }
    clearPlayerBet() {
        for (let player of this.players) {
            player.bet = 0;
        }
    }
    evaluateAndGetRoundResults() {
        return "";
    }
    evaluateMove(player, userData) {
        if (player.type == "dealer") {
            if (this.roundCounter == 0) {
                this.dealer.hand.push(this.deck.drawCard());
                this.dealer.hand.push(this.deck.drawCard());
                this.dealer.hand.push(this.deck.drawCard());
            }
            else {
                this.dealer.hand.push(this.deck.drawCard());
            }
            this.roundCounter++;
            if (this.roundCounter == 3) {
                console.log("最終ラウンドまで来た。");
                this.gamePhase = "evaluating";
            }
            this.clearPlayerBet();
            this.changePlayerStatusToBet();
            this.turnCounter = this.dealerIndex + 1;
            this.betMoney = this.minbet;
            console.log("ディーラーのhand", this.dealer.hand);
            console.log("次のラウンドの開始person", this.getTurnPlayer().name);
            this.gamePhase = "betting";
            this.printPlayerStatus();
        }
        else {
            if (this.turnCounter == this.betIndex &&
                player.gameStatus != "bet" &&
                player.gameStatus != "blind") {
                console.log("一周してきました。ディーラーに移行");
                this.gamePhase = "dealer turn";
            }
            let gameDecision = player.promptPlayer(userData, this.betMoney);
            console.log(gameDecision);
            switch (gameDecision.action) {
                case "bet":
                    console.log("ベットできてません。もう一度選択してください");
                    break;
                case "blind":
                    if (this.turnCounter == this.dealerIndex + 1)
                        this.assignPlayerHands();
                    console.log(player.name, "before blind", player);
                    player.bet =
                        this.turnCounter == this.dealerIndex + 1
                            ? this.smallBlind
                            : this.bigBlind;
                    console.log("player Blind bet money", player.bet);
                    player.chips -= player.bet;
                    this.pot += player.bet;
                    player.gameStatus = "bet";
                    console.log(player.name, "after blind", player);
                    if (this.turnCounter == this.dealerIndex + 2) {
                        this.changePlayerStatusToBet();
                        console.log("プレイヤーの情報をBETに変更!!!");
                    }
                    break;
                case "call":
                    if (this.getoneBeforePlayer().gameStatus == "check") {
                        this.betIndex = this.turnCounter;
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
                    this.betIndex = this.turnCounter;
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
            player.getHandScore(this.dealer);
            console.log("Pot Money", this.pot);
        }
    }
    haveTurn(userData) {
        if (this.gamePhase == "dealer turn") {
            console.log("ディーラーターン");
            if (this.roundCounter == 3) {
                console.log("最終ラウンドまで来た。1");
                this.gamePhase = "evaluating";
            }
            else
                this.evaluateMove(this.dealer);
        }
        if (this.gamePhase == "evaluating") {
            console.log("TURN  OWARIIIIIIIIIIII!!!!");
            this.evaluateAndGetRoundResults();
            this.clearPlayerHandsAndBets();
        }
        let player = this.getTurnPlayer();
        console.log("currPlayer: ", player.name);
        let playerBefore = this.getoneBeforePlayer();
        if (this.allPlayerActionResolved()) {
            this.gamePhase = "dealer turn";
            this.evaluateMove(this.dealer);
        }
        else {
            if ((playerBefore.gameStatus == "check" ||
                playerBefore.gameStatus == "bet") &&
                userData == "check") {
                this.evaluateMove(player, "check");
            }
            else if (player.gameStatus == "fold" ||
                player.gameStatus == "allin") {
                console.log(player.name + "はこのゲームでは何もできません。");
                this.evaluateMove(player, player.gameStatus);
            }
            else if (playerBefore.gameStatus !== "check" &&
                playerBefore.gameStatus !== "fold" &&
                userData == "check") {
                console.log("前のプレイヤーがcheckしてなからcheckできません。");
                this.evaluateMove(player, "call");
            }
            else if (player.chips < this.betMoney && player.chips > 0) {
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
                console.log("userAction: ", userData);
                player.type == "player"
                    ? this.evaluateMove(player, userData)
                    :
                        this.evaluateMove(player);
            }
            this.turnCounter++;
            this.turnCounter %= this.players.length;
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
        return this.turnCounter == this.betIndex;
    }
    moveToNextPlayer() {
        this.turnCounter++;
        this.turnCounter %= this.players.length;
    }
    changePlayerStatusToBet() {
        for (let player of this.players) {
            if (player.gameStatus != "fold" && player.gameStatus != "allin")
                player.gameStatus = "bet";
        }
    }
    getTurnPlayer() {
        return this.players[this.turnCounter % this.players.length];
    }
    getoneBeforePlayer() {
        return this.players[(this.turnCounter + this.players.length - 1) % this.players.length];
    }
}
//# sourceMappingURL=pokerTable.js.map