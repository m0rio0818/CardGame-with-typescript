export class Table {
    constructor(gameType, betDenominations = [5, 20, 50, 100]) {
        this.gameType = gameType;
        this.betDenominatoins = betDenominations;
        this.turnCounter = 0;
        this.gamePhase = "betting";
        this.resultsLog = [];
    }
    blackjackAssignPlayerHands() { }
    blackjackCloearPlayerHandsAndBets() { }
    evaluateMove(userDate) { }
    haveTurn(userData) { }
}
//# sourceMappingURL=Table.js.map