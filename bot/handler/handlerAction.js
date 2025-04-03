const createFuncMessage = global.utils.message;
const handlerCheckDB = require("./handlerCheckData.js");
const fs = require("fs-extra");
const path = require("path");

module.exports = (api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData) => {
  const handlerEvents = require(
    process.env.NODE_ENV == "development"
      ? "./handlerEvents.dev.js"
      : "./handlerEvents.js"
  )(api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData);

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
      // Ensure the command folder exists
      const commandFolder = path.join(__dirname, "../scripts/cmds");
      if (!fs.existsSync(commandFolder)) {
        fs.mkdirSync(commandFolder, { recursive: true });
      }

      let commandFiles = [];
      try {
        // Read the command folder
        commandFiles = fs.readdirSync(commandFolder).filter((file) => file.endsWith(".js"));
      } catch (err) {
        console.error("[BOT] Error reading command folder:", err);
      }

      switch (event.type) {
        case "message":
        case "message_reply": {
          let body = event.body?.trim();
          if (!body || body.length < 2) return;

          const commands = new Map();
          // Load commands dynamically from the folder
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

          const prefix = global.config.PREFIX || "!";
          let commandName = body.toLowerCase();
          if (commandName.startsWith(prefix)) {
            commandName = commandName.slice(prefix.length).trim().toLowerCase();
          }

          const command = commands.get(commandName);
          if (command && typeof command.onStart === "function") {
            console.log("[BOT] Executing command:", commandName);
            await command.onStart({ event, api, message, usersData, threadsData });
            return;
          }

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
