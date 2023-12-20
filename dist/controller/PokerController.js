import { Config } from "../config/pageConfig.js";
import pokerTable from "../model/poker/pokerTable.js";
import { PokerView } from "../games/pokerScene.js";
import { PreloadScene } from "../games/common/preloadScene.js";
export class PokerController {
    static startGame(table) {
        const game = new Phaser.Game({
            type: Phaser.AUTO,
            width: 1080,
            height: 720,
            scene: [],
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            },
        });
        game.scene.add("preload", PreloadScene, false);
        game.scene.add("poker", PokerView, false);
        game.scene.start("preload", { table: table });
    }
    static renderGameScene(table) {
        this.renderPlayers(table);
        if (table.roundCounter === table.maxTurn) {
            console.log("ゲーム終了, 結果表示ページに遷移したい。");
            Config.displayNone();
            this.renderFinalResultsModal(table);
            return;
        }
        if (table.gamePhase === "dealer turn") {
            setTimeout(() => {
                Config.displayNone();
                table.haveTurn();
                this.renderGameScene(table);
                return;
            }, 1000);
        }
        const turnPlayer = table.getTurnPlayer();
        const beforePlayer = table.getoneBeforePlayer();
        console.log(turnPlayer.type);
        if (turnPlayer.type == "player") {
            if (table.gamePhase != "blinding") {
                if (turnPlayer.gameStatus == "fold" ||
                    turnPlayer.gameStatus == "allin") {
                    console.log("allin or fold なので、もう今は何もアクションはできません。");
                    setTimeout(() => {
                        Config.displayNone();
                        table.haveTurn();
                        this.renderGameScene(table);
                    }, 500);
                    return;
                }
                if (beforePlayer.gameStatus == "check" ||
                    table.playerIndexCounter == table.dealerIndex + 1) {
                    if (turnPlayer.chips < table.betMoney &&
                        turnPlayer.chips > 0) {
                        PokerView.createActionswithCheckModal();
                        this.onActionButtonsClick(table);
                    }
                    else {
                        PokerView.createActionswithCheckModal();
                        this.onActionButtonsClick(table);
                    }
                }
                else {
                    if (turnPlayer.chips < table.betMoney &&
                        turnPlayer.chips > 0) {
                        PokerView.createallInModal();
                        this.onActionButtonsClick(table);
                    }
                    else {
                        PokerView.createActionsModal();
                        this.onActionButtonsClick(table);
                    }
                }
            }
        }
        else {
            setTimeout(() => {
                Config.displayNone();
                table.haveTurn();
                this.renderGameScene(table);
            }, 100);
        }
    }
    static renderPlayers(table) {
        PokerView.createPlayerView(table.dealer, table);
        for (let player of table.players) {
            PokerView.createPlayerView(player, table);
        }
    }
    static onActionButtonsClick(table) {
        const callButton = document.querySelector(".call-button");
        const raiseButton = document.querySelector(".raise-button");
        const foldButton = document.querySelector(".fold-button");
        const checkButton = document.querySelector(".check-button");
        const allInButton = document.querySelector(".allIn-button");
        callButton === null || callButton === void 0 ? void 0 : callButton.addEventListener("click", () => {
            Config.displayNone();
            table.haveTurn("call");
            this.renderGameScene(table);
        });
        raiseButton === null || raiseButton === void 0 ? void 0 : raiseButton.addEventListener("click", () => {
            Config.displayNone();
            table.haveTurn("raise");
            this.renderGameScene(table);
        });
        foldButton === null || foldButton === void 0 ? void 0 : foldButton.addEventListener("click", () => {
            Config.displayNone();
            table.haveTurn("fold");
            console.log("clicked FOLD!!");
            this.renderGameScene(table);
        });
        allInButton === null || allInButton === void 0 ? void 0 : allInButton.addEventListener("click", () => {
            Config.displayNone();
            table.haveTurn("allin");
            console.log("ALL IN ");
            this.renderGameScene(table);
        });
        checkButton === null || checkButton === void 0 ? void 0 : checkButton.addEventListener("check", () => {
            Config.displayNone();
            table.haveTurn("check");
            this.renderGameScene(table);
        });
    }
    static renderFinalResultsModal(table) {
        PokerView.createFinalResultsModal(table);
        this.onClickFinalResultsButons(table);
    }
    static onClickNextRoundButton(table) {
        const nextRoundButton = document.querySelector(".next-round-button");
        nextRoundButton === null || nextRoundButton === void 0 ? void 0 : nextRoundButton.addEventListener("click", () => {
            if (table.gamePhase === "game over") {
                Config.displayNone();
                this.renderGameOverModal(table);
                return;
            }
            table.gamePhase = "betting";
            Config.displayNone();
            this.renderGameScene(table);
        });
    }
    static onClickGameOverButtons(table) {
        const restartButton = document.querySelector(".restart-button");
        const backButton = document.querySelector(".back-button");
        restartButton === null || restartButton === void 0 ? void 0 : restartButton.addEventListener("click", () => {
            Config.displayNone();
            this.renderGameScene(new pokerTable("blackjack", table.players[0].name, table.difficulty, table.maxRounds));
        });
        backButton === null || backButton === void 0 ? void 0 : backButton.addEventListener("click", () => {
            Config.displayNone();
        });
    }
    static onClickFinalResultsButons(table) { }
}
//# sourceMappingURL=PokerController.js.map