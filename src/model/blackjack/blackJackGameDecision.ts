import { BlackJackActionType } from "../../config/blackJackConfig.js";
import GameDecision from "../common/GameDecision.js";

export default class blackJackGameDecision extends GameDecision {
    public action: BlackJackActionType;
    public amount: number;

    constructor(action: BlackJackActionType, amount: number = 0) {
        super(action, amount);
        this.action = action;
        this.amount = amount;
    }
}
