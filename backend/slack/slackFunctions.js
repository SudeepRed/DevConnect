/* eslint-disable @typescript-eslint/naming-convention */
const OpenAI = require("../open-ai");
const slackBlocks = require("./slackBlocks");
const DBquery = require("./../db/queries");
const messageResponce = async (message, link) => {
  let text = message.text;
  if (text.length < 10) {
    return null;
  }
  const classifiedCategory = await OpenAI.classifyChat(text);

  if (classifiedCategory.includes("chat")) {
    return null;
  } else if (classifiedCategory.includes("bug")) {
    const messageTitle = await OpenAI.addTitle(text);
    let priority = getPriority(classifiedCategory);
    const slack_post = {
      teamid: message.team,
      message: message.text,
      userid: message.user,
      ts: message.ts,
      channelid: message.channel,
      category: "bug",
      title: messageTitle,
      priority: priority,
      message_link: link,
    };
    await DBquery.insertSlackPost(slack_post);
    let blocks = slackBlocks.getBugBlock(messageTitle, priority);
    return blocks;
  } else if (classifiedCategory.includes("feature")) {
    const outputTitle = await addTitle(text);
    let blocks = slackBlocks.getFeatureBlock(outputTitle);
    const slack_post = {
      teamid: message.team,
      message: message.text,
      userid: message.user,
      ts: message.ts,
      channelid: message.channel,
      category: "feature",
      title: messageTitle,
      priority: priority,
      message_link: link,
    };
    await DBquery.insertSlackPost(slack_post);
    return blocks;
  }
};

const getPriority = (text) => {
  let priority = "";
  if (text.includes("low")) {
    priority = "Low";
  }
  if (text.includes("high")) {
    priority = "High";
  }
  if (text.includes("medium")) {
    priority = "Medium";
  }
  if (text.includes("urgent")) {
    priority = "Urgent";
  }
  if (priority === "") {
    priority = "Low/Medium";
  }
  return priority;
};

const postMessage = async (app, message, blocks) => {
  await app.client.chat.postMessage({
    token: process.env.SLACK_BOT_TOKEN,
    channel: message.channel,
    thread_ts: message.ts,
    blocks: blocks,
    text: message.text,
  });
  return postMessage;
};

module.exports = {
  messageResponce,
};
