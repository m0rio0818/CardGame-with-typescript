import pokerPlayer from "./model/poker/pokerPlayer.js";
import pokerTable from "./model/poker/pokerTable.js";
/*
    pokerのの実装
    前回作成したコードを使ってください。
*/

let table = new pokerTable("poker");
// console.log(table);
while (table.gamePhase != "round over") {
    table.haveTurn();
}


// 初期状態では、ハウスと2人以上のA.Iプレーヤーが戦います。
console.log(table.resultsLog);
