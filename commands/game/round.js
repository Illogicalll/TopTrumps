const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('round')
		.setDescription('Get your hand'),
	async execute() {
		// Handle round
	},
};