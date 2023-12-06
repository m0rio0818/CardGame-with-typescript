import GameDecision from "../common/gameDecision.js";
import Player from "../common/player.js";
export default class pokerPlayer extends Player {
    constructor(name, type, gameType, chips = 100) {
        super(name, type, gameType, chips);
        this.gameStatus = "blind";
    }
    promptPlayer(userData) {
        let score = this.getHandScore();
        if (this.type === "player") {
            return this.gameStatus === "blind"
                ? new GameDecision("blind", userData)
                : this.gameStatus === "bet"
                    ? new GameDecision("call", userData)
                    : this.gameStatus === "call"
                        ? new GameDecision("call", userData)
                        : this.gameStatus == "raise"
                            ? new GameDecision("raise", userData * 2)
                            : new GameDecision(userData);
        }
        else {
            switch (this.gameStatus) {
                case "blind":
                    return new GameDecision("blind", userData);
                case "bet":
                    const rand = Math.random();
                    return this.name == "ai_2"
                        ? new GameDecision("raise", userData * 2)
                        : new GameDecision("call", userData);
                case "call":
                    return new GameDecision("call", userData);
                case "raise":
                    return new GameDecision("raise", userData * 2);
                default:
                    return new GameDecision("fold");
            }
        }
    }
    getHandScore() {
        let score = 0;
        return score;
    }
}
//# sourceMappingURL=pokerPlayer.js.map