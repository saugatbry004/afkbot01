const mineflayer = require("mineflayer");

function createBot() {
  const bot = mineflayer.createBot({
    host: "afkbottest.aternos.me", // Your server IP
    port: 36350,                   // Your server port
    username: "AFK_Bot_01"         // Cracked server username
  });

  bot.on("spawn", () => {
    console.log("Bot spawned! Typing infinite effect commands.");

    const effects = [
      "resistance",
      "regeneration",
      "fire_resistance",
      "absorption"
    ];

    // Type each effect command in chat with "infinite" duration
    function sendEffectCommands(index = 0) {
      if (index >= effects.length) return;

      const cmd = `/effect give ${bot.username} minecraft:${effects[index]} infinite`;
      bot.chat(cmd);
      console.log(`Typed: ${cmd}`);

      setTimeout(() => sendEffectCommands(index + 1), 1000); // 1 sec delay between messages
    }

    sendEffectCommands();

    // Anti-AFK: look around + jump every 15 seconds
    setInterval(() => {
      const yaw = Math.random() * Math.PI * 2;
      bot.look(yaw, 0, true);
      bot.setControlState("jump", true);
      setTimeout(() => bot.setControlState("jump", false), 500);
    }, 15000);
  });

  bot.on("death", () => {
    console.log("Bot died!");
  });

  bot.on("kicked", (reason) => {
    console.log("Bot kicked:", reason);
    reconnect();
  });

  bot.on("end", () => {
    console.log("Bot disconnected. Reconnecting...");
    reconnect();
  });

  bot.on("error", (err) => {
    console.log("Error:", err);
  });

  function reconnect() {
    setTimeout(() => {
      console.log("Reconnecting...");
      createBot();
    }, 3000);
  }
}

createBot();
