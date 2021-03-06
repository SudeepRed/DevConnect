/* eslint-disable @typescript-eslint/naming-convention */
const OpenAI = require("../open-ai");
const slackBlocks = require("./slackBlocks");
const DBquery = require("./../db/queries");
const messageResponce = async (message, link, user_info) => {
  let text = message.text;
  if (text.length < 10) {
    return null;
  }
  const classifiedCategory = await OpenAI.classifyChat(text);
  console.log( classifiedCategory)
  if (classifiedCategory.includes("chat") && !(classifiedCategory.includes("feature") || classifiedCategory.includes("bug"))) {
    return null;
  } else if (classifiedCategory.includes("bug")) {
    const messageTitle = await OpenAI.addTitle(text,"bug");
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
      avatar: user_info.user.profile.image_original,
      name: user_info.user.name,
    };
    await DBquery.insertSlackPost(slack_post);
    let blocks = slackBlocks.getBugBlock(messageTitle, priority);
    return blocks;
  } else if (classifiedCategory.includes("feature")) {
    const outputTitle = await OpenAI.addTitle(text,"feature");
    let blocks = slackBlocks.getFeatureBlock(outputTitle);
    const slack_post = {
      teamid: message.team,
      message: message.text,
      userid: message.user,
      ts: message.ts,
      channelid: message.channel,
      category: "feature",
      title: outputTitle,
      priority: "Low",
      message_link: link,
      avatar: user_info.user.profile.image_original,
      name: user_info.user.name,
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
  getPriority,
};
