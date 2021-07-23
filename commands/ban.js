const { embedColor } = require('../info.js');
const { MessageEmbed } = require('discord.js');
const { noBotPerms } = require('../utils/errors');

exports.run = async (client, message, args) => {

  let perms = message.guild.me.permissions;
  if (!perms.has('BAN_MEMBERS')) return noBotPerms(message, 'BAN_MEMBERS');

  const table2 = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'roleSettings';").get();
	client.getroleSet = sql.prepare("SELECT * FROM roleSettings WHERE guildID = ?");
    client.setroleSet = sql.prepare("INSERT OR REPLACE INTO roleSettings (guildID, adminID, modID, muteID, autoID) VALUES (@guildID, @adminID, @modID, @muteID, @autoID);");
    
	let roleSet;
	
	roleSet = client.getroleSet.get(guild.id);

  if(message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR') || message.member.roles.has(roleSet.adminID)) {

    let member = message.mentions.members.first();
  
    if(!member)
  
    return message.channel.send("Please mention a valid member of this server")
  
    if(!member.bannable) 
  
    return message.channel.send("I cannot ban this user! Do they have a higher role? Do I have ban permissions?")
  
    let reason = args.slice(1).join(' ');
  
    if(!reason) reason = "No reason provided";
  
    message.guild.members.ban(member, {reason: `${reason}`})
  
      .catch(error => message.channel.send(`Sorry ${message.author} I couldn't ban because of : ${error}`)
    );

      message.channel.send(`${member} has been banned by **${message.author.username}** for \`${reason}\``)
    /*const statsEmbed = new MessageEmbed()
        .setAuthor(`Ban | ${member.user.tag}`, member.user.displayAvatarURL())
        .setColor(embedColor)
        .addField(`Banned By:`, message.author, true)
        .addField(`Reason:`, reason, true)
        .setFooter(`ID: ${member.id}`)
        .setTimestamp();
      client.channels.cache.get(`697496140563742731`).send(statsEmbed);*/
    }
    else {
      message.channel.send(`You don't have the permission to use this command`)
    }
};

exports.help = {
    name: 'ban',
    aliases: [],
    description: 'Ban User for Reason',
    usage: 'ban {User} {Reason}',
    premium: 'false',
    metrics: 'true',
    category: 'moderation'
};