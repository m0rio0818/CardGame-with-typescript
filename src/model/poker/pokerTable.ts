import {
    PokerGamePhaseType,
    PokerDenominationType,
    PokerActionType,
    PokerHandType,
} from "../../config/pokerConfig.js";
import Player from "../common/Player.js";
import Table from "../common/Table.js";
import pokerGameDecision from "./pokerGameDecision.js";
import pokerPlayer from "./pokerPlayer.js";

export default class pokerTable extends Table {
    betDenominations: PokerDenominationType[] = [5, 10, 20, 50, 100];
    indexOfNum: string[];
    dealer: pokerPlayer;
    gamePhase: PokerGamePhaseType; // 型の変更
    turnCounter: number; //　現在のターンカウンター
    dealerIndex: number; // 追加
    minbet: number; //　最小bet
    betMoney: number; // テーブルの現在のbet金額(raise等によって変動していく。)
    betIndex: number; // betStartIndex;
    smallBlind: number;
    bigBlind: number;
    pot: number;
    players: pokerPlayer[];
    pokerPlayerRank: PokerHandType[];
    constructor(gameType: string) {
        super(gameType);
        this.dealer = new pokerPlayer("Dealer", "dealer", gameType);
        this.gamePhase = "blinding";
        this.players = [
            new pokerPlayer("p1", "player", gameType),
            new pokerPlayer("p2", "player", gameType),
            new pokerPlayer("p3", "player", gameType),
            new pokerPlayer("p4", "player", gameType),
        ];
        // this.dealerIndex = Math.floor(
        //     Math.random() * (this.players.length - 1)
        // );
        this.dealerIndex = 0;
        this.turnCounter = this.dealerIndex + 1; // 現在ターンのプレイヤーを返す。
        this.betIndex = (this.dealerIndex + 2) % this.players.length;
        this.minbet = 5; // 最小ベット金額
        this.smallBlind = Math.floor(this.minbet / 2);
        this.bigBlind = Math.floor(this.minbet);
        this.betMoney = this.minbet; //　ベットしないといけない金額
        this.pot = 0; // potに溜まった金額
        this.pokerPlayerRank = [
            "royal flush",
            "straight flush",
            "four card",
            "full house",
            "flush",
            "straight",
            "three card",
            "two pair",
            "one pair",
            "no pair",
        ];
        this.indexOfNum = [
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "J",
            "Q",
            "K",
            "A",
        ];
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
            player.gameStatus = "blind";
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
        const hashMap: Record<PokerHandType, number> = {
            "": 0,
            "royal flush": 0,
            "straight flush": 0,
            "four card": 0,
            "full house": 0,
            flush: 0,
            straight: 0,
            "three card": 0,
            "two pair": 0,
            "one pair": 0,
            "no pair": 0,
            fold: 0,
        };

        console.log("ログ、勝敗判定します");

        for (let player of this.players) {
            hashMap[player.playerHandStatus] += 1;
        }

        let maxValue: PokerHandType = "";
        // 今回のポーカーの役で一番強いものを決める => もしダブってたら、手札の強い順？
        for (let key in hashMap) {
            if (hashMap[key] > 0) {
                maxValue = key as PokerHandType;
                break;
            }
        }

        // 誰だったかを取得
        console.log(maxValue, hashMap[maxValue]);

        // 複数人いた際は、手札の強い方で判定。
        if (hashMap[maxValue] > 1) {
            let winnerPlayer: pokerPlayer[] = this.players.filter(
                (player) => player.playerHandStatus == maxValue
            );
            console.log(
                "複数人います。",
                winnerPlayer.map((player) => player.playerHandStatus)
            );
            // フォーカード　比較
            // フルハウス or スリーカード
            if (
                winnerPlayer[0].playerHandStatus == "full house" ||
                winnerPlayer[0].playerHandStatus == "three card"
            ) {
                let maxThreeCard = winnerPlayer[0].pairsOfThreeList[0];
                let maxThreeCardIndex = 0;
                for (let i = 1; i < winnerPlayer.length; i++) {
                    if (
                        this.indexOfNum.indexOf(maxThreeCard) <
                        this.indexOfNum.indexOf(
                            winnerPlayer[i].pairsOfThreeList[0]
                        )
                    ) {
                        maxThreeCard = winnerPlayer[i].pairsOfThreeList[0];
                        maxThreeCardIndex = i;
                    }
                }
                console.log(
                    maxThreeCard,
                    maxThreeCardIndex,
                    winnerPlayer[maxThreeCardIndex].name
                );
            }
            //　ツーペア比較 // ワンペア比較
            else if (
                winnerPlayer[0].playerHandStatus == "two pair" ||
                winnerPlayer[0].playerHandStatus == "one pair"
            ) {
                let currHand =
                    winnerPlayer[0].pairsOfTwoList[
                        winnerPlayer[0].pairsOfTwoList.length - 1
                    ];
                let currIndex = 0;
                let flag = false;
                for (
                    let j = winnerPlayer[0].pairsOfTwoList.length - 1;
                    j >= 0;
                    j--
                ) {
                    currHand = winnerPlayer[0].pairsOfTwoList[j];
                    for (let i = 0; i < winnerPlayer.length; i++) {
                        let currPlayerHand = winnerPlayer[i].pairsOfTwoList[j];
                        console.log(currIndex, currHand, currPlayerHand);
                        if (currHand != currPlayerHand) {
                            flag = true;
                            if (
                                this.indexOfNum.indexOf(currHand) <
                                this.indexOfNum.indexOf(currPlayerHand)
                            ) {
                                currHand = currPlayerHand;
                                currIndex = i;
                                console.log(
                                    "currHand",
                                    currHand,
                                    "currIndex",
                                    currIndex,
                                    flag
                                );
                            }
                        }
                    }
                    if (flag) break;
                }

                let flagSecond = false;
                if (!flag) {
                    for (
                        let j = winnerPlayer[0].parisOfCardList.length - 1;
                        j >= 0;
                        j--
                    ) {
                        currHand = winnerPlayer[0].parisOfCardList[j];
                        for (let i = 0; i < winnerPlayer.length; i++) {
                            let currPlayerHand =
                                winnerPlayer[i].parisOfCardList[j];
                            console.log(currIndex, currHand, currPlayerHand);
                            if (currHand != currPlayerHand) {
                                flagSecond = true;
                                if (
                                    this.indexOfNum.indexOf(currHand) <
                                    this.indexOfNum.indexOf(currPlayerHand)
                                ) {
                                    currHand = currPlayerHand;
                                    currIndex = i;
                                    console.log(
                                        "currHand",
                                        currHand,
                                        "currIndex",
                                        currIndex,
                                        flagSecond
                                    );
                                }
                            }
                        }
                        if (flagSecond) break;
                    }
                }

                if (!flagSecond) {
                    // 引き分け
                    for (let player of winnerPlayer){
                        console.log(player, player.name)
                        player.chips += Math.floor(this.pot / winnerPlayer.length)
                    }
                } else {
                    // 勝利プレイヤーに分配
                    winnerPlayer[currIndex].chips += this.pot;
                }
                console.log(
                    currIndex,
                    winnerPlayer[currIndex].name,
                    flag,
                    flagSecond
                );
            }
            // no pair
            else {
                let currHand =
                    winnerPlayer[0].pairsOfTwoList[
                        winnerPlayer[0].pairsOfTwoList.length - 1
                    ];
                let currIndex = 0;
                let flag = false;

                for (
                    let j = winnerPlayer[0].parisOfCardList.length - 1;
                    j >= 0;
                    j--
                ) {
                    currHand = winnerPlayer[0].parisOfCardList[j];
                    for (let i = 0; i < winnerPlayer.length; i++) {
                        let currPlayerHand = winnerPlayer[i].parisOfCardList[j];
                        console.log(currIndex, currHand, currPlayerHand);
                        if (currHand != currPlayerHand) {
                            flag = true;
                            if (
                                this.indexOfNum.indexOf(currHand) <
                                this.indexOfNum.indexOf(currPlayerHand)
                            ) {
                                currHand = currPlayerHand;
                                currIndex = i;
                                console.log(
                                    "currHand",
                                    currHand,
                                    "currIndex",
                                    currIndex,
                                    flag
                                );
                            }
                        }
                    }
                    if (flag) break;
                }
                if (!flag) {
                    // 引き分け
                    for (let player of winnerPlayer){
                        console.log(player, player.name)
                        player.chips += Math.floor(this.pot / winnerPlayer.length)
                    }
                } else {
                    // 勝利プレイヤーに分配
                    winnerPlayer[currIndex].chips += this.pot;
                }
                console.log(currIndex, winnerPlayer[currIndex].name, flag);
            }

            // ツーカード　or ワンペア
            winnerPlayer.map((player) => {
                console.log(
                    player.name,
                    player.pairsOfTwoList,
                    player.pairsOfThreeList,
                    player.parisOfCardList
                );
            });
        } else {
            // 勝ちプレイヤー取得。
            let winnerPlayer: pokerPlayer[] = this.players.filter(
                (player) => player.playerHandStatus == maxValue
            );
            console.log(winnerPlayer[0].name);
            winnerPlayer[0].chips += this.pot;
            this.pot = 0;
        }

        return "";
    }

