const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js')
const locale = require('../locale/en-US.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kick a user.')
		.addUserOption((option) => 
			option
				.setName('user')
				.setDescription('The user you wanna kick.')
				.setRequired(true)
		)
		.addStringOption((option) => 
			option
				.setName('reason')
				.setDescription('The reason you wanna kick the user for.')
				.setRequired(false)
                .addChoices(
                    [
                        ['Spam', 'Spam'],
                        ['Discord TOS', 'Broke Discord TOS'],
                        ['Pedophilia', 'Gross Pedo'],
                        ['Unsolicited Nudes', 'Unsolicited Nudes'],
                        ['Racism', 'Racism'],
                        ['Bot', 'Bot'],
                        ['Compromised Account', 'Compromised Account'],
                        ['Harassment', 'Harassment'],
                        ['Doxing', 'Doxing'],
                        ['Bullying', 'Bullying'],
                        ['Mysogyny', 'Mysogyny'],
                        ['Homophobia', 'Homophobia'],
                        ['Gore Content', 'Gore Content'],
                        ['Phishing', 'Phishing'],
                        ['Scamming', 'Scamming'],
                        ['Other', 'Other']
                    ]
                )
		)
        .addStringOption((option) => 
            option
                .setName('custom_reason')
                .setDescription('If your reason isn\'t listed you can use a custom one here.')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option
                .setName('send_reason')
                .setDescription('Do you want to send your custom reason to our developers so they can add it to the list of reasons?')
                .setRequired(false)
                .addChoices(
                    [
                        ['Yes', 'true'],
                        ['No', 'false']
                    ]
                )
        ),
	async execute(interaction) {
        const user = interaction.options.getUser('user')
        const reason = interaction.options.getString('reason')
        const customReason = interaction.options.getString('custom_reason')
        const sendCustomReason = interaction.options.getString('send_reason')
        const member = interaction.guild.members.cache.get(user.id)
        const client = interaction.client
        var reason1 = "Kicked by "+interaction.user.username

        if(interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) || interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) || interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS) || interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
            if(customReason) {
                if(sendCustomReason === "true") {
                    client.channels.cache.get('906706193924386846').send({ content: "Someone used a custom reason. The reason is `"+customReason+"`" })
                }
                reason1 = "Kicked by "+interaction.user.username+" for "+customReason
            } else {
                if(!reason) {
                    reason1 = "Kicked by "+interaction.user.username
                } else {
                    reason1 = "Kicked by "+interaction.user.username+" for "+reason
                }
            }
            if(!member.kickable) {
                interaction.reply({ content: 'Either my role is too low to Kick this user or they have some sort of magical power.' })
            } else {
                member.kick({ reason: reason1 })
                interaction.reply({ content: 'Done' })
            }
        } else {
            interaction.reply({ content: 'You don\'t have the permission to use this command.' })
        }
	}
};