const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('round')
		.setDescription('Get your hand'),
	async execute() {
		const roundStats = [];
		global.userIDQueue.forEach(id => {
			const servingUser = global.userIDQueue.indexOf(id);
			global.interactionQueue[servingUser].followUp({ content: `**${global.usernameQueue[global.playerTurn]}** has chosen **${global.chosenStat}**`, ephemeral: true });
			roundStats.push(parseInt(global.stats[parseInt(global.playerHands[servingUser][0].split('.')[0]) - 1][global.chosenStat]));
		});
		const roundWinner = roundStats.indexOf(Math.max(...roundStats));
		let cardToMove = null;
		const hasGivenCard = Array(global.userIDQueue.length).fill(false);
		global.userIDQueue.forEach(id => {
			if (roundWinner === global.userIDQueue.indexOf(id)) {
				global.interactionQueue[roundWinner].followUp({ content: `**You win the round!** You now have **${global.playerHands[roundWinner].length + hasGivenCard.filter(given => given === false).length - 1}** cards!`, ephemeral: true });
			}
			else {
				global.interactionQueue[global.userIDQueue.indexOf(id)].followUp({ content: `**${global.usernameQueue[roundWinner]} wins the round!** You now have **${global.playerHands[global.userIDQueue.indexOf(id)].length - 1}** cards...`, ephemeral: true });
				cardToMove = global.playerHands[global.userIDQueue.indexOf(id)].shift();
				global.playerHands[roundWinner].push(cardToMove);
				hasGivenCard[global.userIDQueue.indexOf(id)] = true;
			}
		});
	},
};