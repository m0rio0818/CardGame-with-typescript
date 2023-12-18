import Player from "../blackjack/blackJackPlayer.js";
import Deck from "../common/Deck.js";
export class Table {
    constructor(gameType, betDenominations = [5, 20, 50, 100]) {
        this.gameType = gameType;
        this.betDenominatoins = betDenominations;
        this.deck = new Deck(this.gameType);
        this.house = new Player("house", "house", this.gameType);
        this.players = [
            this.house,
            new Player("p_1", "player", this.gameType),
            new Player("ai_1", "ai", this.gameType),
        ];
        this.turnCounter = 0;
        this.gamePhase = "betting";
        this.resultsLog = [];
    }
    blackjackEvaluateAndGetRoundResults() {
        console.log("ここから勝敗判定を行なっていきます。");
        for (let player of this.players) {
            console.log(player.name, player.getHandScore(), player.gameStatus, player.hand);
        }
        const dealer = this.players[0];
        const dealerScore = dealer.getHandScore();
        const dealerStatus = dealer.gameStatus;
        console.log(dealerScore, dealerStatus, dealer.hand);
        let statusLog = [];
        for (let i = 1; i < this.players.length; i++) {
            let currPlayer = this.players[i];
            let playerStatus = currPlayer.gameStatus;
            let playerScore = currPlayer.getHandScore();
            if (playerStatus != "bust" && playerStatus != "surrender") {
                if (dealerStatus === "blackjack") {
                    if (playerStatus === "blackjack") {
                        currPlayer.chips += 0;
                        currPlayer.gameResult = "draw";
                    }
                    else {
                        currPlayer.chips -= currPlayer.winAmount;
                        currPlayer.gameResult = "lost";
                    }
                }
                else if (dealerStatus === "bust") {
                    if (playerStatus === "blackjack") {
                        currPlayer.chips += currPlayer.winAmount * 1.5;
                        currPlayer.gameResult = "win";
                    }
                    else if (playerStatus === "double") {
                        console.log("double win!!");
                        currPlayer.chips += currPlayer.winAmount;
                        currPlayer.gameResult = "win";
                    }
                    else {
                        currPlayer.chips += currPlayer.winAmount;
                        currPlayer.gameResult = "win";
                    }
                }
                else {
                    if (dealerScore > playerScore) {
                        if (playerStatus == "double") {
                            currPlayer.chips -= currPlayer.winAmount;
                            currPlayer.gameResult = "lost";
                        }
                        else if (playerStatus == "stand") {
                            currPlayer.chips -= currPlayer.winAmount;
                            currPlayer.gameResult = "lost";
                        }
                    }
                    else if (dealerScore < playerScore) {
                        if (playerStatus === "blackjack") {
                            currPlayer.winAmount *= 1.5;
                            currPlayer.chips += currPlayer.winAmount * 1.5;
                            currPlayer.gameResult = "win";
                        }
                        else if (playerStatus === "double") {
                            console.log("doble!!!", currPlayer.bet + "win!");
                            currPlayer.chips += currPlayer.winAmount;
                            currPlayer.gameResult = "win";
                        }
                        else {
                            currPlayer.chips += currPlayer.winAmount;
                            currPlayer.gameResult = "win";
                        }
                    }
                    else {
                        currPlayer.chips += 0;
                        currPlayer.gameResult = "draw";
                    }
                }
            }
            else {
                console.log(currPlayer.name, "bust or surrenter!");
                currPlayer.chips -= currPlayer.winAmount;
                currPlayer.gameResult = "lost";
            }
            console.log(currPlayer.type + " : " + currPlayer.gameResult + ": ", currPlayer);
            statusLog.push("name: " +
                currPlayer.name +
                " result : " +
                +currPlayer.gameResult +
                ", action : " +
                currPlayer.gameStatus +
                ", bet : " +
                currPlayer.bet +
                ", won : " +
                currPlayer.winAmount);
        }
        this.resultsLog.push(statusLog);
        return statusLog;
    }
    blackjackAssignPlayerHands() {
        for (let player of this.players) {
            if (player.type == "house") {
                player.hand.push(this.deck.drawCard());
            }
            else {
                for (let i = 0; i < 2; i++) {
                    player.hand.push(this.deck.drawCard());
                }
            }
        }
    }
    blackjackClearPlayerHandsAndBets() {
        for (let player of this.players) {
            player.bet = player.type == "house" ? -1 : 0;
            player.hand = [];
        }
    }
    getTurnPlayer() {
        return this.players[this.turnCounter];
    }
    evaluateMove(player) {
        let gamedecision;
        if (this.gamePhase == "betting" && player.type == "player") {
            let inputBet = 20;
            gamedecision = player.promptPlayer(inputBet);
        }
        else {
            if (player.type === "house") {
                let inputBet = "wait";
                gamedecision = player.promptPlayer(inputBet);
            }
            else {
                let inputBet = "double";
                gamedecision = player.promptPlayer(inputBet);
            }
        }
        console.log("handを評価 :", gamedecision);
        if (gamedecision.action == "bet") {
            console.log("ベット => 状態を更新");
            player.bet = gamedecision.amount;
            player.winAmount = gamedecision.amount;
            player.gameStatus = "acting";
            console.log(player.type + " after bet: ", player);
            console.log("----------------------------------------------------------------------------------------------------------------");
        }
        else if (gamedecision.action == "hit") {
            let score = player.getHandScore();
            if (player.type == "ai") {
                console.log("ai or houseは17未満だとhit");
                while (score < 17) {
                    console.log(player.name, "17以下: ヒット => カードを一枚引く");
                    gamedecision = player.promptPlayer("hit");
                    player.hand.push(this.deck.drawCard());
                    score = player.getHandScore();
                }
            }
            else {
                console.log(player.name, "ヒット => カードを一枚引く");
                player.hand.push(this.deck.drawCard());
            }
            console.log("hitの終了 => bust, acting 判定〜〜〜", score);
            player.gameStatus = score > 21 ? "bust" : "acting";
            console.log("Player after hit: ", player, score);
            console.log("----------------------------------------------------------------------------------------------------------------");
        }
        else if (gamedecision.action == "stand") {
            console.log("スタンド => standする");
            player.gameStatus = "stand";
            console.log(player.type + "after stand: ", player);
            console.log("----------------------------------------------------------------------------------------------------------------");
        }
        else if (gamedecision.action == "double") {
            player.hand.push(this.deck.drawCard());
            player.bet += gamedecision.amount;
            player.winAmount = player.bet * 2;
            let score = player.getHandScore();
            player.gameStatus = score > 21 ? "bust" : "double";
            console.log(player.type + " after double: ", player);
            console.log("----------------------------------------------------------------------------------------------------------------");
        }
        else if (gamedecision.action == "surrender") {
            console.log("surrenderされましたお");
            player.chips -= player.bet / 2;
            player.winAmount = 0;
            player.gameStatus = "surrender";
            console.log(player.type + " after Surrender : ", player);
            console.log("----------------------------------------------------------------------------------------------------------------");
        }
        else if (gamedecision.action == "wait") {
            player.gameStatus = "waiting";
            console.log(player.type + " after wait: ", player);
            console.log("----------------------------------------------------------------------------------------------------------------");
        }
        if (player.hand.length == 2 &&
            player.getHandScore() == 21 &&
            player.hand.filter((card) => card.rank === "A").length > 0)
            player.gameStatus = "blackjack";
    }
    haveTurn() {
        let currPlayer = this.getTurnPlayer();
        console.log(currPlayer.type + " before " + this.gamePhase + " action :", currPlayer);
        this.evaluateMove(currPlayer);
        if (this.gamePhase == "betting") {
            if (this.onLastPlayer()) {
                this.gamePhase = "acting";
                this.turnCounter = -1;
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!ここでプレイヤー全員にカードを配ります!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                this.blackjackAssignPlayerHands();
                console.log("----------------------------------------------------------------------------------------------------------------");
            }
        }
        else if (this.gamePhase == "acting") {
            console.log(currPlayer.name, ": act終了し、次はjudgeです。");
            if (this.onLastPlayer()) {
                this.gamePhase = "evaluateWinners";
                this.turnCounter = -1;
                console.log("最後のプレイヤーがact終了しました");
            }
        }
        else if (this.gamePhase == "evaluateWinners") {
            console.log("ここから勝利プレイヤーを決定します。");
            let dealer = this.players[0];
            let dealerScore = dealer.getHandScore();
            console.log(dealerScore);
            while (dealerScore < 17) {
                dealer.hand.push(this.deck.drawCard());
                dealerScore = dealer.getHandScore();
            }
            if (dealerScore == 21 && dealer.hand.length == 2)
                dealer.gameStatus == "blackjack";
            else if (dealerScore > 21)
                dealer.gameStatus = "bust";
            else
                dealer.gameStatus = "stand";
            this.blackjackEvaluateAndGetRoundResults();
            this.gamePhase = "roundOver";
        }
        else if (this.gamePhase == "roundOver") {
            this.blackjackClearPlayerHandsAndBets();
        }
        this.turnCounter++;
    }
    onLastPlayer() {
        return this.turnCounter == this.players.length - 1;
    }
    onFirstPlayer() {
        return this.turnCounter == 0;
    }
    allPlayerActionsResolved() {
        let statusList = [
            "broken",
            "surrender",
            "bust",
            "stand",
            "blackjack",
            "double",
        ];
        for (let player of this.players) {
            let playerGameStatus = player.gameStatus;
            if (playerGameStatus in statusList)
                return true;
        }
        return false;
    }
}
//# sourceMappingURL=blackjackTable.js.map