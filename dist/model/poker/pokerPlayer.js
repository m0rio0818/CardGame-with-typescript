import Player from "../common/Player.js";
import pokerGameDecision from "./pokerGameDecision.js";
export default class pokerPlayer extends Player {
    constructor(name, type, gameType, chips = 100) {
        super(name, type, gameType, chips);
        this.gameStatus = "blind";
    }
    promptPlayer(userData, betMoney) {
        if (this.type === "player") {
            return userData == "blind"
                ? new pokerGameDecision("blind")
                : userData == "bet"
                    ? new pokerGameDecision("bet")
                    : userData == "call"
                        ? new pokerGameDecision("call", betMoney)
                        : userData == "raise"
                            ? new pokerGameDecision("raise", betMoney * 2)
                            : userData == "allin"
                                ? new pokerGameDecision("allin", betMoney)
                                : userData == "check"
                                    ? new pokerGameDecision("check")
                                    : userData == "fold"
                                        ? new pokerGameDecision("fold")
                                        : new pokerGameDecision("blind");
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