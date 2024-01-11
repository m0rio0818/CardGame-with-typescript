import { PokerController } from "./controller/PokerController.js";
import pokerPlayer from "./model/poker/pokerPlayer.js";
import pokerTable from "./model/poker/pokerTable.js";



let table = new pokerTable("poker", 5);
PokerController.startGame(table);
// console.log(table);
// while (table.gamePhase != "round over") {
//     table.haveTurn();
// }