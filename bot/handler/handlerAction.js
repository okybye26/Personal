const createFuncMessage = global.utils.message;
const handlerCheckDB = require("./handlerCheckData.js");
const fs = require("fs-extra");

module.exports = (api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData) => {
    const handlerEvents = require(process.env.NODE_ENV == 'development' ? "./handlerEvents.dev.js" : "./handlerEvents.js")(api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData);

    // Load all command files dynamically
    const commandFiles = fs.readdirSync('./scripts/cmds').filter(file => file.endsWith('.js'));
    const commands = new Map();

    for (const file of commandFiles) {
        const command = require(`./scripts/cmds/${file}`);
        if (command.config && command.config.name) {
            commands.set(command.config.name.toLowerCase(), command);
            if (command.config.aliases) {
                for (const alias of command.config.aliases) {
                    commands.set(alias.toLowerCase(), command);
                }
            }
        }
    }

    return async function (event) {
        const message = createFuncMessage(api, event);
        await handlerCheckDB(usersData, threadsData, event);
        const handlerChat = await handlerEvents(event, message);
        if (!handlerChat) return;

        const { onStart, onChat, onReply, onEvent, handlerEvent, onReaction, typ, presence, read_receipt } = handlerChat;

        if (event.type === "message" || event.type === "message_reply") {
            let body = event.body ? event.body.trim().toLowerCase() : "";

            // Debugging log
            console.log(`[LOG] Received message: "${body}"`);

            // Ignore unnecessary texts
            if (!body || body.length < 2 || !isNaN(body)) {
                console.log("[LOG] Ignored: Not a valid command");
                return;
            }

            // Check if it's a valid command (No-prefix mode)
            if (commands.has(body)) {
                let cmd = commands.get(body);
                console.log(`[LOG] Running command: ${body}`);
                await cmd.onStart({ event, api, message, usersData, threadsData });
                return;
            }

            // If no command found, run onChat
            onChat();
        }

        if (event.type === "event") {
            handlerEvent();
            onEvent();
        }

        if (event.type === "message_reaction") {
            onReaction();
        }

        if (event.type === "typ") {
            typ();
        }

        if (event.type === "presence") {
            presence();
        }

        if (event.type === "read_receipt") {
            read_receipt();
        }
    };
};
