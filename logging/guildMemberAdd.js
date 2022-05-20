const { MessageEmbed } = require('discord.js');
const { embedColor, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	name: 'guildMemberAdd',
	execute(member) {
		const client = member.client
		const user = member.user

		client.getChSett = sql.prepare("SELECT * FROM channelSettings WHERE guildID = ?");
		client.getGuSett = sql.prepare("SELECT * FROM guildFeatures WHERE guildID = ?");
		client.getRoSett = sql.prepare("SELECT * FROM roleSettings WHERE guildID = ?");
		client.setGuSett = sql.prepare("INSERT OR REPLACE INTO guildFeatures (guildID, enableLogging, enableWelcome, enableXP, enableRoleOnJoin, enableBoosts, enableLeave) VALUES (@guildID, @enableLogging, @enableWelcome, @enableXP, @enableRoleOnJoin, @enableBoosts, @enableLeave);");

		let chanset = client.getChSett.get(member.guild.id)
		let guildset = client.getGuSett.get(member.guild.id)
		let roleset = client.getRoSett.get(member.guild.id)
		
		if(!guildset) {
			guildset = { guildID: member.guild.id, enableLogging: 'false', enableWelcome: 'false', enableXP: 'false', enableRoleOnJoin: 'false', enableBoosts: 'false', enableLeave: 'true' }
			client.setGuSett.run(guildset);
		}

		if(guildset.enableLogging === 'true') {
			var logsID = chanset.loggingChannel

			const embed = new MessageEmbed()
				.setAuthor('Member Joined | '+user.username, user.avatarURL())
				.setColor(embedColor)
				.addField('User Created', '<t:'+Math.floor(new Date(user.createdAt).getTime() / 1000)+'>', true)
				.addField('@mention', '<@'+user.id+'>', true)
				.setFooter('User ID '+ user.id+' | Join Date/Time: ')
				.setTimestamp();
			client.channels.cache.get(logsID).send({ embeds: [embed] })
		}
		if(guildset.enableWelcome === 'true') {
			var welcomeID = chanset.welcomeChannel;

			const embed2 = new MessageEmbed()
				.setAuthor('Welcome | '+user.username, user.avatarURL())
				.setColor(embedColor)
				.setDescription('Welcome to '+member.guild.name+' <@'+user.id+'>')
				/*.setDescription('Hello <@'+member.id+'> and welcome to Lockyz Dev.\nWe hope you enjoy your stay in our amazing server.\n\nMake sure to read the <#872687574592942110> before doing anything.')
				.addField('Useful Channels', '\u200B')
				.addField('Info Category', '<#873411946613973003> for our products\n<#872687574592942110> for rules\n<#595881825688092672> for roles\n<#864321208094425108> for Known Issues with Our Bots')
				.addField('Announcements', '<#750291755001315360> for General Announcements and New/Updated Products\n<#857615516876275732> for polls\n<#896250169090273290> for Spoilers')
				.setFooter('JoiBoi Welcome System Private Beta')*/
				.setTimestamp();
			client.channels.cache.get(welcomeID).send({ embeds: [embed2] })
			return;
		}
		if(guildset.enableRoleOnJoin === 'true') {
			var memberRole = roleset.memberRole

			member.roles.add(memberRole, 'LMB automatic Role on Join feature')
		}
	}
}