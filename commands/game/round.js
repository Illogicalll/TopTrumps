const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

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
			cardToMove = global.playerHands[global.userIDQueue.indexOf(id)].shift();
			global.playerHands[roundWinner].push(cardToMove);
			if (roundWinner === global.userIDQueue.indexOf(id)) {
				global.interactionQueue[roundWinner].followUp({ content: `**You win the round!** You now have **${global.playerHands[roundWinner].length + hasGivenCard.filter(given => given === false).length - 1}** cards!`, ephemeral: true });
			}
			else {
				global.interactionQueue[global.userIDQueue.indexOf(id)].followUp({ content: `**${global.usernameQueue[roundWinner]} wins the round!** You now have **${global.playerHands[global.userIDQueue.indexOf(id)].length}** cards...`, ephemeral: true });
				hasGivenCard[global.userIDQueue.indexOf(id)] = true;
			}
		});
		if (global.playerHands[roundWinner].length === global.totalCards) {
			global.interactionQueue[roundWinner].followUp({ content: `**${global.usernameQueue[roundWinner]} wins the game!** They have all the cards!`, ephemeral: false });
		}
		else {
			if (global.playerTurn < global.userIDQueue.length - 1) {
				global.playerTurn += 1;
			}
			else {
				global.playerTurn = 0;
			}
			global.userIDQueue.forEach(id => {
				const servingUser = global.userIDQueue.indexOf(id);
				const image = new AttachmentBuilder(`./sets/${global.selection}/${global.playerHands[servingUser][0]}`);
				if (global.playerTurn === servingUser) {
					global.interactionQueue[servingUser].followUp({ content: 'Your Card:\n**It is your turn, choose a stat...**', files: [image], components: [global.row], ephemeral: true });
				}
				else {
					global.interactionQueue[servingUser].followUp({ content: `Your Card:\n**It is ${global.usernameQueue[global.playerTurn]}'s turn...**`, files: [image], ephemeral: true });
				}
			});
		}
	},
};