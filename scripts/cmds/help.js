const moment = require("moment");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "help",
    aliases: ["h", "menu", "hp"],
    version: "2.4",
    author: "Eren",
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

    // Calculate uptime
    const uptime = process.uptime();
    const days = Math.floor(uptime / (60 * 60 * 24));
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const minutes = Math.floor((uptime / 60) % 60);
    const seconds = Math.floor(uptime % 60);
    const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    const perPage = 5;
    let page = 1;
    let cmdName = null;

    if (args.length > 0) {
      const input = args[0].toLowerCase();
      if (isNaN(input)) {
        cmdName = input;
      } else {
        page = parseInt(input);
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
        `╭─    𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐈𝐧𝐟𝐨    ─╮\n` +
        `\n` +
        `⟡ Name: ${name}\n` +
        `⟡ Aliases: ${aliases?.join(", ") || "None"}\n` +
        `⟡ Category: ${category}\n` +
        `⟡ Author: ${author}\n` +
        `⟡ Description: ${longDescription}\n` +
        `⟡ Detail: ${usage}\n` +
        `\n` +
        ` - OWNER : EREN YEAGER 💦\n` +
        `─────────────────────`,
        event.threadID,
        event.messageID
      );
    }

    // Group commands by category
    const grouped = {};
    for (const cmd of allCommands) {
      const cat = cmd.config.category || "uncategorized";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(cmd.config.name);
    }

    const categoryList = Object.entries(grouped).map(([cat, cmds]) => ({
      category: cat,
      cmds: cmds.join(", ")
    }));

    const totalPages = Math.ceil(categoryList.length / perPage);
    if (page < 1 || page > totalPages) page = 1;

    const sliced = categoryList.slice((page - 1) * perPage, page * perPage);
    const msg = sliced.map(item =>
      `╭─⟪ ${item.category} ⟫\n│ ${item.cmds}\n╰───────────────`
    ).join("\n");

    // Download and send video before message
    const videoUrl = "https://files.catbox.moe/7q400i.mp4";
    const videoPath = path.join(__dirname, "helpvideo.mp4");

    try {
      const videoRes = await axios.get(videoUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(videoPath, Buffer.from(videoRes.data, "binary"));

      api.sendMessage({
        body:
          `╭── 🎀 𝐁𝐨𝐭 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬 🎀 ──╮\n` +
          `│ Total: ${allCommands.length} cmds\n` +
          `│ Uptime: ${uptimeString}\n` +
          `│ Page: ${page}/${totalPages}\n` +
          `╰────────────────────╯\n\n` +
          `${msg}\n\n` +
          `➤ Type 'help <command name>' to see command info.`,
        attachment: fs.createReadStream(videoPath)
      }, event.threadID, () => fs.unlinkSync(videoPath), event.messageID);
    } catch (err) {
      console.error("Failed to send video:", err);
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
    }
  },

  onChat: async function ({ api, event, args }) {
    const input = event.body.trim().toLowerCase();
    if (input.startsWith("help")) {
      const newArgs = input.split(" ").slice(1);
      this.onStart({ api, event, args: newArgs });
    }
  }
};
