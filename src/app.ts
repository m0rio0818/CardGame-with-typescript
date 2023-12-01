import { Table } from "./common/Table.js";
/*
    Blackjackの実装
    前回作成したコードを使ってください。
*/

let table1 = new Table("blackjack");
while(table1.gamePhase != 'roundOver'){
    table1.haveTurn();
}

// 初期状態では、ハウスと2人以上のA.Iプレーヤーが戦います。
console.log(table1.resultsLog);