    checkPairsOfCard(winnerPlayer: pokerPlayer[], type?: string): boolean {
        let flag = false;
        let currIndex = 0;
        if (type == "two") {
            let currHand =
                winnerPlayer[0].pairsOfTwoList[
                    winnerPlayer[0].pairsOfTwoList.length - 1
                ];
            for (
                let j = winnerPlayer[0].pairsOfTwoList.length - 1;
                j >= 0;
                j--
            ) {
                currHand = winnerPlayer[0].pairsOfTwoList[j];
                for (let i = 0; i < winnerPlayer.length; i++) {
                    let currPlayerHand = winnerPlayer[i].pairsOfTwoList[j];
                    console.log(currIndex, currHand, currPlayerHand);
                    if (currHand != currPlayerHand) {
                        flag = true;
                        if (
                            this.indexOfNum.indexOf(currHand) <
                            this.indexOfNum.indexOf(currPlayerHand)
                        ) {
                            currHand = currPlayerHand;
                            currIndex = i;
                            console.log(
                                "currHand",
                                currHand,
                                "currIndex",
                                currIndex,
                                flag
                            );
                        }
                    }
                }
                if (flag) break;
            }
            return flag;
        } else {
            let currHand =
                winnerPlayer[0].pairsOfTwoList[
                    winnerPlayer[0].pairsOfTwoList.length - 1
                ];
            if (!flag) {
                for (
                    let j = winnerPlayer[0].parisOfCardList.length - 1;
                    j >= 0;
                    j--
                ) {
                    currHand = winnerPlayer[0].parisOfCardList[j];
                    for (let i = 0; i < winnerPlayer.length; i++) {
                        let currPlayerHand = winnerPlayer[i].parisOfCardList[j];
                        console.log(currIndex, currHand, currPlayerHand);
                        if (currHand != currPlayerHand) {
                            flag = true;
                            if (
                                this.indexOfNum.indexOf(currHand) <
                                this.indexOfNum.indexOf(currPlayerHand)
                            ) {
                                currHand = currPlayerHand;
                                currIndex = i;
                                console.log(
                                    "currHand",
                                    currHand,
                                    "currIndex",
                                    currIndex,
                                    flag
                                );
                            }
                        }
                    }
                    if (flag) break;
                }
            }
            return flag;
        }
    }

