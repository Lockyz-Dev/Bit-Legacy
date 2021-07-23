const { prefix } = require('../config');
const { version } = require('../package.json');

const versions = {
    production: 'Production',
    development: 'Development'
};

module.exports = async client => {

    await client.logger.log(`Logged in as ${client.user.tag} (${client.user.id}) in ${client.guilds.size} server(s).`);
    await client.logger.log(`Version ${version} of the bot loaded.`);
    await client.logger.log(`${versions[process.env.NODE_ENV]} version of the bot loaded.`);
};