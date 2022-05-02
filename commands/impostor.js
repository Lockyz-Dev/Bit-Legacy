const { SlashCommandBuilder } = require('@discordjs/builders');
const locale = require('../locale/en-US.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('impostor')
		.setDescription('Find the impostor amogus')
		.addUserOption((option) => 
			option
				.setName('user')
				.setDescription('The user you think is the impostor.')
				.setRequired(false)
		)
		.addStringOption((option) => 
			option
				.setName('help')
				.setDescription('Find out what this command is')
				.setRequired(false)
				.addChoices(
					[
						['Yes', 'true'],
						['No', 'false'],
					]
				)
		),
	async execute(interaction) {
            const user = interaction.options.getUser('user');
            const help = interaction.options.getString('help');
			var user1 = interaction.user.username;

            if(help === "true") {
                interaction.reply({content: locale.impostorInfo})
            } else {
				if(user) {
					user1 = user.username
				}
				
				var randomAnswer = (Math.random() * 100 <= 1 ? locale.impostorTextImpost.replace('{user}', user1) : locale.impostorTextNot.replace('{user}', user1))
                interaction.reply({content: ".      　。　　　　•　    　ﾟ　　。\n　　.　　　.　　　  　　.　　　　　。　　   。　.\n　.　　      。　        ඞ   。　    .    •\n•      "+randomAnswer+"　 　　。　　 　　　　ﾟ　　　.　      　　　.\n,　　　　.　 ."})
			}
		}
};
