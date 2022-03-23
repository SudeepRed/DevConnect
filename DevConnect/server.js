const { App } = require("@slack/bolt");
require("dotenv").config();

const slackFunctions = require("./slack/slackFunctions");
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

app.message("", async ({ message, say }) => {
  
  await slackFunctions.messageResponce(message, app);
});
(async () => {
  // Start your app
  await app.start(3001);

  console.log("⚡️ Bolt app is running!");
})();
