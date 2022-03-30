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
const cors = require("cors");

const slackApp = new App({
  // token: process.env.SLACK_BOT_TOKEN,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  stateSecret: "aksjdhakjsdhkajd",
  // socketMode: true,
  // appToken: process.env.SLACK_APP_TOKEN,
  scopes: ["chat:write", "channels:history"],
  installerOptions: {
    stateVerification: false,
  },
  installationStore: {
    storeInstallation: async (installation) => {
      if (installation.team !== undefined) {
        try {
          console.log("DONE");
          return await DBquery.setInstallation(installation.team, installation);
        } catch (error) {
          console.log(error);
        }

        return;
      }
      throw new Error("Failed saving installation data to installationStore");
    },
    fetchInstallation: async (installQuery) => {
      if (installQuery.teamId !== undefined) {
        return await DBquery.getInstallation(installQuery.teamId);
      }
      // throw new Error("Failed fetching installation");
    },
    deleteInstallation: async (installQuery) => {
      if (installQuery.teamId !== undefined) {
        return await DBquery.deleteInstallation(installation.teamId);
      }
      throw new Error("Failed to delete installation");
    },
  },
});

slackApp.message("", async ({ message, say, ack, client }) => {
  //Ignore thread bot reply
  if (!message.hasOwnProperty("bot_profile")) {
   await client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: message.channel,
      thread_ts: message.ts,
      blocks: await slackFunctions.messageResponce(message),
      text: message.text,
    });
  }
  return;
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
          accessToken: jwt.sign(
            { userId: profile.id },
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: "1y",
            }
          ),
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
  expressApp.use(cors({ origin: "*" }));
  //paths
  expressApp.get(
    "/auth/github",
    passport.authenticate("github", { session: false })
  );
  // expressApp.get("/auth/slack/redirect", async (req, res) => {
  //   console.log(req);
  //   const code = req.query.code;
  //   // res.send("redirecting");
  //   console.log(code)
  //   if (code) {
  //     const token = await slackApp.client.oauth.access({
  //       client_id: process.env.SLACK_CLIENT_ID,
  //       client_secret: process.env.SLACK_CLIENT_SECRET,
  //       code: code,
  //       redirect_uri: "https://eab6-2405-201-4005-898b-517b-a724-47cd-31b1.ngrok.io/auth/slack/redirect"
  //     });
  //   }
  // });
  expressApp.get("/me", async (req, res) => {
    // Bearer 120jdklowqjed021901
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (!authHeader) {
      res.send({ user: null });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.send({ user: null });
      return;
    }

    let userId = "";

    try {
      const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      userId = payload.userId;
    } catch (err) {
      res.send({ user: null });
      return;
    }

    if (!userId) {
      res.send({ user: null });
      return;
    }

    const user = await DBquery.findUser(userId);

    res.send({ user });
  });
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
