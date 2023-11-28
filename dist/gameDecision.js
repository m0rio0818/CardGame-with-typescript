export default class GameDecision {
    /*
        String action: プレイヤーのアクションの選択（ブラックジャックでは、hit、stand等）
        Number amount: プレイヤーが選択する数値
        Player.promptPlayer() メソッドが常に GameDecision オブジェクトを返します
    */
    constructor(action, amount) {
        this.action = action;
        this.amount = amount;
    }
}
//# sourceMappingURL=gameDecision.js.map