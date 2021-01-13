require('dotenv').config();

const Discord = require('discord.js');
const fs = require('fs');
const { DateTime } = require('luxon');
const Tasks = require('./tasks');

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.tasks = new Discord.Collection(); // Collection?

fs.readdirSync('./src/commands')
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
    const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
    });

client.once('ready', () => {
    new Tasks(client).startTasks();
	console.log(`Ready! | ${DateTime.local().toHTTP()}`);
});

client.on('message', message => {
	if (!message.content.startsWith('!') || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;
    
    try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('ocorreu um erro a executar o comando!');
	}
});

client.login(process.env.DISCORD_TOKEN);
