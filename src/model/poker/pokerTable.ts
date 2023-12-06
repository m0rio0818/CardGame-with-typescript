import {
    PokerGamePhaseType,
    PokerDenominationType,
    PokerActionType,
} from "../../config/pokerConfig.js";
import GameDecision from "../common/GameDecision.js";
import Player from "../common/Player.js";
import Table from "../common/table.js";
import pokerPlayer from "./pokerPlayer.js";

export default class pokerTable extends Table {
    betDenominations: PokerDenominationType[] = [5, 10, 20, 50, 100];
    dealer: pokerPlayer;
    gamePhase: PokerGamePhaseType; // 型の変更
    turnCounter: number;
    dealerIndex: number; // 追加
    minbet: number; //　最小bet
    betMoney: number; //レイズ等をした時のbet額 管理
    betIndex: number; // betStartIndex;
    pot: number;
    players: pokerPlayer[];
    constructor(gameType: string) {
        super(gameType);
        this.dealer = new pokerPlayer("Dealer", "dealer", gameType);
        this.gamePhase = "blinding";
        this.players = [
            new pokerPlayer("p1", "player", gameType),
            new pokerPlayer("ai_1", "ai", gameType),
            new pokerPlayer("ai_2", "ai", gameType),
            new pokerPlayer("ai_3", "ai", gameType),
        ];
        // this.dealerIndex = Math.floor(
        //     Math.random() * (this.players.length - 1)
        // );
        this.dealerIndex = 0;
        this.turnCounter = this.dealerIndex + 1;
        this.betIndex = (this.dealerIndex + 2) % this.players.length;
        this.minbet = 5; // 最小ベット金額
        this.betMoney = 5; //　ベットしないといけない金額
        this.pot = 0; // potに溜まった金額
    }

    assignPlayerHands(): void {
        for (let player of this.players) {
            player.hand.push(this.deck.drawCard());
            player.hand.push(this.deck.drawCard());
        }
    }

    clearPlayerHandsAndBets(): void {
        for (let player of this.players) {
            player.hand = [];
            player.bet = 0;
        }
        this.dealer.hand = [];
        this.dealer.bet = 0;
        this.pot = 0;
    }

    // ラウンド結果を評価し、結果を文字列として返すメソッド.
    evaluateAndGetRoundResults(): string {
        return "";
    }

    // プレイヤーのアクションを評価し、ゲームの進行状態を変更するメソッド。
    evaluateMove(
        player: pokerPlayer,
        userData?: number | PokerActionType
    ): void {
        let decision: GameDecision = player.promptPlayer(this.betMoney);
        console.log(
            "PlayerIndex: ",
            this.turnCounter,
            "betIndex: ",
            this.betIndex
        );
        console.log(player.name, "before", player.gameStatus, player);
        console.log(player.name, "Decistion: ", decision);
        switch (decision.action) {
            case "blind":
                player.bet = this.turnCounter == 1 ? 2 : 5;
                player.chips -= player.bet;
                this.pot += player.bet;
                break;
            case "call":
                console.log("~~~~betの処理〜〜〜");
                console.log(
                    "bet",
                    player.bet,
                    "have to bet : ",
                    decision.amount!
                );
                // 現在betする金額
                let playerNeedBet =
                    decision.amount! <= player.bet
                        ? decision.amount
                        : decision.amount! - player.bet;

                player.bet += playerNeedBet!;
                player.chips -= playerNeedBet!;
                this.pot += playerNeedBet!;
                player.gameStatus = "call";
                console.log("bet ===>>", player.bet);
                break;
            case "raise":
                console.log("betIndex更新前: ", this.betIndex);
                this.betIndex = this.turnCounter;
                console.log("betIndex更新後: ", this.betIndex);
                console.log("before raise: ", this.betMoney);
                this.betMoney *= 2;
                console.log("after raise: ", this.betMoney);
                let playerRaiseBet =
                    decision.amount! <= player.bet
                        ? decision.amount
                        : decision.amount! - player.bet;

                this.pot += playerRaiseBet!;
                player.bet += playerRaiseBet!;
                player.chips -= player.bet;
                player.gameStatus = "raise";
                break;
            case "fold":
                player.gameStatus = "fold";
                break;
            case "pass":
                player.gameStatus = "pass";
                break;
            // case "":
            //     break;
            // default:
            //     break;
        }
        console.log(player.name, "after", player.gameStatus, player);
        console.log("POT に溜まっているお金", this.pot);
    }

