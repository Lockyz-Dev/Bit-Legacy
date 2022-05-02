const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const locale = require('../locale/en-US.json')
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('Get user information.')
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('The user you want information on (Optional)')
                .setRequired(false)
        ),
	async execute(interaction) {
        const membera = interaction.user
        const usra = interaction.options.getUser('user');
        var user
        var usAcc

        if(!usra) {
            user = membera
            usAcc = "true"
        } else {
            client.getUsSett = sql.prepare("SELECT * FROM userSettings WHERE userID = ?");
            let userset = client.getUsSett.get(user.id)

            if(userset.userAccess === "true") {
                interaction.reply({ content: 'This user has disabled access to their account, only showing you basic information.'})
                usAcc = "false"
            } else {
                usAcc = "true"
            }
            user = usra
        }
        const member = interaction.guild.members.cache.get(user.id);

        const embed = new MessageEmbed()
            .setTitle('User Info')
            .setThumbnail(user.avatarURL())
            .addField('Username', user.username, true)
            if(member.nickname != null) {
                embed.addField('Nickname', member.nickname, true)
            } else {
                embed.addField('Nickname', 'None', true)
            }
            if(usAcc === "true") {
                if(member.presence === null) {
                    embed.addField('Presence Status', 'User status is messed up somehow...', true)
                } else {
                    embed.addField('Presence Status', member.presence.status, true)
                }
                embed.addField('Joined', '<t:'+Math.floor(new Date(member.joinedAt).getTime() / 1000)+'>', true)
            }
            embed.addField('Roles', member.roles.cache.map(r => r.toString()).join(' | '))
            if(usAcc === "true") {
                embed.setFooter('ID: '+user.id+ ' | User Created: ')
                embed.setTimestamp(user.createdTimestamp)
            } else {
                embed.setTimestamp()
            }
        interaction.reply({ embeds: [embed] })
	}
};
