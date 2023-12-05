import { RIGHT, Tilemaps } from "phaser";
import {
    PokerGamePhaseType,
    PokerDenominationType,
    PokerActionType,
} from "../../config/pokerConfig.js";
import Player from "../common/player.js";
import Table from "../common/table.js";
import pokerPlayer from "./pokerPlayer.js";
import { setTransitionHooks } from "vue";

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
        this.minbet = 5;
        this.betMoney = 5;
        this.pot = 0;
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

    getDealer(): number {
        return this.players.length > this.dealerIndex
            ? (this.dealerIndex = 0)
            : this.dealerIndex;
    }

    // プレイヤーのアクションを評価し、ゲームの進行状態を変更するメソッド。
    evaluateMove(player: Player, userData?: number | PokerActionType): void {
        let decision = player.promptPlayer(this.betMoney);
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
                let playerNeedBet = decision.amount! - player.bet;
                player.bet += decision.amount! - player.bet;
                player.chips -= playerNeedBet;
                this.pot += playerNeedBet;
                player.gameStatus = "call";
                console.log("bet ===>>", player.bet);
                break;
            case "raise":
                this.betIndex = this.turnCounter;
                console.log("before raise: ", this.betMoney);
                this.betMoney *= 2;
                console.log("after raise: ", this.betMoney);
                player.bet = this.betMoney - player.bet;
                player.chips -= player.bet;
                this.pot += player.bet;
                player.gameStatus = "raise";
                console.log("raise ===>>", player.bet);
                break;
            case "fold":
                player.gameStatus = "fold";
                break;
            // case "":
            //     break;
            // default:
            //     break;
        }
        console.log(player.type, "after", player.gameStatus, player);
        console.log("potに溜まっているお金", this.pot);
    }

    // プレイヤーのターンを処理するメソッド.
    haveTurn(userData?: string | number | undefined): void {
        let player = this.getTurnPlayer();

        if (this.gamePhase == "blinding") {
            // ブラインドベット
            // そのターンのbetをstartした人のindexを取得 (そこで終了か判定するため)
            console.log("betindex", this.betIndex);
            this.evaluateMove(player);
            this.turnCounter++;
            this.turnCounter %= this.players.length;
            if (this.turnCounter == this.betIndex + 1) {
                this.assignPlayerHands();
                this.gamePhase = "betting";
            }
        } else if (this.gamePhase == "betting") {
            if (player.gameStatus == "blind") player.gameStatus = "bet";
            // 一周したら、終了。途中で,raiseしたら、またそこから一周カウント。
            // if (player.gameStatus == "fold") {
            //     console.log(player.name + "は降ります!!!!");
            //     this.turnCounter++;
            //     this.turnCounter %= this.players.length;
            // }
            if (this.turnCounter == this.betIndex) {
                // 初回のみ例外。
                // 一周回 => this.betIndex => pass or raise
                // =>  raiseしたらもう一周する。
                if (player.gameStatus == "raise") {
                    this.gamePhase = "dealer turn";
                    console.log("ゲームフェーズをdealer turnに変更します。");
                } else {
                    console.log("call start!!!!!");
                    this.evaluateMove(player);
                    this.turnCounter++;
                    this.turnCounter %= this.players.length;
                }
            } else {
                console.log("callします!!!!!");
                this.evaluateMove(player);
                this.turnCounter++;
                this.turnCounter %= this.players.length;
            }
        } else if (this.gamePhase == "dealer turn") {
            this.turnCounter = this.dealerIndex + 1;
            // this.roundCounter++;
            // if (this.roundCounter != 3) {
            //     console.log("現在round : ", this.roundCounter);
            //     this.betMoney = this.minbet;         //　また開始ベットに戻す。
            //     console.log("ディーラーがカードを引きます。");
            //     this.dealer.hand.push(this.deck.drawCard());
            //     this.chagePlayerStatusToBet();
            //     this.gamePhase = "betting";
            // } else {
            this.gamePhase = "round over";
            // }
        } else if (this.gamePhase == "round over") {
            console.log(
                "ラウンドがが終了しました。ここから勝敗判定に入ります。"
            );
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
    getTurnPlayer(): Player {
        return this.players[this.turnCounter % this.players.length];
    }
}
