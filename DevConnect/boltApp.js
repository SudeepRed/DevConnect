const { App } = require("@slack/bolt");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.message("", async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggere
  let text = message.text;
  // console.log(text);
  if (text.length < 10) {
    text = "chatXXXXXXXXXXXXXXX";
  }
  console.log(message);

  const response = await openai.createCompletion("text-davinci-002", {
    prompt:
      "Classify the given Chat message into [bug, feature, feedback]. If it is a bug classify the chat priority based on [low, medium, high, urgent].if it cant be classified return chat.\n" +
      text,
    temperature: 0,
    max_tokens: 100,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  const output = response.data.choices[0].text;
  app.client.chat.postMessage({
    token: process.env.SLACK_BOT_TOKEN,
    channel: message.channel,
    thread_ts: message.ts,
    text: output,
  });
});
(async () => {
  // Start your app
  await app.start(3001);

  console.log("⚡️ Bolt app is running!");
})();
