module.exports = async function ({ message, event, threadsData, commandModules, client }) {
  try {
    const prefix = global.config.PREFIX || "!";
    const body = event.body || "";
    const hasPrefix = body.startsWith(prefix);
    const commandBody = hasPrefix ? body.slice(prefix.length).trim() : body.trim();
    const args = commandBody.split(/\s+/);
    const commandName = args.shift()?.toLowerCase();

    const threadData = await threadsData.get(event.threadID);
    const prefixMode = threadData?.data?.prefixMode || "onlyPrefix";

    if (
      (prefixMode === "onlyPrefix" && !hasPrefix) ||
      (prefixMode === "noPrefix" && hasPrefix)
    ) {
      return;
    }

    if (!commandName) return;

    const command =
      commandModules.get(commandName) ||
      commandModules.find(cmd => cmd.config.aliases?.includes(commandName));

    if (!command) return;

    await command.onStart({
      message,
      event,
      args,
      threadsData,
      client
    });
  } catch (err) {
    console.error("Handler error:", err);
  }
};
