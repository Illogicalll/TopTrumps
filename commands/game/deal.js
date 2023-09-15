const { SlashCommandBuilder, AttachmentBuilder, ActionRowBuilder, StringSelectMenuBuilder, Events } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const csv = require('csv-parser');
// eslint-disable-next-line prefer-const
let playerTurn = 0;

async function execute(file, ...args) {
	const f = require(file);
	if (!f) throw new Error('Invalid file');
	return f.execute(...args);
}

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
	const totalCards = deck.length - 2;
	global.totalCards = totalCards;

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

function getStats() {
	return new Promise((resolve, reject) => {
		const stats = [];
		const statNames = [];
		const statsPath = path.join(global.__basedir, `./sets/${global.selection}/stats.csv`);

		fs.createReadStream(statsPath)
			.pipe(csv())
			.on('data', (data) => stats.push(data))
			.on('end', () => {
				for (const [key] of Object.entries(stats[0])) {
					statNames.push(key);
				}
				resolve({ stats, statNames });
			})
			.on('error', (error) => {
				reject(error);
			});
	});
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deal')
		.setDescription('Get your hand'),
	async execute() {
		let deck = fs.readdirSync(`sets/${global.selection}`);
		deck = shuffle(deck);
		// eslint-disable-next-line prefer-const
		let playerHands = distributeCards(deck, global.userIDQueue.length);
		global.playerHands = playerHands;

		const { stats, statNames } = await getStats();
		global.stats = stats;
		const select = new StringSelectMenuBuilder()
			.setCustomId('stat')
			.setPlaceholder('Choose a Stat...')
			.addOptions(statNames.map(name => { return { label: name, value: name }; }));
		const row = new ActionRowBuilder()
			.addComponents(select);
		global.row = row;

		global.userIDQueue.forEach(id => {
			const servingUser = global.userIDQueue.indexOf(id);
			const image = new AttachmentBuilder(`./sets/${global.selection}/${playerHands[servingUser][0]}`);

			if (playerTurn === servingUser) {
				global.interactionQueue[servingUser].followUp({ content: 'Your Card:\n**It is your turn, choose a stat...**', files: [image], components: [row], ephemeral: true });
			}
			else {
				global.interactionQueue[servingUser].followUp({ content: `Your Card:\n**It is ${global.usernameQueue[playerTurn]}'s turn...**`, files: [image], ephemeral: true });
			}
		});

		global.playerTurn = playerTurn;

		global.client.on(Events.InteractionCreate, async interaction => {
			if (!interaction.isStringSelectMenu()) return;
			if (interaction.customId !== 'stat') return;
			const chosenStat = interaction.values;
			global.chosenStat = chosenStat;
			await execute('./round.js');
		});
	},
};