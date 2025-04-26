const moment = require("moment");

module.exports = {
  config: {
    name: "help",
    aliases: ["h", "menu", "hp"],
    version: "2.4",
    author: " Eren",
    countDown: 5,
    role: 0,
    shortDescription: "Show all commands",
    longDescription: "View full list of bot commands in a paginated and detailed format",
    category: "info",
    guide: "{pn} [command name | page number]"
  },

  onStart: async function ({ api, event, args }) {
    const prefix = global.GoatBot.config.prefix;
    const commands = global.GoatBot.commands;
    const allCommands = Array.from(commands.values());
    const perPage = 15;
    const totalPages = Math.ceil(allCommands.length / perPage);
    let page = 1;
    let cmdName = null;

    // Calculate bot uptime
    const uptime = process.uptime(); // in seconds
    const days = Math.floor(uptime / (60 * 60 * 24));
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const minutes = Math.floor((uptime / 60) % 60);
    const seconds = Math.floor(uptime % 60);

    const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    if (args.length > 0) {
      const input = args[0].toLowerCase();
      if (isNaN(input)) {
        cmdName = input;
      } else {
        page = parseInt(input);
        if (page < 1 || page > totalPages) page = 1;
      }
    }

    if (cmdName) {
      const cmd = allCommands.find(item =>
        item.config.name.toLowerCase() === cmdName ||
        (item.config.aliases && item.config.aliases.map(a => a.toLowerCase()).includes(cmdName))
      );

      if (!cmd) {
        return api.sendMessage(`✖️ 𝐜𝐨𝐦𝐦𝐚𝐧𝐝 𝐍𝐨𝐭 𝐟𝐨𝐮𝐧𝐝 𝐢𝐧 𝐭𝐡𝐢𝐬 𝐧𝐚𝐦𝐞 '${cmdName}'`, event.threadID, event.messageID);
      }

      const { name, aliases, author, shortDescription, longDescription, category, guide } = cmd.config;
      const usage = typeof guide === "string" ? guide.replace(/{pn}/g, prefix + name) : "No usage guide provided.";

      return api.sendMessage(
        `╭─〔 ✨ 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐈𝐧𝐟𝐨 ✨ 〕─╮\n` +
        `│\n` +
        `│ ⟡ Name: ${name}\n` +
        `│ ⟡ Aliases: ${aliases?.join(", ") || "None"}\n` +
        `│ ⟡ Category: ${category}\n` +
        `│ ⟡ Author: ${author}\n` +
        `│ ⟡ Description: ${shortDescription}\n` +
        `│ ⟡ Detail: ${longDescription}\n` +
        `│\n` +
        `│ ⟡ Usage:\n│ ${usage}\n` +
        `╰──────────────────────╯`,
        event.threadID,
        event.messageID
      );
    }

    const sliced = allCommands.slice((page - 1) * perPage, page * perPage);
    const msg = sliced.map((cmd, index) => {
      return `╭─⟪ ${cmd.config.name} ⟫\n│ ✦ ${cmd.config.shortDescription}\n╰───────────────`;
    }).join("\n");

    api.sendMessage(
      `╭── 🎀 𝐁𝐨𝐭 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬 🎀 ──╮\n` +
      `│ Total: ${allCommands.length} cmds\n` +
      `│ Uptime: ${uptimeString}\n` +
      `│ Page: ${page}/${totalPages}\n` +
      `╰────────────────────╯\n\n` +
      `${msg}\n\n` +
      `➤ Type 'help <command name>' to see command info.`,
      event.threadID,
      event.messageID
    );
  },

  onChat: async function ({ api, event, args }) {
    const input = event.body.trim().toLowerCase();  // Get the chat input
    if (input.startsWith("help")) {  // Check if the user typed 'help' (no prefix)
      const newArgs = input.split(" ").slice(1);  // Remove 'help' from the input
      this.onStart({ api, event, args: newArgs });
    }
  }
};
