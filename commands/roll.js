const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Roll a dice.')
        .addIntegerOption((option) => 
			option
				.setName('sides')
				.setDescription('The amount of sides on the dice you want to roll (Up to 1000).')
				.setRequired(false)
		)
        .addIntegerOption((option) =>
            option
                .setName('number')
                .setDescription('The amount of dice you want to roll')
                .setRequired(false)
                .addChoices(
                    [
                        ['One', 1],
                        ['Two', 2],
                        ['Three', 3],
                        ['Four', 4],
                        ['Five', 5],
                        ['Six', 6],
                        ['Seven', 7],
                        ['Eight', 8],
                        ['Nine', 9],
                        ['Ten', 10],
                        ['Eleven', 11],
                        ['Twelve', 12],
                        ['Thirteen', 13],
                        ['Fourteen', 14],
                        ['Fifteen', 15],
                        ['Sixteen', 16],
                        ['Seventeen', 17],
                        ['Eighteen', 18],
                        ['Nineteen', 19],
                        ['Twenty', 20],
                    ]
                )
        )
        ,
	async execute(interaction) {
        const client = interaction.client
        var lan = 'en'
        client.getUsSett = sql.prepare("SELECT * FROM userSettings WHERE userID = ?");
        let userset = client.getUsSett.get(interaction.user.id)

        if(userset) {
            if(userset.language) {
                lan = userset.language;
            }
        }
        const locale = require('../locale/'+lan+'.json')
        var soods = 6;
        const sides = interaction.options.getInteger('sides')
        const count = interaction.options.getInteger('number')

        if(!sides) {
            soods = 6;
        } else if(sides > 1000 ) {
            interaction.channel.send(locale.diceFailedTooHigh)
            return;
        } else if(sides < 3) {
            interaction.channel.send(locale.diceFailedTooLow)
        } else if (sides < 1000) {
            soods = sides;
        }

        if(!count) {
            const embed = new MessageEmbed()
                .setTitle(locale.diceEmbedName)
                const roll1 = locale.diceEmbedDescriptionSingle.replace('{sides}', soods.toString())
                .setDescription(roll1.replace('{number}', Math.round(Math.random() * (soods - 1) + 1).toString()))
                .setTimestamp()
            return interaction.channel.send({ embeds: [embed] });
        }  else if(count === 1) {
            const embed = new MessageEmbed()
                .setTitle(diceEmbedName)
                const roll1 = locale.diceEmbedDescriptionSingle.replace('{sides}', soods.toString())
                .setDescription(roll1.replace('{number}', Math.round(Math.random() * (soods - 1) + 1).toString()))
                .setTimestamp()
            return interaction.channel.send({ embeds: [embed] });
        } else if(count === 2) {
            const embed = new MessageEmbed()
                .setTitle(diceEmbedName)
                .setDescription(locale.diceEmbedDescription.replace('{sides}', count.toString()))
                .addField(locale.diceWord+' 1', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 2', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .setTimestamp()
            return interaction.channel.send({ embeds: [embed] });
        } else if(count === 3) {
            const embed = new MessageEmbed()
                .setTitle(diceEmbedName)
                setDescription(locale.diceEmbedDescription.replace('{sides}', count.toString()))
                .addField(locale.diceWord+' 1', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 2', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 3', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .setTimestamp()
            return interaction.channel.send({ embeds: [embed] });
        } else if(count === 4) {
            const embed = new MessageEmbed()
                .setTitle(diceEmbedName)
                setDescription(locale.diceEmbedDescription.replace('{sides}', count.toString()))
                .addField(locale.diceWord+' 1', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 2', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 3', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 4', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .setTimestamp()
            return interaction.channel.send({ embeds: [embed] });
        } else if(count === 5) {
            const embed = new MessageEmbed()
                .setTitle(diceEmbedName)
                setDescription(locale.diceEmbedDescription.replace('{sides}', count.toString()))
                .addField(locale.diceWord+' 1', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 2', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 3', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 4', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 5', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .setTimestamp()
            return interaction.channel.send({ embeds: [embed] });
        } else if(count === 6) {
            const embed = new MessageEmbed()
                .setTitle(diceEmbedName)
                setDescription(locale.diceEmbedDescription.replace('{sides}', count.toString()))
                .addField(locale.diceWord+' 1', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 2', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 3', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 4', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 5', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 6', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .setTimestamp()
            return interaction.channel.send({ embeds: [embed] });
        } else if(count === 7) {
            const embed = new MessageEmbed()
                .setTitle(diceEmbedName)
                setDescription(locale.diceEmbedDescription.replace('{sides}', count.toString()))
                .addField(locale.diceWord+' 1', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 2', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 3', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 4', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 5', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 6', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 7', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .setTimestamp()
            return interaction.channel.send({ embeds: [embed] });
        } else if(count === 8) {
            const embed = new MessageEmbed()
                .setTitle(diceEmbedName)
                setDescription(locale.diceEmbedDescription.replace('{sides}', count.toString()))
                .addField(locale.diceWord+' 1', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 2', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 3', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 4', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 5', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 6', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 7', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 8', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .setTimestamp()
            return interaction.channel.send({ embeds: [embed] });
        } else if(count === 9) {
            const embed = new MessageEmbed()
                .setTitle(diceEmbedName)
                setDescription(locale.diceEmbedDescription.replace('{sides}', count.toString()))
                .addField(locale.diceWord+' 1', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 2', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 3', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 4', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 5', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 6', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 7', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 8', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 9', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .setTimestamp()
            return interaction.channel.send({ embeds: [embed] });
        } else if(count === 10) {
            const embed = new MessageEmbed()
                .setTitle(diceEmbedName)
                setDescription(locale.diceEmbedDescription.replace('{sides}', count.toString()))
                .addField(locale.diceWord+' 1', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 2', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 3', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 4', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 5', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 6', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 7', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 8', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 9', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 10', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .setTimestamp()
            return interaction.channel.send({ embeds: [embed] });
        } else if(count === 11) {
            const embed = new MessageEmbed()
                .setTitle(diceEmbedName)
                setDescription(locale.diceEmbedDescription.replace('{sides}', count.toString()))
                .addField(locale.diceWord+' 1', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 2', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 3', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 4', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 5', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 6', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 7', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 8', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 9', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 10', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 11', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .setTimestamp()
            return interaction.channel.send({ embeds: [embed] });
        } else if(count === 12) {
            const embed = new MessageEmbed()
                .setTitle(diceEmbedName)
                setDescription(locale.diceEmbedDescription.replace('{sides}', count.toString()))
                .addField(locale.diceWord+' 1', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 2', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 3', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 4', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 5', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 6', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 7', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 8', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 9', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 10', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 11', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 12', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .setTimestamp()
            return interaction.channel.send({ embeds: [embed] });
        } else if(count === 13) {
            const embed = new MessageEmbed()
                .setTitle(diceEmbedName)
                setDescription(locale.diceEmbedDescription.replace('{sides}', count.toString()))
                .addField(locale.diceWord+' 1', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 2', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 3', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 4', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 5', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 6', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 7', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 8', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 9', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 10', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 11', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 12', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 13', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .setTimestamp()
            return interaction.channel.send({ embeds: [embed] });
        } else if(count === 14) {
            const embed = new MessageEmbed()
                .setTitle(diceEmbedName)
                setDescription(locale.diceEmbedDescription.replace('{sides}', count.toString()))
                .addField(locale.diceWord+' 1', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 2', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 3', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 4', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 5', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 6', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 7', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 8', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 9', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 10', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 11', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 12', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 13', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 14', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .setTimestamp()
            return interaction.channel.send({ embeds: [embed] });
        } else if(count === 15) {
            const embed = new MessageEmbed()
                .setTitle(diceEmbedName)
                setDescription(locale.diceEmbedDescription.replace('{sides}', count.toString()))
                .addField(locale.diceWord+' 1', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 2', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 3', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 4', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 5', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 6', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 7', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 8', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 9', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 10', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 11', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 12', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 13', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 14', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 15', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .setTimestamp()
            return interaction.channel.send({ embeds: [embed] });
        } else if(count === 16) {
            const embed = new MessageEmbed()
                .setTitle(diceEmbedName)
                setDescription(locale.diceEmbedDescription.replace('{sides}', count.toString()))
                .addField(locale.diceWord+' 1', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 2', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 3', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 4', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 5', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 6', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 7', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 8', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 9', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 10', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 11', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 12', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 13', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 14', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 15', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 16', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .setTimestamp()
            return interaction.channel.send({ embeds: [embed] });
        } else if(count === 17) {
            const embed = new MessageEmbed()
                .setTitle(diceEmbedName)
                setDescription(locale.diceEmbedDescription.replace('{sides}', count.toString()))
                .addField(locale.diceWord+' 1', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 2', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 3', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 4', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 5', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 6', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 7', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 8', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 9', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 10', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 11', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 12', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 13', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 14', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 15', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 16', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 17', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .setTimestamp()
            return interaction.channel.send({ embeds: [embed] });
        } else if(count === 18) {
            const embed = new MessageEmbed()
                .setTitle(diceEmbedName)
                setDescription(locale.diceEmbedDescription.replace('{sides}', count.toString()))
                .addField(locale.diceWord+' 1', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 2', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 3', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 4', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 5', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 6', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 7', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 8', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 9', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 10', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 11', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 12', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 13', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 14', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 15', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 16', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 17', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 18', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .setTimestamp()
            return interaction.channel.send({ embeds: [embed] });
        } else if(count === 19) {
            const embed = new MessageEmbed()
                .setTitle(diceEmbedName)
                setDescription(locale.diceEmbedDescription.replace('{sides}', count.toString()))
                .addField(locale.diceWord+' 1', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 2', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 3', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 4', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 5', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 6', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 7', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 8', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 9', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 10', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 11', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 12', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 13', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 14', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 15', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 16', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 17', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 18', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 19', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .setTimestamp()
            return interaction.channel.send({ embeds: [embed] });
        } else if(count === 20) {
            const embed = new MessageEmbed()
                .setTitle(diceEmbedName)
                setDescription(locale.diceEmbedDescription.replace('{sides}', count.toString()))
                .addField(locale.diceWord+' 1', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 2', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 3', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 4', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 5', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 6', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 7', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 8', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 9', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 10', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 11', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 12', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 13', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 14', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 15', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 16', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 17', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 18', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 19', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .addField(locale.diceWord+' 20', Math.round(Math.random() * (soods - 1) + 1).toString(), true)
                .setTimestamp()
            return interaction.channel.send({ embeds: [embed] });
        }
	}
};
