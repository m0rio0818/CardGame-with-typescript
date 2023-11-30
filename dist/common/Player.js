export class Player {
    constructor(name, type, gameType, chips = 400) {
        this.name = name;
        this.type = type;
        this.gameType = gameType;
        this.chips = chips;
        this.hand = [];
        this.bet = 0;
        this.winAmount = 0;
        this.gameStatus = "betting";
    }
    promptPlayer(userData) {
    }
    getHandScore() {
    }
}
//# sourceMappingURL=Player.js.map