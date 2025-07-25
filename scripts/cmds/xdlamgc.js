const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "xdlamgc",
    version: "1.0",
    author: "ᴀɴɪᴋ_🐢",
    countDown: 0,
    role: 0,
    shortDescription: {
      en: "ᴀᴜᴛᴏ ᴀᴅᴅ ᴏɴʟʏ ᴜɪᴅ 61558559288827"
    },
    category: "ᴀɴɪᴋ",
  },

  onStart: async function ({ api, event }) {
    if (event.senderID !== "100078769420993") {
      return api.sendMessage(
        "ᴏɴʟʏ ᴍʏ ᴏᴡɴᴇʀ ᴀɴɪᴋ_🐢 ᴄᴀɴ ᴜsᴇ ᴛʜɪs!😤",
        event.threadID,
        event.messageID
      );
    }

    const targetUID = "61558559288827";
    const threadID = event.threadID;

    try {
      await api.addUserToGroup(targetUID, threadID);
      await api.approveChatJoinRequest(threadID, targetUID);
    } catch (err) {
      // silent error
    }
  }
};
