const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');
const ms = require("ms");
const locale = require('../locale/en-US.json')

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
                        content: '⚠️ **LAST CHANCE TO ENTER !** ⚠️',
                        threshold: 5000,
                        embedColor: '#FF0000'
                    }
                }).then((gData) => {
                    interaction.reply({ content: 'Giveaway Started! '})
                })
            } else if (interaction.options.getSubcommand() === 'end') {
                const messageId = interaction.options.getString('message_id')
                const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === interaction.options.getString('message_id'))
                
                if(!giveaway){
                    interaction.reply({ content: 'Unable to find the giveaway you\'re looking for.'})
                    return;
                }

                client.giveawaysManager.end(messageId).then(() => {
                    interaction.reply({ content: 'Success! Giveaway Ended!' });
                }).catch((err) => {
                    interaction.reply({ content: 'An error has occured, please try again\n`'+err+'`'})
                })
            } else if(interaction.options.getSubcommand() === 'pause') {
                const messageId = interaction.options.getString('message_id')
                const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === interaction.options.getString('message_id'))
                
                if(!giveaway){
                    interaction.reply({ content: 'Unable to find the giveaway you\'re looking for.'})
                    return;
                }

                client.giveawaysManager.pause(messageId).then(() => {
                    interaction.reply({ content: 'Success! Giveaway Paused!' });
                }).catch((err) => {
                    interaction.reply({ content: 'An error has occured, please try again\n`'+err+'`'})
                })
            } else if(interaction.options.getSubcommand() === 'unpause') {
                const messageId = interaction.options.getString('message_id')
                const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === interaction.options.getString('message_id'))
                
                if(!giveaway){
                    interaction.reply({ content: 'Unable to find the giveaway you\'re looking for.'})
                    return;
                }

                client.giveawaysManager.unpause(messageId).then(() => {
                    interaction.reply({ content: 'Success! Giveaway Unpaused!' });
                }).catch((err) => {
                    interaction.reply({ content: 'An error has occured, please try again\n`'+err+'`'})
                })
            } else if(interaction.options.getSubcommand() === 'reroll') {
                const messageId = interaction.options.getString('message_id')

                const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === interaction.options.getString('message_id'))
                
                if(!giveaway){
                    interaction.reply({ content: 'Unable to find the giveaway you\'re looking for.'})
                    return;
                }

                client.giveawaysManager.reroll(messageId).then(() => {
                    interaction.reply({ content: 'Success! Giveaway Rerolled!' });
                }).catch((err) => {
                    interaction.reply({ content: 'An error has occured, please try again\n`'+err+'`'})
                })
            }
        } else {
            interaction.reply({ content: 'You don\'t have permission to use this command' })
        }
	}
};
