import { Config } from "../config/pageConfig.js";
import pokerTable from "../model/poker/pokerTable.js";
import { PokerView } from "../view/PokerView.js";
export class PokerController {
    static renderGameScene(table) {
        this.renderPlayers(table);
        if (table.roundCounter == table.maxTurn - 1) {
            console.log("ゲーム終了, 結果表示ページに遷移したい。");
        }
        if (table.gamePhase === "dealer turn") {
            setTimeout(() => {
                Config.displayNone();
                table.haveTurn();
                this.renderGameScene(table);
                return;
            }, 3000);
        }
        const turnPlayer = table.getTurnPlayer();
        console.log(turnPlayer.type);
        if (turnPlayer.type == "player") {
            if (table.gamePhase != "blinding") {
                if (turnPlayer.gameStatus == "fold" ||
                    turnPlayer.gameStatus == "allin") {
                    console.log("もう何もアクションはできません。");
                    setTimeout(() => {
                        Config.displayNone();
                        table.haveTurn();
                        this.renderGameScene(table);
                    }, 1000);
                }
                else {
                    PokerView.createActionsModal();
                    this.onActionButtonsClick(table);
                }
            }
        }
        else {
            setTimeout(() => {
                Config.displayNone();
                table.haveTurn();
                this.renderGameScene(table);
            }, 2000);
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
        checkButton === null || checkButton === void 0 ? void 0 : checkButton.addEventListener("check", () => {
            Config.displayNone();
            table.haveTurn("check");
            this.renderGameScene(table);
        });
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