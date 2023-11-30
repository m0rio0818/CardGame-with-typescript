export class GameDecision {
    public action: string;
    public amount: number;
    /*
        String action: プレイヤーのアクションの選択 ('bet', 'surrender', 'stand', 'hit', 'double')
        Number amount: プレイヤーが選択する数値
        Player.promptPlayer() メソッドが常に GameDecision オブジェクトを返します
    */

    constructor(action: string, amount: number = -1) {
        this.action = action;
        this.amount = amount;
    }
}
