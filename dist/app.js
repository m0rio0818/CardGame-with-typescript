import { Table } from "./model/common/Table.js";
let table = new Table("blackjack");
while (table.gamePhase != 'roundOver') {
    table.haveTurn();
}
console.log(table.resultsLog);
//# sourceMappingURL=app.js.map