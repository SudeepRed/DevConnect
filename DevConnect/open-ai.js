const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const getOutput = async(message)=>{
    const response = await openai.createCompletion("text-davinci-002", {
        prompt:
          "Classify the given Chat message into [bug, feature]. If it is a bug classify the chat priority based on [low, medium, high, urgent].if it cant be classified return chat. If the Chat contains foul language return Chat\n" +
          message,
        temperature: 0.2,
        max_tokens: 50,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      const output = response.data.choices[0].text.toLowerCase();
      console.log(output);
      return output;
}

module.exports = {
    getOutput,
};