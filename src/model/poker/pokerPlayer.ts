import { Game, Tilemaps } from "phaser";
import {
    BlackjackActionType,
    BlackjackStatusType,
} from "../../config/blackjackConfig.js";
import {
    PokerActionType,
    PokerPlayerType,
    PokerStatusType,
} from "../../config/pokerConfig.js";
import GameDecision from "../common/gameDecision.js";
import Player from "../common/blackJackPlayer.js";

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

    promptPlayer(userData?: number | PokerActionType): GameDecision {
        let score = this.getHandScore();

        if (this.type === "player") {
            return this.gameStatus === "blind"
                ? new GameDecision("blind", userData as number)
                : this.gameStatus === "bet"
                ? new GameDecision("call", userData as number)
                : this.gameStatus === "call"
                ? new GameDecision("call", userData as number)
                : this.gameStatus == "raise"
                ? new GameDecision("raise", (userData as number) * 2)
                : new GameDecision(userData as string);
        } else {
            switch (this.gameStatus) {
                case "blind":
                    return new GameDecision("blind", userData as number);
                case "bet":
                    const rand = Math.random();
                    // return rand > 0.5
                    //     ? new GameDecision("call", userData as number)
                    //     : new GameDecision("raise", (userData as number) * 2);
                    return this.name == "ai_2"
                    ? new GameDecision("raise", (userData as number) * 2)
                        // ? new GameDecision("fold", (userData as number) * 2)
                        : new GameDecision("call", userData as number);
                case "call":
                    return new GameDecision("call", userData as number);
                case "raise":
                    return new GameDecision("raise", (userData as number) * 2);
                default:
                    return new GameDecision("fold");
            }
        }
    }

    getHandScore(): number {
        let score = 0;
        return score;
    }
}
