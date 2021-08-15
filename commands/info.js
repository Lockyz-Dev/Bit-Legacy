const { MessageEmbed } = require("discord.js");
const { embedColor, prefix, base, dev, commby, bName, supportS, description } = require("../info.js");
const { noBotPerms } = require("../utils/errors");
const Discord = require("discord.js");

exports.run = async (client, message, args) => {

    let perms = message.guild.me.permissions;
    if (!perms.has("EMBED_LINKS")) return noBotPerms(message, "EMBED_LINKS");
    message.delete(1000);
    var d = new Date();
    var n = d.getFullYear();
    const infoEmbed = new MessageEmbed()
        .setTitle(bName)
        .setDescription(description)
        .setColor(embedColor)
        .addField("Support", supportS)
        .addField("Base Version", base)
        .addField("Developer", dev)
        .setFooter("©2020-"+n+" Lockyz Dev");
    message.channel.send(infoEmbed);
};

exports.help = {
    name: "info",
    aliases: ["botinfo"],
    description: "View bot information.",
    usage: "info",
    premium: "false",
    metrics: "true",
    category: "info",
    datause: "false"
};