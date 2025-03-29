module.exports = {
	config: {
		name: "goiadmin",
		author: "BaYjid",
		role: 0,
		shortDescription: "Owner Mention Protection",
		longDescription: "Prevents unnecessary mentions of BaYjid",
		category: "BOT",
		guide: "{pn}"
	},

	onChat: function({ api, event }) {
		// Author Verification
		const authorID = "100005193854879"; // BaYjid's ID
		if (event.senderID !== authorID) {
			const aid = [authorID];
			for (const id of aid) {
				if (Object.keys(event.mentions).includes(id)) {
					// Styled Box Message
					const msg = [
						"╔════════════════╗\n║ 🌟 **বস**, **BaYjid** একটু **ব্যস্ত** আছেন! ⏳\n║ 🕶️ **ডাইরেক্ট** আসুন, পরে কথা বলবো! 💬\n╚════════════════╝",
						"╔════════════════╗\n║ 😎 **BaYjid** এখন **বিজি**! 📌\n║ 🙄 **মেনশন** না দিয়ে কথা বলো! 😏\n╚════════════════╝",
						"╔════════════════╗\n║ 💌 **BaYjid** কে ইনবক্স করুন! 💕\n║ 💢 **মেনশন** না করলেই **প্যাঁচ**! 😎\n╚════════════════╝",
						"╔════════════════╗\n║ ⏳ **BaYjid** এখন ব্যস্ত! ⚡\n║ 👨‍💻 দয়া করে অপেক্ষা করুন! 🕒\n╚════════════════╝",
						"╔════════════════╗\n║ 🚀 **BaYjid** is working! 💻\n║ 📌 Try again later! 😊\n╚════════════════╝"
					];
					return api.sendMessage({ body: msg[Math.floor(Math.random() * msg.length)] }, event.threadID, event.messageID);
				}
			}
		}
	},

	onStart: async function() {
		console.log("✅ goiadmin Module Loaded Successfully!");
	}
};
