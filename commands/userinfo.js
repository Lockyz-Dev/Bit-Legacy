const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../info.js');
const { noBotPerms } = require('../utils/errors');
const Discord = require('discord.js');

exports.run = async (client, message, args) => {

    let perms = message.guild.me.permissions;
    if (!perms.has('EMBED_LINKS')) return noBotPerms(message, 'EMBED_LINKS');

    const taggedUser = message.mentions.users.first();

    var user;

    if(!message.mentions.users.size) {
        user = message.author.username
    } else {
        user = taggedUser.username
    }

    const table3 = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'userSettings';").get();
	client.getuserSet = sql.prepare("SELECT * FROM userSettings WHERE userID = ?");
    client.setuserSet = sql.prepare("INSERT OR REPLACE INTO userSettings (userID, metrics, levels, news, levelNotifs, dataCollect) VALUES (@userID, @metrics, @levels, @news, @levelNotifs, @dataCollect);");
    
	let userSet;
	
	userSet = client.getuserSet.get(user.id);

	if(!userSet) {
		userSet = { userID: user.id, metrics: "true", levels: 'true', news: 'true', levelNotifs: 'true', dataCollect: 'false' };
		client.setuserSet.run(userSet);
	}

    if(userSet.dataCollect === 'false') {
        message.channel.send('Command could not be executed due to data collection being disabled.')
        return;
    }
    
    const statsEmbed = new MessageEmbed()
      .setTitle('User Info')
      .setAuthor(client.user.username, client.user.avatarURL())
      .setColor(embedColor)
      .setThumbnail(user.avatarURL())
      .addField(`Username`, user.username, true)
      if(member.nickname != null) {
        statsEmbed.addField(`Nickname`, member.nickname, true)
      } else {
        statsEmbed.addField(`Nickname`, 'None', true)
      }
      //.addField(`Nickname`, member.nickname, true)
      statsEmbed.addField(`ID`, user.id, true)
      statsEmbed.addField(`Created`, user.createdAt, true)
      statsEmbed.addField(`Bot?`, user.bot, true)
      statsEmbed.addField(`Presence Status`, user.presence.status)
      statsEmbed.addField(`Joined`, member.joinedAt, true)
      statsEmbed.addField(`Roles`, member.roles.cache.map(r => `${r}`).join(' | '), true)
      statsEmbed.setTimestamp();
    message.channel.send(statsEmbed);
};

exports.help = {
    name: 'userinfo',
    aliases: ['ui'],
    description: 'View user information.',
    usage: 'userinfo {mention}',
    premium: 'false',
    metrics: 'true',
    category: 'info',
    datause: 'true'
};