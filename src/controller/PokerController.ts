import { Config } from "../config/pageConfig.js";
import pokerTable from "../model/poker/pokerTable.js";
import { PokerView } from "../view/PokerView.js";

export class PokerController {
    /*
  renderGameScene(table: BlackjackTable): void
  ゲームのシーンを描画する
  */
    static renderGameScene(table: pokerTable) {
        // lotate table's dealer and player
        this.renderPlayers(table);

        // if (table.gamePhase === "betting") {
        //     this.renderGameOverModal(table);
        //     return;
        // }

        // if (table.roundCount === table.maxRounds) {
        //     this.renderFinalResultsModal(table);
        //     return;
        // }

        // if (table.gamePhase === "evaluating") {
        //     Config.displayNone();
        //     this.renderRoundOverModal(table);
        //     this.onClickNextRoundButton(table);
        //     return;
        // }

        // if (table.gamePhase === "dealer turn") {
        //     table.dealer.gameStatus =
        //         table.dealer.gameStatus === "waiting"
        //             ? "acting"
        //             : table.dealer.gameStatus;
        //     setTimeout(() => {
        //         Config.displayNone();
        //         if (table.dealer.gameStatus === "acting") {
        //             table.haveTurn();
        //             this.renderGameScene(table);
        //         }
        //         table.gamePhase = "evaluating";
        //         this.renderGameScene(table);
        //         return;
        //     }, 3000);
        // }

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
                if (
                    turnPlayer.gameStatus == "fold" ||
                    turnPlayer.gameStatus == "allin"
                ) {
                    console.log("もう何もアクションはできません。");
                    setTimeout(() => {
                        Config.displayNone();
                        table.haveTurn();
                        this.renderGameScene(table);
                    }, 1000);
                } else {
                    PokerView.createActionsModal();
                    this.onActionButtonsClick(table);
                }
            }
        } else {
            setTimeout(() => {
                Config.displayNone();
                table.haveTurn();
                this.renderGameScene(table);
            }, 2000);
        }

        // if (turnPlayer.type === "human") {
        //     if (table.gamePhase === "betting") {
        //         BlackjackView.createBetModal(table);

        //         const betButton = document.querySelector(".bet-button");
        //         if (!betButton?.ariaDisabled) {
        //             betButton!.addEventListener("click", () => {
        //                 Config.displayNone();

        //                 const betCount = parseInt(
        //                     betButton!.innerHTML.split(" ")[1]
        //                 );
        //                 table.haveTurn(betCount);
        //                 this.renderGameScene(table);
        //                 betButton!.ariaDisabled = "true";
        //             });
        //         }
        //     } else if (table.gamePhase === "acting") {
        //         // プレイヤーのgameStatusがstand, bust, surrender, blackjackの場合は次のターンへ
        //         if (table.playerActionResolved(turnPlayer)) {
        //             Config.displayNone();

        //             table.haveTurn();
        //             this.renderGameScene(table);
        //         } else {
        //             BlackjackView.createActionsModal();

        //             // on action buttons click
        //             this.onActionButtonsClick(table);
        //         }
        //     }
        // } else {
        //     setTimeout(() => {
        //         Config.displayNone();
        //         table.haveTurn();
        //         this.renderGameScene(table);
        //     }, 3000);
        // }
    }

    /*
  renderRoundOverModal(table: BlackjackTable): void
  ラウンド終了時のモーダルを描画する
  */
    //     static renderRoundOverModal(table: BlackjackTable) {
    //         BlackjackView.createRoundOverModal(table);
    //     }

    //     /*
    //   renderGameOverModal(table: BlackjackTable): void
    //   操作プレイヤーのチップが全てなくなった時のモーダルを描画する
    //   */
    //     static renderGameOverModal(table: BlackjackTable) {
    //         BlackjackView.createGameOverModal();
    //         this.onClickGameOverButtons(table);
    //     }

    //     /*
    //   renderFinalResultsModal(table: BlackjackTable): void
    //   全ラウンド終了後の最終結果のモーダルを描画する
    //   */
    //     static renderFinalResultsModal(table: pokerTable) {
    //         PokerView.createFinalResultsModal(table);
    //         this.onClickFinalResultsButons(table);
    //     }

    /*
  renderPlayers(table: PokerTable): void
  プレイヤーの情報を描画する
  */
    static renderPlayers(table: pokerTable) {
        PokerView.createPlayerView(table.dealer, table);

        for (let player of table.players) {
            PokerView.createPlayerView(player, table);
        }
    }

    /*
  onActionButtonsClick(table: BlackjackTable): void
  アクションボタンがクリックされた時の処理を記述する
  */
    static onActionButtonsClick(table: pokerTable) {
        const callButton = document.querySelector(".call-button");
        const raiseButton = document.querySelector(".raise-button");
        const foldButton = document.querySelector(".fold-button");
        const checkButton = document.querySelector(".check-button");

        callButton?.addEventListener("click", () => {
            Config.displayNone();
            table.haveTurn("call");
            this.renderGameScene(table);
        });

        raiseButton?.addEventListener("click", () => {
            Config.displayNone();
            table.haveTurn("raise");
            this.renderGameScene(table);
        });

        foldButton?.addEventListener("click", () => {
            Config.displayNone();
            table.haveTurn("fold");
            console.log("clicked FOLD!!");
            this.renderGameScene(table);
        });

        checkButton?.addEventListener("check", () => {
            Config.displayNone();
            table.haveTurn("check");
            this.renderGameScene(table);
        });
    }

    /*
  onClickNextRoundButton(table: BlackjackTable): void
  round overモーダルのnext roundボタンがクリックされた時の処理を記述する
  */
    static onClickNextRoundButton(table: pokerTable) {
        const nextRoundButton = document.querySelector(".next-round-button");
        nextRoundButton?.addEventListener("click", () => {
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

    /*
  onClickGameOverButtons(table: BlackjackTable): void
  game overモーダルのrestart, backボタンがクリックされた時の処理を記述する
  */
    static onClickGameOverButtons(table: pokerTable) {
        const restartButton = document.querySelector(".restart-button");
        const backButton = document.querySelector(".back-button");
        restartButton?.addEventListener("click", () => {
            Config.displayNone();
            this.renderGameScene(
                new pokerTable(
                    "blackjack",
                    table.players[0].name,
                    table.difficulty,
                    table.maxRounds
                )
            );
        });
        backButton?.addEventListener("click", () => {
            Config.displayNone();
        });
    }

    /*
  onClickFinalResultsButons(table: BlackjackTable): void
  final resultsモーダルのrestart, backボタンがクリックされた時の処理を記述する
  */
    static onClickFinalResultsButons(table: BlackjackTable) {}
}
