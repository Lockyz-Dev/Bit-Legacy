const { MessageEmbed } = require('discord.js');
const { noBotPerms } = require('../utils/errors');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

exports.run = async (client, message, args) => {

        if(message.author.id === '835394949612175380') {
            if(args[0] === 'cmdInfo') {
                let cmd = args[1];
                let cmdObj = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
                if (!cmdObj) return;
                let cmdHelp = cmdObj.help;
            
                let perms = message.guild.me.permissions;
                if (!perms.has('EMBED_LINKS')) return noBotPerms(message, 'EMBED_LINKS');
            
                const table4 = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'commandInfo';").get();
                client.getcmdInfo = sql.prepare("SELECT * FROM commandInfo WHERE commandName = ?");
                client.setcmdInfo = sql.prepare("INSERT OR REPLACE INTO commandInfo (commandName, enabled) VALUES (@commandName, @enabled);");
                
                let cmdInfo;
                
                cmdInfo = client.getcmdInfo.get(cmdHelp.name);
            
                if(!cmdInfo) {
                    cmdInfo = { commandInfo: cmdHelp.name, enabled: "true" };
                    client.setcmdInfo.run(cmdInfo);
                }

                if(args[2] === 'true') {
                    cmdInfo = { commandInfo: cmdHelp.name, enabled: 'true' };
                    client.setcmdInfo.run(cmdInfo);
                    message.channel.send(cmdHelp.name+' has been enabled')
                } else if(args[2] === 'false') {
                    cmdInfo = { commandInfo: cmdHelp.name, enabled: 'false' };
                    client.setcmdInfo.run(cmdInfo);
                    message.channel.send(cmdHelp.name+' has been disabled')
                } else if(args[2] === 'view') {
                    var cmdStatus
                    if(cmdInfo.enabled === 'true') {
                        cmdStatus = 'enabled'
                    } else {
                        cmdStatus = 'disabled'
                    }
                    message.channel.send(cmdHelp.name+' is '+ cmdStatus)
                }
                else {
                    message.channel.send('You can only enter `true`, `false` or `view`')
                }
            }
            if(args[0] === 'stop'){
                client.logger.log('Bot shutting down...');
                client.user.setStatus('offline')
                .then(console.log)
                .catch(console.error);
                client.destroy(() => {
                    client.logger.log('Bot has shut down.');
                    process.exit(0);
                });
            }
            else {
                let devOptions = new MessageEmbed()
                    .setTitle(`Dev Options | List`)
                    .setDescription('Use this command to change various bot options.')
                    .addField('cmdInfo', 'Enable/Disable Commands', true)
                    .addField('stop', 'Causes the bot to shut down.', true)
                    .setColor(128, 128, 128);
                message.channel.send(devOptions)
            }
        } else {
            message.channel.send('You do NOT have permission to use this command.')
        }
};

exports.help = {
    name: 'dev',
    aliases: [],
    description: 'Toggle Developer Settings (Developer use ONLY).',
    usage: 'dev {Option}',
    premium: 'false',
    metrics: 'false',
    category: 'settings',
    datause: 'false'
};