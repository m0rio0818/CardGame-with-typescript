export class GameDecision {
    public action: string;
    public amount: number;
    /*
        String action: プレイヤーのアクションの選択（ブラックジャックでは、hit、stand等）
        Number amount: プレイヤーが選択する数値
        Player.promptPlayer() メソッドが常に GameDecision オブジェクトを返します
    */

    constructor(action: string, amount: number) {
        this.action = action;
        this.amount = amount;
    }
}
