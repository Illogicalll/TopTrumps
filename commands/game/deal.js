const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deal')
		.setDescription('Get your hand'),
	async execute() {
		global.userIDQueue.forEach(id => {
			const servingUser = global.userIDQueue.indexOf(id);
			global.interactionQueue[servingUser].followUp({ content: (`Dealing to ${global.usernameQueue[servingUser]}`), ephemeral: true });
		});
	},
};