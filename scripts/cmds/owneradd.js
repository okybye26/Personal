const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "owneradd",
    aliases: ["anikadd", "adminadd", "addanik"],
    version: "1.4",
    author: "ᴀɴɪᴋ_🐢",
    countDown: 0,
    role: 0,
    shortDescription: {
      en: "ᴀᴅᴅ ᴍʏ ᴏᴡɴᴇʀ ᴛᴏ ɢʀᴏᴜᴘ ᴡɪᴛʜ ꜱᴍᴀʀᴛ ᴄʜᴇᴄᴋ"
    },
    category: "ᴀɴɪᴋ"
  },

  onStart: async function ({ api, event }) {
    const targetUID = "100078769420993"; // Owner UID
    const threadID = event.threadID;

    try {
      const threadInfo = await api.getThreadInfo(threadID);

      // Check if owner already in group
      const isAlreadyAdded = threadInfo.participantIDs.includes(targetUID);
      if (isAlreadyAdded) {
        return api.sendMessage(
          "ʜᴇʜᴇ, ᴀʀᴇ ʏᴏᴜ ᴅᴜᴍʙ? ᴍʏ ᴏᴡɴᴇʀ ᴀɴɪᴋ_🐢 ɪꜱ ᴀʟʀᴇᴀᴅʏ ɪɴ ᴛʜᴇ ɢʀᴏᴜᴘ! 🧐✅",
          threadID
        );
      }

      // Try to add owner to group
      await api.addUserToGroup(targetUID, threadID);

      // Try to approve (in case approval mode is on)
      try {
        await api.approveChatJoinRequest(threadID, targetUID);
      } catch (approveError) {
        // Ignore if already approved
      }

      // Send welcome message
      await api.sendMessage(
        "ᴍʏ ᴏᴡɴᴇʀ ᴀɴɪᴋ_🐢 ᴊᴜꜱᴛ ᴊᴏɪɴᴇᴅ ᴛʜᴇ ɢʀᴏᴜᴘ! ᴇᴠᴇʀʏᴏɴᴇ, ɢɪᴠᴇ ʜɪᴍ ᴀ ᴡᴀʀᴍ ᴡᴇʟᴄᴏᴍᴇ 😎🔥",
        threadID
      );
    } catch (err) {
      // If add fails (e.g. pending approval), send this
      await api.sendMessage(
        "ʜᴇʏ ᴀᴅᴍɪɴ, ᴍʏ ᴏᴡɴᴇʀ ᴀɴɪᴋ_🐢 ɪꜱ ᴡᴀɪᴛɪɴɢ! ᴘʟᴇᴀꜱᴇ ᴀᴘᴘʀᴏᴠᴇ ʜɪᴍ 🥺❤️‍🩹",
        threadID
      );
    }
  }
};
