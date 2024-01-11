import { PokerController } from "./controller/PokerController.js";
import pokerPlayer from "./model/poker/pokerPlayer.1.js";
import pokerTable from "./model/poker/pokerTable.js";



let table = new pokerTable("poker", 3);
PokerController.startGame(table);
// console.log(table);
// while (table.gamePhase != "round over") {
//     table.haveTurn();
// }