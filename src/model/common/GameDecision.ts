import { BlackJackActionType } from "../../config/blackJackConfig";

export class GameDecision {
    public action: BlackJackActionType;
    public amount: number;
    /*
        String action: プレイヤーのアクションの選択 ('bet', 'surrender', 'stand', 'hit', 'double')
        Number amount: プレイヤーが選択する数値
        Player.promptPlayer() メソッドが常に GameDecision オブジェクトを返します
    */

    constructor(action: BlackJackActionType, amount: number = 0) {
        this.action = action;
        this.amount = amount;
    }
}
