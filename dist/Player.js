export default class Player {
    // ブラックジャックの場合、最初の状態は「betting」です。
    constructor(name, type, gameType, chips = 400) {
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
    promptPlayer(userData) {
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
//# sourceMappingURL=Player.js.map