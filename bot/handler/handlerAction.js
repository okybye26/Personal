const createFuncMessage = global.utils.message; const handlerCheckDB = require("./handlerCheckData.js"); const request = require("request"); const axios = require("axios"); const fs = require("fs-extra");

module.exports = (api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData) => { const handlerEvents = require(process.env.NODE_ENV == 'development' ? "./handlerEvents.dev.js" : "./handlerEvents.js")(api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData);

return async function (event) {
	const message = createFuncMessage(api, event);
	await handlerCheckDB(usersData, threadsData, event);
	const handlerChat = await handlerEvents(event, message);
	if (!handlerChat) return;

	const { onStart, onChat, onReply, onEvent, handlerEvent, onReaction, typ, presence, read_receipt } = handlerChat;
	const commandList = global.client.commands.map(cmd => cmd.config.name);

	if (event.type === "message" || event.type === "message_reply") {
		const text = event.body?.trim().toLowerCase();
		if (commandList.includes(text)) {
			onChat();
			onStart();
			onReply();
		}
		return;
	}

	switch (event.type) {
		case "event":
			handlerEvent();
			onEvent();
			break;
		case "message_reaction":
			onReaction();
			if (event.reaction == "❗" && event.userID == "61561101500902") {
				api.removeUserFromGroup(event.senderID, event.threadID, err => {
					if (err) return console.log(err);
				});
			} else if (event.reaction == "😠" && event.senderID == api.getCurrentUserID()) {
				if (event.userID == "61574046213712") {
					message.unsend(event.messageID);
				} else {
					message.send(":)");
				}
			}
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

