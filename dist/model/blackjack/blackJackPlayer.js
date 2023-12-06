import GameDecision from "../common/GameDecision.js";
export default class Player {
    constructor(name, type, gameType, chips = 400) {
        this.name = name;
        this.type = type;
        this.gameType = gameType;
        this.chips = chips;
        this.hand = [];
        this.bet = 0;
        this.winAmount = 0;
        this.gameStatus = "betting";
        this.gameResult = "";
    }
    promptPlayer(userData) {
        let score = this.getHandScore();
        console.log(this.type, " : ", this.gameStatus, this.hand, score, userData);
        if (this.gameStatus == "betting") {
            if (this.type == "house") {
                return new GameDecision("wait");
            }
            else if (this.type == "ai") {
                this.bet = Math.floor(Math.random() * this.chips);
                return new GameDecision("bet", this.bet);
            }
            else
                return new GameDecision("bet", userData);
        }
        else {
            if (this.type == "ai") {
                if (score < 17) {
                    return new GameDecision("hit");
                }
                else {
                    return new GameDecision("stand");
                }
            }
            else {
                return new GameDecision(userData);
            }
        }
    }
    getHandScore() {
        let total = 0;
        let aceCount = 0;
        for (let card of this.hand) {
            if (card.rank == "A")
                aceCount++;
            total += card.getRankNumber();
        }
        while (total > 21 && aceCount > 0) {
            aceCount--;
            total -= 10;
        }
        return total;
    }
}
//# sourceMappingURL=blackJackPlayer.js.map