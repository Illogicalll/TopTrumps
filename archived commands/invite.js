const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
	async execute(searchInitiator, i, selection) {

		const accept = new ButtonBuilder()
			.setCustomId('accept')
			.setLabel('Accept Match')
			.setStyle(ButtonStyle.Success);

		const row2 = new ActionRowBuilder()
			.addComponents(accept);

		const response = await i.followUp({ content: `**${searchInitiator}** is looking for a TopTrumps match on **${selection}**`, components: [row2], ephemeral: false });

		const collectorFilter = j => j.user.id === j.user.id;

		try {
			const invite = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });

			if (invite.customId === 'accept') {
				const acceptee = accept.user.tag.split('#')[0];
				await invite.update({ content: `**${acceptee}** has accepted **${searchInitiator}'s** match on **${selection}**`, components: [] });
			}
		}
		catch (e) {
			await i.editReply({ content: 'Invitation not accepted within 1 minute, cancelling', components: [] });
		}

	},
};