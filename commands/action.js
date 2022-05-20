const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');
const ms = require("ms");
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('action')
		.setDescription('Do various actions through the bot')
        .addSubcommand(subcommand =>
            subcommand
                .setName('hug')
                .setDescription('Hug another user')
                .addUserOption((option) => 
			        option
				        .setName('user')
				        .setDescription('The user you wanna hug.')
				        .setRequired(true)
		        )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('stab')
                .setDescription('Stab another user')
                .addUserOption((option) => 
			        option
				        .setName('user')
				        .setDescription('The user you wanna stab.')
				        .setRequired(true)
		        )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('dab')
                .setDescription('Dab on the haters')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('beg')
                .setDescription('Oh please please please give this person something')
                .addStringOption((option) =>
                    option
                        .setName('item')
                        .setDescription('What do you wanna beg for?')
                        .setRequired(false)
                )
                .addUserOption((option) => 
			        option
				        .setName('user')
				        .setDescription('The user you wanna beg.')
				        .setRequired(false)
		        )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('cry')
                .setDescription('Sometimes you JUST gotta cry')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('slap')
                .setDescription('Slap another user')
                .addUserOption((option) => 
			        option
				        .setName('user')
				        .setDescription('The user you wanna slap.')
				        .setRequired(true)
		        )
        )
        ,
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

        //Code goes here, build translation strings as well

        const embed = new MessageEmbed()
        if(interaction.options.getSubcommand() === 'hug') {
            const user = interaction.options.getUser('user')
            embed.setTitle('Hug')
            embed.setDescription(member.user.username+' hugged '+user.username+', cute.')

            interaction.reply({ embeds: [embed]})
        }
        if(interaction.options.getSubcommand() === 'stab') {
            const user = interaction.options.getUser('user')
            embed.setTitle('Stab')
            embed.setDescription(member.user.username+' stabbed '+user.username+', run before they stab you too.')

            interaction.reply({ embeds: [embed]})
        }
        if(interaction.options.getSubcommand() === 'dab') {
            embed.setTitle('Dab')
            embed.setDescription(member.user.username+' just dabbed on them haters, CRINGE.')

            interaction.reply({ embeds: [embed]})
        }
        if(interaction.options.getSubcommand() === 'beg') {
            const user = interaction.options.getUser('user')
            const item = interaction.options.getString('item')

            embed.setTitle('Beg')
            if(!user && !item) {
                embed.setDescription(member.user.username+' just begged.')
            }
            if(item && !user) {
                embed.setDescription(member.user.username+' just begged for '+item+'.')
            }
            if(user && !item) {
                embed.setDescription(member.user.username+' just begged '+user.username+' for something.')
            }
            if(user && item) {
                embed.setDescription(member.user.username+' just begged '+user.username+' for '+item+'.')
            }
            interaction.reply({ embeds: [embed]})
        }
        if(interaction.options.getSubcommand() === 'cry') {
            embed.setTitle('Cry')
            embed.setDescription(member.user.username+' just started crying. Come on, let it all out, it\'s ok to cry.')

            interaction.reply({ embeds: [embed]})
        }
        if(interaction.options.getSubcommand() === 'slap') {
            const user = interaction.options.getUser('user')
            embed.setTitle('Slap')
            embed.setDescription(member.user.username+' slapped '+user.username+', ouch.')

            interaction.reply({ embeds: [embed]})
        }
    }
};
