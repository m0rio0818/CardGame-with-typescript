import GameDecision from "../common/GameDecision.js";
export default class pokerGameDecision extends GameDecision {
    constructor(action, amount = 0) {
        super(action, amount);
        this.action = action;
        this.amount = amount;
    }
}
//# sourceMappingURL=blackJackGameDecision.js.map