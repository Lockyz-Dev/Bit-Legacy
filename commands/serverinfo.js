const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js')
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Get advanced information about the guild you\'re in.'),
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
        const guild = interaction.guild
        
        const embed = new MessageEmbed()
            .setTitle('Server Info')
            .setThumbnail(guild.iconURL())
            if(guild.description != null) {
                embed.setDescription(guild.description)
            }
            //Basic Guild Information
            embed.addField(`Name`, guild.name.toString(), true)
            embed.addField(`ID`, guild.id.toString(), true)
            embed.addField(`Owner`, '<@'+guild.ownerID+'>', true)
            embed.addField(`Verification Level`, guild.verificationLevel.toString(), true)
            embed.addField(`Creation Date`, '<t:'+Math.floor(new Date(guild.createdAt).getTime() / 1000)+'>', true)
            embed.addField(`Is partnered?`, guild.partnered.toString(), true)
            embed.addField(`Is Verified?`, guild.verified.toString(), true)
            if(guild.rulesChannelId != null) {
                embed.addField(`Rules Channel`, '<#'+guild.rulesChannelId.toString()+'>', true)
            }
            //Counts
            embed.addField(`Boost Tier | Count`, `${guild.premiumTier} | ${guild.premiumSubscriptionCount}`, true)
            embed.addField(`Total Users`, guild.memberCount.toString() /*+' | '+guild.members.cache.filter(member => member.user.bot).size+' | '+guild.members.cache.filter(member => !member.user.bot).size*/, true)
            embed.addField(`Total Channels`, guild.channels.cache.size.toString(), true)
            embed.addField(`Roles`, guild.roles.cache.size.toString(), true)
            embed.setTimestamp();
            if(guild.bannerURL != null) {
                embed.setImage(guild.bannerURL())
            }
        interaction.reply({ embeds: [embed] })
	}
};