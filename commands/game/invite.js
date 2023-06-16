const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
	async execute(searchInitiator, i, selection) {

		const accept = new ButtonBuilder()
			.setCustomId('accept')
			.setLabel('Accept Match')
			.setStyle(ButtonStyle.Success);

		const row2 = new ActionRowBuilder()
			.addComponents(accept);

		await i.followUp({ content: `**${searchInitiator}** is looking for a TopTrumps match on **${selection}**`, components: [row2], ephemeral: false });

	},
};