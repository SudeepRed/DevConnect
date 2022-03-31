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
const auth = require("./isAuth");

const slackApp = new App({
  // token: process.env.SLACK_BOT_TOKEN,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  stateSecret: "aksjdhakjsdhkajd",
  // socketMode: true,
  // appToken: process.env.SLACK_APP_TOKEN,
  scopes: [
    "chat:write",
    "channels:history",
    "users:read",
    "users:read.email",
    "team:read",
  ],
  installerOptions: {
    stateVerification: false,
  },
  installationStore: {
    storeInstallation: async (installation) => {
      if (installation.team !== undefined) {
        try {
          const user_details = await slackApp.client.users.info({
            token: installation.bot.token,
            user: installation.user.id,
          });
          const teaminfo = await slackApp.client.team.info({
            token: installation.bot.token,
            teamid: installation.team.id,
          });
          return await DBquery.setInstallation(
            installation.team.id,
            installation,
            user_details.user.profile.email,
            teaminfo.team
          );
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
  const link = await slackApp.client.chat.getPermalink({
    token: process.env.SLACK_BOT_TOKEN,
    channel: message.channel,
    message_ts: message.ts,
  });

  if (!message.hasOwnProperty("bot_profile")) {
    const blocks = await slackFunctions.messageResponce(
      message,
      link.permalink
    );
    if (blocks) {
      await client.chat.postMessage({
        token: process.env.SLACK_BOT_TOKEN,
        channel: message.channel,
        thread_ts: message.ts,
        blocks: blocks,
        text: message.text,
      });
    }
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
  expressApp.use(express.json());
  expressApp.use(cors({ origin: "*" }));
  //paths
  expressApp.get(
    "/auth/github",
    passport.authenticate("github", { session: false })
  );
  expressApp.get("/github-repo", async (req, res) => {
    // Bearer 120jdklowqjed021901
    const authHeader = req.headers.authorization;

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
    const owner = user.username;
    const data = await DBquery.getUserRepos(owner);

    res.send({ repo: data });
  });

  expressApp.get("/slack-workspace", async (req, res) => {
    // Bearer 120jdklowqjed021901
    const authHeader = req.headers.authorization;

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
    const email = user.emails[0].value;
    const workspaces = await DBquery.getUserWorkspaces(email);

    res.send({ workspaces: workspaces, userInfo: user });
  });
  //auth call back
  expressApp.get(
    "/auth/github/callback",
    passport.authenticate("github", { session: false }),
    function (req, res) {
      // res.send("redirecting");
      res.redirect(`http://localhost:54321/auth/${req.user.accessToken}`);
    }
  );
  expressApp.post("/getInfo/slack", async (req, res) => {
    const { teamid } = req.body;
    console.log(req.body);
    if (teamid) {
      const data = await DBquery.getInfo(teamid);
      console.log(data);
      return res.send({ data });
    } else return res.status(200).json({ data: null });
  });
  expressApp.post("/getInfo/github", async (req, res) => {
    const { owner, repo } = req.body;
    console.log(req.body);
    if (owner) {
      const data = await DBquery.getInfoGH(owner,repo);
      // console.log(data);
      return res.send({ data });
    } else return res.status(200).json({ data: null });
  });

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
