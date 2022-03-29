// eslint-disable-next-line @typescript-eslint/naming-convention
const { App } = require("@slack/bolt");
require("dotenv").config();
const GitHubStrategy = require("passport-github").Strategy;
const passport = require("passport");
const express = require("express");
const schema = require("./db/schema");
const slackFunctions = require("./slack/slackFunctions");
const DBquery = require("./db/queries");
const jwt = require("jsonwebtoken");

const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

slackApp.message("", async ({ message, say }) => {
  await slackFunctions.messageResponce(message, slackApp);
});

(async () => {
  //create db
  schema.createdb();
  //start slack app
  await slackApp.start(3001);
  console.log("⚡️ Slack app is running on 3001!");

  //passport serializeUser
  passport.serializeUser(function (user, done) {
    done(null, user.accessToken);
  });
  //passport github authentication
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3002/auth/github/callback",
      },
      async function (accessToken, refreshToken, profile, cb) {
        console.log(profile);
        let res = await DBquery.findUserExists(profile.id);
        cb(null, {
          accessToken: jwt.sign({ userId: profile.id }, "aksjdhajkhsdgal;sdh", {
            expiresIn: "1y",
          }),
        });
        if (!res) {
          DBquery.addUserAuth(profile.id, profile);
        } else {
          DBquery.updateUserAuth(profile.id, profile);
        }
      }
    )
  );
  //express app
  const expressApp = express();

  //paths
  expressApp.get(
    "/auth/github",
    passport.authenticate("github", { session: false })
  );

  //auth call back
  expressApp.get(
    "/auth/github/callback",
    passport.authenticate("github", { session: false }),
    function (req, res) {
      res.redirect(`http://localhost:54321/auth/${req.user.accessToken}`);
    }
  );

  //healthcheck
  expressApp.get("/", (req, res) => {
    res.send("Hey from express");
  });

  //starting express app
  expressApp.listen(3002, () => {
    console.log("⚡️ Express app listening on 3002!");
  });
  expressApp.use(passport.initialize());
})();
