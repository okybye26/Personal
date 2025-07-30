module.exports = {
  config: {
    name: "notis",
    version: "1.0",
    author: "ᴀɴɪᴋ_🐢",
    countDown: 5,
    role: 0,
    shortDescription: "ꜱᴇɴᴅ ɴᴏᴛɪꜰɪᴄᴀᴛɪᴏɴ ᴛᴏ ᴀʟʟ ɢʀᴏᴜᴘꜱ",
    longDescription: "ꜱᴇɴᴅ ɴᴏᴛɪꜰɪᴄᴀᴛɪᴏɴ ᴛᴏ ᴀʟʟ ɢʀᴏᴜᴘꜱ ᴀꜱ ꜱᴀᴋɪʙ",
    category: "owner",
  },

  onStart: async function ({ api, args, threadsData, message, event }) {
    const senderID = event.senderID;
    const allowedUIDs = ["100078769420993", "100094014288453"];
    if (!allowedUIDs.includes(senderID)) {
      return message.reply("❌ ʏᴏᴜ ᴀʀᴇ ɴᴏᴛ ᴀʟʟᴏᴡᴇᴅ ᴛᴏ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ");
    }

    if (!args[0]) return message.reply("🔔 ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴍᴇssᴀɢᴇ ᴛᴏ ꜱᴇɴᴅ");

    const smallCapsMap = {
      a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ", g: "ɢ",
      h: "ʜ", i: "ɪ", j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ",
      o: "ᴏ", p: "ᴘ", q: "ǫ", r: "ʀ", s: "ꜱ", t: "ᴛ", u: "ᴜ",
      v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ"
    };

    const toSmallCaps = (text) =>
      text
        .toLowerCase()
        .replace(/[a-z]/g, (c) => smallCapsMap[c] || c);

    const allThreads = await threadsData.getAll();
    const groupThreads = allThreads.filter(thread => thread.threadID && thread.members && thread.members.length > 1);

    const body =
      "ɴᴏᴛɪꜰɪᴄᴀᴛɪᴏɴ ꜰʀᴏᴍ ꜱᴀᴋɪʙ (ᴅᴏ ɴᴏᴛ ʀᴇᴘʟʏ)\n" +
      "────────────────\n" +
      toSmallCaps(args.join(" "));

    let sent = 0, failed = 0;

    for (const thread of groupThreads) {
      try {
        await api.sendMessage(body, thread.threadID);
        sent++;
      } catch (e) {
        failed++;
      }
    }

    return message.reply(`✅ ꜱᴇɴᴛ ᴛᴏ ${sent} ɢʀᴏᴜᴘꜱ | ❌ ꜰᴀɪʟᴇᴅ: ${failed}`);
  }
};
