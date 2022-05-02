const { SlashCommandBuilder } = require('@discordjs/builders');
const locale = require('../locale/en-US.json')
const { Permissions, MessageEmbed, InviteGuild } = require('discord.js')
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('settings')
		.setDescription('Change settings')
        .addSubcommandGroup((group) =>
            group
                .setName('user_settings')
                .setDescription('User Settings')
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('privacy_settings')
                        .setDescription('Privacy Settings')
                        .addStringOption((option) =>
                            option
                                .setName('user_access')
                                .setDescription('Allow other users access to your userinfo?')
                                .addChoice('True', 'true')
                                .addChoice('False', 'false')
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('other_settings')
                        .setDescription('Just a collection of settings that we couldnt fit into a category.')
                        .addStringOption((option) =>
                            option
                                .setName('level_notifications')
                                .setDescription('Notifications on new level within the XP Module.')
                                .addChoice('True', 'true')
                                .addChoice('False', 'false')
                                .setRequired(true)
                        )
                        .addStringOption((option) =>
                            option
                                .setName('show_news')
                                .setDescription('Show bot news at the bottom of command outputs?')
                                .addChoice('True', 'true')
                                .addChoice('False', 'false')
                                .setRequired(true)
                        )
                )
            )
            .addSubcommandGroup((group) =>
                group
                    .setName('guild_settings')
                    .setDescription('Various Guild Settings')
                    .addSubcommand((subcommand) =>
                        subcommand
                            .setName('channel_settings')
                            .setDescription('Guild channel settings')
                            .addChannelOption((option) =>
                                option
                                    .setName('logging_channel')
                                    .setDescription('The channel you want to use for bot logs.')
                            )
                            .addChannelOption((option) =>
                                option
                                    .setName('welcome_channel')
                                    .setDescription('The channel in which to welcome new members.')
                            )
                    )
                    .addSubcommand((subcommand) =>
                        subcommand
                            .setName('feature_toggle')
                            .setDescription('Toggle each module that can currently be toggled')
                            .addStringOption((option) =>
                                option
                                    .setName('toggle_logging')
                                    .setDescription('Toggle the moderation logs. (Requires a channel set.)')
                                    .addChoice('True', 'true')
                                    .addChoice('False', 'false')
                            )
                            .addStringOption((option) =>
                                option
                                    .setName('toggle_welcome')
                                    .setDescription('Change whether the bot welcomes new members. (Requires a channel set.)')
                                    .addChoice('True', 'true')
                                    .addChoice('False', 'false')
                            )
                            .addStringOption((option) =>
                                option
                                    .setName('toggle_xp')
                                    .setDescription('Change whether the bot awards users XP each message.')
                                    .addChoice('True', 'true')
                                    .addChoice('False', 'false')
                            )
                            .addStringOption((option) =>
                                option
                                    .setName('toggle_role_on_join')
                                    .setDescription('Change whether the bot gives new members a role. (Requires a role set.)')
                                    .addChoice('True', 'true')
                                    .addChoice('False', 'false')
                            )
                    )
                    .addSubcommand((subcommand) =>
                        subcommand
                            .setName('role_settings')
                            .setDescription('Guild Role Settings')
                            .addRoleOption((option) =>
                                option
                                    .setName('member_role')
                                    .setDescription('The role to give new members.')
                                    .setRequired(true)
                            )
                    )
            )
        ,
	async execute(interaction) {
        const client = interaction.client

		const chTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'channelSettings';").get();
		client.getChSett = sql.prepare("SELECT * FROM channelSettings WHERE guildID = ?");
		client.setChSett = sql.prepare("INSERT OR REPLACE INTO channelSettings (guildID, loggingChannel, welcomeChannel) VALUES (@guildID, @loggingChannel, @welcomeChannel);");

		const guSettTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'guildFeatures';").get();
		client.getGuSett = sql.prepare("SELECT * FROM guildFeatures WHERE guildID = ?");
		client.setGuSett = sql.prepare("INSERT OR REPLACE INTO guildFeatures (guildID, enableLogging, enableWelcome, enableXP, enableRoleOnJoin) VALUES (@guildID, @enableLogging, @enableWelcome, @enableXP, @enableRoleOnJoin);");

		const roSettTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'roleSettings';").get();
        client.getRoSett = sql.prepare("SELECT * FROM roleSettings WHERE guildID = ?");
        client.setRoSett = sql.prepare("INSERT OR REPLACE INTO roleSettings (guildID, memberRole) VALUES (@guildID, @memberRole);");

		const usSettTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'userSettings';").get();
        client.getUsSett = sql.prepare("SELECT * FROM userSettings WHERE userID = ?");
        client.setUsSett = sql.prepare("INSERT OR REPLACE INTO userSettings (userID, userAccess, levelNotifications, showNews) VALUES (@userID, @userAccess, @levelNotifications, @showNews);");

        if(interaction.options.getSubcommandGroup() === 'user_settings') {
            if(interaction.options.getSubcommand() === 'privacy_settings') {
                const userAccess = interaction.options.getString('user_access')
                let userset = client.getUsSett.get(interaction.user.id)
                var showNuus;
                var showLeevels;
                var userAccuss;

                if(userAccess) {
                    userAccuss = userAccess
                    interaction.reply({ content: 'Your changes have now been applied.', ephemeral: true })
                }

                if(!userset) {
                    showNuus = 'true';
                    showLeevels = 'true';
                } else {
                    showNuus = userset.showNews;
                    showLeevels = userset.levelNotifications;
                }

                userset = { userID: interaction.user.id, userAccess: userAccuss, levelNotifications: showLeevels, showNews: showNuus}
                client.setUsSett.run(userset);
            }
            if(interaction.options.getSubcommand() === 'other_settings') {
                const showNews = interaction.options.getString('show_news')
                const levelNotifs = interaction.options.getString('level_notifications')
                let userset = client.getUsSett.get(interaction.user.id)
                var showNuus;
                var showLeevels;
                var userAccuss;

                const embed = new MessageEmbed()
                    .setTitle('User Settings')

                if(showNews) {
                    showNuus = showNews;
                    embed.addField('Show News on command outputs', showNuus, true)
                } else {
                    if(!userset) {
                        showNuus = 'false';
                        embed.addField('Show News on command outputs', 'False', true)
                    } else {
                        showNuus = userset.showNews;
                        embed.addField('Show News on command outputs', showNuus, true)
                    }
                }

                if(levelNotifs) {
                    showLeevels = levelNotifs;
                    embed.addField('Show notifications on Level Up', showLeevels, true)
                } else {
                    if(!userset) {
                        showLeevels = false;
                        embed.addField('Show notifications on Level Up', 'False', true)
                    } else {
                        showLeevels = userset.levelNotifications
                        embed.addField('Show notifications on Level Up', showLeevels, true)
                    }
                }
                
                if(!userset) {
                    userAccuss = 'false'
                } else {
                    userAccuss = userset.userAccess;
                }
                embed.addField('Can other users access your basic user information?', userAccuss, true)

                userset = { userID: interaction.user.id, userAccess: userAccuss, levelNotifications: showLeevels, showNews: showNuus}
                client.setUsSett.run(userset)
                interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }
        if(interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) || interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) ) {
            if(interaction.options.getSubcommandGroup() === 'guild_settings') {
                if(interaction.options.getSubcommand() === 'channel_settings') {
                    const logsChannel = interaction.options.getChannel('logging_channel')
                    const welcomeChannel = interaction.options.getChannel('welcome_channel')
                    let chanset = client.getChSett.get(interaction.guild.id)
                    var loogChan;
                    var weelcChan;

                    if(!chanset) {
                        chanset = { guildID: interaction.guild.id, loggingChannel: 'a', welcomeChannel: 'a' };
                        client.setChSett.run(chanset);
                    }

                    if(logsChannel) {
                        loogChan = logsChannel.id;
                    } else {
                        loogChan = 'a';
                    }

                    if(welcomeChannel) {
                        weelcChan = welcomeChannel.id;
                    } else {
                        weelcChan = 'a';
                    }

                    chanset = { guildID: interaction.guild.id, loggingChannel: loogChan, welcomeChannel: weelcChan };
                    client.setChSett.run(chanset);
                    interaction.reply({ content: 'Done!', ephemeral: true })
                }
                if(interaction.options.getSubcommand() === 'feature_toggle') {
                    const togLog = interaction.options.getString('toggle_logging')
                    const togWelc = interaction.options.getString('toggle_welcome')
                    const togXp = interaction.options.getString('toggle_xp')
                    const togRoj = interaction.options.getString('toggle_role_on_join')

                    var tooLog;
                    var tooWelc;
                    var tooXP;
                    var tooROJ;

                    let guildset = client.getGuSett.get(interaction.guild.id)

                    if(togLog) {
                        tooLog = togLog;
                    } else {
                        if(!guildset) {
                            tooLog = 'false';
                        } else {
                            tooLog = guildset.enableLogging;
                        }
                    }

                    if(togWelc) {
                        tooWelc = togWelc;
                    } else {
                        if(!guildset) {
                            tooLog = 'false';
                        } else {
                            tooLog = guildset.enableWelcome;
                        }
                    }

                    if(togXp) {
                        tooXP = togLog;
                    } else {
                        if(!guildset) {
                            tooLog = 'false';
                        } else {
                            tooLog = guildset.enableXP;
                        }
                    }

                    if(togRoj) {
                        tooROJ = togRoj;
                    } else {
                        if(!guildset) {
                            tooLog = 'false';
                        } else {
                            tooLog = guildset.enableRoleOnJoin;
                        }
                    }

                    guildset = { guildID: interaction.guild.id, enableLogging: tooLog, enableWelcome: tooWelc, enableXP: tooXP, enableRoleOnJoin: tooROJ };
                    client.setGuSett.run(guildset);
                    interaction.reply({ content: 'Done!', ephemeral: true })
                }
                if(interaction.options.getSubcommand() === 'role_settings') {
                    const memberRole = interaction.options.getRole('member_role')
                    let roleset = client.getRoSett.get(interaction.guild.id)
                    var loogChan;

                    if(!roleset) {
                        roleset = { guildID: interaction.guild.id, memberRole: 'a' }
                        client.setRoSett.run(roleset);
                    }

                    if(memberRole) {
                        loogChan = memberRole.id;
                    } else {
                        loogChan = 'a';
                    }

                    roleset = { guildID: interaction.guild.id, memberRole: loogChan };
                    client.setRoSett.run(roleset);
                    interaction.reply({ content: 'Done!', ephemeral: true })
                }
            }
        }
    }
};
