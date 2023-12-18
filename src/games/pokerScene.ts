import pokerTable from "../model/poker/pokerTable.js";
import { BaseScene } from "./common/baseScene.js";
import { Button } from "./common/button.js";

export class PokerView extends BaseScene {
    table: pokerTable | null = null;

    private callButton: Button | null = null;
    private raiseButton: Button | null = null;
    private foldButton: Button | null = null;
    private checkButton: Button | null = null;
    private allInButton: Button | null = null;

    create(data: any) {
        // reset all the scene
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

    createCallButton(x: number, y: number) {
        this.callButton = new Button(
            this,
            800,
            500,
            "call",
            "gray-button",
            () => {
                console.log("calll");
            }
        );
    }

    createAllInButton(x: number, y: number) {
        this.allInButton = new Button(
            this,
            800,
            650,
            "allIn",
            "gray-button",
            () => {
                console.log("allIn");
            }
        );
    }

    createCheckButton(x: number, y: number) {
        this.checkButton = new Button(
            this,
            800,
            600,
            "check",
            "gray-button",
            () => {
                console.log("check");
            }
        );
    }

    createFoldButton(x: number, y: number) {
        this.foldButton = new Button(
            this,
            800,
            450,
            "fold",
            "gray-button",
            () => {
                console.log("fold");
            }
        );
    }

    createRaiseButton(x: number, y: number) {
        this.raiseButton = new Button(
            this,
            800,
            550,
            "raise",
            "gray-button",
            () => {
                console.log("raise");
            }
        );
    }
}
