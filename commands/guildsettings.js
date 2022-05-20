const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed, InviteGuild } = require('discord.js')
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('guildsettings')
		.setDescription('Change Guild settings')
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
                    .addChannelOption((option) =>
                        option
                            .setName('boost_channel')
                            .setDescription('The channel in which to send boost notifications.')
                    )
                    .addChannelOption((option) =>
                        option
                            .setName('leave_channel')
                            .setDescription('The channel in which to send leave notifications.')
                    )
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName('feature_settings')
                    .setDescription('Toggle each module that can currently be toggled')
                    .addStringOption((option) =>
                        option
                            .setName('toggle_logging')
                            .setRequired(true)
                            .setDescription('Toggle the moderation logs. (Requires a channel set.)')
                            .addChoice('True', 'true')
                            .addChoice('False', 'false')
                    )
                    .addStringOption((option) =>
                        option
                            .setName('toggle_welcome')
                            .setRequired(true)
                            .setDescription('Change whether the bot welcomes new members. (Requires a channel set.)')
                            .addChoice('True', 'true')
                            .addChoice('False', 'false')
                    )
                    .addStringOption((option) =>
                        option
                            .setName('toggle_xp')
                            .setRequired(true)
                            .setDescription('Change whether the bot awards users XP each message.')
                            .addChoice('True', 'true')
                            .addChoice('False', 'false')
                    )
                    .addStringOption((option) =>
                        option
                            .setName('toggle_role_on_join')
                            .setRequired(true)
                            .setDescription('Change whether the bot gives new members a role. (Requires a role set.)')
                            .addChoice('True', 'true')
                            .addChoice('False', 'false')
                    )
                    .addStringOption((option) =>
                        option
                            .setName('toggle_boost_notifications')
                            .setRequired(true)
                            .setDescription('Change whether the bot thanks users for boosting. (Requires a channel set.)')
                            .addChoice('True', 'true')
                            .addChoice('False', 'false')
                    )
                    .addStringOption((option) =>
                        option
                            .setName('toggle_leave_notifications')
                            .setRequired(true)
                            .setDescription('Change whether the bot sends leave notifications (Requires a channel set.)')
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
            ),
	async execute(interaction) {
        const client = interaction.client
        var lan = 'en';
        client.getGuSett = sql.prepare("SELECT * FROM guildFeatures WHERE guildID = ?");
        let guildset = client.getGuSett.get(interaction.guild.id)

        client.getUsSett = sql.prepare("SELECT * FROM userSettings WHERE userID = ?");
        let userset = client.getUsSett.get(interaction.user.id)

        if(userset) {
            if(userset.language) {
                lan = userset.language;
            }
        }
        const locale = require('../locale/'+lan+'.json')

		const chTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'channelSettings';").get();
		client.getChSett = sql.prepare("SELECT * FROM channelSettings WHERE guildID = ?");
		client.setChSett = sql.prepare("INSERT OR REPLACE INTO channelSettings (guildID, loggingChannel, welcomeChannel) VALUES (@guildID, @loggingChannel, @welcomeChannel);");

		const guSettTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'guildFeatures';").get();
		client.setGuSett = sql.prepare("INSERT OR REPLACE INTO guildFeatures (guildID, enableLogging, enableWelcome, enableXP, enableRoleOnJoin, enableBoosts, enableLeave) VALUES (@guildID, @enableLogging, @enableWelcome, @enableXP, @enableRoleOnJoin, @enableBoosts, @enableLeave);");

		const roSettTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'roleSettings';").get();
        client.getRoSett = sql.prepare("SELECT * FROM roleSettings WHERE guildID = ?");
        client.setRoSett = sql.prepare("INSERT OR REPLACE INTO roleSettings (guildID, memberRole) VALUES (@guildID, @memberRole);");

        if(interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) || interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) ) {
                if(interaction.options.getSubcommand() === 'channel_settings') {
                    const logsChannel = interaction.options.getChannel('logging_channel')
                    const welcomeChannel = interaction.options.getChannel('welcome_channel')
                    const boostChannel = interaction.options.getChannel('boost_channel')
                    const leaveChannel = interaction.options.getChannel('leave_channel')
                    let chanset = client.getChSett.get(interaction.guild.id)
                    var loogChan;
                    var weelcChan;
                    var beestChan;
                    var leeveChan;

                    if(!chanset) {
                        chanset = { guildID: interaction.guild.id, loggingChannel: 'a', welcomeChannel: 'a', boostChannel: 'a', leaveChannel: 'a' };
                        client.setChSett.run(chanset);
                    }

                    if(logsChannel) {
                        loogChan = logsChannel.id;
                    } else {
                        if(!chanset.loggingChannel) {
                            loogChan = 'a';
                        } else {
                            loogChan = chanset.loggingChannel;
                        }
                    }

                    if(welcomeChannel) {
                        weelcChan = welcomeChannel.id;
                    } else {
                        if(!chanset.welcomeChannel) {
                            weelcChan = 'a';
                        } else {
                            weelcChan = chanset.welcomeChannel;
                        }
                    }

                    if(boostChannel) {
                        beestChan = boostChannel.id;
                    } else {
                        if(!chanset.boostChannel) {
                            beestChan = 'a';
                        } else {
                            beestChan = chanset.boostChannel;
                        }
                    }

                    if(leaveChannel) {
                        leeveChan = leaveChannel.id;
                    } else {
                        if(!chanset.leaveChannel) {
                            leeveChan = 'a';
                        } else {
                            leeveChan = chanset.leaveChannel;
                        }
                    }

                    chanset = { guildID: interaction.guild.id, loggingChannel: loogChan, welcomeChannel: weelcChan, boostChannel: beestChan, leaveChannel: leeveChan };
                    client.setChSett.run(chanset);
                    interaction.reply({ content: 'Done!', ephemeral: true })
                }
                if(interaction.options.getSubcommand() === 'feature_settings') {
                    const togLog = interaction.options.getString('toggle_logging')
                    const togWelc = interaction.options.getString('toggle_welcome')
                    const togXp = interaction.options.getString('toggle_xp')
                    const togRoj = interaction.options.getString('toggle_role_on_join')
                    const togBn = interaction.options.getString('toggle_boost_notifications')
                    const togLn = interaction.options.getString('toggle_leave_notifications')

                    var tooLog;
                    var tooWelc;
                    var tooXP;
                    var tooROJ;
                    var tooBN;
                    var tooLN;

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

                    if(togBn) {
                        tooBN = togBn;
                    } else {
                        if(!guildset) {
                            tooBN = 'false';
                        } else {
                            tooBN = guildset.enableBoosts;
                        }
                    }

                    if(togLn) {
                        tooLN = togLn;
                    } else {
                        if(!guildset) {
                            tooLN = 'false';
                        } else {
                            tooLN = guildset.enableLeave;
                        }
                    }

                    guildset = { guildID: interaction.guild.id, enableLogging: tooLog, enableWelcome: tooWelc, enableXP: tooXP, enableRoleOnJoin: tooROJ, enableBoosts: tooBN, enableLeave: tooLN };
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
};
