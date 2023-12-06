import GameDecision from "../common/GameDecision.js";
import { BlackJackActionType } from "../../config/blackJackConfig.js";
export default class pokerGameDecision extends GameDecision {
    public action: BlackJackActionType;
    public amount: number;

    constructor(action: BlackJackActionType, amount: number = 0) {
        super(action, amount);
        this.action = action;
        this.amount = amount;
    }
}
