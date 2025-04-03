const createFuncMessage = global.utils.message;
const handlerCheckDB = require("./handlerCheckData.js");
const fs = require("fs-extra");
const path = require("path");

module.exports = (api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData) => {
  const handlerEvents = require(
    process.env.NODE_ENV == "development"
      ? "./handlerEvents.dev.js"
      : "./handlerEvents.js"
  )(
    api,
    threadModel,
    userModel,
    dashBoardModel,
    globalModel,
    usersData,
    threadsData,
    dashBoardData,
    globalData
  );

  // Load all command files
  const commandFolder = path.join(__dirname, "scripts", "cmds");
  const commandFiles = fs
    .readdirSync(commandFolder)
    .filter((file) => file.endsWith(".js"));

  const commands = new Map();
  for (const file of commandFiles) {
    const command = require(path.join(commandFolder, file));
    if (command.config?.name) {
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

    const {
      onStart,
      onChat,
      onReply,
      onEvent,
      handlerEvent,
      onReaction,
      typ,
      presence,
      read_receipt,
    } = handlerChat;

    try {
      switch (event.type) {
        case "message":
        case "message_reply": {
          let body = event.body?.trim()?.toLowerCase();
          if (!body || body.length < 2 || !isNaN(body)) return;

          // Check command match
          const command = commands.get(body);
          if (command && typeof command.onStart === "function") {
            console.log("[BOT] Executing command:", body);
            await command.onStart({ event, api, message, usersData, threadsData });
            return;
          }

          // Fallback to onChat
          if (typeof onChat === "function") onChat();
          if (typeof onStart === "function") onStart();
          if (typeof onReply === "function") onReply();
          break;
        }

        case "event":
          if (typeof handlerEvent === "function") handlerEvent();
          if (typeof onEvent === "function") onEvent();
          break;

        case "message_reaction":
          if (typeof onReaction === "function") onReaction();
          break;

        case "typ":
          if (typeof typ === "function") typ();
          break;

        case "presence":
          if (typeof presence === "function") presence();
          break;

        case "read_receipt":
          if (typeof read_receipt === "function") read_receipt();
          break;

        default:
          break;
      }
    } catch (err) {
      console.error("[BOT] Handler error:", err);
    }
  };
};
