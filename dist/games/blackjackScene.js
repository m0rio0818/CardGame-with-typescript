var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BlackjackView_userChipCount, _BlackjackView_userChipText, _BlackjackView_userBetCount, _BlackjackView_userBetText, _BlackjackView_chipButtons, _BlackjackView_betButton, _BlackjackView_clearButton, _BlackjackView_actionButtons, _BlackjackView_nextButton, _BlackjackView_againButton, _BlackjackView_backButton, _BlackjackView_playerNameTexts, _BlackjackView_chipTexts, _BlackjackView_betTexts, _BlackjackView_scoreTexts, _BlackjackView_playersHandsImages, _BlackjackView_dealerHandImages;
import { Controller } from '../controller/controller';
import BlackjackTable from '../model/blackjack/blackjackTable';
import { BaseScene } from './common/baseScene';
import { Button } from './common/button';
export class BlackjackView extends BaseScene {
    constructor() {
        super(...arguments);
        this.table = null;
        this.user = null;
        this.dealer = null;
        this.difficulty = '';
        this.maxRounds = 0;
        _BlackjackView_userChipCount.set(this, 100);
        _BlackjackView_userChipText.set(this, null);
        _BlackjackView_userBetCount.set(this, 0);
        _BlackjackView_userBetText.set(this, null);
        _BlackjackView_chipButtons.set(this, []);
        _BlackjackView_betButton.set(this, null);
        _BlackjackView_clearButton.set(this, null);
        _BlackjackView_actionButtons.set(this, []);
        _BlackjackView_nextButton.set(this, null);
        _BlackjackView_againButton.set(this, null);
        _BlackjackView_backButton.set(this, null);
        _BlackjackView_playerNameTexts.set(this, []);
        _BlackjackView_chipTexts.set(this, []);
        _BlackjackView_betTexts.set(this, []);
        _BlackjackView_scoreTexts.set(this, []);
        _BlackjackView_playersHandsImages.set(this, [[], [], []]);
        _BlackjackView_dealerHandImages.set(this, []);
    }
    create(data) {
        super.create(data);
        __classPrivateFieldSet(this, _BlackjackView_chipButtons, [], "f");
        __classPrivateFieldSet(this, _BlackjackView_betButton, null, "f");
        __classPrivateFieldSet(this, _BlackjackView_clearButton, null, "f");
        __classPrivateFieldSet(this, _BlackjackView_actionButtons, [], "f");
        __classPrivateFieldSet(this, _BlackjackView_betTexts, [], "f");
        __classPrivateFieldSet(this, _BlackjackView_scoreTexts, [], "f");
        __classPrivateFieldSet(this, _BlackjackView_playersHandsImages, [[], [], [], []], "f");
        __classPrivateFieldSet(this, _BlackjackView_dealerHandImages, [], "f");
        this.table = data.table;
        this.user = this.table.players[0];
        this.dealer = this.table.dealer;
        this.difficulty = this.table.difficulty;
        this.maxRounds = this.table.maxRounds;
        this.renderScene();
    }
    renderScene() {
        this.userChipCount();
        this.userBetCount();
        if (this.table.roundCount === this.table.maxRounds) {
            this.finalResults();
            return;
        }
        switch (this.table.gamePhase) {
            case 'game over':
                this.gameOver();
                __classPrivateFieldSet(this, _BlackjackView_userBetCount, 0, "f");
                __classPrivateFieldSet(this, _BlackjackView_userChipCount, this.user.chips, "f");
                __classPrivateFieldGet(this, _BlackjackView_userChipText, "f").destroy();
                __classPrivateFieldGet(this, _BlackjackView_userBetText, "f").destroy();
                this.userChipCount();
                this.userBetCount();
                return;
            case 'evaluating':
                this.roundResults();
                __classPrivateFieldSet(this, _BlackjackView_userBetCount, 0, "f");
                __classPrivateFieldSet(this, _BlackjackView_userChipCount, this.user.chips, "f");
                __classPrivateFieldGet(this, _BlackjackView_userChipText, "f").destroy();
                __classPrivateFieldGet(this, _BlackjackView_userBetText, "f").destroy();
                this.userChipCount();
                this.userBetCount();
                return;
            case 'dealer turn':
                if (this.dealer.gameStatus === 'waiting') {
                    this.flipDealerCard();
                }
                this.playersInfo();
                this.dealer.gameStatus =
                    this.dealer.gameStatus === 'waiting'
                        ? 'acting'
                        : this.dealer.gameStatus;
                setTimeout(() => {
                    if (this.dealer.gameStatus === 'acting' &&
                        this.dealer.getHandScore() < 17) {
                        this.table.haveTurn();
                        this.drawCard(this.dealer);
                        this.renderScene();
                        return;
                    }
                    else {
                        this.table.haveTurn();
                        this.renderScene();
                        return;
                    }
                }, 3000);
                return;
        }
        const turnPlayer = this.table.getTurnPlayer();
        switch (turnPlayer.type) {
            case 'human':
                if (this.table.gamePhase === 'betting') {
                    this.chipButtons();
                    this.betButton();
                    this.clearButton();
                }
                else if (this.table.gamePhase === 'acting') {
                    if (__classPrivateFieldGet(this, _BlackjackView_playersHandsImages, "f")[0].length === 0) {
                        this.dealInitialHands();
                    }
                    this.playersInfo();
                    if (this.table.playerActionResolved(turnPlayer)) {
                        this.table.haveTurn();
                        this.renderScene();
                    }
                    else {
                        this.actionButtons();
                    }
                }
                break;
            default:
                this.playersInfo();
                setTimeout(() => {
                    switch (this.table.gamePhase) {
                        case 'betting':
                            this.table.haveTurn();
                            this.renderScene();
                            return;
                        case 'acting':
                            this.table.haveTurn();
                            if (!this.table.playerActionResolved(turnPlayer)) {
                                this.drawCard(turnPlayer);
                            }
                            this.renderScene();
                            return;
                    }
                }, 3000);
        }
    }
    chipButtons() {
        for (let i = 0; i < this.table.betDenominations.length; i++) {
            const chipButton = new Button(this, 350 + i * 100, 300, this.table.betDenominations[i].toString(), 'coin', 'coin-se', () => {
                var _a;
                __classPrivateFieldSet(this, _BlackjackView_userBetCount, __classPrivateFieldGet(this, _BlackjackView_userBetCount, "f") + (__classPrivateFieldGet(this, _BlackjackView_userBetCount, "f") + this.table.betDenominations[i] <=
                    this.user.chips
                    ? this.table.betDenominations[i]
                    : 0), "f");
                (_a = __classPrivateFieldGet(this, _BlackjackView_betButton, "f")) === null || _a === void 0 ? void 0 : _a.destroy();
                this.betButton();
                __classPrivateFieldSet(this, _BlackjackView_userChipCount, __classPrivateFieldGet(this, _BlackjackView_userChipCount, "f") - (__classPrivateFieldGet(this, _BlackjackView_userChipCount, "f") - this.table.betDenominations[i] >= 0
                    ? this.table.betDenominations[i]
                    : 0), "f");
                __classPrivateFieldGet(this, _BlackjackView_userChipText, "f").destroy();
                this.userChipCount();
                __classPrivateFieldGet(this, _BlackjackView_userBetText, "f").destroy();
                this.userBetCount();
            });
            __classPrivateFieldGet(this, _BlackjackView_chipButtons, "f").push(chipButton);
        }
    }
    betButton() {
        __classPrivateFieldSet(this, _BlackjackView_betButton, new Button(this, 650, 400, `Bet ${__classPrivateFieldGet(this, _BlackjackView_userBetCount, "f")} & Deal`, 'orange-button', 'select-se', () => {
            var _a, _b;
            if (__classPrivateFieldGet(this, _BlackjackView_userBetCount, "f") <= 0)
                return;
            __classPrivateFieldGet(this, _BlackjackView_chipButtons, "f").forEach((button) => button.destroy());
            __classPrivateFieldGet(this, _BlackjackView_actionButtons, "f").forEach((button) => button.destroy());
            (_a = __classPrivateFieldGet(this, _BlackjackView_betButton, "f")) === null || _a === void 0 ? void 0 : _a.destroy();
            (_b = __classPrivateFieldGet(this, _BlackjackView_clearButton, "f")) === null || _b === void 0 ? void 0 : _b.destroy();
            this.table.haveTurn(__classPrivateFieldGet(this, _BlackjackView_userBetCount, "f"));
            this.renderScene();
        }), "f");
    }
    clearButton() {
        __classPrivateFieldSet(this, _BlackjackView_clearButton, new Button(this, 450, 400, `Clear`, 'orange-button', 'coin-se', () => {
            var _a;
            __classPrivateFieldSet(this, _BlackjackView_userChipCount, __classPrivateFieldGet(this, _BlackjackView_userChipCount, "f") + __classPrivateFieldGet(this, _BlackjackView_userBetCount, "f"), "f");
            __classPrivateFieldSet(this, _BlackjackView_userBetCount, 0, "f");
            (_a = __classPrivateFieldGet(this, _BlackjackView_betButton, "f")) === null || _a === void 0 ? void 0 : _a.destroy();
            this.betButton();
            __classPrivateFieldGet(this, _BlackjackView_userBetText, "f").destroy();
            this.userBetCount();
            __classPrivateFieldSet(this, _BlackjackView_userChipCount, __classPrivateFieldGet(this, _BlackjackView_userChipCount, "f") + this.user.bet, "f");
            __classPrivateFieldGet(this, _BlackjackView_userChipText, "f").destroy();
            this.userChipCount();
        }), "f");
    }
    actionButtons() {
        this.hitButton();
        this.standButton();
        this.doubleButton();
        this.surrenderButton();
    }
    hitButton() {
        const hitButton = new Button(this, 200, 600, 'Hit', 'orange-button', 'select-se', () => {
            __classPrivateFieldGet(this, _BlackjackView_actionButtons, "f").forEach((button) => button.destroy());
            this.table.haveTurn('hit');
            this.drawCard(this.user);
            this.renderScene();
        });
        __classPrivateFieldGet(this, _BlackjackView_actionButtons, "f").push(hitButton);
    }
    standButton() {
        const standButton = new Button(this, 400, 600, 'Stand', 'orange-button', 'select-se', () => {
            __classPrivateFieldGet(this, _BlackjackView_actionButtons, "f").forEach((button) => button.destroy());
            this.table.haveTurn('stand');
            this.renderScene();
        });
        __classPrivateFieldGet(this, _BlackjackView_actionButtons, "f").push(standButton);
    }
    doubleButton() {
        const doubleButton = new Button(this, 600, 600, 'Double', 'orange-button', 'select-se', () => {
            __classPrivateFieldGet(this, _BlackjackView_actionButtons, "f").forEach((button) => button.destroy());
            this.table.haveTurn('double');
            this.drawCard(this.user);
            this.renderScene();
        });
        __classPrivateFieldGet(this, _BlackjackView_actionButtons, "f").push(doubleButton);
    }
    surrenderButton() {
        const surrenderButton = new Button(this, 800, 600, 'Surrender', 'orange-button', 'select-se', () => {
            __classPrivateFieldGet(this, _BlackjackView_actionButtons, "f").forEach((button) => button.destroy());
            this.table.haveTurn('surrender');
            this.renderScene();
        });
        __classPrivateFieldGet(this, _BlackjackView_actionButtons, "f").push(surrenderButton);
    }
    playersInfo() {
        this.playerNameTexts();
        this.chipTexts();
        this.playerScoreTexts();
        this.betTexts();
    }
    playerNameTexts() {
        __classPrivateFieldGet(this, _BlackjackView_playerNameTexts, "f").forEach((text) => text.destroy());
        const dealerNameText = this.add.text(480, 50, `${this.dealer.name}`, {
            fontSize: '30px',
            color: '#ffffff',
            fontFamily: 'pixel'
        });
        __classPrivateFieldGet(this, _BlackjackView_playerNameTexts, "f").push(dealerNameText);
        for (let i = 0; i < this.table.players.length; i++) {
            const player = this.table.players[i];
            const playerNameText = this.add.text(80 + i * 380, 270, `${player.name}`, {
                fontSize: '30px',
                color: '#ffffff',
                fontFamily: 'pixel'
            });
            __classPrivateFieldGet(this, _BlackjackView_playerNameTexts, "f").push(playerNameText);
        }
    }
    userChipCount() {
        var _a;
        (_a = __classPrivateFieldGet(this, _BlackjackView_userChipText, "f")) === null || _a === void 0 ? void 0 : _a.destroy();
        const userChipText = this.add.text(5, 30, `Chips: ${__classPrivateFieldGet(this, _BlackjackView_userChipCount, "f")}`, {
            fontSize: '30px',
            color: '#ffffff',
            fontFamily: 'pixel'
        });
        __classPrivateFieldSet(this, _BlackjackView_userChipText, userChipText, "f");
    }
    userBetCount() {
        var _a;
        (_a = __classPrivateFieldGet(this, _BlackjackView_userBetText, "f")) === null || _a === void 0 ? void 0 : _a.destroy();
        const userBetText = this.add.text(5, 60, `Bet: ${__classPrivateFieldGet(this, _BlackjackView_userBetCount, "f")}`, {
            fontSize: '30px',
            color: '#ffffff',
            fontFamily: 'pixel'
        });
        __classPrivateFieldSet(this, _BlackjackView_userBetText, userBetText, "f");
    }
    chipTexts() {
        __classPrivateFieldGet(this, _BlackjackView_chipTexts, "f").forEach((text) => text.destroy());
        for (let i = 0; i < this.table.players.length; i++) {
            const player = this.table.players[i];
            const chipText = this.add.text(80 + i * 380, 320, `Chips: ${player.chips}`, {
                fontSize: '30px',
                color: '#ffffff',
                fontFamily: 'pixel'
            });
            __classPrivateFieldGet(this, _BlackjackView_chipTexts, "f").push(chipText);
        }
    }
    betTexts() {
        __classPrivateFieldGet(this, _BlackjackView_betTexts, "f").forEach((text) => text.destroy());
        for (let i = 0; i < this.table.players.length; i++) {
            const player = this.table.players[i];
            const betText = this.add.text(80 + i * 380, 350, `Bet: ${player.bet}`, {
                fontSize: '30px',
                color: '#ffffff',
                fontFamily: 'pixel'
            });
            __classPrivateFieldGet(this, _BlackjackView_betTexts, "f").push(betText);
        }
    }
    playerScoreTexts() {
        __classPrivateFieldGet(this, _BlackjackView_scoreTexts, "f").forEach((text) => text.destroy());
        const dealerScore = this.table.gamePhase === 'dealer turn'
            ? `Score: ${this.table.dealer.getHandScore()}`
            : 'Score: ?';
        const dealerScoreText = this.add.text(480, 100, dealerScore, {
            fontSize: '30px',
            color: '#ffffff',
            fontFamily: 'pixel'
        });
        __classPrivateFieldGet(this, _BlackjackView_scoreTexts, "f").push(dealerScoreText);
        for (let i = 0; i < this.table.players.length; i++) {
            const player = this.table.players[i];
            const playerScore = player.hand.length > 0 ? `Score: ${player.getHandScore()}` : 'Score: ?';
            const playerScoreText = this.add.text(80 + i * 380, 380, playerScore, {
                fontSize: '30px',
                color: '#ffffff',
                fontFamily: 'pixel'
            });
            __classPrivateFieldGet(this, _BlackjackView_scoreTexts, "f").push(playerScoreText);
        }
    }
    dealInitialHands() {
        const dealerHands = this.table.dealer.hand;
        for (let i = 0; i < dealerHands.length; i++) {
            const card = dealerHands[i];
            const cardImage = this.add.image(400, 0, 'back');
            this.tweens.add({
                targets: cardImage,
                x: 480 + i * 25,
                y: 180,
                duration: 1000,
                ease: 'Power2',
                delay: i * 100
            });
            this.sound.play('card-se');
            if (i === 0) {
                setTimeout(() => {
                    this.sound.play('card-flip-se');
                    this.add.tween({
                        targets: cardImage,
                        scaleX: 0,
                        duration: 500,
                        ease: 'Power2',
                        onComplete: () => {
                            cardImage.setTexture(`${card.rank}${card.suit}`);
                            this.add.tween({
                                targets: cardImage,
                                scaleX: 1,
                                duration: 500,
                                ease: 'Power2'
                            });
                        }
                    });
                }, 1000);
            }
            __classPrivateFieldGet(this, _BlackjackView_dealerHandImages, "f").push(cardImage);
        }
        for (let i = 0; i < this.table.players.length; i++) {
            const player = this.table.players[i];
            const playerHands = player.hand;
            for (let j = 0; j < playerHands.length; j++) {
                const card = playerHands[j];
                const cardImage = this.add.image(400, -10, card.getImageKey());
                this.tweens.add({
                    targets: cardImage,
                    x: 100 + i * 380 + j * 25,
                    y: 460,
                    sound: 'card-se',
                    duration: 1000,
                    ease: 'Power2',
                    delay: i * 100
                });
                setTimeout(() => {
                    this.add.tween({
                        targets: cardImage,
                        scaleX: 0,
                        duration: 500,
                        ease: 'Power2',
                        onComplete: () => {
                            cardImage.setTexture(`${card.rank}${card.suit}`);
                            this.add.tween({
                                targets: cardImage,
                                scaleX: 1,
                                duration: 500,
                                ease: 'Power2'
                            });
                        }
                    });
                }, 1000);
                __classPrivateFieldGet(this, _BlackjackView_playersHandsImages, "f")[i].push(cardImage);
            }
        }
    }
    drawCard(player) {
        const card = player.hand[player.hand.length - 1];
        const cardImage = this.add.image(400, -10, 'back');
        const playerIndex = this.table.players.indexOf(player);
        let posX = 0;
        let posY = 0;
        if (player.type === 'dealer') {
            posX = 460 + (player.hand.length - 1) * 25;
            posY = 180;
        }
        else {
            posX = 100 + playerIndex * 380 + (player.hand.length - 1) * 25;
            posY = 460;
        }
        this.tweens.add({
            targets: cardImage,
            x: posX,
            y: posY,
            duration: 1000,
            ease: 'Power2',
            delay: (playerIndex - 1) * 100
        });
        this.sound.play('card-se');
        setTimeout(() => {
            this.sound.play('card-flip-se');
            this.add.tween({
                targets: cardImage,
                scaleX: 0,
                duration: 500,
                ease: 'Power2',
                onComplete: () => {
                    cardImage.setTexture(`${card.rank}${card.suit}`);
                    this.add.tween({
                        targets: cardImage,
                        scaleX: 1,
                        duration: 500,
                        ease: 'Power2'
                    });
                }
            });
        }, 1000);
        if (player.type === 'dealer') {
            __classPrivateFieldGet(this, _BlackjackView_dealerHandImages, "f").push(cardImage);
        }
        else {
            __classPrivateFieldGet(this, _BlackjackView_playersHandsImages, "f")[playerIndex].push(cardImage);
        }
    }
    flipDealerCard() {
        const card = this.dealer.hand[1];
        const cardImage = __classPrivateFieldGet(this, _BlackjackView_dealerHandImages, "f")[1];
        setTimeout(() => {
            this.sound.play('card-flip-se');
            this.add.tween({
                targets: cardImage,
                scaleX: 0,
                duration: 500,
                ease: 'Power2',
                onComplete: () => {
                    cardImage.setTexture(`${card.rank}${card.suit}`);
                    this.add.tween({
                        targets: cardImage,
                        scaleX: 1,
                        duration: 500,
                        ease: 'Power2'
                    });
                }
            });
        }, 1000);
    }
    roundResults() {
        var _a, _b;
        __classPrivateFieldGet(this, _BlackjackView_playerNameTexts, "f").forEach((text) => text.destroy());
        __classPrivateFieldGet(this, _BlackjackView_chipTexts, "f").forEach((text) => text.destroy());
        __classPrivateFieldGet(this, _BlackjackView_betTexts, "f").forEach((text) => text.destroy());
        __classPrivateFieldGet(this, _BlackjackView_scoreTexts, "f").forEach((text) => text.destroy());
        __classPrivateFieldGet(this, _BlackjackView_actionButtons, "f").forEach((button) => button.destroy());
        __classPrivateFieldGet(this, _BlackjackView_chipButtons, "f").forEach((button) => button.destroy());
        (_a = __classPrivateFieldGet(this, _BlackjackView_betButton, "f")) === null || _a === void 0 ? void 0 : _a.destroy();
        (_b = __classPrivateFieldGet(this, _BlackjackView_clearButton, "f")) === null || _b === void 0 ? void 0 : _b.destroy();
        __classPrivateFieldGet(this, _BlackjackView_playersHandsImages, "f").forEach((hand) => {
            hand.forEach((card) => card.destroy());
        });
        __classPrivateFieldGet(this, _BlackjackView_dealerHandImages, "f").forEach((card) => card.destroy());
        if (this.user.getHandScore() > 21 ||
            (this.dealer.getHandScore() > this.user.getHandScore() &&
                this.dealer.getHandScore() <= 21) ||
            this.user.gameStatus === 'surrender') {
            this.sound.play('lose-se');
        }
        else if (this.user.getHandScore() > this.dealer.getHandScore() ||
            this.dealer.getHandScore() > 21) {
            this.sound.play('win-se');
        }
        const resultsLog = this.table.evaluateAndGetRoundResults();
        this.add.text(400, 300, resultsLog, {
            fontSize: '30px',
            color: '#ffffff',
            fontFamily: 'pixel'
        });
        this.nextButton(this.user.name);
    }
    nextButton(username) {
        const nextButton = new Button(this, 500, 500, 'Next', 'orange-button', 'select-se', () => {
            this.table.resetRoundInfo();
            this.create({ table: this.table, difficulty: this.difficulty });
        });
        __classPrivateFieldSet(this, _BlackjackView_nextButton, nextButton, "f");
    }
    finalResults() {
        var _a, _b;
        __classPrivateFieldGet(this, _BlackjackView_playerNameTexts, "f").forEach((text) => text.destroy());
        __classPrivateFieldGet(this, _BlackjackView_chipTexts, "f").forEach((text) => text.destroy());
        __classPrivateFieldGet(this, _BlackjackView_scoreTexts, "f").forEach((text) => text.destroy());
        __classPrivateFieldGet(this, _BlackjackView_betTexts, "f").forEach((text) => text.destroy());
        __classPrivateFieldGet(this, _BlackjackView_actionButtons, "f").forEach((button) => button.destroy());
        __classPrivateFieldGet(this, _BlackjackView_chipButtons, "f").forEach((button) => button.destroy());
        (_a = __classPrivateFieldGet(this, _BlackjackView_betButton, "f")) === null || _a === void 0 ? void 0 : _a.destroy();
        (_b = __classPrivateFieldGet(this, _BlackjackView_clearButton, "f")) === null || _b === void 0 ? void 0 : _b.destroy();
        __classPrivateFieldGet(this, _BlackjackView_playersHandsImages, "f").forEach((hand) => {
            hand.forEach((card) => card.destroy());
        });
        __classPrivateFieldGet(this, _BlackjackView_dealerHandImages, "f").forEach((card) => card.destroy());
        const resultsLog = this.table.evaluateAndGetFinalResults();
        this.add.text(400, 300, resultsLog, {
            fontSize: '30px',
            color: '#ffffff',
            fontFamily: 'pixel'
        });
        if (this.user.chips >
            Math.max(this.table.players[1].chips, this.table.players[2].chips)) {
            this.sound.play('win-se');
        }
        else {
            this.sound.play('lose-se');
        }
        this.againButton();
        this.backButton();
    }
    gameOver() {
        var _a, _b;
        __classPrivateFieldGet(this, _BlackjackView_playerNameTexts, "f").forEach((text) => text.destroy());
        __classPrivateFieldGet(this, _BlackjackView_chipTexts, "f").forEach((text) => text.destroy());
        __classPrivateFieldGet(this, _BlackjackView_betTexts, "f").forEach((text) => text.destroy());
        __classPrivateFieldGet(this, _BlackjackView_scoreTexts, "f").forEach((text) => text.destroy());
        __classPrivateFieldGet(this, _BlackjackView_actionButtons, "f").forEach((button) => button.destroy());
        __classPrivateFieldGet(this, _BlackjackView_chipButtons, "f").forEach((button) => button.destroy());
        (_a = __classPrivateFieldGet(this, _BlackjackView_betButton, "f")) === null || _a === void 0 ? void 0 : _a.destroy();
        (_b = __classPrivateFieldGet(this, _BlackjackView_clearButton, "f")) === null || _b === void 0 ? void 0 : _b.destroy();
        __classPrivateFieldGet(this, _BlackjackView_playersHandsImages, "f").forEach((hand) => {
            hand.forEach((card) => card.destroy());
        });
        __classPrivateFieldGet(this, _BlackjackView_dealerHandImages, "f").forEach((card) => card.destroy());
        this.sound.play('lose-se');
        const resultsLog = 'You ran out of chips...';
        this.add.text(400, 300, resultsLog, {
            fontSize: '30px',
            color: '#ffffff',
            fontFamily: 'pixel'
        });
        this.againButton();
        this.backButton();
    }
    againButton() {
        const againButton = new Button(this, 500, 500, 'Again', 'orange-button', 'select-se', () => {
            this.table.resetRoundInfo();
            this.table = new BlackjackTable('blackjack', this.user.name, this.difficulty, this.maxRounds);
            this.user = this.table.players[0];
            this.dealer = this.table.dealer;
            this.create({ table: this.table });
        });
        __classPrivateFieldSet(this, _BlackjackView_againButton, againButton, "f");
    }
    backButton() {
        const backButton = new Button(this, 500, 600, 'Back', 'orange-button', 'select-se', () => {
            const root = document.getElementById('app');
            root.innerHTML = '';
            Controller.renderModeSelectPage(['blackjack', 'war'], 'player');
        });
        __classPrivateFieldSet(this, _BlackjackView_backButton, backButton, "f");
    }
    static createTutorialView() { }
}
_BlackjackView_userChipCount = new WeakMap(), _BlackjackView_userChipText = new WeakMap(), _BlackjackView_userBetCount = new WeakMap(), _BlackjackView_userBetText = new WeakMap(), _BlackjackView_chipButtons = new WeakMap(), _BlackjackView_betButton = new WeakMap(), _BlackjackView_clearButton = new WeakMap(), _BlackjackView_actionButtons = new WeakMap(), _BlackjackView_nextButton = new WeakMap(), _BlackjackView_againButton = new WeakMap(), _BlackjackView_backButton = new WeakMap(), _BlackjackView_playerNameTexts = new WeakMap(), _BlackjackView_chipTexts = new WeakMap(), _BlackjackView_betTexts = new WeakMap(), _BlackjackView_scoreTexts = new WeakMap(), _BlackjackView_playersHandsImages = new WeakMap(), _BlackjackView_dealerHandImages = new WeakMap();
//# sourceMappingURL=blackjackScene.js.map