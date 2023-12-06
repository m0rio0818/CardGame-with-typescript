import { setTransitionHooks } from "vue";
import {
    PokerGamePhaseType,
    PokerDenominationType,
    PokerActionType,
} from "../../config/pokerConfig.js";
import Table from "../common/Table.js";
import pokerGameDecision from "./pokerGameDecision.js";
import pokerPlayer from "./pokerPlayer.js";

export default class pokerTable extends Table {
    betDenominations: PokerDenominationType[] = [5, 10, 20, 50, 100];
    dealer: pokerPlayer;
    gamePhase: PokerGamePhaseType; // 型の変更
    turnCounter: number; //　現在のターンカウンター
    dealerIndex: number; // 追加
    minbet: number; //　最小bet
    betMoney: number; // テーブルの現在のbet金額(raise等によって変動していく。)
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
        this.turnCounter = this.dealerIndex + 1; // 現在ターンのプレイヤーを返す。
        this.betIndex = (this.dealerIndex + 2) % this.players.length;
        this.minbet = 5; // 最小ベット金額
        this.betMoney = this.minbet; //　ベットしないといけない金額
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
        this.pot = 0;
    }

    clearPlayerBet(): void {
        for (let player of this.players) {
            player.bet = 0;
        }
    }

    // ラウンド結果を評価し、結果を文字列として返すメソッド.
    evaluateAndGetRoundResults(): string {
        return "";
    }

    // プレイヤーのアクションを評価し、ゲームの進行状態を変更するメソッド。
    evaluateMove(player: pokerPlayer, userData?: PokerActionType): void {
        if (player.type == "dealer") {
            if (this.roundCounter == 1) {
                this.dealer.hand.push(this.deck.drawCard());
                this.dealer.hand.push(this.deck.drawCard());
                this.dealer.hand.push(this.deck.drawCard());
            } else {
                this.dealer.hand.push(this.deck.drawCard());
            }
            this.gamePhase = "betting";
            this.clearPlayerBet();
            this.roundCounter++;
        } else {
            // turnCounter == betIndex : 1周してきた時
            if (
                this.turnCounter == this.betIndex &&
                player.gameStatus != "bet"
            ) {
                this.gamePhase = "dealer turn";
            }

            let gameDecision: pokerGameDecision = player.promptPlayer(
                userData!,
                this.betMoney
            );

            console.log(gameDecision);

            switch (gameDecision.action) {
                case "blind":
                    //　ブラインドベットをする。
                    console.log(player.name, "before blind", player);
                    player.bet =
                        this.turnCounter == this.dealerIndex + 1 ? 2 : 5;
                    console.log("player Blind bet money", player.bet);
                    player.chips -= player.bet;
                    this.pot += player.bet;
                    player.gameStatus = "bet";
                    console.log(player.name, "after blind", player);
                    // ブラインド終了後に、、全プレイヤーをbet状態にする。
                    if (this.turnCounter == this.dealerIndex + 2) {
                        this.changePlayerStatusToBet();
                    }
                    break;
                case "call":
                    // 一個前のプレイヤーのステータス check => betIndexの変更
                    if (this.getoneBeforePlayer().gameStatus == "check") {
                        this.betIndex = this.turnCounter;
                        this.changePlayerStatusToBet();
                    }

                    console.log(player.name, "before call", player);

                    let playercallMoney = gameDecision.amount;
                    let currBet = player.bet;
                    console.log("call前のbet", currBet);
                    let playerHaveToCall = playercallMoney - currBet;
                    player.bet += playerHaveToCall;
                    console.log("call後のbet", player.bet);
                    player.chips -= playerHaveToCall;
                    this.pot += playerHaveToCall;
                    player.gameStatus = "call";
                    console.log(player.name, "after call", player);
                    break;
                case "raise":
                    console.log(player.name, "before raise", player);
                    // レイズ時indexの変更
                    let playerRaiseMoney = gameDecision.amount;
                    this.betMoney = gameDecision.amount;
                    currBet = player.bet;
                    let playerHaveToRaise = playerRaiseMoney - currBet;
                    this.pot += playerHaveToRaise;
                    player.chips -= playerHaveToRaise;
                    this.betIndex = this.turnCounter;
                    // 全プレイヤーをbet状態に戻す。
                    this.changePlayerStatusToBet();
                    // 自身はraiseにかえ、一周してきた時に、betではないので次は
                    player.gameStatus = "raise";
                    console.log(player.name, "after raise", player);
                    break;
                case "allin":
                    this.pot += gameDecision.amount;
                    player.gameStatus = "allin";
                    break;
                case "check":
                    console.log(player.name, "after check", player);
                    player.gameStatus = "check";
                    console.log(player.name, "after check", player);
                    break;
                case "fold":
                    player.gameStatus = "fold";
                    break;
            }
            console.log("Pot Money", this.pot);
        }
    }

    // プレイヤーのターンを処理するメソッド.
    haveTurn(userData?: PokerActionType): void {
        if (this.gamePhase == "dealer turn") {
            if (this.roundCounter == 3) {
                this.gamePhase = "evaluating";
            }
            // 0, 1, 2回目は再びbettingに戻る。
            else this.evaluateMove(this.dealer);
        }

        if (this.gamePhase == "evaluating") {
;            this.evaluateAndGetRoundResults();
            this.clearPlayerHandsAndBets();
        }

        let player = this.getTurnPlayer();
        // 前のまえのプレイヤーがpassしてたらpass可能
        // else bet, raise, dropのみ選択可能。

        let playerBefore = this.getoneBeforePlayer();
        console.log("currPlayer: ", player.name);
        if (this.allPlayerActionResolved()) {
            this.gamePhase = "dealer turn";
            this.evaluateMove(this.dealer);
        } else {
            if (playerBefore.gameStatus == "check" && userData == "check") {
                // checkできる。
                this.evaluateMove(player, "check");
            }
            // passはできないように実装。
            else if (
                playerBefore.gameStatus !== "check" &&
                userData == "check"
            ) {
                this.evaluateMove(player, "call");
            }

            // playerが最小ベットより小さかったら。
            // allin
            else if (player.chips <= this.minbet) {
                this.evaluateMove(player, "allin");
            } else {
                player.type == "player"
                    ? this.evaluateMove(player, userData as PokerActionType)
                    : // ai
                      this.evaluateMove(player);
            }
        }

        // プレイヤーにカードを配る。

        this.turnCounter++;
        this.turnCounter %= this.players.length;
    }

    /*
    playerActionResolved(player: Player): boolean
    {'call', "check", "fold", "raise", "allin"}
    ラウンド中のプレイヤーの行動が全て完了しているかどうかを返す
    */
    playerActionResolved(player: pokerPlayer): boolean {
        return (
            player.gameStatus == "call" ||
            player.gameStatus == "check" ||
            player.gameStatus == "fold" ||
            player.gameStatus == "raise" ||
            player.gameStatus == "allin"
        );
    }

    /*
    allPlayerActionsResolved(): boolean
    ラウンド中の全プレイヤーの行動が完了しているかどうかを返す
    */
    allPlayerActionResolved(): boolean {
        for (let player of this.players) {
            if (!this.playerActionResolved(player)) return false;
        }
        return true;
    }

    printPlayerStatus(): void {
        for (let player of this.players) {
            console.log(player.type, player.name, player.gameStatus);
        }
    }

    // 最後のプレイヤーを返す。
    onLastPlayer(): boolean {
        return this.turnCounter == this.betIndex;
    }

    moveToNextPlayer(): void {
        this.turnCounter++;
        this.turnCounter %= this.players.length;
    }

    changePlayerStatusToBet(): void {
        for (let player of this.players) {
            if (player.gameStatus != "fold") player.gameStatus = "bet";
        }
    }

    // ターン中のプレイヤーを取得するメソッド.
    getTurnPlayer(): pokerPlayer {
        return this.players[this.turnCounter % this.players.length];
    }

    getoneBeforePlayer(): pokerPlayer {
        return this.players[
            (this.turnCounter + this.players.length - 1) % this.players.length
        ];
    }
}
