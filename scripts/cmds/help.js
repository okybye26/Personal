const fs = require("fs");

module.exports = {
  config: {
    name: "help",
    version: "2.0",
    author: " Eren",
    role: 0,
    shortDescription: "See available commands",
    longDescription: "Show all available commands or command details",
    guide: "{pn} [page | command name]"
  },

  onStart: async function ({ args, message }) {
    const commands = Array.from(global.GoatBot.commands.values());
    const prefix = ".";
    const perPage = 15;
    const totalPages = Math.ceil(commands.length / perPage);
    const roleMap = ["User", "Group Admin", "Bot Admin", "Owner Only"];

    if (args[0] && isNaN(args[0])) {
      const name = args[0].toLowerCase();
      const cmd =
        global.GoatBot.commands.get(name) ||
        commands.find(c => c.config.aliases?.includes(name));
      if (!cmd) return message.reply(`❌ Command '${name}' not found.`);

      const conf = cmd.config;
      const aliases = conf.aliases?.join(", ") || "None";
      const guide = typeof conf.guide === "string" ? conf.guide.replace(/{pn}/g, prefix + conf.name) : "No guide available.";

      return message.reply(
`══════════════════
                  DETAILS =

  • Name: ${conf.name}
  • Version: ${conf.version || "1.0"}

  • Role: ${roleMap[conf.role] || "Unknown"}
  • Aliases: ${aliases}

  • Author: ${conf.author || "Unknown"}
  • Usage: ${guide}
══════════════════`
      );
    }

    const page = parseInt(args[0]) || 1;
    if (page < 1 || page > totalPages) return message.reply(`❌ Invalid page. Enter 1 - ${totalPages}`);

    const list = commands
      .slice((page - 1) * perPage, page * perPage)
      .map(cmd => `  ◦  ${cmd.config.name}`)
      .join("\n");

    return message.reply(
`════════════════════
               𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐋𝐢𝐬𝐭 :

${list}

════════════════════ Page ${page}/${totalPages} • Total: ${commands.length} commands
   Type /help [page | command name] ════════════════════`
    );
  }
};
