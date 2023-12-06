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
    // roundBet: number; //　そのラウンドでのbetした金額

    constructor(
        name: string,
        type: PokerPlayerType,
        gameType: string,
        chips: number = 100
    ) {
        super(name, type, gameType, chips);
        this.gameStatus = "blind";
        // this.roundBet = 0;
    }

    promptPlayer(userData?: number | PokerActionType | string): pokerGameDecision {
        let score = this.getHandScore();

        if (this.type === "player") {
            return this.gameStatus === "blind"
                ? new pokerGameDecision("blind", userData as number)
                : this.gameStatus === "bet"
                ? new pokerGameDecision("call", userData as number)
                : this.gameStatus === "call"
                ? new pokerGameDecision("call", userData as number)
                : this.gameStatus == "raise"
                ? new pokerGameDecision("raise", (userData as number) * 2)
                : new pokerGameDecision("call", userData as number);
        } else {
            switch (this.gameStatus) {
                case "blind":
                    return new pokerGameDecision("blind", userData as number);
                case "bet":
                    const rand = Math.random();
                    // if (rand > 0.8)
                    //     return new pokerGameDecision(
                    //         "raise",
                    //         (userData as number) * 2
                    //     );
                    // else if (rand > 0.6) return new pokerGameDecision("pass");
                    //     //  new pokerGameDecision("pass", userData as number)
                    //     // : new pokerGameDecision("raise", (userData as number) * 2);
                    // else return new pokerGameDecision("call", userData as number);
                    return this.name == "ai_2"
                        ? new pokerGameDecision("raise", (userData as number) * 2)
                        : // new pokerGameDecision("fold", (userData as number) * 2)
                          new pokerGameDecision("call", userData as number);
                case "call":
                    return new pokerGameDecision("call", userData as number);
                case "raise":
                    return new pokerGameDecision("raise", (userData as number) * 2);
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
