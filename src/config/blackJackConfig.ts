export type BlackJackPlayerType = "house" | "ai" | "player";

export type BlackJackActionType =
    | "bet"
    | "surrender"
    | "stand"
    | "hit"
    | "double"
    | "wait";

export type BlackJackStatusType = BlackJackActionType | "blackjack" | "bust";

export type BlackJackGamePhaseType = "betting" | "acting" | "evaluateWinners" | "gameOver" | "roundOver";