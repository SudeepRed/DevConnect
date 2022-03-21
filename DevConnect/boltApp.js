const { App } = require("@slack/bolt");
require("dotenv").config();
const {getOutput} = require("./open-ai")
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});



app.message("", async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggere
  let text = message.text;
  // console.log(text);
  if (text.length < 10) {
    return;
  }
  console.log(message.text);


  const output = await getOutput(text)
  console.log();
  const chat = "chat"
  const bug = "bug"
  const feedback = "feedback"
  const feature = "feature"
  if(output.includes(chat)) {
    return;
  }
  else if(output.includes(bug)){
    const low = "low"
    const high = "high"
    const medium = "medium"
    const urgent = "urgent"
    let priority =""
    if(output.includes(low)) priority = "Low"
    if(output.includes(high)) priority = "High"
    if(output.includes(medium)) priority = "Medium"
    if(output.includes(urgent)) priority = "Urgent"

    let output_message = 
    [
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "Bug Reported:ladybug:",
          "emoji": true
        }
      },
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "Priority: " +priority,
          "emoji": true
        }
      },
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "Add details in this thread so that developers can solve it ASAP :rocket:",
          "emoji": true
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Not a bug?"
        },
        "accessory": {
          "type": "button",
          "style": "danger",
          "text": {
            "type": "plain_text",
            "text": "Delete :wastebasket:",
            "emoji": true
          },
          "value": "click_me_123",
          "action_id": "button-action"
        }
      }
    ]
    


    app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: message.channel,
      thread_ts: message.ts,
      blocks: output_message,
      text: message.text
    });
  }
  else if(output.includes(feature)){
    let output_message = [
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "Feature Request :pencil2: ",
          "emoji": true
        }
      },
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "Please elaborate your request in this thread so that developers can build it ASAP :rocket:",
          "emoji": true
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Not a feature request?"
        },
        "accessory": {
          "type": "button",
          "style": "danger",
          "text": {
            "type": "plain_text",
            "text": "Delete :wastebasket:",
            "emoji": true
          },
          "value": "click_me_123",
          "action_id": "button-action"
        }
      }
    ]
    app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: message.channel,
      thread_ts: message.ts,
      blocks: output_message,
      text: message.text
    });
  }
  else if(output.includes(feedback)){
    let output_message = [
      {
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": "Thank you for your feedback. It helps us stay motivated and deliver the best product for you :hugging_face:",
          "emoji": true
        }
      }
    ]
    app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: message.channel,
      thread_ts: message.ts,
      blocks: output_message,
      text: message.text
    });
  }
  
});
(async () => {
  // Start your app
  await app.start(3001);

  console.log("⚡️ Bolt app is running!");
})();
