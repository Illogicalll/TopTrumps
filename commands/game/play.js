const { StringSelectMenuBuilder, ActionRowBuilder, SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const setsPath = path.join(global.__basedir, 'sets');

function getSets(pathToCheck) {
	return fs.readdirSync(pathToCheck).filter(function(file) {
		return fs.statSync(pathToCheck + '/' + file).isDirectory();
	});
}

async function execute(file, ...args) {
	const f = require(file);
	if (!f) throw new Error('Invalid file');
	return f.execute(...args);
}

const sets = getSets(setsPath);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Start the Match!'),
	async execute(interaction) {

		if (global.usernameQueue === undefined || global.usernameQueue.length < 2) {
			await interaction.reply({
				content: 'Error, Could Not Start Match...\nReason: **Not Enough Players**',
				ephemeral: true,
			});
		}
		else if (interaction.user.id !== global.userIDQueue[0]) {
			await interaction.reply({
				content: 'Error, Could Not Start Match...\nReason: **You are not host**',
				ephemeral: true,
			});
		}
		else {
			const select = new StringSelectMenuBuilder()
				.setCustomId('deck')
				.setPlaceholder('Pick a Deck...')
				.addOptions(sets.map(set => { return { label: set, value: set }; }));

			const row = new ActionRowBuilder()
				.addComponents(select);

			const response = await interaction.reply({
				content: 'Welcome to Discord TopTrumps! Here is How it Works...\n1: **Choose a Deck** this will determine what the topic of the game will be\n2: **Wait for an opponent to accept the match** a global message will be sent out with a button for others to join\n3: **Enjoy!** the game is now underway and the winner will be determined at the end!',
				components: [row],
				ephemeral: true,
			});

			const collector = response.createMessageComponentCollector({ time: 3_600_000 });
			collector.on('collect', async i => {
				if (!i.isStringSelectMenu()) return;
				if (i.customId !== 'deck') return;
				const selection = i.values;
				// eslint-disable-next-line quotes
				let playerList = ``;
				global.usernameQueue.forEach(function(player) {playerList += `${player} `;});
				const image = new AttachmentBuilder(`./sets/${selection}/cover.jpg`);
				await i.reply({ content: `**${selection}** has been chosen! Starting the Match...\nPlayers: **${playerList}**`, components: [], files: [image], ephemeral: false });
				global.selection = selection;
				await execute('./deal.js');
			});

		}
	},
};