import { Player } from "./Player.js";
import { Deck } from "./Deck.js";
import { GameDecision } from "./GameDecision.js";

export class Table {
    /*
        String gameType : {"blackjack"}から選択。
        Array betDenominations : プレイヤーが選択できるベットの単位。デフォルトは[5,20,50,100]。
        return Table : ゲームフェーズ、デッキ、プレイヤーが初期化されたテーブル
    */
    public gameType: string;
    public betDenominatoins: number[];
    public deck: Deck;
    public players: Player[];
    public house: Player;
    public turnCounter: number;
    public gamePhase: string;
    public resultsLog: string[];

    constructor(
        gameType: string,
        betDenominations: number[] = [1, 5, 20, 50, 100]
    ) {
        this.gameType = gameType;
        this.betDenominatoins = betDenominations;
        this.deck = new Deck(this.gameType);
        // プレイしているゲームに応じて、プレイヤー、gamePhases、ハウスの表現が異なるかもしれません。
        // 今回はとりあえず3人のAIプレイヤーとハウス、bettingフェーズの始まりにコミットしましょう。
        this.players = [];
        this.house = new Player("house", "house", this.gameType);
        this.turnCounter = 0;
        this.gamePhase = "betting"; // 'betting', 'acting', 'evaluatingWinners, gameOver'
        this.resultsLog = []; // table.gamePhase が 'roundOver' のとき，その内容は blackjackEvaluateAndGetRoundResults() から取得
    }

    /*
        return String: 新しいターンが始まる直前の全プレイヤーの状態を表す文字列。
        NOTE: このメソッドの出力は、各ラウンドの終了時にテーブルのresultsLogメンバを更新するために使用されます。
    */
    blackjackEvaluateAndGetRoundResults(): string {
        let status: string = "";
        for (let player of this.players) {
            let playerStatus: string = player.gameStatus;
            if (
                playerStatus == "bust" ||
                playerStatus == "broken" ||
                playerStatus == "surrender"
            )
                status += player.name + ":" + playerStatus + ",";
            else {
                // 勝利、負け等をpushしたい。
            }
        }
        this.resultsLog.push(status);
        return status;
    }

    /*
        return null: デッキから2枚のカードを手札に加えることで、全プレイヤーの状態を更新します。
        NOTE: プレイヤーのタイプが「ハウス」の場合は、別の処理を行う必要があります。
    */
    blackjackAssignPlayerHands(): void {
        for (let player of this.players) {
            if (player.type == "house") {
                player.hand.push(this.deck.drawOne());
            } else {
                for (let i = 0; i < 2; i++) {
                    player.hand.push(this.deck.drawOne());
                }
            }
        }
    }

    /*
       return null: テーブル内のすべてのプレイヤーの状態を更新し、手札を空の配列に、ベットを0に設定します。
    */
    blackjackClearPlayerHandsAndBets(): void {
        for (let player of this.players) {
            player.bet = player.type == "house" ? -1 : 0;
            player.hand = [];
        }
    }

    // 現在のターンが誰のものかを返す
    getTurnPlayer(): Player {
        return this.players[this.turnCounter];
    }

    // プレイヤーが取った行動（ベット、ヒット、スタンドなど）を評価
    // それに応じてゲームの状態（プレイヤーの手札、ベット、ゲームの状態、チップなど）を更新
    /*
        Player player : テーブルは、Player.promptPlayer()を使用してGameDecisionを取得し、
        GameDecisionとgameTypeに応じてPlayerの状態を更新します。
        return Null : このメソッドは、プレーヤの状態を更新するだけです。
        例.プレイヤーが「ヒット」し、手札が21以上の場合、gameStatusを「バスト」に設定し、チップからベットを引きます。
    */
    evaluateMove(player: Player): void {
        let inputBet: number = 20;
        let gamedecistion: GameDecision = player.promptPlayer(inputBet);

        if (gamedecistion.action == "bet") {
            player.chips -= inputBet;
        } else if (gamedecistion.action == "double") {
            player.chips -= inputBet * 2;
        } else if (gamedecistion.action == "hit") {
            let totalCard = player.getHandScore();
        } else if (gamedecistion.action == "stand") {
        } else if (gamedecistion.action == "surrender") {
        } else if (gamedecistion.action == "wait") {
            // 待ちの状態
        }
    }

    /*
       ブラックジャックゲームの各ターンを管理する役割
       Number userData: テーブルモデルの外部から渡されるデータです。 
       return null: このメソッドはテーブルの状態を更新するだけで、値を返しません。
    */
    haveTurn(): void {
        let currentPlayer: Player = this.getTurnPlayer();
        if (this.gamePhase == "betting") {
            // ベット
            
            // ベットが最後の人だと、次からつぎからアクションフェーズに移行。
            if (this.onLastPlayer()) this.gamePhase = "acting";
        } else if (this.gamePhase == "acting") {
            //　行動

            if (this.onLastPlayer()) {
                this.gamePhase = "evaluateWinners";
            }
        } else if (this.gamePhase == "evaluateWinners") {
            this.blackjackEvaluateAndGetRoundResults();
            this.gamePhase = "roundOver";
        } else if (this.gamePhase == "roundOver") {
            // ラウンド終了　=> カードの初期化
            this.blackjackClearPlayerHandsAndBets();
        } else {
        }
        this.evaluateMove(currentPlayer);
        this.turnCounter++;
    }

    // 現在のプレイヤーがプレイヤーの配列の最後のプレイヤーであるかどうか
    onLastPlayer(): boolean {
        return this.turnCounter == this.players.length - 1;
    }

    onFirstPlayer(): boolean {
        return this.turnCounter == 0;
    }

    allPlayerActionsResolved(): boolean {
        let statusList = [
            "broken",
            "surrender",
            "bust",
            "stand",
            "blackjack",
            "double",
        ];

        for (let player of this.players) {
            let playerGameStatus: string = player.gameStatus;
            if (playerGameStatus in statusList) return true;
        }
        return false;
    }
}
