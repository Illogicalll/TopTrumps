const { ButtonBuilder, ButtonStyle, ActionRowBuilder, SlashCommandBuilder } = require('discord.js');
const usernameQueue = [];
const userIDQueue = [];
const interactionQueue = [];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Enter Queue For A Match!'),
	async execute(interaction) {

		interactionQueue.push(interaction);
		global.interactionQueue = interactionQueue;

		const accept = new ButtonBuilder()
			.setCustomId('leave')
			.setLabel('Leave Queue')
			.setStyle(ButtonStyle.Danger);

		const row = new ActionRowBuilder()
			.addComponents(accept);

		// eslint-disable-next-line quotes
		let msg = ``;
		if (usernameQueue.length == 0) {
			msg = `Now in Queue...\nNumber of Players in Queue: **${usernameQueue.length}**\nYou are **Lobby Host** (when 2 or more players are in queue you will have the ability to start the match...)`;
		}
		else {
			msg = `Now in Queue...\nNumber of Players in Queue: **${usernameQueue.length}**\n**${usernameQueue[0]}** is host`;
		}
		const username = interaction.user.tag.split('#')[0];
		const userID = interaction.user.id;
		usernameQueue.push(username);
		userIDQueue.push(userID);

		const response = await interaction.reply({
			content: msg,
			components: [row],
			ephemeral: true,
		});

		function updateQueue() {
			if (usernameQueue[0] == username) {
				msg = `Now in Queue...\nNumber of Players in Queue: **${usernameQueue.length}**\nYou are **Lobby Host** (when 2 or more players are in queue you will have the ability to start the match...)`;
			}
			else {
				msg = `Now in Queue...\nNumber of Players in Queue: **${usernameQueue.length}**\n**${usernameQueue[0]}** is host`;
			}
			interaction.editReply({
				content: msg,
				components: [row],
				ephemeral: true,
			});
			global.usernameQueue = usernameQueue;
			global.userIDQueue = userIDQueue;
		}

		const queueRefresh = setInterval(updateQueue, 2000);

		const collectorFilter = i => i.user.id === interaction.user.id;

		const confirmation = await response.awaitMessageComponent({ filter: collectorFilter });

		if (confirmation.customId === 'leave') {
			const index = usernameQueue.indexOf(username);
			if (index > -1) {
				usernameQueue.splice(index, 1);
				userIDQueue.splice(index, 1);
				interactionQueue.splice(index, 1);
			}
			await confirmation.update({ content: 'You Have Left the Queue...', components: [] });
			clearInterval(queueRefresh);
		}

	},
};