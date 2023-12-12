import Player from "../common/Player.js";
import pokerGameDecision from "./pokerGameDecision.js";
export default class pokerPlayer extends Player {
    constructor(name, type, gameType, chips = 100) {
        super(name, type, gameType, chips);
        this.gameStatus = "blind";
        this.indexOfNum = [
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
            "A",
        ];
        this.Cards = this.hand;
        this.CardsMap = {};
        this.pairsOfTwo = 0;
        this.pairsOfThree = 0;
        this.maxValue = 0;
    }
    promptPlayer(userData, betMoney) {
        if (this.type === "player") {
            return userData == "blind"
                ? new pokerGameDecision("blind")
                : userData == "bet"
                    ? new pokerGameDecision("bet")
                    : userData == "call"
                        ? new pokerGameDecision("call", betMoney)
                        : userData == "raise"
                            ? new pokerGameDecision("raise", betMoney * 2)
                            : userData == "allin"
                                ? new pokerGameDecision("allin", this.chips)
                                : userData == "check"
                                    ? new pokerGameDecision("check")
                                    : userData == "fold"
                                        ? new pokerGameDecision("fold")
                                        : new pokerGameDecision("blind");
        }
        else {
            switch (this.gameStatus) {
                case "blind":
                    return new pokerGameDecision("blind", betMoney);
                case "bet":
                    const rand = Math.random();
                    if (rand > 0.9)
                        return new pokerGameDecision("raise", betMoney * 2);
                    else
                        return new pokerGameDecision("call", betMoney);
                case "call":
                    return new pokerGameDecision("call", betMoney);
                case "raise":
                    return new pokerGameDecision("raise", betMoney * 2);
                default:
                    return new pokerGameDecision("fold");
            }
        }
    }
    getHandScore(dealer) {
        console.log("before Concat", this.Cards);
        this.Cards = this.hand.concat(dealer.hand);
        this.Cards.sort((a, b) => {
            return (this.indexOfNum.indexOf(a.rank) -
                this.indexOfNum.indexOf(b.rank));
        });
        console.log("after Concat", this.Cards);
        for (let card of this.Cards) {
            this.CardsMap[card.rank] == undefined
                ? (this.CardsMap[card.rank] = 1)
                : (this.CardsMap[card.rank] += 1);
        }
        this.maxValue = Math.max(...Object.values(this.CardsMap));
        Object.keys(this.CardsMap).forEach((data) => {
            if (this.CardsMap[data] == 2)
                this.pairsOfTwo++;
            if (this.CardsMap[data] == 3)
                this.pairsOfThree++;
        });
        if (this.isRoyalFlush()) {
            return "royal flush";
        }
        else if (this.isStraightFlush()) {
            return "straight flush";
        }
        else if (this.isFourCard()) {
            return "four card";
        }
        else if (this.isFullHouse()) {
            return "full house";
        }
        else if (this.isFlush()) {
            return "flush";
        }
        else if (this.isStraight()) {
            return "straight";
        }
        else if (this.isThreeCard()) {
            return "three card";
        }
        else if (this.isTwoPair()) {
            return "two pair";
        }
        else {
            return "no pair";
        }
    }
    isRoyalFlush() {
        return (this.isStraightFlush() &&
            this.Cards[this.Cards.length - 1].rank == "A");
    }
    isStraightFlush() {
        return this.isStraight() && this.isFlush();
    }
    isFourCard() {
        return this.maxValue == 4;
    }
    isFullHouse() {
        return this.pairsOfThree == 1 && this.pairsOfTwo == 1;
    }
    isFlush() {
        return this.Cards.every((hand) => this.Cards[0].suit === hand.suit);
    }
    isStraight() {
        for (let i = 0; i < this.Cards.length - 1; i++) {
            if (this.indexOfNum.indexOf(this.Cards[i + 1].rank) -
                this.indexOfNum.indexOf(this.Cards[i].rank) !=
                1)
                return false;
        }
        return true;
    }
    isThreeCard() {
        return this.maxValue == 3 && this.pairsOfThree == 1;
    }
    isTwoPair() {
        return this.maxValue == 2 && this.pairsOfTwo == 2;
    }
    isOnePair() {
        return this.pairsOfTwo == 2;
    }
    printHandScore(Cards) {
        for (let i = 0; i < Cards.length; i++) {
            console.log(Cards[i].rank);
        }
    }
}
//# sourceMappingURL=pokerPlayer.js.map