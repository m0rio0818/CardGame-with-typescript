import Card from "./Card.js";

export default class Deck {
    public gameType: string;
    public cards: Card[];

    constructor(gameType: string) {
        this.gameType = gameType;
        this.cards = [];
        // ゲームタイプによって、カードを初期化してください。
        if (this.gameType == "blackjack") {
            this.cards = this.generateDeck();
        }
    }

    generateDeck(): Card[] {
        const suits: string[] = ["H", "D", "C", "S"];
        const ranks: string[] = [
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

        let deck: Card[] = [];

        for (let i = 0; i < suits.length; i++) {
            let currSuit = suits[i];
            for (let j = 0; j < ranks.length; j++) {
                let currRank = ranks[j];
                deck.push(new Card(currSuit, currRank));
            }
        }
        return deck;
    }

    resetDeck(): void {
        this.cards = [];
        this.cards = this.generateDeck();
        this.shuffleDeck();
    }

    shuffleDeck(): void {
        for (let i = this.cards.length - 1; i >= 0; i--) {
            let j = Math.floor(Math.random() * (i+1));

            let temp = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = temp;
        }
    }

    drawOne(): Card {
        return this.cards.pop()!;
    }
}