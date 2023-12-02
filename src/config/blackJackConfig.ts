export type BlackJackPlayerType = "house" | "ai" | "player";

export type BlackJackActionType =
    | "bet"
    | "hit"
    | "stand"
    | "double"
    | "surrender"
    | "insurance"
    | "wait";   // dealerのみ

export type BlackjackStatusType =
    | ""
    | "betting"
    | "waiting"   // dealerのみ
    | "acting"
    | "stand"
    | "bust"
    | "blackjack"
    | "surrender";

export type BlackJackGamePhaseType =
    | "betting"
    | "acting"
    | "evaluateWinners"
    | "gameOver"
    | "roundOver";
