import { GameDecision } from "./GameDecision.js";
export class Player {
    constructor(name, type, gameType, chips = 400) {
        this.name = name;
        this.type = type;
        this.gameType = gameType;
        this.chips = chips;
        this.hand = [];
        this.bet = 0;
        this.winAmount = 0;
        this.gameStatus = "betting";
    }
    promptPlayer(userData) {
        if ((this.gameStatus = "bet")) {
            if (this.type == "house") {
                return new GameDecision("pass");
            }
            else if (this.type == "ai") {
                return new GameDecision("bet", 10);
            }
            else
                return new GameDecision("bet", userData);
        }
        else {
            if (this.type == "ai" || this.type == "house") {
                if (this.getHandScore() < 17) {
                    return new GameDecision("hit");
                }
                else {
                    return new GameDecision("stand");
                }
            }
            else {
                return new GameDecision("hit");
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
//# sourceMappingURL=Player.js.map