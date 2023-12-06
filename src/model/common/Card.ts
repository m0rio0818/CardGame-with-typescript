export default class Card {
    /*
       String suit : {"H", "D", "C", "S"}から選択
       String rank : {"A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"}から選択
    */
    public suit: string;
    public rank: string;

    constructor(suit: string, rank: string) {
        this.suit = suit;
        this.rank = rank;
    }

    getRankNumber(): number {
        if (this.rank == "J" || this.rank == "Q" || this.rank == "K") return 10;
        else if (this.rank == "A") return 11;
        else return Number(this.rank);
    }
}
