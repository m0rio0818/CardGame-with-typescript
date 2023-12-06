import {
    PokerActionType,
    PokerPlayerType,
    PokerStatusType,
} from "../../config/pokerConfig.js";
import GameDecision from "../common/GameDecision.js";
import Player from "../common/Player.js";
import pokerGameDecision from "./pokerGameDecision.js";

export default class pokerPlayer extends Player {
    gameStatus: PokerStatusType;
    constructor(
        name: string,
        type: PokerPlayerType,
        gameType: string,
        chips: number = 100
    ) {
        super(name, type, gameType, chips);
        this.gameStatus = "blind";
    }

    promptPlayer(
        userData: PokerActionType,
        betMoney?: number
    ): pokerGameDecision {
        if (this.type === "player") {
            // return this.gameStatus === "blind"
            //     ? new pokerGameDecision("blind", betMoney as number)
            //     : this.gameStatus === "bet"
            //     ? new pokerGameDecision("call", betMoney as number)
            //     : this.gameStatus === "call"
            //     ? new pokerGameDecision("call", betMoney as number)
            //     : this.gameStatus == "raise"
            //     ? new pokerGameDecision("raise", (betMoney as number) * 2)
            //     : this.gameStatus == "check"
            //     ? new pokerGameDecision("check")
            //     : this.gameStatus == "fold"
            //     ? new pokerGameDecision("fold")
            //     : allin;

            return userData == "blind"
                ? new pokerGameDecision("blind")
                : userData == "bet"
                ? new pokerGameDecision("bet")
                : userData == "call"
                ? new pokerGameDecision("call", betMoney)
                : userData == "raise"
                ? new pokerGameDecision("raise", (betMoney as number) * 2)
                : userData == "allin"
                ? new pokerGameDecision("allin", betMoney as number)
                : userData == "check"
                ? new pokerGameDecision("check")
                : userData == "fold"
                ? new pokerGameDecision("fold")
                : new pokerGameDecision("blind");
        } else {
            switch (this.gameStatus) {
                case "blind":
                    return new pokerGameDecision("blind", betMoney as number);
                case "bet":
                    const rand = Math.random();
                    if (rand > 0.9)
                        return new pokerGameDecision(
                            "raise",
                            (betMoney as number) * 2
                        );
                    // else if (rand > 0.6) return new pokerGameDecision("check");
                    else
                        return new pokerGameDecision(
                            "call",
                            betMoney as number
                        );

                case "call":
                    return new pokerGameDecision("call", betMoney as number);
                case "raise":
                    return new pokerGameDecision(
                        "raise",
                        (betMoney as number) * 2
                    );
                default:
                    return new pokerGameDecision("fold");
            }
        }
    }

    getHandScore(): number {
        let score = 0;
        return score;
    }
}
