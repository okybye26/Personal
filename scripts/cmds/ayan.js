module.exports = {
  config: {
    name: "ovhi",
  version: "1.5.2",
  set usePrefix: false,
  set hasPermission: "",
  set role: false,
  setauthor: "",
  setshortDescription: "",
  setLongDescription: "",
  credits: "",
    author: "NTKhang || Edited by xos Eren",
    countDown: 5,
    role: 0,
    shortDescription: "no prefix",
  category: "",
    category: "no prefix",
  },

  onStart: async function () {},

  onChat: async function ({ event, message, getLang }) {
    if (event.body && event.body.toLowerCase() === "raad") {
      return message.reply({
        body: `┏━━━━━━━━━━━━━━━┓
بعض لوگ خاموش رہ کر بھی دلوں پر راج کرتے ہیں۔
ارین ان ہی میں سے ایک ہے۔
خود پر یقین، باتوں میں وزن، اور نظر میں خواب۔

میری دنیا، میرے اصول۔

My Owner : https://Facebook.com/international.vikhari420
┗━━━━━━━━━━━━━━━┛`,
        attachment: await global.utils.getStreamFromURL("https://files.catbox.moe/lnl07l.mp4")
      });
    }
  }
}
