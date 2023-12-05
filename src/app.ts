import { Table } from "./model/common/Table.js";
/*
    Blackjackの実装
    前回作成したコードを使ってください。
*/

let table = new Table("blackjack");
// console.log(table);
while(table.gamePhase != 'roundOver'){
    table.haveTurn();
}

// 初期状態では、ハウスと2人以上のA.Iプレーヤーが戦います。
console.log(table.resultsLog);