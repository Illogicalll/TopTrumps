const { ActionRowBuilder, StringSelectMenuBuilder, SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const setsPath = path.join(global.__basedir, 'sets');
let selection = '';

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
		.setDescription('Play a Game of TopTrumps!'),
	async execute(interaction) {
		const select = new StringSelectMenuBuilder()
			.setCustomId('Deck')
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
			selection = i.values[0];
			await i.update({ content: `**${selection}** has been chosen! Broadcasting match invite...`, components: [] });
			const searchInitiator = interaction.user.tag.split('#')[0];
			await execute('./invite.js', searchInitiator, i, selection);
		});

	},
};