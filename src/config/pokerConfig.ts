export type PokerActionType =
    | "bet"
    | "call"
    | "check"
    | "fold"
    | "drop"
    | "raise"
    | "allin"
    | "blind"
    | "ante";

export type PokerPlayerType = "" | "ai" | "player" | "dealer";

export type PokerStatusType =
    | ""
    | "blind"
    | "pass"
    | "fold" // 降りること
    | "bet"
    | "call"
    | "raise"
    | "check"
    | "folded"
    | "allin"
    | "";

export type PokerChangeBetIndexType = "" | "raise";

export type PokerGamePhaseType =
    | "blinding"
    | "betting"
    // | "acting"
    | "dealer turn"
    | "evaluating"
    | "round over"
    | "game over";

export type PokerDenominationType = 5 | 10 | 20 | 50 | 100;
