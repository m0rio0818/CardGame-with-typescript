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
            new pokerPlayer("ai_1", "ai", gameType),
            new pokerPlayer("ai_2", "ai", gameType),
            new pokerPlayer("ai_3", "ai", gameType),
        ];
        this.dealerIndex = 0;
        this.turnCounter = this.dealerIndex + 1;
        this.betIndex = (this.dealerIndex + 2) % this.players.length;
        this.minbet = 5;
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
            if (this.roundCounter == 1) {
                this.dealer.hand.push(this.deck.drawCard());
                this.dealer.hand.push(this.deck.drawCard());
                this.dealer.hand.push(this.deck.drawCard());
            }
            else {
                this.dealer.hand.push(this.deck.drawCard());
            }
            this.gamePhase = "betting";
            this.clearPlayerBet();
            this.roundCounter++;
        }
        else {
            if (this.turnCounter == this.betIndex &&
                player.gameStatus != "bet") {
                this.gamePhase = "dealer turn";
            }
            let gameDecision = player.promptPlayer(userData, this.betMoney);
            console.log(gameDecision);
            switch (gameDecision.action) {
                case "blind":
                    console.log(player.name, "before blind", player);
                    player.bet =
                        this.turnCounter == this.dealerIndex + 1 ? 2 : 5;
                    console.log("player Blind bet money", player.bet);
                    player.chips -= player.bet;
                    this.pot += player.bet;
                    player.gameStatus = "bet";
                    console.log(player.name, "after blind", player);
                    if (this.turnCounter == this.dealerIndex + 2) {
                        this.changePlayerStatusToBet();
                    }
                    break;
                case "call":
                    if (this.getoneBeforePlayer().gameStatus == "check") {
                        this.betIndex = this.turnCounter;
                        this.changePlayerStatusToBet();
                    }
                    console.log(player.name, "before call", player);
                    let playercallMoney = gameDecision.amount;
                    let currBet = player.bet;
                    console.log("call前のbet", currBet);
                    let playerHaveToCall = playercallMoney - currBet;
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
                    currBet = player.bet;
                    let playerHaveToRaise = playerRaiseMoney - currBet;
                    this.pot += playerHaveToRaise;
                    player.chips -= playerHaveToRaise;
                    this.betIndex = this.turnCounter;
                    this.changePlayerStatusToBet();
                    player.gameStatus = "raise";
                    console.log(player.name, "after raise", player);
                    break;
                case "allin":
                    this.pot += gameDecision.amount;
                    player.gameStatus = "allin";
                    break;
                case "check":
                    console.log(player.name, "after check", player);
                    player.gameStatus = "check";
                    console.log(player.name, "after check", player);
                    break;
                case "fold":
                    player.gameStatus = "fold";
                    break;
            }
            console.log("Pot Money", this.pot);
        }
    }
    haveTurn(userData) {
        if (this.gamePhase == "dealer turn") {
            if (this.roundCounter == 3) {
                this.gamePhase = "evaluating";
            }
            else
                this.evaluateMove(this.dealer);
        }
        if (this.gamePhase == "evaluating") {
            ;
            this.evaluateAndGetRoundResults();
            this.clearPlayerHandsAndBets();
        }
        let player = this.getTurnPlayer();
        let playerBefore = this.getoneBeforePlayer();
        console.log("currPlayer: ", player.name);
        if (this.allPlayerActionResolved()) {
            this.gamePhase = "dealer turn";
            this.evaluateMove(this.dealer);
        }
        else {
            if (playerBefore.gameStatus == "check" && userData == "check") {
                this.evaluateMove(player, "check");
            }
            else if (playerBefore.gameStatus !== "check" &&
                userData == "check") {
                this.evaluateMove(player, "call");
            }
            else if (player.chips <= this.minbet) {
                this.evaluateMove(player, "allin");
            }
            else {
                player.type == "player"
                    ? this.evaluateMove(player, userData)
                    :
                        this.evaluateMove(player);
            }
        }
        this.turnCounter++;
        this.turnCounter %= this.players.length;
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
            console.log(player.type, player.name, player.gameStatus);
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
            if (player.gameStatus != "fold")
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