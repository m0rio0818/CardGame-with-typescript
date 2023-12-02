export type BlackJackPlayerType = "house" | "ai" | "player";

export type BlackJackActionType =
    | "bet"
    | "hit"
    | "stand"
    | "double"
    | "surrender"
    | "insurance"
    | "wait"; // dealerのみ

export type BlackjackStatusType =
    | ""
    | "betting"
    | "acting"
    | "stand"
    | "bust"
    | "double"
    | "blackjack"
    | "surrender"
    | "waiting" // dealerのみ

export type BlackJackGamePhaseType =
    | "betting"
    | "acting"
    | "evaluateWinners"
    | "gameOver"
    | "roundOver";

export type BlackJackGameStatus = "" | "win" | "lost" | "draw";
