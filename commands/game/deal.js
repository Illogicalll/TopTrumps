const { EmbedBuilder, SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs');

function shuffle(array) {
	let currentIndex = array.length;
	let temporaryValue;
	let randomIndex;

	while (currentIndex !== 0) {

		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function distributeCards(deck, numPlayers) {
	const playerHands = [];

	for (let i = 0; i < numPlayers; i++) {
		playerHands.push([]);
	}

	let currentPlayer = 0;
	for (let i = 0; i < deck.length; i++) {
		if (deck[i] === 'stats.csv' || deck[i] === 'cover.jpg') {
			// Don't deal card stats file or cover cards
		}
		else {
			playerHands[currentPlayer].push(deck[i]);
			if (currentPlayer < numPlayers - 1) {
				currentPlayer += 1;
			}
			else {
				currentPlayer = 0;
			}
		}
	}

	const cardCounts = [];
	for (let i = 0; i < playerHands.length; i++) {
		cardCounts.push(playerHands[i].length);
	}

	const allEqual = arr => arr.every(v => v === arr[0]);
	if (!allEqual(cardCounts)) {
		cardCounts[cardCounts.indexOf(Math.max(...cardCounts))]--;
	}

	return playerHands;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deal')
		.setDescription('Get your hand'),
	async execute() {
		let deck = fs.readdirSync(`sets/${global.selection}`);
		deck = shuffle(deck);
		let playerHands = distributeCards(deck, global.userIDQueue.length);
		global.playerHands = playerHands;
		global.userIDQueue.forEach(id => {
			const servingUser = global.userIDQueue.indexOf(id);
			const image = new AttachmentBuilder(`./sets/${global.selection}/${playerHands[servingUser][0]}`);
			global.interactionQueue[servingUser].followUp({ content: 'Your Card:', files: [image], ephemeral: true });
		});
	},
};