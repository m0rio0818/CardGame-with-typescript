import pokerTable from "./model/poker/pokerTable.js";
let table = new pokerTable("poker");
while (table.gamePhase != "round over") {
    table.haveTurn();
}
console.log(table.resultsLog);
//# sourceMappingURL=app.js.map