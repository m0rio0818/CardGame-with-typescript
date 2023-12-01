import { Table } from "./common/Table.js";
let table1 = new Table("blackjack");
while (table1.gamePhase != 'roundOver') {
    table1.haveTurn();
}
console.log(table1.resultsLog);
//# sourceMappingURL=app.js.map