const cmd = {
  config: {
    name: "slot",
    aliases: ["bet"],
    version: "1.6.9",
    author: "Nazrul",
    category: "game",
    guide: "{pn} <amount>",
    countDown: 5
  },

  onStart: async function ({ args, message, event, usersData }) {
    const { senderID } = event;
    const userData = await usersData.get(senderID);
    const bet = parseMoney(args[0]);

    if (!bet || bet <= 0) return message.reply("🎀 Please enter a valid amount!");
    if (bet > userData.money) return message.reply(`🎀 Your Current balance ${formatMoney(userData.money)}!`);

    const symbols = [
      { emoji: "🦆", weight: 35, payout: [0,0,2,5,10] },
      { emoji: "🎀", weight: 30, payout: [0,0,3,7,15] },
      { emoji: "🍓", weight: 25, payout: [0,0,4,10,20] },
      { emoji: "❤️", weight: 15, payout: [0,0,5,15,30] },
      { emoji: "💜", weight: 10, payout: [0,0,7,20,50] },
      { emoji: "💙", weight: 5, payout: [0,0,10,30,100] },
      { emoji: "🤍", weight: 3, payout: [0,0,20,50,200] },
      { emoji: "💚", weight: 2, payout: [0,0,50,150,500] }
    ];

    const reels = Array(5).fill().map(() => {
      const pool = symbols.flatMap(s => Array(s.weight).fill(s.emoji));
      return pool[Math.floor(Math.random() * pool.length)];
    });

    const result = calculateResult(reels, symbols, bet);
    const newBalance = userData.money + result.win;
    await usersData.set(senderID, { money: newBalance });

    return message.reply({
      body: createResponse(userData.name || "Player", reels.join(" | "), result, bet, newBalance),
      mentions: [{ id: senderID, tag: userData.name }]
    });
  }
};

function calculateResult(reels, symbols, bet) {
  const counts = reels.reduce((a, e) => (a[e] = (a[e] || 0) + 1, a), {});
  let win = 0, combos = [], jackpot = false;

  Object.entries(counts).forEach(([sym, cnt]) => {
    const s = symbols.find(s => s.emoji === sym);
    const match = Math.min(cnt, 5);
    if (match >= 3 && s.payout[match-1]) {
      const amount = bet * s.payout[match-1];
      win += amount;
      combos.push(`${sym} x${cnt} (${s.payout[match-1]}x)`);
      if (match >= 5) jackpot = true;
    }
  });

  const pairs = Object.values(counts).filter(c => c === 2).length;
  if (pairs >= 2 && win === 0) {
    win = bet * 1.5;
    combos.push("Two Pairs (1.5x)");
  }

  return {
    win: win || -bet,
    type: jackpot ? "jackpot" : win >= bet * 10 ? "big" : win > 0 ? "normal" : "loss",
    combos
  };
}

function createResponse(name, reels, {win, type, combos}, bet, newBalance) {
  const absWin = Math.abs(win);
  const formattedWin = formatMoney(absWin);
  const formattedNewBalance = formatMoney(newBalance);

  if (win > 0) {
    const baseMessages = {
      jackpot: `🎀 JACKPOT! \n\n👑 ${name} WON ${formattedWin}!\n\n${reels}\n\n⚡ ${combos.join("\n")}\n\n🏆 JACKPOT!`,
      big: `🎀 BIG WIN! \n\n👑 ${name} won ${formattedWin}!\n\n${reels}\n\n⚡ ${combos.join("\n")}`,
      normal: `👑 ${name} won ${formattedWin}!\n\n${reels}\n\n⚡ ${combos.join(", ")}`
    };
    return `${baseMessages[type]}\n\n💰 New Balance: ${formattedNewBalance}\n`;
  }
  
  return `🦆 Better luck next time!\n\n🧢 ${name}\n💸 Lost: ${formattedWin}\n\n${reels}\n\n💰 Available Balance: ${formattedNewBalance}\n`;
}

function formatMoney(amount) {
  if (amount < 1000) return `$${amount.toFixed(2)}`;

  const suffixes = [
    '', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc',
    'Ud', 'Dd', 'Td', 'Qad', 'Qid', 'Sxd', 'Spd', 'Od', 'Nd', 'Vg'
  ]; // Up to Vigintillion

  const exp = Math.floor(Math.log10(amount) / 3);
  const shortValue = (amount / Math.pow(1000, exp)).toFixed(2);

  return `$${shortValue}${suffixes[exp] || ''}`;
}

function parseMoney(input) {
  if (!input) return NaN;

  const match = input.match(/^([\d.,]+)\s*([a-zA-Z]*)$/);
  if (!match) return NaN;

  const num = parseFloat(match[1].replace(/,/g, ''));
  const suffix = match[2].toLowerCase();

  const multipliers = {
    'k': 1e3,
    'm': 1e6,
    'b': 1e9,
    't': 1e12,
    'qa': 1e15,
    'qi': 1e18,
    'sx': 1e21,
    'sp': 1e24,
    'oc': 1e27,
    'no': 1e30,
    'dc': 1e33,
    'ud': 1e36,
    'dd': 1e39,
    'td': 1e42,
    'qad': 1e45,
    'qid': 1e48,
    'sxd': 1e51,
    'spd': 1e54,
    'od': 1e57,
    'nd': 1e60,
    'vg': 1e63
  };

  let multiplier = 1;
  for (const key in multipliers) {
    if (suffix.startsWith(key)) {
      multiplier = multipliers[key];
      break;
    }
  }

  return num * multiplier;
}

module.exports = cmd;
