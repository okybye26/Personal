const { Client } = require('whatsapp-web.js');
const moment = require('moment');
const { adminNumber, botName } = require('../config.json'); // Admin-er number o bot name import

// Bot er client instance
const client = new Client();

module.exports = {
    name: 'botstatus', // Command name
    description: 'Shows the status of the bot', // Description of the command
    aliases: ['status', 'uptime'], // Aliases of the command

    async execute(message, args) {
        client.on('ready', () => {
            console.log('Bot connected ✅');

            const botInfo = `
Bot connected ✅

Bot Name: ${nickNameBot}

Prefix: Eren

Bot Run Time: ${moment.duration(client.startTime).humanize()} 

Bot Ping: ${Math.round(client.ping)} ms 

Bot Status: Smooth 

Owner: EREN
            `;

            // Admin-er inbox e message pathano
            sendInboxMessage(botInfo);
        });

        function sendInboxMessage(message) {
            // Admin-er inbox-e SMS pathanor logic
            client.getChatById(adminNumber + "@c.us").then(chat => {
                chat.sendMessage(message);  // Message send to admin's inbox
                console.log("Sending SMS to admin inbox: ", message);
            }).catch(err => {
                console.log("Error sending message to admin: ", err);
            });
        }
    }
};

// Initialize client and start the bot
client.initialize();
