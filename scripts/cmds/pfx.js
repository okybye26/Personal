module.exports = {
  config: {
    name: "prefixmode",
    aliases: ["noprefix", "pfxmd"],
    version: "1.1",
    author: "Eren",
    countDown: 5,
    role: 1,
    shortDescription: "Change prefix mode for this thread",
    longDescription: "Cycle between onlyPrefix, noPrefix, and both modes",
    category: "config",
    guide: "{p}prefixmode"
  },

  onStart: async function ({ message, event, threadsData }) {
    const threadID = event.threadID;

    let threadData = await threadsData.get(threadID);
    if (!threadData) {
      await threadsData.set(threadID, { data: {} });
      threadData = await threadsData.get(threadID);
    }

    const current = threadData.data?.prefixMode || "onlyPrefix";
    const modes = ["onlyPrefix", "noPrefix", "both"];
    const nextMode = modes[(modes.indexOf(current) + 1) % modes.length];

    await threadsData.set(threadID, {
      data: {
        ...threadData.data,
        prefixMode: nextMode
      }
    });

    message.reply(`✅ Prefix mode is now set to: ${nextMode}`);
  }
};
