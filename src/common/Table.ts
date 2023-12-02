import { Player } from "./Player.js";
import { Deck } from "./Deck.js";
import { GameDecision } from "./GameDecision.js";
import { BlackJackActionType, BlackjackStatusType } from "../config/blackJackConfig.js";
import { Card } from "./Card.js";

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
    public resultsLog: string[][];

    constructor(
        gameType: string,
        betDenominations: number[] = [1, 5, 20, 50, 100]
    ) {
        this.gameType = gameType;
        this.betDenominatoins = betDenominations;
        this.deck = new Deck(this.gameType);
        // プレイしているゲームに応じて、プレイヤー、gamePhases、ハウスの表現が異なるかもしれません。
        // 今回はとりあえず3人のAIプレイヤーとハウス、bettingフェーズの始まりにコミットしましょう。
        this.house = new Player("house", "house", this.gameType);
        this.players = [
            this.house,
            new Player("p_1", "player", this.gameType),
            new Player("ai_1", "ai", this.gameType),
            // new Player("ai_2", "ai", this.gameType),
        ];
        this.turnCounter = 0;
        this.gamePhase = "betting"; // 'betting', 'acting', 'evaluatingWinners, gameOver'
        this.resultsLog = []; // table.gamePhase が 'roundOver' のとき，その内容は blackjackEvaluateAndGetRoundResults() から取得
    }

    /*
        return String: 新しいターンが始まる直前の全プレイヤーの状態を表す文字列。
        NOTE: このメソッドの出力は、各ラウンドの終了時にテーブルのresultsLogメンバを更新するために使用されます。
    */
    blackjackEvaluateAndGetRoundResults(): string[] {
        console.log("ここから勝敗判定を行なっていきます。");

        for (let player of this.players) {
            console.log(player.name, player.getHandScore());
        }

        // Dealer: BlackJack
            // player: Blackjack => draw
            // player : !Blackjack => Lose
        // Dealer : Bust
            // Player : Blackjack => $bet x1.5 win
            // Player : double => $bet x2 win
            // player : stand => $bet win
        //  Dealer > plaer
            // player = double : -$bet x2
            // player = stand :  -$bet

        const dealer : Player = this.players[0];
        const dealerScore : number = dealer.getHandScore();
        const dealerStatus : BlackjackStatusType = dealer.gameStatus;

        

        let statusLog: string[] = [];
        for (let i=1; i<this.players.length; i++) {
            let currPlayer = this.players[i];
            let playerStatus: BlackjackStatusType  = currPlayer.gameStatus;
            let playerScore : number = currPlayer.getHandScore();
            if (dealerStatus === "blackjack"){
                if (playerStatus === "blackjack") {
                    // draw
                }
                else {
                    // player lose
                }
            }
            else if (dealerStatus === "bust"){
                if (playerStatus === "blackjack") {
                    // $bet x1.5 win
                }
                else if (playerStatus === ""){
                    // $bet x2 win
                }
                else {
                    // $bet x1 win
                }
            }
            else if (dealerScore > playerScore) {
                if (playerStatus == "") {

                }
                else if (playerStatus == "stand"){
                    //  - $bet x1 win
                }
            }
            
            if (
                playerStatus == "bust" ||
                playerStatus == "surrender"
            )
            statusLog.push(
                    "name: " +
                        currPlayer.name +
                        ", action" +
                        currPlayer.gameStatus +
                        ", bet : " +
                        currPlayer.bet +
                        ", won : " +
                        currPlayer.winAmount
                );
            else {
                // 勝利、負け等をpushしたい。
            }
        }
        this.resultsLog.push(statusLog);
        return statusLog;
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
        let gamedecision: GameDecision;

        // 現在のhand　bet => player $20 bet のみ => hitはしない。 (stand);
        if (this.gamePhase == "betting" && player.type == "player") {
            let inputBet: number = 20;
            gamedecision = player.promptPlayer(inputBet);
        } else {
            if (player.type == "house") {
                let inputBet: BlackJackActionType = "wait";
                gamedecision = player.promptPlayer(inputBet);
            } else {
                let inputBet: BlackJackActionType = "stand";
                gamedecision = player.promptPlayer(inputBet);
            }
        }
        console.log("handを評価 :", gamedecision);

        if (gamedecision.action == "bet") {
            console.log("ベット => 状態を更新");
            player.chips -= gamedecision.amount;
            player.winAmount = gamedecision.amount;
            player.gameStatus = "acting";
            console.log("Player after bet: ", player);
            console.log(
                "----------------------------------------------------------------------------------------------------------------"
            );
        } else if (gamedecision.action == "hit") {
            let score = player.getHandScore();
            if (player.type == "ai" || player.type == "house") {
                console.log("ai or houseは17未満だとhit");
                // 17未満の場合は場合は超えるまでhitを続ける。
                while (score < 17) {
                    console.log(player.name, "ヒット => カードを一枚引く");
                    gamedecision = player.promptPlayer("hit");
                    player.hand.push(this.deck.drawOne());
                    score = player.getHandScore();
                }
            } else {
                console.log(player.name, "ヒット => カードを一枚引く");
                player.hand.push(this.deck.drawOne());
            }

            console.log("hitの終了 => bust, acting 判定〜〜〜");

            player.gameStatus = score > 21 ? "bust" : "acting";

            console.log("Player after hit: ", player, score);
            console.log(
                "----------------------------------------------------------------------------------------------------------------"
            );
        } else if (gamedecision.action == "stand") {
            console.log("スタンド => standする");
            player.gameStatus = "stand";
            console.log("Player after stand: ", player);
            console.log(
                "----------------------------------------------------------------------------------------------------------------"
            );
        } else if (gamedecision.action == "double") {
            player.hand.push(this.deck.drawOne());
            player.chips -= gamedecision.amount;
            player.winAmount = gamedecision.amount * 2;
            player.gameStatus = "stand";
        } else if (gamedecision.action == "surrender") {
            player.chips -= gamedecision.amount / 2;
            player.winAmount = 0;
            player.gameStatus = "surrender";
        } else if (gamedecision.action == "wait") {
            // ディーラーの待ち状態
            player.gameStatus = "waiting";
            console.log("Dealer after wait: ", player);
            console.log(
                "----------------------------------------------------------------------------------------------------------------"
            );
        }

        //　ブラックジャックの場合は、こちらで更新。
        if (
            player.hand.length == 2 &&
            player.hand.filter((card) => card.rank === "A").length > 0
        )
            player.gameStatus = "blackjack";
    }

    /*
       ブラックジャックゲームの各ターンを管理する役割
       Number userData: テーブルモデルの外部から渡されるデータです。 
       return null: このメソッドはテーブルの状態を更新するだけで、値を返しません。
    */
    haveTurn(): void {
        let currPlayer: Player = this.getTurnPlayer();
        console.log(
            "Player before " + this.gamePhase + " action :",
            currPlayer
        );

        this.evaluateMove(currPlayer);

        if (this.gamePhase == "betting") {
            // ベットが最後の人だと、次にアクションフェーズに移行。
            if (this.onLastPlayer()) {
                // 全員がbet終了後にカード配布
                this.gamePhase = "acting";
                this.turnCounter = -1;
                console.log(
                    "!!!!!!!!!!!!!!!!!!!!ここでプレイヤー全員にカードを配ります!!!!!!!!!!!!!!!!!!!!"
                );
                this.blackjackAssignPlayerHands();
                console.log(
                    "----------------------------------------------------------------------------------------------------------------"
                );
            }
            // console.log("現在のフェーズ", this.gamePhase);
        } else if (this.gamePhase == "acting") {
            //　行動
            console.log(currPlayer.name, ": act終了し、次はjudgeです。");
            if (this.onLastPlayer()) {
                this.gamePhase = "evaluateWinners";
                this.turnCounter = -1;
                console.log("最後のプレイヤーがact終了しました");
            }
        } else if (this.gamePhase == "evaluateWinners") {
            console.log("ここから勝利プレイヤーを決定します。");
            // ディーラーが2枚目を引く。
            // ディーラーが2枚目以降のカードをめくっていく。
            let dealer: Player = this.players[0];
            let dealerScore = dealer.getHandScore();
            console.log(dealerScore);
            while (dealerScore < 17) {
                dealer.hand.push(this.deck.drawOne());
                dealerScore = dealer.getHandScore();
            }

            if (dealerScore == 21 && dealer.hand.length == 2)
                dealer.gameStatus == "blackjack";
            else if (dealerScore > 21) dealer.gameStatus = "bust";
            else dealer.gameStatus = "stand";

            this.blackjackEvaluateAndGetRoundResults();
            this.gamePhase = "roundOver";
        } else if (this.gamePhase == "roundOver") {
            // ラウンド終了　=> カードの初期化
            this.blackjackClearPlayerHandsAndBets();
        }
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
