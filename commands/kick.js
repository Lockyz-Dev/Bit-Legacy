const { embedColor } = require("../info.js");
const { MessageEmbed } = require("discord.js");
const { noBotPerms } = require("../utils/errors");

exports.run = async (client, message, args) => {

  let perms = message.guild.me.permissions;
  if (!perms.has("KICK_MEMBERS")) return noBotPerms(message, "KICK_MEMBERS");

  const table2 = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'roleSettings';").get();
	client.getroleSet = sql.prepare("SELECT * FROM roleSettings WHERE guildID = ?");
  client.setroleSet = sql.prepare("INSERT OR REPLACE INTO roleSettings (guildID, adminID, modID, muteID, autoID) VALUES (@guildID, @adminID, @modID, @muteID, @autoID);");
    
	let roleSet;
	
	roleSet = client.getroleSet.get(guild.id);

  if(message.member.hasPermission("KICK_MEMBERS") || message.member.hasPermission("ADMINISTRATOR") || message.member.roles.has(roleSet.adminID)) {

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if(!member)

    return message.channel.send("Please mention a valid member of this server")

    if(!member.kickable) 

    return message.channel.send("I cannot kick this user! Do they have a higher role? Do I have kick permissions?")

    let reason = args.slice(1).join(" ");

    if(!reason) reason = "No reason provided";

    member.kick(reason)

      .catch(error => message.channel.send(`Sorry ${message.author} I couldn"t kick because of : ${error}`)
    );

    message.channel.send(`${member} has been kicked by **${message.author.username}** for \`${reason}\``)

    const statsEmbed = new MessageEmbed()
        .setAuthor(`Kick | ${member.user.tag}`, member.user.displayAvatarURL())
        .setColor(embedColor)
        .addField(`Kicked By:`, message.author, true)
        .addField(`Reason:`, reason, true)
        .setFooter(`ID: ${member.id}`)
        .setTimestamp();
    client.channels.cache.get(`697496140563742731`).send(statsEmbed);
  }
  else {
    message.channel.send("You don\"t have permission to use this command")
  }
};

exports.help = {
    name: "kick",
    aliases: [],
    description: "Kick user for a specified reason.",
    usage: "kick {user} [Reason]",
    category: "moderation",
    datause: "false"
};