const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: Object.freeze({
    name: "help",
    version: "1.20",
    author: "BaYjid",
    countDown: 5,
    role: 0,
    shortDescription: { en: "📖 View command usage" },
    longDescription: { en: "📜 View command usage and list all commands directly" },
    category: "ℹ️ Info",
    guide: { en: "🔹 {pn} / help cmdName" },
    priority: 1,
  }),

  onStart: async function ({ message, args, event, role }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      let msg = `╭━━━━━━━━━━━━━━━━━╮\n` +
                ` 🦋 𝗜𝗧𝗔𝗖𝗛𝗜 ✞︎ 𝗨𝗖𝗛𝗜𝗛𝗔♂️    \n` +
                `╰━━━━━━━━━━━━━━━━━╯\n\n`;

      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;
        const category = value.config.category || "Uncategorized";
        if (!categories[category]) categories[category] = [];
        categories[category].push(name);
      }

      Object.keys(categories).forEach((category) => {
        msg += `╭━ 📂 ★${category.toUpperCase()}\n`;
        categories[category].sort().forEach((item) => msg += ` 🔹 ${item}\n`);
        msg += `╰━━━━━━━━━━━━━━╯\n\n`;
      });

      msg += `╭━━━━━━━━━━━━━━━╮\n` +
             `┃ 📌 Total Commands: ${commands.size}\n` +
             `┃ 🔹 Type: ★"${prefix}help cmdName"★ for details.\n` +
             `╰━━━━━━━━━━━━━━━╯`;

      await message.reply(msg);
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`❌ Command "*${commandName}*" not found.`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "Unknown";
        const longDescription = configCommand.longDescription?.en || "No description available.";
        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{pn}/g, prefix).replace(/{n}/g, configCommand.name);

        const response = `─━ 📌 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎 ━─\n` +
                         ` 🔹 Name: ${configCommand.name}\n` +
                         ` 📜 Description: ${longDescription}\n` +
                         ` 🆔 Aliases: ${configCommand.aliases ? configCommand.aliases.join(", ") : "None"}\n` +
                         ` 📎 Version: ${configCommand.version || "1.0"}\n` +
                         ` 👤 Role: ${roleText}\n` +
                         ` ⏳ Cooldown: ${configCommand.countDown || "1"}s\n` +
                         ` 👨‍💻 Author: ${author}\n` +
                         ` 📖 Usage: ${usage}\n` +
                         `━━━━━━━━━━━━━━━━━━━━`;
        await message.reply(response);
      }
    }
  },
};

function roleTextToString(role) {
  switch (role) {
    case 0: return "🌎 All Users";
    case 1: return "👑 Group Admins";
    case 2: return "🤖 Bot Admins";
    default: return "❓ Unknown Role";
  }
}
