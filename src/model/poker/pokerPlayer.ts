import {
    PokerActionType,
    PokerHandType,
    PokerPlayerType,
    PokerStatusType,
} from "../../config/pokerConfig.js";
import Card from "../common/Card.js";
import GameDecision from "../common/GameDecision.js";
import Player from "../common/Player.js";
import pokerGameDecision from "./pokerGameDecision.js";
import pokerTable from "./pokerTable.js";

export default class pokerPlayer extends Player {
    gameStatus: PokerStatusType;
    indexOfNum: string[];
    Cards: Card[];
    CardsMap: Record<string, number>;
    pairsOfTwo: number;
    pairsOfThree: number;
    maxValue: number;

    constructor(
        name: string,
        type: PokerPlayerType,
        gameType: string,
        chips: number = 100 // getter, setterを後から
    ) {
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

    promptPlayer(
        userData: PokerActionType,
        betMoney?: number
    ): pokerGameDecision {
        if (this.type === "player") {
            return userData == "blind"
                ? new pokerGameDecision("blind")
                : userData == "bet"
                ? new pokerGameDecision("bet")
                : userData == "call"
                ? new pokerGameDecision("call", betMoney)
                : userData == "raise"
                ? new pokerGameDecision("raise", (betMoney as number) * 2)
                : userData == "allin"
                ? new pokerGameDecision("allin", this.chips)
                : userData == "check"
                ? new pokerGameDecision("check")
                : userData == "fold"
                ? new pokerGameDecision("fold")
                : new pokerGameDecision("blind");
        } else {
            // aiの実装
            switch (this.gameStatus) {
                case "blind":
                    return new pokerGameDecision("blind", betMoney as number);
                case "bet":
                    const rand = Math.random();
                    if (rand > 0.9)
                        return new pokerGameDecision(
                            "raise",
                            (betMoney as number) * 2
                        );
                    // else if (rand > 0.6) return new pokerGameDecision("check");
                    else
                        return new pokerGameDecision(
                            "call",
                            betMoney as number
                        );

                case "call":
                    return new pokerGameDecision("call", betMoney as number);
                case "raise":
                    return new pokerGameDecision(
                        "raise",
                        (betMoney as number) * 2
                    );
                default:
                    return new pokerGameDecision("fold");
            }
        }
    }

    getHandScore(dealer: Player): PokerHandType {
        console.log("before Concat", this.Cards);
        this.Cards = this.hand.concat(dealer.hand);
        this.Cards.sort((a, b) => {
            return (
                this.indexOfNum.indexOf(a.rank) -
                this.indexOfNum.indexOf(b.rank)
            );
        });
        console.log("after Concat", this.Cards);

        for (let card of this.Cards) {
            this.CardsMap[card.rank] == undefined
                ? (this.CardsMap[card.rank] = 1)
                : (this.CardsMap[card.rank] += 1);
        }

        this.maxValue = Math.max(...Object.values(this.CardsMap));

        Object.keys(this.CardsMap).forEach((data) => {
            if (this.CardsMap[data] == 2) this.pairsOfTwo++;
            if (this.CardsMap[data] == 3) this.pairsOfThree++;
        });

        if (this.isRoyalFlush()) {
            return "royal flush";
        } else if (this.isStraightFlush()) {
            return "straight flush";
        } else if (this.isFourCard()) {
            return "four card";
        } else if (this.isFullHouse()) {
            return "full house";
        } else if (this.isFlush()) {
            return "flush";
        } else if (this.isStraight()) {
            return "straight";
        } else if (this.isThreeCard()) {
            return "three card";
        } else if (this.isTwoPair()) {
            return "two pair";
        } else {
            return "no pair";
        }
    }

    isRoyalFlush(): boolean {
        return (
            this.isStraightFlush() &&
            this.Cards[this.Cards.length - 1].rank == "A"
        );
    }
    isStraightFlush(): boolean {
        return this.isStraight() && this.isFlush();
    }

    isFourCard(): boolean {
        return this.maxValue == 4;
    }

    isFullHouse(): boolean {
        return this.pairsOfThree == 1 && this.pairsOfTwo == 1;
    }

    isFlush(): boolean {
        return this.Cards.every((hand) => this.Cards[0].suit === hand.suit);
    }

    isStraight(): boolean {
        for (let i = 0; i < this.Cards.length - 1; i++) {
            if (
                this.indexOfNum.indexOf(this.Cards[i + 1].rank) -
                    this.indexOfNum.indexOf(this.Cards[i].rank) !=
                1
            )
                return false;
        }
        return true;
    }

    isThreeCard(): boolean {
        return this.maxValue == 3 && this.pairsOfThree == 1;
    }

    isTwoPair(): boolean {
        return this.maxValue == 2 && this.pairsOfTwo == 2;
    }

    isOnePair(): boolean {
        return this.pairsOfTwo == 2;
    }

    // checkCardsPair(dealer: Player): PokerHandType {
    //     // ロイヤルストレートフラッシュ確認
    //     const isRoyalFlush = () =>
    //         isStraightFlush() && this.Cards[this.Cards.length - 1].rank == "A";

    //     // ストレートフラッシュ確認
    //     const isStraightFlush = () => isStraight() && isFlush();

    //     // フォーカード
    //     const isFourCard = () => maxValue == 4;

    //     // フルハウス
    //     const isFullHouse = () => pairsOfThree == 1 && pairsOfTwo == 1;

    //     // フラッシュ
    //     const isFlush = () =>
    //         Cards.every((hand) => Cards[0].suit === hand.suit);

    //     // ストレート
    //     const isStraight = () => {
    //         for (let i = 0; i < Cards.length - 1; i++) {
    //             if (
    //                 this.indexOfNum.indexOf(Cards[i + 1].rank) -
    //                     this.indexOfNum.indexOf(Cards[i].rank) !=
    //                 1
    //             )
    //                 return false;
    //         }
    //         return true;
    //     };

    //     // スリーカード
    //     const isThreeCard = () => maxValue == 3 && pairsOfThree == 1;

    //     // ツーペア
    //     const isTwoPair = () => maxValue == 2 && pairsOfTwo == 2;

    //     // ワンペア
    //     const isOnePair = () => maxValue == 2 && pairsOfTwo == 1;
    // }

    printHandScore(Cards: Card[]): void {
        for (let i = 0; i < Cards.length; i++) {
            console.log(Cards[i].rank);
        }
    }
}
