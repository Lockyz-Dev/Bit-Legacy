const { MessageEmbed } = require("discord.js");
const { embedColor } = require("../info.js");
const { noBotPerms } = require("../utils/errors");
const Discord = require("discord.js");

exports.run = async (client, message, args) => {

    let perms = message.guild.me.permissions;
    if (!perms.has("EMBED_LINKS")) return noBotPerms(message, "EMBED_LINKS");

    message.delete(1000);
    var roll = [
      "Yes",
      "No",
      "Likely",
      "Not Likely",
      "I can't give an answer now"
  ]
    const sayMessage = args.join(" ");
    if(!sayMessage) {
    return message.channel.send("You didn't ask a question")}
    var randomAnswer = roll[Math.floor(Math.random() * roll.length)];
    const infoEmbed = new MessageEmbed()
	    .setAuthor(client.user.username, client.user.avatarURL())
        .setTitle("8ball")
        .addField(`${sayMessage}`, `${randomAnswer}`)
	    .setColor(embedColor)
	    .setTimestamp();
    message.channel.send(infoEmbed);
};

exports.help = {
    name: "8ball",
    aliases: [],
    description: "Get the answer to a yes or no question from the all wise magic 8ball.",
    usage: "8ball {question}",
    premium: "false",
    metrics: "true",
    category: "fun",
    datause: "false"
};