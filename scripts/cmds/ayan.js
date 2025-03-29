 module.exports = {
config: {
name: "ovhi",
version: "1.0",
author: "NTKhang ||Edited by xos Eren",
countDown: 5,
role: 0,
shortDescription: "no prefix",
longDescription: "no prefix",
category: "no prefix",
},

onStart: async function(){}, 
onChat: async function({ event, message, getLang }) {
if (event.body && event.body.toLowerCase() === "raad") {
return message.reply({
body: "         🎶𝐑𝐚𝐚𝐝' \n \n𝐍𝐚𝐦𝐞 : 𝐑𝐚 𝐀𝐚𝐝\n𝐍𝐢𝐜𝐤𝐧𝐚𝐦𝐞 : 𝐄𝐫𝐮𝐮 ! \n\n\n𝐅𝐫𝐨𝐦𝐞 : 𝐔𝐠𝐚𝐧𝐝𝐚\n     𝐘𝐨𝐮 𝐜𝐚𝐧 𝐂𝐚𝐥𝐥 𝐡𝐢𝐦 𝐄𝐫𝐞𝐧 !\n ",
attachment: await global.utils.getStreamFromURL("https://i.imgur.com/8CKqNVL.mp4")
});
}
}
}
