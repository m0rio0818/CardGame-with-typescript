export class PokerView {
    static createPlayerView(player, table) {
        const root = document.getElementById("app");
        const modal = document.createElement("div");
        const container = document.createElement("div");
        container.classList.add("player-container", "p-3");
        const imgContainer = document.createElement("div");
        imgContainer.classList.add("card-img-container", "flex");
        for (let i = 0; i < player.hand.length; i++) {
            const card = document.createElement("div");
            card.classList.add("card", "col-3", "text-center");
            card.innerText =
                player.hand[i].rank + "(" + player.hand[i].suit + ")";
            imgContainer.append(card);
        }
        if (player.type == "dealer") {
            const roundCounter = document.createElement("h4");
            roundCounter.innerText = "Round: " + (table.roundCounter + 1);
            const turnCounter = document.createElement("h4");
            turnCounter.innerHTML = "turn: " + table.turnCounter;
            const gamePhase = document.createElement("h4");
            gamePhase.innerText = "GamePhase: " + table.gamePhase;
            const currPlayer = document.createElement("h4");
            currPlayer.innerText = "CurrPlayer: " + table.getTurnPlayer().name;
            const pot = document.createElement("h3");
            pot.classList.add("pot");
            pot.innerText = "POT: " + String(table.pot);
            container.append(gamePhase, currPlayer, turnCounter, roundCounter, pot, imgContainer);
        }
        else {
            const name = document.createElement("h5");
            name.innerText = player.name;
            const chips = document.createElement("h5");
            chips.classList.add("chips");
            chips.innerText = "Chips: " + String(player.chips);
            const status = document.createElement("h5");
            status.classList.add("stuaus");
            status.innerText = "Status :" + String(player.gameStatus);
            const bet = document.createElement("h5");
            bet.classList.add("bet");
            bet.innerText = "Bet: " + String(player.bet);
            const hand = document.createElement("div");
            hand.classList.add("hand");
            hand.innerText = "Hand: " + String(player.playerHandStatus);
            container.append(name, chips, imgContainer, hand, status);
        }
        root === null || root === void 0 ? void 0 : root.append(container);
    }
    static createActionsModal() {
        const root = document.getElementById("app");
        const container = document.createElement("div");
        const callButton = document.createElement("button");
        callButton.innerText = "call";
        callButton.classList.add("btn", "btn-primary", "p-1", "mx-1", "call-button");
        const raiseButton = document.createElement("button");
        raiseButton.innerText = "Raise";
        raiseButton.classList.add("btn", "btn-primary", "p-1", "mx-1", "raise-button");
        const foldButton = document.createElement("button");
        foldButton.innerText = "fold";
        foldButton.classList.add("btn", "btn-primary", "p-1", "mx-1", "fold-button");
        container.append(callButton, raiseButton, foldButton);
        root === null || root === void 0 ? void 0 : root.append(container);
    }
    static createActionswithCheckModal() {
        const root = document.getElementById("app");
        const container = document.createElement("div");
        const callButton = document.createElement("button");
        callButton.innerText = "call";
        callButton.classList.add("btn", "btn-primary", "p-1", "mx-1", "call-button");
        const raiseButton = document.createElement("button");
        raiseButton.innerText = "Raise";
        raiseButton.classList.add("btn", "btn-primary", "p-1", "mx-1", "raise-button");
        const foldButton = document.createElement("button");
        foldButton.innerText = "fold";
        foldButton.classList.add("btn", "btn-primary", "p-1", "mx-1", "fold-button");
        const checkButton = document.createElement("button");
        checkButton.innerText = "check";
        checkButton.classList.add("btn", "btn-primary", "p-1", "mx-1", "check-button");
        container.append(callButton, raiseButton, foldButton, checkButton);
        root === null || root === void 0 ? void 0 : root.append(container);
    }
    static createallInModal() {
        const root = document.getElementById("app");
        const container = document.createElement("div");
        const allInButton = document.createElement("button");
        allInButton.innerText = "allIn";
        allInButton.classList.add("btn", "btn-primary", "p-1", "mx-1", "allIn-button");
        const foldButton = document.createElement("button");
        foldButton.innerText = "fold";
        foldButton.classList.add("btn", "btn-primary", "p-1", "mx-1", "fold-button");
        container.append(allInButton, foldButton);
        root === null || root === void 0 ? void 0 : root.append(container);
    }
    static createallInwithCheckModal() {
        const root = document.getElementById("app");
        const container = document.createElement("div");
        const allInButton = document.createElement("button");
        allInButton.innerText = "allIn";
        allInButton.classList.add("btn", "btn-primary", "p-1", "mx-1", "allIn-button");
        const foldButton = document.createElement("button");
        foldButton.innerText = "fold";
        foldButton.classList.add("btn", "btn-primary", "p-1", "mx-1", "fold-button");
        const checkButton = document.createElement("button");
        checkButton.innerText = "check";
        checkButton.classList.add("btn", "btn-primary", "p-1", "mx-1", "check-button");
        container.append(allInButton, foldButton, checkButton);
        root === null || root === void 0 ? void 0 : root.append(container);
    }
    static createFinalResultsModal(table) {
        const root = document.createElement("app");
        const container = document.createElement("div");
        const tableDiv = document.createElement("table");
        const tableFrame = document.createElement("tr");
        const nametr = document.createElement("th");
        nametr.innerText = "name";
        tableFrame.append(nametr);
        for (let i = 0; i < table.maxTurn; i++) {
            const cell = document.createElement("th");
            const cellText = document.createTextNode(`Round ${i + 1}`);
            cell.appendChild(cellText);
            tableFrame.append(cell);
        }
        let logs = table.resultsLog;
        let players = table.players;
        for (let i = 0; i < logs.length; i++) {
            console.log(logs[i].split(","));
        }
        container.append(tableDiv);
        console.log(tableFrame);
        root === null || root === void 0 ? void 0 : root.append(container);
    }
    static backToMenuButton() {
    }
}
//# sourceMappingURL=PokerView.js.map