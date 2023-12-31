import {
    BlackJackActionType,
    BlackjackStatusType,
} from "../../config/blackJackConfig.js";
import { PokerActionType, PokerHandType, PokerStatusType } from "../../config/pokerConfig";
import Card from "./Card";
import GameDecision from "./GameDecision";

export default abstract class Player {
    name: string;
    type: string;
    gameType: string;
    gameStatus: BlackjackStatusType | PokerStatusType = "";
    chips: number;
    bet: number = 0;
    winAmount: number = 0;
    hand: Card[] = [];

    constructor(
        name: string,
        type: string,
        gameType: string,
        chips: number = 100
    ) {
        this.name = name;
        this.type = type;
        this.gameType = gameType;
        this.chips = chips;
    }

    /*
    promptPlayer(userData?: number | BlackjackActionType): GameDecision
    プレイヤーのゲーム内での行動を返す
    */
    abstract promptPlayer(
        userData?: number | BlackJackActionType | PokerActionType
    ): GameDecision;

    /*
    getHandScore(): number
    手札の合計スコアを計算して返す
    */
    abstract getHandScore(dealer?: Player): number | PokerHandType;
}
