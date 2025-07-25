const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "anikcmd",
    aliases: ["acmd"],
    version: "3.1",
    author: "ᴀɴɪᴋ_🐢",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "ꜱʜᴏᴡ ᴄᴍᴅꜱ ʙʏ ᴀᴜᴛʜᴏʀ"
    },
    longDescription: {
      en: "ꜱʜᴏᴡ ᴀʟʟ ᴄᴏᴍᴍᴀɴᴅꜱ ʙʏ ᴀɴʏ ᴀᴜᴛʜᴏʀ ᴏʀ ᴀʟʟ ᴄᴍᴅꜱ"
    },
    category: "ᴀɴɪᴋ",
    guide: {
      en: "{pn} [ᴀᴜᴛʜᴏʀ ɴᴀᴍᴇ|all]"
    }
  },

  onStart: async function ({ message, args }) {
    const input = args.join(" ").trim().toLowerCase();
    const targetAuthor = (input === "" || input.includes("anik")) ? "ᴀɴɪᴋ_🐢" : input;
    const cmdsPath = __dirname;

    const files = fs.readdirSync(cmdsPath).filter(f => f.endsWith(".js") && f !== "anikcmd.js");
    const cmdMap = {};

    for (const file of files) {
      try {
        delete require.cache[require.resolve(path.join(cmdsPath, file))];
        const cmd = require(path.join(cmdsPath, file));
        const author = (cmd?.config?.author || "ᴜɴᴋɴᴏᴡɴ").toLowerCase();
        const name = cmd?.config?.name || "ᴜɴɴᴀᴍᴇᴅ";

        const matchAuthor = (targetAuthor === "all") ||
                            (author.includes("anik") && targetAuthor.includes("anik")) ||
                            (author === targetAuthor);

        if (matchAuthor) {
          if (!cmdMap[author]) cmdMap[author] = [];
          cmdMap[author].push(name);
        }
      } catch (e) {
        console.error(`error loading command ${file}:`, e);
      }
    }

    if (Object.keys(cmdMap).length === 0) {
      return message.reply(`😥 ᴋᴏɴᴏ ᴄᴏᴍᴍᴀɴᴅ ᴘᴀᴏᴀ ɢᴇʟᴏ ɴᴀ${targetAuthor === "all" ? "" : ` ᴀᴜᴛʜᴏʀ: ${targetAuthor}`}`);
    }

    let output = `╭─ 🎯 ᴄᴍᴅꜱ ʙʏ ᴀᴜᴛʜᴏʀ: ${targetAuthor === "all" ? "ᴀʟʟ ᴀᴜᴛʜᴏʀꜱ" : targetAuthor} ─╮\n\n`;

    for (const [author, cmds] of Object.entries(cmdMap)) {
      if (targetAuthor !== "all" && author !== targetAuthor) continue;
      output += `✦ ᴀᴜᴛʜᴏʀ: ${author.toUpperCase()}\n `;
      output += cmds.join(" ") + "\n\n";
    }

    output += `~ᴄʀᴇᴅɪᴛ ᴀɴɪᴋ_🐢 ⤴️\n╰────────────────────╯`;

    message.reply(output.trim());
  }
};
