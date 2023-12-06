import { BlackJackActionType } from "../../config/blackJackConfig";
import { PokerActionType } from "../../config/pokerConfig";

export default abstract class GameDecision {
    public action: string;
    public amount: number;
    /*
        String action: プレイヤーのアクションの選択 ('bet', 'surrender', 'stand', 'hit', 'double')
        Number amount: プレイヤーが選択する数値
        Player.promptPlayer() メソッドが常に GameDecision オブジェクトを返します
    */

    constructor(action: string, amount: number = 0) {
        this.action = action;
        this.amount = amount;
    }
}
