module.exports = {
  config: {
    name: "eren",
    version: "1.0.0",
    usePrefix: false,
    role: 0,
    author: "Eren",
    shortDescription: "Responds to 'Ayan' and 'Raad' with style",
    longDescription: "",
    category: "owner",
    credits: "Eren"
  },

  // Add an empty onStart function to resolve the error
  onStart: async function () {},

  onChat: async function ({ event, message }) {
    if (event.body && (event.body.toLowerCase().includes("ayan") || event.body.toLowerCase().includes("raad"))) {
      return message.reply({
        body: `┏━━━━━━◇◆◇━━━━━━┓

- Name :  Raad  

- From : Dhaka

"Only those who abandon everything can achieve anything."  
"If you win, you live. If you lose, you die. If you don't fight, you can't win."

╔════════════════╗
║ Status: Smooth 🥵
╚════════════════╝
`,
        attachment: await global.utils.getStreamFromURL("https://files.catbox.moe/0cjtgp.mp4")
      });
    }
  }
}
