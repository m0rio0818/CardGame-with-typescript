import Deck from './Deck.js';
export default class Table {
    constructor(gameType) {
        this.turnCounter = 0;
        this.roundCounter = 0;
        this.gamePhase = '';
        this.resultsLog = [];
        this.players = [];
        this.gameType = gameType;
        this.deck = new Deck(this.gameType);
        console.log(this.deck);
    }
}
//# sourceMappingURL=Table.js.map