    // プレイヤーのアクションを評価し、ゲームの進行状態を変更するメソッド。
    evaluateMove(player: pokerPlayer, userData?: PokerActionType): void {
        if (player.type == "dealer") {
            if (this.roundCounter == 0) {
                this.dealer.hand.push(this.deck.drawCard());
                this.dealer.hand.push(this.deck.drawCard());
                this.dealer.hand.push(this.deck.drawCard());
            } else if (this.roundCounter < 3) {
                this.dealer.hand.push(this.deck.drawCard());
            }
            this.roundCounter++;
            console.log("roundCounter !!: ", this.roundCounter);

            if (this.roundCounter == 4) {
                console.log("最終ラウンドまで来た。");
                this.gamePhase = "evaluating";
            }
            this.clearPlayerBet();
            this.changePlayerStatusToBet();
            this.turnCounter = this.dealerIndex + 1;
            this.betMoney = this.minbet;
            console.log("ディーラーのhand", this.dealer.hand);
            console.log("次のラウンドの開始person", this.getTurnPlayer().name);
            this.gamePhase == "evaluating"
                ? (this.gamePhase = "evaluating")
                : (this.gamePhase = "betting");
            this.printPlayerStatus();
        } else {
            // turnCounter == betIndex : 1周してきた時
            // bet状態じゃない or ブラインドベットじゃない => dealer.turn
            if (
                this.turnCounter == this.betIndex &&
                player.gameStatus != "bet" &&
                player.gameStatus != "blind"
            ) {
                console.log("一周してきました。ディーラーに移行");
                this.gamePhase = "dealer turn";
            }

            let gameDecision: pokerGameDecision = player.promptPlayer(
                userData!,
                this.betMoney
            );

            console.log(gameDecision);
            console.log(this.gamePhase);
            if (this.gamePhase != "blinding") {
                console.log("player Info: ", player.getHandScore(this.dealer)); // プレイヤーのstatusをcheck,
            }
            switch (gameDecision.action) {
                case "bet":
                    console.log("ベットできてません。もう一度選択してください");
                    break;
                case "blind":
                    if (this.turnCounter == this.dealerIndex + 1)
                        this.assignPlayerHands();
                    //　ブラインドベットをする。
                    console.log(player.name, "before blind", player);
                    player.bet =
                        this.turnCounter == this.dealerIndex + 1
                            ? this.smallBlind
                            : this.bigBlind;
                    console.log("player Blind bet money", player.bet);
                    player.chips -= player.bet;
                    this.pot += player.bet;
                    player.gameStatus = "bet";
                    console.log(player.name, "after blind", player);
                    // ブラインド終了後に、、全プレイヤーをbet状態にする。
                    if (this.turnCounter == this.dealerIndex + 2) {
                        this.changePlayerStatusToBet();
                        console.log("プレイヤーの情報をBETに変更!!!");
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
                    let callBet = player.bet;
                    console.log("call前のbet", player.bet);
                    let playerHaveToCall = playercallMoney - callBet;
                    player.bet += playerHaveToCall;
                    console.log("call後のbet", player.bet);
                    player.chips -= playerHaveToCall;
                    this.pot += playerHaveToCall;
                    player.gameStatus = "call";
                    console.log(player.name, "after call", player);
                    break;
                case "raise":
                    console.log(player.chips);
                    console.log(player.name, "before raise", player);
                    // レイズ時indexの変更
                    let playerRaiseMoney = gameDecision.amount;
                    this.betMoney = gameDecision.amount;
                    let raiseBet = player.bet;
                    let playerHaveToRaise = playerRaiseMoney - raiseBet;
                    this.pot += playerHaveToRaise;
                    player.chips -= playerHaveToRaise;
                    this.betIndex = this.turnCounter;
                    // 全プレイヤーをbet状態に戻す。
                    this.changePlayerStatusToBet();
                    // 自身はraiseにかえ、一周してきた時に、betではないので次は
                    player.gameStatus = "raise";
                    this.printPlayerStatus();
                    console.log(player.name, "after raise", player);
                    console.log(player.chips);
                    break;
                case "allin":
                    if (player.gameStatus == "allin") break;
                    this.pot += gameDecision.amount;
                    player.gameStatus = "allin";
                    break;
                case "check":
                    console.log(player.name, "before check", player);
                    player.gameStatus = "check";
                    console.log(player.name, "after check", player);
                    break;
                case "fold":
                    console.log(player.name, "降ります。");
                    player.gameStatus = "fold";
                    break;
            }
            console.log("Pot Money", this.pot);
        }
    }

    // プレイヤーのターンを処理するメソッド.
    haveTurn(userData?: PokerActionType): void {
        if (this.gamePhase == "dealer turn") {
            console.log("ディーラーターン");
            // if (this.roundCounter == 4) {
            //     console.log("最終ラウンドまで来た。1");
            //     this.gamePhase = "evaluating";
            // }
            // 0, 1, 2回目は再びbettingに戻る。
            this.evaluateMove(this.dealer);
        }

        let player = this.getTurnPlayer();
        // 前のまえのプレイヤーがpassしてたらpass可能
        // else bet, raise, dropのみ選択可能。
        console.log("currPlayer: ", player.name);

        let playerBefore = this.getoneBeforePlayer();
        if (this.allPlayerActionResolved()) {
            this.gamePhase = "dealer turn";
            this.evaluateMove(this.dealer);
        } else {
            if (
                (playerBefore.gameStatus == "check" ||
                    playerBefore.gameStatus == "bet") &&
                (userData == "check" || player.type == "ai")
            ) {
                // checkできる。
                this.evaluateMove(player, "check");
            } else if (
                player.gameStatus == "fold" ||
                player.gameStatus == "allin"
            ) {
                console.log(player.name + "はこのゲームでは何もできません。");
                this.evaluateMove(player, player.gameStatus);
            }
            // 前のプレイヤーがpassしてなかったら、passはできないように実装。
            else if (
                playerBefore.gameStatus !== "check" &&
                playerBefore.gameStatus !== "fold" &&
                userData == "check"
            ) {
                console.log("前のプレイヤーがcheckしてなからcheckできません。");
                // call　or raise or fold => 選択
                this.evaluateMove(player, "call");
            }

            // playerの所持金が現在のベット金額より小さかったら allin
            // callの場合
            else if (player.chips < this.betMoney && player.chips > 0) {
                console.log(
                    player.name,
                    "の所持金が最小ベット額より少ないです！！",
                    this.betMoney,
                    player.chips
                );
                this.evaluateMove(player, "allin");
            } else if (
                player.chips < this.betMoney * 2 &&
                player.chips > 0 &&
                userData == "raise"
            ) {
                console.log("所持金足りないからRAISEできませんよ!!!!!");
                console.log("強制call");
                this.evaluateMove(player, "call");
            } else {
                console.log("userAction: ", userData);
                player.type == "player"
                    ? this.evaluateMove(player, userData as PokerActionType)
                    : // ai
                      this.evaluateMove(player);
            }

            // プレイヤーにカードを配る。
            this.turnCounter++;
            this.turnCounter %= this.players.length;
        }

        if (this.gamePhase == "evaluating") {
            console.log("TURN  OWARIIIIIIIIII!!!!");
            this.evaluateAndGetRoundResults();
            this.clearPlayerHandsAndBets();
            this.gamePhase = "blinding";
        }
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
            console.log(
                player.type,
                player.name,
                player.gameStatus,
                player.chips
            );
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
            if (player.gameStatus != "fold" && player.gameStatus != "allin")
                player.gameStatus = "bet";
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
