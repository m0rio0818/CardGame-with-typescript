import pokerPlayer from "./model/poker/pokerPlayer.js";
import pokerTable from "./model/poker/pokerTable.js";
/*
    pokerのの実装
    前回作成したコードを使ってください。
*/

let table = new pokerTable("poker");
// console.log(table);
// while (table.gamePhase != "round over") {
//     table.haveTurn();
// }

console.log("roundCounter = 0");
table.haveTurn(); // p2
table.haveTurn(); // p3
table.haveTurn("call"); // p4
table.haveTurn("call"); // p1
table.haveTurn("raise"); // p2
table.haveTurn("call"); // p3
table.haveTurn("call"); // p4
table.haveTurn("call"); // p1
table.haveTurn("call"); // p2
console.log("roundCounter = 1");
// roundCounter = 1;
table.haveTurn("check"); // p2
table.haveTurn("check"); // p3
table.haveTurn("check"); // p4
table.haveTurn("call"); // p1
table.haveTurn("check"); // p2
table.haveTurn("check"); // p3
table.haveTurn("call"); // p4
table.haveTurn("call"); // p1
console.log("roundCounter = 2");
// // roundCounter = 2;

table.haveTurn("call"); // p2
table.haveTurn("call"); // p3
table.haveTurn("raise"); // p4
table.haveTurn("call"); // p1
table.haveTurn("call"); // p2
table.haveTurn("call"); // p3
console.log("roundCounter = 3");
table.haveTurn("call"); // p4
table.haveTurn("call"); // p1
table.haveTurn("call"); // p2
table.haveTurn("call"); // p3
table.haveTurn("call"); // p4
// // roundCounter = 3;

// 初期状態では、ハウスと2人以上のA.Iプレーヤーが戦います。
