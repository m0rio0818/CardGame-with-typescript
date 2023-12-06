import Card from "../common/Card.js";
import blackJackGameDecision from "../blackjack/blackJackGameDecision.js";
import {
    BlackJackActionType,
    BlackJackGameStatus,
    BlackJackPlayerType,
    BlackjackStatusType,
} from "../../config/blackJackConfig.js";

export default class Player {
    public name: string; // name
    public type: BlackJackPlayerType; // type : "ai", "house", "use"
    public gameType: string; // {'blackjack'}から選択。プレイヤーの初期化方法を決定するために使用されます。
    public chips: number; //ゲーム開始に必要なチップ。デフォルトは400。
    public hand: Card[]; // プレイヤーの手札
    public bet: number; // 現在のラウンドでのベットしているチップ
    public winAmount: number; // 勝利金額。正の数にも負の数にもなります。
    // public gamePhase : BlackjackStatusType;
    public gameStatus: BlackjackStatusType; // プレイヤーのゲームの状態やアクション. 最初の状態は「betting」です。
    //  "" | "betting" | "waiting" | "acting" | "stand" | "bust" | "blackjack" | "surrender";
    public gameResult: BlackJackGameStatus;

    constructor(
        name: string,
        type: BlackJackPlayerType,
        gameType: string,
        chips: number = 400
    ) {
        this.name = name;
        this.type = type;
        this.gameType = gameType;
        this.chips = chips;
        this.hand = [];
        this.bet = 0;
        this.winAmount = 0;
        // this.gamePhase = "bet";
        this.gameStatus = "betting";
        this.gameResult = "";
    }

    /*
        ?Number userData: モデル外から渡されるパラメータ。nullになることもあります。
        return GameDecision: 状態を考慮した上で、プレイヤーが行った意思決定。
    */
    promptPlayer(userData: number | BlackJackActionType): blackJackGameDecision {
        // 意思決定を決めてもらう。
        let score: number = this.getHandScore();

        console.log(
            this.type,
            " : ",
            this.gameStatus,
            this.hand,
            score,
            userData
        );

        if (this.gameStatus == "betting") {
            if (this.type == "house") {
                return new blackJackGameDecision("wait");
            } else if (this.type == "ai") {
                this.bet = Math.floor(Math.random() * this.chips);
                return new blackJackGameDecision("bet", this.bet);
            } else return new blackJackGameDecision("bet", userData as number);
        } else {
            if (this.type == "ai") {
                if (score < 17) {
                    return new blackJackGameDecision("hit");
                } else {
                    return new blackJackGameDecision("stand");
                }
            } else {
                return new blackJackGameDecision(userData as BlackJackActionType);
            }
        }
    }

    /*
            return Number : 手札の合計
            合計が21を超える場合、手札の各エースについて、合計が21以下になるまで10を引きます。
        */
    getHandScore(): number {
        let total: number = 0;
        let aceCount: number = 0;
        for (let card of this.hand) {
            if (card.rank == "A") aceCount++;
            total += card.getRankNumber();
        }

        while (total > 21 && aceCount > 0) {
            aceCount--;
            total -= 10;
        }
        return total;
    }
}
