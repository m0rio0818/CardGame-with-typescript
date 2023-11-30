import { Player } from "./Player.js";
import { Deck } from "./Deck.js";
export class Table {
    constructor(gameType, betDenominations = [5, 20, 50, 100]) {
        this.gameType = gameType;
        this.betDenominatoins = betDenominations;
        this.deck = new Deck(this.gameType);
        this.players = [];
        this.house = new Player("house", "house", this.gameType);
        this.turnCounter = 0;
        this.gamePhase = "betting";
        this.resultsLog = [];
    }
    evaluateMove(player) {
        let inputBet = 20;
        let gamedecistion = player.promptPlayer(inputBet);
        if (gamedecistion.action == "bet") {
        }
        else if (gamedecistion.action == "hit") {
            let totalCard = player.getHandScore();
        }
        else if (gamedecistion.action == "stand") {
        }
        else if (gamedecistion.action == "surrender") {
        }
        else {
        }
    }
    blackjackEvaluateAndGetRoundResults() {
        let status = [];
        for (let i = 0; i < this.players.length; i++) {
            let playerStatus = this.players[i].gameStatus;
            if (playerStatus == "bust" ||
                playerStatus == "broken" ||
                playerStatus == "surrender")
                status.push(playerStatus);
            else {
            }
            ;
        }
        this.resultsLog.push(status);
        return status;
    }
    blackjackAssignPlayerHands() {
        for (let i = 0; i < this.players.length; i++) {
            let currPlayer = this.players[i];
            if (currPlayer.type == "house") {
            }
            else {
                for (let i = 0; i < 2; i++) {
                    currPlayer.hand.push(this.deck.drawOne());
                }
            }
        }
    }
    blackjackClearPlayerHandsAndBets() {
        for (let player of this.players) {
            player.bet = player.type == "house" ? -1 : 0;
            player.hand = [];
        }
    }
    getTurnPlayer() {
        return this.players[this.turnCounter];
    }
    haveTurn(userData) {
        if (this.gamePhase == "betting") {
        }
        else if (this.gamePhase == "acting") {
        }
        else if (this.gamePhase == "roundOver") {
            this.blackjackEvaluateAndGetRoundResults();
        }
        else {
        }
        let currentPlayer = this.getTurnPlayer();
        currentPlayer.promptPlayer(userData);
        this.evaluateMove(currentPlayer);
        this.turnCounter++;
    }
    onLastPlayer() {
        return this.turnCounter == this.players.length - 1;
    }
    onFirstPlayer() {
        return this.turnCounter == 0;
    }
    allPlayerActionsResolved() {
        let statusList = [
            "broken",
            "surrender",
            "bust",
            "stand",
            "blackjack",
            "double",
        ];
        for (let player of this.players) {
            let playerGameStatus = player.gameStatus;
            if (playerGameStatus in statusList)
                return true;
        }
        return false;
    }
}
//# sourceMappingURL=Table.js.map