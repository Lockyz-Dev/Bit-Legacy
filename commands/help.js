const { MessageEmbed } = require('discord.js');
const { embedColor, prefix } = require('../info.js');
const { noBotPerms } = require('../utils/errors');

exports.run = async (client, message, args) => {

    let perms = message.guild.me.permissions;
    if (!perms.has('EMBED_LINKS')) return noBotPerms(message, 'EMBED_LINKS');

    let cmds = Array.from(client.commands.keys());
    let cmd = args[0];

    let cmdName = client.commands.get('help', 'help.name');

    if (cmd) {

        let cmdObj = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
        if (!cmdObj) return;
        let cmdHelp = cmdObj.help;

        let cmdHelpEmbed = new MessageEmbed()
            .setTitle(`${cmdHelp.name} | Help Information`)
            .setDescription(cmdHelp.description)
            .addField('Usage', `\`${cmdHelp.usage}\``, true)
            .addField('Category', cmdHelp.category, true)
            .setColor(embedColor);

        if (cmdHelp.aliases.length) cmdHelpEmbed.addField('Aliases', `\`${cmdHelp.aliases.join(', ')}\``, true);

        message.author.send(cmdHelpEmbed);
        message.channel.send('Sent to you in a DM')
        return;
    }

    const helpCmds = cmds.map(cmd => {
        return '`' + cmd + '`';
    });
    let categories = Array.from(client.categories.keys());
    const helpCats = categories.map(category => {
        return '`' + category + '`';
    });
    let funCat = Array.from(client.categories.fun.keys());
    const funCmds = funCat.map(fun => {
        return '`' + fun + '`';
    });
    let modCat = Array.from(client.categories.moderation.keys());
    const modCmds = modCat.map(mod => {
        return '`' + mod + '`';
    });
    let infoCat = Array.from(client.categories.info.keys());
    const infoCmds = infoCat.map(info => {
        return '`' + info + '`';
    });
    let levCat = Array.from(client.categories.level.keys());
    const levCmds = levCat.map(lev => {
        return '`' + lev + '`';
    });
    let setCat = Array.from(client.categories.settings.keys());
    const setCmds = setCat.map(set => {
        return '`' + set + '`';
    });
    let gwayCat = Array.from(client.categories.giveaway.keys());
    const gwayCmds = gwayCat.map(gway => {
        return '`' + gway + '`';
    });

    const helpEmbed = new MessageEmbed()
        .setTitle('Help Information')
        .setDescription(`View help information for ${client.user}. \n (Do \`${prefix + cmdName} <command>\` for specific help information).`)
        .addField('Current Prefix', prefix)
        .addField('Current Categories', helpCats.join(' | '))
        .addField('Fun Commands', funCmds.join(' | '))
        .addField('Moderation Commands', modCmds.join(' | '))
        .addField('Info Commands', infoCmds.join(' | '))
        .addField('Level Commands', levCmds.join(' | '))
        .addField('Settings Commands', setCmds.join(' | '))
        .addField('Giveaway Commands', gwayCmds.join(' | '))
        //.addField('Found an issue?', `Please report any issues to <@${owner}> via the Support Discord.`)
        .setColor(embedColor);
    message.author.send(helpEmbed);
    message.channel.send('Sent to you in a DM')
    message.delete(1000);
    return;
};

exports.help = {
    name: 'help',
    aliases: ['h', 'halp'],
    description: 'View all commands and where to receive bot support.',
    usage: 'help',
    premium: 'false',
    metrics: 'false',
    category: 'info'
};