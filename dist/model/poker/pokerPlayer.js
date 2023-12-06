import Player from "../common/Player.js";
import pokerGameDecision from "./pokerGameDecision.js";
export default class pokerPlayer extends Player {
    constructor(name, type, gameType, chips = 100) {
        super(name, type, gameType, chips);
        this.gameStatus = "blind";
    }
    promptPlayer(userData) {
        let score = this.getHandScore();
        if (this.type === "player") {
            return this.gameStatus === "blind"
                ? new pokerGameDecision("blind", userData)
                : this.gameStatus === "bet"
                    ? new pokerGameDecision("call", userData)
                    : this.gameStatus === "call"
                        ? new pokerGameDecision("call", userData)
                        : this.gameStatus == "raise"
                            ? new pokerGameDecision("raise", userData * 2)
                            : new pokerGameDecision("call", userData);
        }
        else {
            switch (this.gameStatus) {
                case "blind":
                    return new pokerGameDecision("blind", userData);
                case "bet":
                    const rand = Math.random();
                    return this.name == "ai_2"
                        ? new pokerGameDecision("raise", userData * 2)
                        :
                            new pokerGameDecision("call", userData);
                case "call":
                    return new pokerGameDecision("call", userData);
                case "raise":
                    return new pokerGameDecision("raise", userData * 2);
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