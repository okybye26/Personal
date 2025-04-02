const createFuncMessage = global.utils.message; const handlerCheckDB = require("./handlerCheckData.js"); const request = require("request"); const axios = require("axios"); const fs = require("fs-extra");

module.exports = (api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData) => { const handlerEvents = require(process.env.NODE_ENV == 'development' ? "./handlerEvents.dev.js" : "./handlerEvents.js")(api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData);

return async function (event) {
    console.log("[DEBUG] New event received:", event.type);
    const message = createFuncMessage(api, event);
    await handlerCheckDB(usersData, threadsData, event);
    const handlerChat = await handlerEvents(event, message);
    if (!handlerChat) {
        console.log("[DEBUG] handlerChat not found, exiting.");
        return;
    }

    const { onStart, onChat, onReply, onEvent, handlerEvent, onReaction, typ, presence, read_receipt } = handlerChat;
    const commandList = global.client.commands.map(cmd => cmd.config.name);
    const botAdmins = global.config.BOT_ADMINS || [];
    const senderID = event.senderID;
    const prefix = global.config.PREFIX || "/";

    if (event.type === "message" || event.type === "message_reply") {
        const text = event.body?.trim();
        console.log("[DEBUG] Message received:", text);
        
        if (!text) return;

        const isCommand = text.startsWith(prefix) || (botAdmins.includes(senderID) && commandList.includes(text.split(" ")[0]));

        if (isCommand) {
            console.log("[DEBUG] Command detected, executing...");
            try {
                onChat();
                onStart();
                onReply();
            } catch (err) {
                console.error("[ERROR] Command execution failed:", err);
            }
        } else {
            console.log("[DEBUG] Not a valid command, ignoring.");
        }
        return;
    }

    switch (event.type) {
        case "event":
            console.log("[DEBUG] Handling event...");
            handlerEvent();
            onEvent();
            break;
        case "message_reaction":
            console.log("[DEBUG] Handling message reaction...");
            onReaction();
            break;
        case "typ":
            console.log("[DEBUG] Handling typing event...");
            typ();
            break;
        case "presence":
            console.log("[DEBUG] Handling presence event...");
            presence();
            break;
        case "read_receipt":
            console.log("[DEBUG] Handling read receipt event...");
            read_receipt();
            break;
        default:
            console.log("[DEBUG] Unknown event type, ignoring.");
            break;
    }
};

};

