const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');
const ms = require("ms");
const Pokedex = require('pokedex-promise-v2');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');
var P = new Pokedex();
const types = require('../db/types.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pokemon')
		.setDescription('Get information from the pokemon games')
        .addSubcommand(subcommand =>
            subcommand
                .setName('pokedex')
                .setDescription('Get information on a specific pokemon')
                .addStringOption((option) => 
			        option
				        .setName('pokemon')
				        .setDescription('The pokemon you want information on.')
				        .setRequired(true)
		        )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('typedex')
                .setDescription('Get type information')
                .addStringOption((option) => 
			        option
				        .setName('type')
				        .setDescription('The type you wanted information for')
				        .setRequired(true)
		        )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('itemdex')
                .setDescription('Get item information')
                .addStringOption((option) => 
			        option
				        .setName('item')
				        .setDescription('The item you wanted information for')
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

        if(interaction.options.getSubcommand() === 'pokedex') {
            const peekamon = interaction.options.getString('pokemon')
            var form = 'false';
            var gen = 1;

            let pkmon = peekamon.toLowerCase();
            const pokeEmbed = new MessageEmbed()
                .setAuthor('Pokedex')
            P.getPokemonSpeciesByName(pkmon)
                .then(function(response) {
                    pokeEmbed.addField('Tags', '\u200b')
                    pokeEmbed.addField('Legendary?', response.is_legendary.toString().replace("false", "No").replace("true", "Yes"), true)
                    pokeEmbed.addField('Mythical?', response.is_mythical.toString().replace("false", "No").replace("true", "Yes"), true)
                    /*if(advanced === "true") {
                        pokeEmbed.addField('Genus', response.genera[7].genus.toString(), true)
                    }*/
                    pokeEmbed.addField('Basic Information', '\u200b')
                    pokeEmbed.addField('Generation', response.generation.name.toString().replaceAll("-", " "), true)
                    /*if(advanced === "true") {
                        pokeEmbed.addField('Habitat', response.habitat.name.toString(), true)
                        pokeEmbed.addField('Growth Rate', response.growth_rate.name.toString(), true)
                        pokeEmbed.addField('Shape', response.shape.name.toString(), true)
                    }*/
                    pokeEmbed.addField('Colour', response.color.name.toString(), true)
                    pokeEmbed.setDescription(response.flavor_text_entries[gen-1].flavor_text.toString().replaceAll("\n", " ").replaceAll("\u000c", " "))
                P.getPokemonByName(pkmon)
                    .then(function(response) {
                        pokeEmbed.setTitle("N° "+response.id+ " " +response.name)
                        pokeEmbed.setThumbnail(response.sprites.front_default)
                        if(response.types[1] === undefined) {
                            pokeEmbed.addField(`Types`, response.types[0].type.name, true)
                        } else {
                            pokeEmbed.addField(`Types`, response.types[0].type.name+ ", "+ response.types[1].type.name, true)
                        }
                        /*if(advanced === "true") {
                            pokeEmbed.addField('Height', response.height+'m', true)
                            pokeEmbed.addField('Weight', response.weight+'kg', true)
                            pokeEmbed.addField('Base Experience', response.base_experience.toString(), true)
                            pokeEmbed.addField('Base Stats', '\u200b')
                            pokeEmbed.addField('HP', response.stats[0].base_stat.toString(), true)
                            pokeEmbed.addField('ATK', response.stats[1].base_stat.toString(), true)
                            pokeEmbed.addField('DEF', response.stats[2].base_stat.toString(), true)
                            pokeEmbed.addField('S. ATK', response.stats[3].base_stat.toString(), true)
                            pokeEmbed.addField('S. DEF', response.stats[4].base_stat.toString(), true)
                            pokeEmbed.addField('\u200b', '\u200b')
                        }*/
                        pokeEmbed.addField('Ability Information', '\u200b')
                        pokeEmbed.addField('Ability 1', response.abilities[0].ability.name, true)
                        if(response.abilities[1].is_hidden === true) {
                            pokeEmbed.addField('Hidden Ability', response.abilities[1].ability.name, true)
                        } else {
                            pokeEmbed.addField('Ability 2', response.abilities[1].ability.name, true)
                            pokeEmbed.addField('Hidden Ability', response.abilities[2].ability.name, true)
                        }
                        /*if(form !== 'false') {
                            P.getPokemonFormByName(form)
                                .then(function(response) {
                                    pokeEmbed.addField('Form Information', '\u200b')
                                    pokeEmbed.addField('Battle Only?', response.is_battle_only.toString())
                                    pokeEmbed.addField('Mega?', response.is_mega.toString())
                            })
                        }*/
                        pokeEmbed.addField('Important Information', 'Quite a lot of information is currently inaccessable until the final version of the bot merge.')
                        interaction.reply({ embeds: [pokeEmbed] })
                        return;
                })
            });
        }
        if(interaction.options.getSubcommand() === 'typedex') {
            const type = interaction.options.getString('type').toLowerCase();

            for(var i=0;i<types.length;i++){
                if(type == types[i].name.toLowerCase()){
                    const link = types[i].name.toLowerCase()
                    const pokeEmbed = new MessageEmbed()
                        .setTitle(`Type Dex`)
                        .setThumbnail("https://db.lockyzdev.net/dismon/types/"+link+".png")
                        .setAuthor(types[i].name)
                        if(types[i].stAg === undefined)
                        {
                            pokeEmbed.addField(`**Strong Against**`, 'Nothing', true)
                        } else {
                            pokeEmbed.addField(`**Strong Against**`, types[i].stAg, true)
                        }
                        if(types[i].wkAg === undefined) {
                            pokeEmbed.addField(`**Weak Against**`, 'Nothing', true)
                        } else {
                            pokeEmbed.addField(`**Weak Against**`, types[i].wkAg, true)
                        }
                        pokeEmbed.addField('Important Information', 'More information has been added to the pokedex command.')
                    interaction.reply({ embeds: [pokeEmbed] })
                    return;
                }
            }
        }
        if(interaction.options.getSubcommand() === 'itemdex') {
            const item = interaction.options.getString('item').toLowerCase();
            P.getItemByName(item)
                .then(function(response) {
                const pokeEmbed = new MessageEmbed()
                    .setAuthor('ItemDex')
                    .setTitle(response.name)
                    .setThumbnail(response.sprites.default)
                    pokeEmbed.addField('Effect', response.effect_entries[0].short_effect)
                    if(response.cost = 0) {
                        pokeEmbed.addField('Cost in Mart', 'Not Purchaseable')
                    } else {
                        pokeEmbed.addField('Cost in Mart', response.cost.toString())
                    }
                    pokeEmbed.addField('Item Category', response.category.name)
                    pokeEmbed.setDescription(response.flavor_text_entries[0].text.toString())
                    pokeEmbed.addField('Important Information', 'More information has been added to the pokedex command.')
                interaction.reply({ content: ' ', embeds: [pokeEmbed], components: [row] })
                return;
            });
        }
    }
};
