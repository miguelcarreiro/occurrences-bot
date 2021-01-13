require('dotenv').config();

const Discord = require('discord.js');
const fs = require('fs');
const { DateTime } = require('luxon');
const Tasks = require('./tasks');

const client = new Discord.Client();
client.tasks = new Discord.Collection(); // Collection?

client.once('ready', () => {
    new Tasks(client).startTasks();
	console.log(`Ready! | ${DateTime.local().toHTTP()}`);
});

client.login(process.env.DISCORD_TOKEN);
