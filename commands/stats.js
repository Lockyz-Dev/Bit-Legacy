const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions, version: discordVersion } = require('discord.js')
const moment = require('moment');
require('moment-duration-format');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Get advanced statistics from the bot.'),
	async execute(interaction) {
        const client = interaction.client
        var lan = 'en'
        client.getUsSett = sql.prepare("SELECT * FROM userSettings WHERE userID = ?");
        let userset = client.getUsSett.get(interaction.user.id)

        if(userset) {
            if(userset.language) {
                lan = userset.language;
            }
        }
        const locale = require('../locale/'+lan+'.json')

        const botUptime = moment.duration(client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
        const memUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const guildSize = client.guilds.cache.size.toString();
        const userSize = client.users.cache.size.toString();

        const embed = new MessageEmbed()
            .setAuthor(client.user.username.toString(),client.user.avatarURL())
            .addField('Guilds', guildSize, true)
            .addField('Users', userSize, true)
            .addField('Uptime', botUptime, true)
            .addField('Memory', `${Math.round(memUsage)} MB`, true)
            .addField('Discord.js', `v${discordVersion}`, true)
            .addField('Node', `${process.version}`, true)
            .setFooter(`Bot Version: v14112021`)
            .setTimestamp();

            interaction.reply({ embeds: [embed] })
	}
};