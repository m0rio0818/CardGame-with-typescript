import { BaseScene } from "./common/baseScene.js";
import { Button } from "./common/button.js";
export class PokerView extends BaseScene {
    constructor() {
        super(...arguments);
        this.table = null;
        this.callButton = null;
        this.raiseButton = null;
        this.foldButton = null;
        this.checkButton = null;
        this.allInButton = null;
    }
    create(data) {
        this.callButton = null;
        super.create(data);
        this.renderScene();
    }
    renderScene() {
        this.createCallButton(0, 0);
        this.createRaiseButton(0, 0);
        this.createFoldButton(0, 0);
        this.createCheckButton(0, 0);
        this.createAllInButton(0, 0);
    }
    createCallButton(x, y) {
        this.callButton = new Button(this, 800, 500, "call", "gray-button", () => {
            console.log("calll");
        });
    }
    createAllInButton(x, y) {
        this.allInButton = new Button(this, 800, 650, "allIn", "gray-button", () => {
            console.log("allIn");
        });
    }
    createCheckButton(x, y) {
        this.checkButton = new Button(this, 800, 600, "check", "gray-button", () => {
            console.log("check");
        });
    }
    createFoldButton(x, y) {
        this.foldButton = new Button(this, 800, 450, "fold", "gray-button", () => {
            console.log("fold");
        });
    }
    createRaiseButton(x, y) {
        this.raiseButton = new Button(this, 800, 550, "raise", "gray-button", () => {
            console.log("raise");
        });
    }
}
//# sourceMappingURL=pokerScene.js.map