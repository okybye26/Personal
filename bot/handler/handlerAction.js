const createFuncMessage = global.utils.message;
const handlerCheckDB = require("./handlerCheckData.js");

const fs = require("fs-extra");
const axios = require("axios");

module.exports = (
  api,
  threadModel,
  userModel,
  dashBoardModel,
  globalModel,
  usersData,
  threadsData,
  dashBoardData,
  globalData
) => {
  const handlerEvents = require(
    process.env.NODE_ENV === "development"
      ? "./handlerEvents.dev.js"
      : "./handlerEvents.js"
  )(
    api,
    threadModel,
    userModel,
    dashBoardModel,
    globalModel,
    usersData,
    threadsData,
    dashBoardData,
    globalData
  );

  return async function (event) {
    const message = createFuncMessage(api, event);

    await handlerCheckDB(usersData, threadsData, event);
    const handlerChat = await handlerEvents(event, message);
    if (!handlerChat) return;

    const {
      onStart,
      onChat,
      onReply,
      onEvent,
      handlerEvent,
      onReaction,
      typ,
      presence,
      read_receipt
    } = handlerChat;

    switch (event.type) {
      case "message":
        onChat?.();
        onStart?.();
        if (
          event.messageReply &&
          global.client.handleReply?.length > 0
        ) {
          const replyData = global.client.handleReply.find(
            (item) => item.messageID === event.messageReply.messageID
          );
          if (replyData) {
            event.replyData = replyData;
            if (typeof onReply === "function") onReply();
          }
        }
        break;

      case "message_reply":
        if (
          global.client.handleReply?.length > 0
        ) {
          const replyData = global.client.handleReply.find(
            (item) => item.messageID === event.messageReply.messageID
          );
          if (replyData) {
            event.replyData = replyData;
            if (typeof onReply === "function") onReply();
          }
        }
        onChat?.();
        onStart?.();
        break;

      case "message_unsend":
        onChat?.();
        onStart?.();
        const resend = await threadsData.get(event.threadID, "settings.reSend");
        if (resend === true && event.senderID !== api.getCurrentUserID()) {
          let umid = global.reSend[event.threadID]?.findIndex(
            (e) => e.messageID === event.messageID
          );
          if (umid > -1) {
            let nname = await usersData.getName(event.senderID);
            let attch = [];
            for (let i = 0; i < global.reSend[event.threadID][umid].attachments.length; i++) {
              const att = global.reSend[event.threadID][umid].attachments[i];
              if (att.type === "audio") {
                const path = `scripts/cmds/tmp/${i + 1}.mp3`;
                const audioData = (await axios.get(att.url, { responseType: "arraybuffer" })).data;
                fs.writeFileSync(path, Buffer.from(audioData, "utf-8"));
                attch.push(fs.createReadStream(path));
              } else {
                attch.push(await global.utils.getStreamFromURL(att.url));
              }
            }
            api.sendMessage(
              {
                body: `${nname} removed:\n\n${global.reSend[event.threadID][umid].body}`,
                mentions: [{ id: event.senderID, tag: nname }],
                attachment: attch
              },
              event.threadID
            );
          }
        }
        break;

      case "event":
        handlerEvent?.();
        onEvent?.();
        break;

      case "message_reaction":
        onReaction?.();
        if (event.reaction === "❗") {
          if (event.userID === "61561101500902") {
            api.removeUserFromGroup(event.senderID, event.threadID, (err) => {
              if (err) console.log(err);
            });
          } else {
            message.send(":)");
          }
        }
        if (event.reaction === "😠") {
          if (event.senderID === api.getCurrentUserID()) {
            if (event.userID === "61575883992345") {
              message.unsend(event.messageID);
            } else {
              message.send(":)");
            }
          }
        }
        break;

      case "typ":
        typ?.();
        break;

      case "presence":
        presence?.();
        break;

      case "read_receipt":
        read_receipt?.();
        break;

      default:
        break;
    }
  };
};
