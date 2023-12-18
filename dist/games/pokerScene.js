var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _PokerView_callButton;
import { BaseScene } from "./common/baseScene.js";
import { Button } from "./common/button.js";
export class PokerView extends BaseScene {
    constructor() {
        super(...arguments);
        this.table = null;
        _PokerView_callButton.set(this, null);
    }
    create(data) {
        __classPrivateFieldSet(this, _PokerView_callButton, null, "f");
        super.create(data);
        this.renderScene();
    }
    renderScene() {
        this.callButton();
    }
    callButton() {
        __classPrivateFieldSet(this, _PokerView_callButton, new Button(this, 800, 500, "call", "gray-button", () => {
            console.log("have turn???");
        }), "f");
    }
}
_PokerView_callButton = new WeakMap();
//# sourceMappingURL=pokerScene.js.map