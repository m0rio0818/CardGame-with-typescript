export default class Table {
    constructor(gameType, betDenominations = [5, 20, 50, 100]) {
        this.gameType = gameType;
        this.betDenominatoins = betDenominations;
        this.turnCounter = 0;
        this.gamePhase = "betting";
        this.resultsLog = [];
    }
    // 各プレイヤーにカードを配るためのメソッド
    blackjackAssignPlayerHands() { }
    // 各ラウンドの開始時に実行され、各プレイヤーの手札とベットを初期化
    blackjackCloearPlayerHandsAndBets() { }
    // プレイヤーが取った行動（ベット、ヒット、スタンドなど）を評価
    // それに応じてゲームの状態（プレイヤーの手札、ベット、ゲームの状態、チップなど）を更新
    evaluateMove(userDate) { }
    // 現在のターンが誰のものかを返す
    getTurnPlayer() { }
    // ブラックジャックゲームの各ターンを管理する役割
    haveTurn(userData) { }
    blackjackEvaluateAndGetRoundResults() { }
    // 現在のプレイヤーがプレイヤーの配列の最後のプレイヤーであるかどうか
    onLastPlayer() { }
    onFirstPlayer() { }
    allPlayerActionsResolved() { }
}
//# sourceMappingURL=Table.js.map