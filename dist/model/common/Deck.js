import Card from "./Card.js";
export default class Deck {
    constructor(gameType) {
        this.gameType = gameType;
        this.cards = [];
        if (this.gameType == "blackjack") {
            this.cards = this.generateDeck();
            this.shuffleDeck();
        }
        else if (this.gameType == "poker") {
            this.cards = this.generateDeck();
            this.shuffleDeck();
        }
    }
    generateDeck() {
        const suits = ["H", "D", "C", "S"];
        const rank = [
            "A",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "J",
            "Q",
            "K",
        ];
        let deck = [];
        for (let i = 0; i < suits.length; i++) {
            let currSuit = suits[i];
            for (let j = 0; j < rank.length; j++) {
                let currRank = rank[j];
                deck.push(new Card(currSuit, currRank));
            }
        }
        return deck;
    }
    resetDeck() {
        this.cards = [];
        this.cards = this.generateDeck();
        this.shuffleDeck();
    }
    shuffleDeck() {
        for (let i = this.cards.length - 1; i >= 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = temp;
        }
    }
    drawCard() {
        return this.cards.pop();
    }
}
//# sourceMappingURL=Deck.js.map