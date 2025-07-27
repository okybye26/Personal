const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "approved",
    aliases: ["aprv"],
    version: "1.2",
    author: "ᴀɴɪᴋ_🐢",
    countDown: 5,
    role: 2, // ✅ Bot admin only
    category: "Admin",
    shortDescription: {
      en: "ᴀᴘᴘʀᴏᴠᴇ/ʀᴇᴍᴏᴠᴇ ɢʀᴏᴜᴘꜱ ꜰʀᴏᴍ ʙᴏᴛ ᴀᴄᴄᴇꜱꜱ"
    }
  },

  onLoad: async function () {
    const dir = path.join(__dirname, "cache");
    const approvedPath = path.join(dir, "approvedThreads.json");
    const pendingPath = path.join(dir, "pendingThreads.json");

    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    if (!fs.existsSync(approvedPath)) fs.writeFileSync(approvedPath, "[]");
    if (!fs.existsSync(pendingPath)) fs.writeFileSync(pendingPath, "[]");
  },

  onStart: async function ({ event, api, args }) {
    const OWNER_UID = "100078769420993";
    const { threadID, messageID, senderID } = event;
    const approvedPath = __dirname + "/cache/approvedThreads.json";
    const pendingPath = __dirname + "/cache/pendingThreads.json";

    let approved = JSON.parse(fs.readFileSync(approvedPath));
    let pending = JSON.parse(fs.readFileSync(pendingPath));
    let idBox = args[1] || args[0] || threadID;

    if (args[0] === "list") {
      let msg = "📋 ꜱᴍᴀʀᴛ ʙᴏᴛ ᴀᴘᴘʀᴏᴠᴇᴅ ʙᴏx ʟɪꜱᴛ:\n\n";
      if (approved.length === 0) msg += "• ᴋᴏɴᴏ ʙᴏx ᴀᴘᴘʀᴏᴠᴇ ɴᴀɪ.";
      else {
        approved.forEach((e, i) => {
          msg += `🔹 ${i + 1}. ɪᴅ: ${e}\n`;
        });
      }
      return api.sendMessage(msg, threadID, messageID);
    }

    if (args[0] === "pending") {
      let msg = "⏳ ᴘᴇɴᴅɪɴɢ ʙᴏx ʟɪꜱᴛ:\n\n";
      if (pending.length === 0) msg += "• ᴋᴏɴᴏ ᴘᴇɴᴅɪɴɢ ɴᴀɪ.";
      else {
        let count = 0;
        for (const id of pending) {
          try {
            const info = await api.getThreadInfo(id);
            msg += `🔸 ${++count}. ${info.name || "ᴜɴᴋɴᴏᴡɴ"}\n📍 ɪᴅ: ${id}\n\n`;
          } catch {
            msg += `🔸 ${++count}. ɴᴀᴍᴇ: ᴇʀʀᴏʀ\n📍 ɪᴅ: ${id}\n\n`;
          }
        }
      }
      return api.sendMessage(msg, threadID, messageID);
    }

    if (args[0] === "del") {
      if (senderID !== OWNER_UID)
        return api.sendMessage("❌ ᴛᴜᴍɪ ʙᴏᴛ ᴏᴡɴᴇʀ ɴᴀɪ ʙʀᴏ!", threadID, messageID);

      const targetID = args[1] || threadID;

      if (!approved.includes(targetID))
        return api.sendMessage("⚠️ ᴇɪ ʙᴏx ᴛᴀ ᴀᴘᴘʀᴏᴠᴇ ᴄᴏʀᴀ ʜᴏʏɴɪ!", threadID, messageID);

      approved = approved.filter(id => id !== targetID);
      if (!pending.includes(targetID)) pending.push(targetID);

      fs.writeFileSync(approvedPath, JSON.stringify(approved, null, 2));
      fs.writeFileSync(pendingPath, JSON.stringify(pending, null, 2));

      return api.sendMessage(`✅ ʙᴏx ${targetID} ᴛᴀ ʀᴇᴍᴏᴠᴇ ᴄᴏʀᴀ ʜᴏʏᴇᴄʜᴇ.`, threadID, messageID);
    }

    if (isNaN(parseInt(idBox))) {
      return api.sendMessage("⚠️ ᴠᴀʟɪᴅ ɪᴅ ᴅɪᴛᴇ ʜᴏʙᴇ ʙʀᴏ!", threadID, messageID);
    }

    if (approved.includes(idBox)) {
      return api.sendMessage(`ℹ️ ɪᴅ ${idBox} ᴀʟʀᴇᴀᴅʏ ᴀᴘᴘʀᴏᴠᴇᴅ.`, threadID, messageID);
    }

    if (senderID !== OWNER_UID)
      return api.sendMessage("❌ ᴛᴜᴍɪ ᴀᴘᴘʀᴏᴠᴇ ᴄᴏʀᴀʀ ᴘᴇʀᴍɪꜱꜱɪᴏɴ ᴘᴀᴏ ɴᴀ!", threadID, messageID);

    api.sendMessage(
      "✅ ʙᴏx ᴀᴘᴘʀᴏᴠᴇ ᴄᴏʀᴀ ʜᴏʏᴇᴄʜᴇ!\n💡 ʜᴇʟᴘ ᴅɪʏᴇ ᴀʀᴏ ᴄᴏᴍᴍᴀɴᴅ ᴅᴇᴋʜᴏ!",
      idBox,
      (err) => {
        if (err) {
          return api.sendMessage("❌ ᴇʀʀᴏʀ: ɪᴅ ᴛᴀ ᴄʜᴇᴄᴋ ᴄᴏʀᴏ ʙʀᴏ!", threadID, messageID);
        } else {
          approved.push(idBox);
          pending = pending.filter(id => id !== idBox);
          fs.writeFileSync(approvedPath, JSON.stringify(approved, null, 2));
          fs.writeFileSync(pendingPath, JSON.stringify(pending, null, 2));
          return api.sendMessage(`🎉 ᴀᴘᴘʀᴏᴠᴇ ꜱᴜᴄᴄᴇꜱꜱ ꜰᴏʀ ɪᴅ: ${idBox}`, threadID, messageID);
        }
      }
    );
  }
};
