import { Game } from "phaser";
import { Card } from "./Card.js";
import { GameDecision } from "./GameDecision.js";

export class Player {
    public name: string; // name
    public type: string; // type : "ai", "house", "use"
    public gameType: string; // {'blackjack'}から選択。プレイヤーの初期化方法を決定するために使用されます。
    public chips: number; //ゲーム開始に必要なチップ。デフォルトは400。
    public hand: Card[]; // プレイヤーの手札
    public bet: number; // 現在のラウンドでのベットしているチップ
    public winAmount: number; // 勝利金額。正の数にも負の数にもなります。
    public gameStatus: string; // プレイヤーのゲームの状態やアクション. 最初の状態は「betting」です。

    constructor(
        name: string,
        type: string,
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
        this.gameStatus = "betting";
    }

    /*
        ?Number userData: モデル外から渡されるパラメータ。nullになることもあります。
        return GameDecision: 状態を考慮した上で、プレイヤーが行った意思決定。
    */
    promptPlayer(userData: number): GameDecision {
        // 意思決定を決めてもらう。 betの時
        if ((this.gameStatus = "bet")) {
            if (this.type == "house") {
                return new GameDecision("pass");
            } else if (this.type == "ai") {
                return new GameDecision("bet", 10);
            } else return new GameDecision("bet", userData);
        } else {
            if (this.type == "ai" || this.type == "house") {
                if (this.getHandScore() < 17) {
                    return new GameDecision("hit");
                } else {
                    return new GameDecision("stand");
                }
            } else {
                // 自分で選択する。
                return new GameDecision("hit");
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
