module.exports = {
	config: {
		name: "goadmis",
		version: "1.0",
		author: "ᴀɴɪᴋ_🐢",
		countDown: 5,
		role: 0,
		shortDescription: "sarcasm",
		longDescription: "reply only if exact 'sakib' texts sent",
		category: "reply",
	},

	onStart: async function () {},

	onChat: async function ({ event, api }) {
		const msg = [
			"এত মেনশন না দিয়ে পারলে একটা গার্লফ্রেন্ড দাও 🥲",
			"eto mention disos, ekta real gf dite paros na? sakib boss busy re bro 😏",
			"Sakib ke mention dile tumi crush peye jaba naki? 😹",
			"আর ডাকিস না ভাই, Sakib তো গেমে না গার্লফ্রেন্ড খুঁজতেছে এখন 😉",
			"তুই জাস্ট মেনশন করিস, Sakib বিয়ে করতেও রাজি হয়ে যাবে মনে হয় 😭",
			"bot er upor emon feelings? tui boro ho 😑",
			"onek bar mention korli, ekhon GF ta koi? 🤨",
			"Sakib er naam dia ki তোর NID বানাই দিবো? 😒",
			"Tui Sakib re mention kortes na, propose kortes 😵",
			"ekta reply paowar jonno eto chesta? baper naam ki 'Hope'? 😹"
		];

		const botID = api.getCurrentUserID();
		const content = event.body?.trim().toLowerCase();

		// ✅ Filter: Only allow exact messages, not replies, not self
		const allowed = ["sakib", "@ahmed sakib", "ahmed sakib"];

		if (
			content &&
			allowed.includes(content) &&
			!event.messageReply &&
			event.senderID !== botID
		) {
			api.setMessageReaction("🎀", event.messageID, (err) => {}, true);
			return api.sendMessage(
				{ body: msg[Math.floor(Math.random() * msg.length)] },
				event.threadID,
				event.messageID
			);
		}
	}
};
