const createFuncMessage = global.utils.message;
const handlerCheckDB = require("./handlerCheckData.js");
const fs = require("fs-extra");

module.exports = (api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData) => {
    const handlerEvents = require(process.env.NODE_ENV == 'development' ? "./handlerEvents.dev.js" : "./handlerEvents.js")(api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData);

    // Load all command files
    const commandFiles = fs.readdirSync('./scripts/cmds').filter(file => file.endsWith('.js'));
    const commands = new Map();

    // Load commands into memory
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

        if (event.type === "message" || event.type === "message_reply" || event.type === "message_unsend") {
            onChat();

            let body = event.body ? event.body.trim().toLowerCase() : "";

            // Ignore unnecessary texts (custom filter)
            if (!body || body.length < 2 || !isNaN(body)) return;

            // Check if it's a valid command (No-prefix mode)
            if (commands.has(body)) {
                let cmd = commands.get(body);
                await cmd.onStart({ event, api, message, usersData, threadsData });
                return;
            }

            // Handle message unsend
            if (event.type === "message_unsend") {
                let resend = await threadsData.get(event.threadID, "settings.reSend");
                if (resend === true && event.senderID !== api.getCurrentUserID()) {
                    let umid = global.reSend[event.threadID].findIndex(e => e.messageID === event.messageID);
                    if (umid > -1) {
                        let nname = await usersData.getName(event.senderID);
                        let attch = [];
                        if (global.reSend[event.threadID][umid].attachments.length > 0) {
                            let cn = 0;
                            for (var abc of global.reSend[event.threadID][umid].attachments) {
                                if (abc.type === "audio") {
                                    cn += 1;
                                    let pts = `scripts/cmds/tmp/${cn}.mp3`;
                                    let res2 = (await axios.get(abc.url, { responseType: "arraybuffer" })).data;
                                    fs.writeFileSync(pts, Buffer.from(res2, "utf-8"));
                                    attch.push(fs.createReadStream(pts));
                                } else {
                                    attch.push(await global.utils.getStreamFromURL(abc.url));
                                }
                            }
                        }

                        api.sendMessage({
                            body: `${nname} removed:\n\n${global.reSend[event.threadID][umid].body}`,
                            mentions: [{ id: event.senderID, tag: nname }],
                            attachment: attch
                        }, event.threadID);
                    }
                }
            }
        } else if (event.type === "event") {
            handlerEvent();
            onEvent();
        } else if (event.type === "message_reaction") {
            onReaction();
            if (event.reaction === "❗") {
                if (event.userID === "61561101500902") {
                    api.removeUserFromGroup(event.senderID, event.threadID, (err) => {
                        if (err) return console.log(err);
                    });
                } else {
                    message.send(":)");
                }
            }
            if (event.reaction === "😠") {
                if (event.senderID === api.getCurrentUserID()) {
                    if (event.userID === "61573991365134") {
                        message.unsend(event.messageID);
                    } else {
                        message.send(":)");
                    }
                }
            }
        } else if (event.type === "typ") {
            typ();
        } else if (event.type === "presence") {
            presence();
        } else if (event.type === "read_receipt") {
            read_receipt();
        }
    };
};