    // プレイヤーのターンを処理するメソッド.
    haveTurn(userData?: string | number | undefined): void {
        let player = this.getTurnPlayer();
        if (this.gamePhase == "blinding") {
            // ブラインドベット
            // そのターンのbetをstartした人のindexを取得 (そこで終了か判定するため)
            this.evaluateMove(player);
            this.turnCounter++;
            this.turnCounter %= this.players.length;
            if (this.turnCounter == this.betIndex + 1) {
                this.assignPlayerHands();
                this.chagePlayerStatusToBet(); // 全プレイヤーをbet状態にする。
                this.gamePhase = "betting";
            }
        } else if (this.gamePhase == "betting") {
            if (player.gameStatus == "blind") player.gameStatus = "bet";
            // // 一周したら、終了。途中で,raiseしたら、またそのindexがbetIndexになり、一周カウント。
            this.evaluateMove(player);
            this.turnCounter++;
            this.turnCounter %= this.players.length;
            player = this.getTurnPlayer();
            if (player.gameStatus == "raise" || player.gameStatus == "pass") {
                this.gamePhase = "dealer turn";
            }

            if (
                this.turnCounter == this.betIndex &&
                this.gamePhase != "dealer turn"
            ) {
                console.log(player.gameStatus);
                if (player.gameStatus == "raise") {
                    this.gamePhase = "betting";
                } else if (player.gameStatus == "pass") {
                    this.gamePhase = "dealer turn";
                }
            }
        } else if (this.gamePhase == "dealer turn") {
            console.log("ROUND!!!!", this.roundCounter);
            console.log("ディーラーのターンです。");
            console.log(this.turnCounter, this.dealerIndex);
            console.log("roundCounter", this.roundCounter);
            if (this.roundCounter == 0) {
                console.log("roundCounter 3 != ", this.roundCounter);
                console.log("ディーラーが初回の3枚カードを引きます。");
                this.dealer.hand.push(this.deck.drawCard());
                this.dealer.hand.push(this.deck.drawCard());
                this.dealer.hand.push(this.deck.drawCard());
                this.gamePhase = "betting";
                console.log("gamePhase", this.gamePhase);
            } else if (this.roundCounter == 3) {
                console.log(
                    "ラウンドが終了しました。ここから勝敗判定に入ります。"
                );
                this.clearPlayerHandsAndBets();
                this.pot = 0;
                this.dealerIndex++;
                this.dealerIndex %= this.players.length;
                this.gamePhase = "round over";
            } else {
                console.log("roundCounter 3 != ", this.roundCounter);
                console.log("ディーラーがカードを引きます。");
                this.dealer.hand.push(this.deck.drawCard());
                this.gamePhase = "betting";
            }
            this.roundCounter++;
            this.chagePlayerStatusToBet();
            this.turnCounter = this.dealerIndex + 1;
            this.betMoney = this.minbet; //　また開始ベットに戻す。
            // player.bet = this.minbet; //
            console.log("gamePhase", this.gamePhase);
            console.log("ポットMONEY!!!!!!", this.pot);
        }
    }

    printPlayerStatus(): void {
        for (let player of this.players) {
            console.log(player.type, player.name, player.gameStatus);
        }
    }

    moveToNextPlayer(): void {
        this.turnCounter++;
        this.turnCounter %= this.players.length;
    }

    chagePlayerStatusToBet(): void {
        for (let player of this.players) {
            if (player.gameStatus != "fold") player.gameStatus = "bet";
        }
    }

    // ターン中のプレイヤーを取得するメソッド.
    getTurnPlayer(): pokerPlayer {
        return this.players[this.turnCounter % this.players.length];
    }
}
