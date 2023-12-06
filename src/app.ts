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

table.haveTurn(); // ai1
table.haveTurn(); // ai2
table.haveTurn("call"); // ai3
table.haveTurn("call"); // ai4
table.haveTurn("call"); // p1
table.haveTurn("call"); // ai1
table.haveTurn("call"); // ai2
console.log("roundCounter = 1")
// roundCounter = 1;
table.haveTurn(); // ai1
table.haveTurn(); // ai2
table.haveTurn(); // ai3
table.haveTurn("call"); // p1
// roundCounter = 2;
console.log("roundCounter = 2")
table.haveTurn(); // ai1
table.haveTurn(); // ai2
table.haveTurn(); // ai3
table.haveTurn(); // p1
// roundCounter = 3;
console.log("roundCounter = 3")
table.haveTurn(); // ai1
table.haveTurn(); // ai2
table.haveTurn(); // ai3
table.haveTurn(); // p1

// 初期状態では、ハウスと2人以上のA.Iプレーヤーが戦います。
