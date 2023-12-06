import Table from "../common/table.js";
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
        this.betMoney = 5;
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
        this.dealer.bet = 0;
        this.pot = 0;
    }
    evaluateAndGetRoundResults() {
        return "";
    }
    getDealer() {
        return this.players.length > this.dealerIndex
            ? (this.dealerIndex = 0)
            : this.dealerIndex;
    }
    evaluateMove(player, userData) {
        let decision = player.promptPlayer(this.betMoney);
        console.log("PlayerIndex: ", this.turnCounter, "betIndex: ", this.betIndex);
        console.log(player.name, "before", player.gameStatus, player);
        console.log(player.name, "Decistion: ", decision);
        switch (decision.action) {
            case "blind":
                player.bet = this.turnCounter == 1 ? 2 : 5;
                player.chips -= player.bet;
                this.pot += player.bet;
                break;
            case "call":
                console.log("~~~~betの処理〜〜〜");
                console.log("bet", player.bet, "have to bet : ", decision.amount);
                let playerNeedBet = decision.amount - player.bet;
                player.bet += decision.amount - player.bet;
                player.chips -= playerNeedBet;
                this.pot += playerNeedBet;
                player.gameStatus = "call";
                console.log("bet ===>>", player.bet);
                break;
            case "raise":
                this.betIndex = this.turnCounter;
                console.log("before raise: ", this.betMoney);
                this.betMoney *= 2;
                console.log("after raise: ", this.betMoney);
                player.bet = this.betMoney - player.bet;
                player.chips -= player.bet;
                this.pot += player.bet;
                player.gameStatus = "raise";
                console.log("raise ===>>", player.bet);
                break;
            case "fold":
                player.gameStatus = "fold";
                break;
        }
        console.log(player.type, "after", player.gameStatus, player);
        console.log("potに溜まっているお金", this.pot);
    }
    haveTurn(userData) {
        let player = this.getTurnPlayer();
        if (this.gamePhase == "blinding") {
            console.log("betindex", this.betIndex);
            this.evaluateMove(player);
            this.turnCounter++;
            this.turnCounter %= this.players.length;
            if (this.turnCounter == this.betIndex + 1) {
                this.assignPlayerHands();
                this.gamePhase = "betting";
            }
        }
        else if (this.gamePhase == "betting") {
            if (player.gameStatus == "blind")
                player.gameStatus = "bet";
            if (this.turnCounter == this.betIndex) {
                if (player.gameStatus == "raise") {
                    this.gamePhase = "dealer turn";
                    console.log("ゲームフェーズをdealer turnに変更します。");
                }
                else {
                    console.log("call start!!!!!");
                    this.evaluateMove(player);
                    this.turnCounter++;
                    this.turnCounter %= this.players.length;
                }
            }
            else {
                console.log("callします!!!!!");
                this.evaluateMove(player);
                this.turnCounter++;
                this.turnCounter %= this.players.length;
            }
        }
        else if (this.gamePhase == "dealer turn") {
            this.turnCounter = this.dealerIndex + 1;
            this.gamePhase = "round over";
        }
        else if (this.gamePhase == "round over") {
            console.log("ラウンドがが終了しました。ここから勝敗判定に入ります。");
        }
    }
    moveToNextPlayer() {
        this.turnCounter++;
        this.turnCounter %= this.players.length;
    }
    chagePlayerStatusToBet() {
        for (let player of this.players) {
            if (player.gameStatus != "fold")
                player.gameStatus = "bet";
        }
    }
    getTurnPlayer() {
        return this.players[this.turnCounter % this.players.length];
    }
}
//# sourceMappingURL=pokerTable.js.map