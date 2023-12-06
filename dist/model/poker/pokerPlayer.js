import Player from "../common/Player.js";
import pokerGameDecision from "./pokerGameDecision.js";
export default class pokerPlayer extends Player {
    constructor(name, type, gameType, chips = 100) {
        super(name, type, gameType, chips);
        this.gameStatus = "blind";
    }
    promptPlayer(userData, betMoney) {
        if (this.type === "player") {
            return this.gameStatus === "blind"
                ? new pokerGameDecision("blind", betMoney)
                : this.gameStatus === "bet"
                    ? new pokerGameDecision("call", betMoney)
                    : this.gameStatus === "call"
                        ? new pokerGameDecision("call", betMoney)
                        : this.gameStatus == "raise"
                            ? new pokerGameDecision("raise", betMoney * 2)
                            : this.gameStatus == "check"
                                ? new pokerGameDecision("check")
                                : this.gameStatus == "fold"
                                    ? new pokerGameDecision("fold")
                                    :
                                        new pokerGameDecision("allin", this.chips);
        }
        else {
            switch (this.gameStatus) {
                case "blind":
                    return new pokerGameDecision("blind", betMoney);
                case "bet":
                    const rand = Math.random();
                    if (rand > 0.9)
                        return new pokerGameDecision("raise", betMoney * 2);
                    else
                        return new pokerGameDecision("call", betMoney);
                case "call":
                    return new pokerGameDecision("call", betMoney);
                case "raise":
                    return new pokerGameDecision("raise", betMoney * 2);
                default:
                    return new pokerGameDecision("fold");
            }
        }
    }
    getHandScore() {
        let score = 0;
        return score;
    }
}
//# sourceMappingURL=pokerPlayer.js.map