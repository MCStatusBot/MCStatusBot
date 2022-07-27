require('dotenv').config({ path: require('path').join(__dirname, '/../.env') });
const { Client, Collection, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

//load in slash commands
client.commands = new Collection();
for (const c of fs.readdirSync('./commands').filter((file) => file.endsWith('.js'))) {
    const command = require('./commands/' + h);
    if (!command.name) continue;
    client.commands.set(command.name, command)
}


//loop though each handler and run it
for (const h of fs.readdirSync('./handlers').filter((file) => file.endsWith('.js'))) {
    const handler = require('./handlers/' + h);
    client.on(handler.name, ...args => handler.run(client, ...args));
}

client.login(process.env.TOKEN);