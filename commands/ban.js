const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js')
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Ban a user.')
		.addUserOption((option) => 
			option
				.setName('user')
				.setDescription('The user you wanna ban.')
				.setRequired(true)
		)
		.addStringOption((option) => 
			option
				.setName('reason')
				.setDescription('The reason you wanna ban the user for.')
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
        var reason1 = "Banned by "+interaction.user.username;

        var lan = 'en'
        client.getUsSett = sql.prepare("SELECT * FROM userSettings WHERE userID = ?");
        let userset = client.getUsSett.get(interaction.user.id)

        if(userset) {
            if(userset.language) {
                lan = userset.language;
            }
        }
        const locale = require('../locale/'+lan+'.json')

        if(interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) || interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) || interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            if(customReason) {
                if(sendCustomReason === "true") {
                    client.channels.cache.get('906706193924386846').send({ content: "Someone used a custom reason. The reason is `"+customReason+"`" })
                }
                reason1 = locale.banReasonAdded.replace('{user}', interaction.user.username).replace('{reason}', customReason)
                //
            } else {
                if(!reason) {
                    reason1 = locale.banReasonDefault.replace('{user}', interaction.user.username)
                } else {
                    reason1 = locale.banReasonAdded.replace('{user}', interaction.user.username).replace('{reason}', reason)
                }
            }
            if(!member.bannable) {
                interaction.reply({ content: locale.banUnbannable })
            } else {
                member.ban({ days: 7, reason: reason1 })
                interaction.reply({ content: locale.banReasonAddedResponse.replace('{user}', member.username).replace('{reason}', reason1) })
            }
        } else {
            interaction.reply({ content: locale.noPermission })
        }
	}
};