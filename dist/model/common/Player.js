export default class Player {
    constructor(name, type, gameType, chips = 10) {
        this.gameStatus = "";
        this.bet = 0;
        this.winAmount = 0;
        this.hand = [];
        this.name = name;
        this.type = type;
        this.gameType = gameType;
        this.chips = chips;
    }
}
//# sourceMappingURL=Player.js.map