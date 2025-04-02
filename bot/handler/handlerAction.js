// Importing the necessary files
const createFuncMessage = require("./path/to/your/createFuncMessage.js"); // <-- add the correct path
const handlerCheckDB = require("./handlerCheckData.js");
const request = require("request");
const axios = require("axios");
const fs = require("fs-extra");

module.exports = (api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData) => {
    const handlerEvents = require(process.env.NODE_ENV == 'development' ? "./handlerEvents.dev.js" : "./handlerEvents.js")(api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData);
    
    const adminIDs = ["61574046213712"];  // Your UID
    const prefix = "Eren";

    return async function (event) {
        const message = createFuncMessage(api, event); // <-- Call to createFuncMessage here
        await handlerCheckDB(usersData, threadsData, event);
        const handlerChat = await handlerEvents(event, message);
        if (!handlerChat) return;

        const { onStart, onChat, onReply, onEvent, handlerEvent, onReaction, typ, presence, read_receipt } = handlerChat;

        const isAdmin = adminIDs.includes(event.senderID);

        if (!event.body) {
            console.log("[DEBUG] No body in the event.");
            return;
        }

        if (!event.body.startsWith(prefix) && !isAdmin) {
            console.log("[DEBUG] Non-admin user trying to use command without prefix.");
            return;
        }

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
