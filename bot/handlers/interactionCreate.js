module.exports.name = "interactionCreate";

const { RateLimiter } = require('discord.js-rate-limiter')
client.rateLimiter = new RateLimiter(1, 2000) // Rate limit to one message every two seconds;

module.exports.run = (client, interaction) => {
    //return if not slash command
    if (!interaction.isChatInputCommand()) return;
    if (interaction.guildId == null) return interaction.reply('please do this in a server');

    //stop spam with rate limit
    const limited = rateLimiter.take(interaction.member.id);
    if (limited) return;

    //get guild
    //const guild = await lookup('discordguild', interaction.guild.id);
    // if (guild == null) return;
    if (!client.commands.has(interaction.commandName)) return;
    const command = client.commands.get(interaction.commandName);
    try {
        return command.execute(interaction, server, client);
    } catch (error) {
        console.log(error.stack || error);
        return interaction.reply({ content: 'Uh, oh! An error occurred while trying to execute that command! (**X  _  X**)', allowedMentions: { repliedUser: false } });
    }

}