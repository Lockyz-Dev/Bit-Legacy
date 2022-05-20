const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');
const ms = require("ms");
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('giveaway')
		.setDescription('Giveaway Manager, create, edit, end, etc giveaways.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Create Giveaways')
                .addStringOption((option) => 
			        option
				        .setName('duration')
				        .setDescription('How long you\'d like the giveaway to run for (ex. 7D for 7 days).')
				        .setRequired(true)
		        )
                .addIntegerOption((option) =>
                    option
                        .setName('winners')
                        .setDescription('The number of winners you want')
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('prize')
                        .setDescription('The thing you want to give away')
                        .setRequired(true)
                )
                .addChannelOption((option) =>
                    option
                        .setName('channel')
                        .setDescription('The channel you want to start the giveaway in')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('end')
                .setDescription('End a currently running giveaway.')
                .addStringOption((option) =>
                    option
                        .setName('message_id')
                        .setDescription('The giveaways message ID')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('pause')
                .setDescription('Pause a currently running giveaway.')
                .addStringOption((option) =>
                    option
                        .setName('message_id')
                        .setDescription('The giveaways message ID')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('unpause')
                .setDescription('Unpause a currently paused giveaway.')
                .addStringOption((option) =>
                    option
                        .setName('message_id')
                        .setDescription('The giveaways message ID')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('reroll')
                .setDescription('Reroll an ended giveaway.')
                .addStringOption((option) =>
                    option
                        .setName('message_id')
                        .setDescription('The giveaways message ID')
                        .setRequired(true)
                )
        ),
	async execute(interaction) {
        const client = interaction.client
        const member = interaction.member
        var lan = 'en'
        client.getUsSett = sql.prepare("SELECT * FROM userSettings WHERE userID = ?");
        let userset = client.getUsSett.get(interaction.user.id)

        if(userset) {
            if(userset.language) {
                lan = userset.language;
            }
        }
        const locale = require('../locale/'+lan+'.json')

        if(member.roles.cache.some(role => role.name === 'Giveaway Manager') || member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            if(interaction.options.getSubcommand() === 'create') {
                const duration = interaction.options.getString('duration');
                const winnerCount = interaction.options.getInteger('winners');
                const prize = interaction.options.getString('prize');
                const gChannel = interaction.options.getChannel('channel');

                client.giveawaysManager.start(gChannel, {
                    duration: ms(duration),
                    winnerCount,
                    prize,
                    botsCanWin: false,
                    lastChance: {
                        enabled: true,
                        content: locale.giveawayLastChance,
                        threshold: 5000,
                        embedColor: '#FF0000'
                    }
                }).then((gData) => {
                    interaction.reply({ content: locale.giveawayStarted})
                })
            } else if (interaction.options.getSubcommand() === 'end') {
                const messageId = interaction.options.getString('message_id')
                const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === interaction.options.getString('message_id'))
                
                if(!giveaway){
                    interaction.reply({ content: locale.giveawayNotFound })
                    return;
                }

                client.giveawaysManager.end(messageId).then(() => {
                    interaction.reply({ content: locale.giveawayEndCommand });
                }).catch((err) => {
                    interaction.reply({ content: locale.errorDefault.replace('{error}', err)})
                })
            } else if(interaction.options.getSubcommand() === 'pause') {
                const messageId = interaction.options.getString('message_id')
                const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === interaction.options.getString('message_id'))
                
                if(!giveaway){
                    interaction.reply({ content: locale.giveawayNotFound })
                    return;
                }

                client.giveawaysManager.pause(messageId).then(() => {
                    interaction.reply({ content: locale.giveawayPauseCommand });
                }).catch((err) => {
                    interaction.reply({ content: locale.errorDefault.replace('{error}', err)})
                })
            } else if(interaction.options.getSubcommand() === 'unpause') {
                const messageId = interaction.options.getString('message_id')
                const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === interaction.options.getString('message_id'))
                
                if(!giveaway){
                    interaction.reply({ content: locale.giveawayNotFound})
                    return;
                }

                client.giveawaysManager.unpause(messageId).then(() => {
                    interaction.reply({ content: locale.giveawayUnpauseCommand });
                }).catch((err) => {
                    interaction.reply({ content: locale.errorDefault.replace('{error}', err)})
                })
            } else if(interaction.options.getSubcommand() === 'reroll') {
                const messageId = interaction.options.getString('message_id')

                const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === interaction.options.getString('message_id'))
                
                if(!giveaway){
                    interaction.reply({ content: locale.giveawayNotFound})
                    return;
                }

                client.giveawaysManager.reroll(messageId).then(() => {
                    interaction.reply({ content: locale.giveawayRerollCommand });
                }).catch((err) => {
                    interaction.reply({ content: locale.errorDefault.replace('{error}', err)})
                })
            }
        } else {
            interaction.reply({ content: locale.noPermission })
        }
	}
};
