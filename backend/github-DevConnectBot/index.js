/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
const DBquery = require("../db/queries");
const OpenAI = require("../open-ai");
const slack = require("../slack/slackFunctions");
module.exports = (app) => {
  // Your code here
  app.log.info("Yay, the app was loaded!");

  app.on("issues.opened", async (context) => {
    if (context.payload.issue.title.length > 10) {
      let classifiedCategory = await OpenAI.classifyChat(
        context.payload.issue.title
      );

      if (
        classifiedCategory.includes("bug") ||
        classifiedCategory.includes("feature")
      ) {
        let category = classifiedCategory.includes("bug") ? "bug" : "feature";
        let p = slack.getPriority(classifiedCategory);
        console.log(p);
        const data = {
          id: context.payload.issue.id,
          owner: context.payload.repository.owner.login,
          message: context.payload.issue.title,
          priority: p,
          sender: context.payload.sender.login,
          sender_avatar: context.payload.sender.avatar_url,
          assigned_user: null,
          repo: context.payload.repository.name,
          ts: new Date(context.payload.issue.created_at).getTime(),
          category: category,
        };
        console.log(data);
        category = classifiedCategory.includes("bug") ? "bug" : "enhancement";
        const issueLabel = context.issue({
          labels: [category],
        });
        console.log(context.octokit.issues.addLabels(issueLabel));
        await DBquery.addGithubIssue(data);

      }
    }

    return;
  });

};
