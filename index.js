const mineflayer = require("mineflayer");
let bot;

function createBot() {
  bot = mineflayer.createBot({
    host: "AGEN2.aternos.me", // Replace with your server IP
    port: 58248,                   // Replace with your server port
    username: "AFK_Bot"         // Cracked server username
  });

  bot.on("spawn", () => {
    console.log("✅ Bot spawned! Applying effects and starting anti-AFK...");

    applyInvincibleEffects();

    // Anti-AFK: move every 15 seconds
    setInterval(() => {
      const yaw = Math.random() * Math.PI * 2;
      bot.look(yaw, 0, true);
      bot.setControlState("jump", true);
      setTimeout(() => bot.setControlState("jump", false), 500);
    }, 15000);
  });

  bot.on("death", () => {
    console.log("⚠️ Bot died!");
  });

  bot.on("kicked", (reason) => {
    console.log("❌ Kicked:", reason);
    reconnect();
  });

  bot.on("end", () => {
    console.log("🔄 Disconnected. Reconnecting...");
    reconnect();
  });

  bot.on("error", (err) => {
    console.log("❌ Error:", err);
  });
}

// Apply long-duration effects (1,000,000 seconds)
function applyInvincibleEffects() {
  const effects = [
    { name: "resistance", level: 4 },
    { name: "regeneration", level: 1 },
    { name: "fire_resistance", level: 0 },
    { name: "absorption", level: 3 },
  ];

  let index = 0;
  function sendNext() {
    if (index >= effects.length) return;
    const effect = effects[index];
    const cmd = `/effect give ${bot.username} minecraft:${effect.name} 1000000 ${effect.level} true`;
    bot.chat(cmd);
    console.log(`🧪 Sent command: ${cmd}`);
    index++;
    setTimeout(sendNext, 1000);
  }

  sendNext();
}

// Disconnect and reconnect at 12 AM
function scheduleMidnightRestart() {
  const now = new Date();
  const nextMidnight = new Date();
  nextMidnight.setHours(24, 0, 0, 0); // 12:00 AM next day

  const msUntilMidnight = nextMidnight.getTime() - now.getTime();

  console.log(`⏰ Scheduled daily restart in ${Math.round(msUntilMidnight / 1000 / 60)} minutes.`);

  setTimeout(() => {
    console.log("🌙 It's midnight! Restarting bot to reapply effects...");

    if (bot) bot.quit();

    setTimeout(() => {
      createBot();         // reconnect
      scheduleMidnightRestart(); // reschedule next midnight restart
    }, 5000); // wait 5s before reconnect
  }, msUntilMidnight);
}

// Start everything
createBot();
scheduleMidnightRestart();
