import { Table } from "./common/Table.js";
let table = new Table("blackjack");
console.log(table);
while (table.gamePhase != 'roundOver') {
    table.haveTurn();
}
console.log(table.resultsLog);
//# sourceMappingURL=app.js.map