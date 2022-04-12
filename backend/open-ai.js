const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const classifyChat = async (message) => {
  const response = await openai.createCompletion("text-davinci-002", {
    prompt:
      "Classify the given customer message into [bug, feature] if it is related to the development team. If it is a bug classify the message severity based on [low, medium, high, urgent]. If it cant be classified return chat. If the message contains foul language return chat. if the customer message is purely code then classify it as chat.\n\n" +
      message,
    temperature: 0,
    max_tokens: 10,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 2,
    best_of: 1,
  });
  const output = response.data.choices[0].text.toLowerCase();
  console.log(output);
  return output;
};
const addTitle = async (message,type) => {
  let prompt = "";
  if(type=="feature"){
    prompt = "extract the feature request from the following message and give it a title.\n"
  }
  else{
    prompt = "You are a GitHub issue generator. you will be given a bug, you have to add a suitable title for it so that developers can generate a bug report.\n"
  }
  const response = await openai.createCompletion("text-davinci-002", {
    prompt: prompt+"\n" + message,
    temperature: 0,
    max_tokens: 70,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  let output = response.data.choices[0].text.trim();
  console.log(output);
  if (output.split("\n").length > 1) {
    t = output.split("\n");
    output = t[t.length - 1];
  }
  output = output.replaceAll('"', "");
  return output;
};
const groupThings = async (message) => {
  message = JSON.stringify(message)
  console.log(message);
  message = (message.replace(/[\[\]]+/g,'-'))
  message = message.replaceAll(',"', '\n-')
  message = message.replaceAll('"','')
  message = message.trim()
  message = message.substring(0, message.length - 1)
  console.log(message)
  const response = await openai.createCompletion("text-davinci-002", {
    prompt:
      "Group the following related tasks together, assign a title to the grouped category, break down the bugs into smaller bugs and group unique task together with a relevant title. Return the grouped tasks as a JSON dictionary where the key is the title, and the values are the related tasks.\n" +
      message,
    temperature: 0,
    max_tokens: 1300,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  let output = response.data.choices[0].text.replace(/(\r\n|\n|\r)/gm, "");
  console.log()
  console.log(output);
  let isJSON = false;
  try {
    let temp = JSON.parse(output);
    isJSON = true;
  } catch (e) {
    output = "";
    console.log("no JSON for u");
  }
  return output;
  // return null;
};
module.exports = {
  classifyChat,
  addTitle,
  groupThings,
};
