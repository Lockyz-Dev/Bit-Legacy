const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
const { token } = require('./config.json');

const client = new Client({
	intents: [
        Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.GUILD_INTEGRATIONS,
		Intents.FLAGS.GUILD_WEBHOOKS,
		Intents.FLAGS.GUILD_INVITES,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.DIRECT_MESSAGES
    ]
})

const { GiveawaysManager } = require('discord-giveaways');
// Starts updating currents giveaways
const manager = new GiveawaysManager(client, {
    storage: './giveaways.json',
    default: {
        botsCanWin: false,
        embedColor: '#FF0000',
        embedColorEnd: '#000000',
        reaction: '🎁'
    }
});
// We now have a giveawaysManager property to access the manager everywhere!
client.giveawaysManager = manager;
console.log('==============================')
console.log('=                            =')
console.log('=   LMB Startup Procedures   =')
console.log('=                            =')
console.log('==============================')
console.log('Loading LMB Base...')
console.log('🟢 LMB Base Online')

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	console.log('Loading Slash Command Collection...')
	const command = require('./commands/'+file);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}
console.log('🟢 Found all Slash Commands. LMB Slash Command System Online...')
console.log('Loading LMB Welcome System V2 Beta...')

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const loggingFiles = fs.readdirSync('./logging').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	
	const event = require('./events/'+file);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
console.log('🟢 LMB Welcome System Online')

for (const file of loggingFiles) {
	console.log('Loading LMB Logging System V2 Beta...')
	const logging = require('./logging'+file);
	if (logging.once) {
		client.once(logging.name, (...args) => logging.execute(...args));
	} else {
		client.on(logging.name, (...args) => logging.execute(...args));
	}
}
console.log('🟢 LMB Logging System Online')

client.login(token);