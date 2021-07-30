const Discord = require('discord.js');

exports.run = async (client, message, args) => {

    if(message.author.id === "100182453812985856") {
    const description = args.join(" ");
    message.delete(1000);
    if(!description)
    return message.channel.send(`You haven't specified a description. Please include a description into your application`)
    let Embed = new Discord.MessageEmbed()
        .setTitle('Poll')
        .setAuthor(`Poll by: ${message.author.username}`)
        .setDescription(`${description}`)
        .addField('Yes', '✅', true)
        .addField('No', '❌', true)
        .setFooter('Poll Created:')
        .setTimestamp()
    message.channel.send(Embed)
    .then(function (message) {
        message.react('✅')
            .then(() => message.react('❌'))
    })
}};

exports.help = {
    name: 'poll',
    aliases: [],
    description: 'Create a Poll',
    usage: 'poll {Description}',
    premium: 'false',
    metrics: 'true',
    category: 'fun',
    datause: 'false'
};