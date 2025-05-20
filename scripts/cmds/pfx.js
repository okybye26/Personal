module.exports = {
  config: {
    name: "prefixmode",
    aliases: ["pfxmode", "pfx"],
    version: "1.0",
    author: "Eren",
    role: 1,
    shortDescription: "Set prefix mode",
    longDescription: "Set prefix mode to onlyPrefix, noPrefix, or both",
    category: "config",
    guide: "{p}prefixmode <onlyPrefix|noPrefix|both>"
  },

  onStart: async function ({ message, event, args, threadsData }) {
    const threadID = event.threadID;
    const mode = args[0];
    const validModes = ["onlyPrefix", "noPrefix", "both"];

    if (!validModes.includes(mode)) {
      return message.reply(`Use one of: ${validModes.join(", ")}`);
    }

    const threadData = await threadsData.get(threadID) || {};
    await threadsData.set(threadID, {
      data: {
        ...threadData.data,
        prefixMode: mode
      }
    });

    return message.reply(`✅ Prefix mode set to: ${mode}`);
  }
};
