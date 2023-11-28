import Player from "./Player";

export default class Table {
    public gameType: string;
    public betDenominatoins: number[];
    public turnCounter: number;
    public gamePhase: string;
    public resultsLog: string[];

    constructor(
        gameType: string,
        betDenominations: number[] = [5, 20, 50, 100]
    ) {
        this.gameType = gameType;
        this.betDenominatoins = betDenominations;
        this.turnCounter = 0;
        this.gamePhase = "betting";
        this.resultsLog = [];
    }

    // 各プレイヤーにカードを配るためのメソッド
    blackjackAssignPlayerHands(): void {}

    // 各ラウンドの開始時に実行され、各プレイヤーの手札とベットを初期化
    blackjackCloearPlayerHandsAndBets(): void {}

    // プレイヤーが取った行動（ベット、ヒット、スタンドなど）を評価
    // それに応じてゲームの状態（プレイヤーの手札、ベット、ゲームの状態、チップなど）を更新
    evaluateMove(userDate: number): void {}

    // 現在のターンが誰のものかを返す
    getTurnPlayer(): Player {}

    // ブラックジャックゲームの各ターンを管理する役割
    haveTurn(userData: number): void {}

    blackjackEvaluateAndGetRoundResults(): string {}

    // 現在のプレイヤーがプレイヤーの配列の最後のプレイヤーであるかどうか
    onLastPlayer(): boolean {}

    onFirstPlayer(): boolean {}

    allPlayerActionsResolved(): boolean {}
}
