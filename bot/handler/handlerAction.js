const createFuncMessage = global.utils.message; const handlerCheckDB = require("./handlerCheckData.js"); const request = require("request"); const axios = require("axios"); const fs = require("fs-extra");

module.exports = (api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData) => { const handlerEvents = require(process.env.NODE_ENV == 'development' ? "./handlerEvents.dev.js" : "./handlerEvents.js")(api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData);

// Admin ID list (added your UID here)
const adminIDs = ["61574046213712"];  // Your UID added here
const prefix = "Eren"; // Updated prefix to "Eren"

return async function (event) {
    const message = createFuncMessage(api, event);
    await handlerCheckDB(usersData, threadsData, event);
    const handlerChat = await handlerEvents(event, message);
    if (!handlerChat) return;

    const { onStart, onChat, onReply, onEvent, handlerEvent, onReaction, typ, presence, read_receipt } = handlerChat;

    // Ensure event body exists
    if (!event.body) return;

    // Check if the user is an admin
    const isAdmin = adminIDs.includes(event.senderID.toString());
    
    // If no prefix is used and the user is not an admin, block the command
    if (!event.body.startsWith(prefix) && !isAdmin) {
        console.log("[DEBUG] Non-admin user tried using command without prefix.");
        return;
    }

    // Handling different event types
    switch (event.type) {
        case "message":
        case "message_reply":
        case "message_unsend":
            onChat();
            onStart();
            onReply();
            break;
        case "event":
            handlerEvent();
            onEvent();
            break;
        case "message_reaction":
            onReaction();
            break;
        case "typ":
            typ();
            break;
        case "presence":
            presence();
            break;
        case "read_receipt":
            read_receipt();
            break;
        default:
            break;
    }
};

};

