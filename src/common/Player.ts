import { Card } from "./Card.js";

export class Player {
    public name: string; // 名前
    public type: string; // タイプ(AI, ハウス or ユーザー)
    public gameType: string; // {'blackjack'}から選択。プレイヤーの初期化方法を決定するために使用されます。
    public chips: number; //ゲーム開始に必要なチップ。デフォルトは400。
    public hand: Card[]; // プレイヤーの手札
    public bet: number; // 現在のラウンドでのベットしているチップ
    public winAmount: number; // 勝利金額。正の数にも負の数にもなります。
    public gameStatus: string; // プレイヤーのゲームの状態やアクションを表します。
    // ブラックジャックの場合、最初の状態は「betting」です。

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
    promptPlayer(userData: number) {
        //TODO: ここからコードを書きましょう
    }

    /*
            return Number : 手札の合計
            合計が21を超える場合、手札の各エースについて、合計が21以下になるまで10を引きます。
        */
    getHandScore() {
        //TODO: ここからコードを書きましょう
    }
}
