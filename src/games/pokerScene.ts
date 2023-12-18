import pokerTable from "../model/poker/pokerTable.js";
import { BaseScene } from "./common/baseScene.js";
import { Button } from "./common/button.js";

export class PokerView extends BaseScene {
    table: pokerTable | null = null;

    #callButton: Button | null = null;

    create(data: any) {
        // reset all the scene
        this.#callButton = null;
        super.create(data);
        this.renderScene();
    }

    renderScene() {
        this.callButton();
    }

    callButton() {
        this.#callButton = new Button(
            this,
            800,
            500,
            "call",
            "gray-button",
            () => {
                // this.table?.haveTurn("call");
                console.log("have turn???")
            }
        );
    }
}
