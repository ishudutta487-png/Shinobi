const axios = require("axios");
require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/shinobi-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();

app.command("/shinobi-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text: `Available Commands:
/shinobi-ping - Check bot latency
/shinobi-catfact - Get a random cat fact
/shinobi-joke - Get a random joke`
  });
});

app.command("/shinobi-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});

app.command("/shinobi-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({ text: `${response.data.setup}\n${response.data.punchline}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});

// Array of Sekiro Quotes
const sekiroQuotes = [
  "“Hesitation is defeat.” — *Isshin, The Sword Saint*",
  "“MY NAME IS GYOUBU MASATAKA ONIWA! As I breathe, you will not pass the castle gate!”",
  "“A shinobi should know the difference between honor and victory.” — *Genichiro Ashina*",
  "“One! The parent is absolute. Their will must be obeyed.” — *Great Shinobi Owl*",
  "“Death of a shadow... You've taught me well.” — *Wolf*",
  "“You were still just a puppy.” — *Lady Butterfly*",
  "“How my blood boils!” — *Isshin Ashina*",
  "“WOOOOOOOOOOOOOOOOOOOOO!” — *Nightjar Ninja*"
];

// /shinobi-quote Command
app.command("/shinobi-quote", async ({ ack, respond }) => {
  await ack();

  const randomQuote = sekiroQuotes[Math.floor(Math.random() * sekiroQuotes.length)];
  await respond({
    text: `🥷 *Sekiro Wisdom:*\n> ${randomQuote}`
  });
});