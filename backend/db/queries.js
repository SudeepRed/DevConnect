const client = require("./db");
const setInstallation = async (
  teamid,
  installation,
  user_details,
  teaminfo
) => {
  console.log("HEre");
  try {
    await client.query(
      `INSERT INTO slack_workspace (teamid,installation,teaminfo) VALUES ($1,$2,$3)
      ON CONFLICT(teamid) 
      DO 
      UPDATE SET installation = $2, teaminfo = $3`,
      [teamid, installation, teaminfo]
    );
    console.log(user_details);
    console.log(teamid);
    const res = await client.query(
      `INSERT INTO slack_github (email, teamid) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
      [user_details, teamid]
    );
  } catch (e) {
    console.log("oops");
    return null;
  }
};
const getInstallation = async (teamid) => {
  console.log("HERE");
  try {
    const res = await client.query(
      `SELECT installation FROM slack_workspace WHERE teamid = $1`,
      [teamid]
    );
    return res.rows[0];
  } catch (e) {
    return null;
  }
};
const findUserExists = async (id) => {
  try {
    let res = await client.query(`SELECT * FROM user_auth WHERE id = $1`, [id]);
    res = res.rows.length;
    console.log(res, "HERE");
    if (res > 0) return true;
    else return false;
  } catch (e) {
    return false;
  }
};
const findUser = async (id) => {
  try {
    let res = await client.query(
      `SELECT profile FROM user_auth WHERE id = $1`,
      [id]
    );
    res = res.rows[0].profile;
    console.log(res);
    return res;
  } catch (e) {
    return null;
  }
};
const addUserAuth = async (id, profile) => {
  try {
    console.log("HERE");
    const res = await client.query(
      `INSERT INTO user_auth (id, email, profile) VALUES ($1, $2, $3) ON CONFLICT (id)
    DO UPDATE SET email = $2 , profile = $3`,
      [id, profile.emails[0].value, profile]
    );
  } catch (e) {
    console.log(e, "ERROR in inserting to user_auth");
  }
  return true;
};
const updateUserAuth = async (id, profile) => {
  try {
    console.log("UPDATE");
    const res = await client.query(
      `UPDATE user_auth SET profile=$2, email=$3 WHERE id=$1`,
      [id, profile, profile.emails[0].value]
    );
  } catch (e) {
    console.log(e, "ERROR in updating user_auth");
  }
};
const insertSlackPost = async (slack_post) => {
  try {
    const {
      teamid,
      message,
      userid,
      ts,
      channelid,
      category,
      title,
      priority,
      message_link,
    } = slack_post;
    console.log(slack_post);
    console.log("Slack POST INSERT");
    const res = await client.query(
      `INSERT INTO slack_posts (teamid, message, userid, ts, channelid, category, title, priority, message_link) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        teamid,
        message,
        userid,
        ts,
        channelid,
        category,
        title,
        priority,
        message_link,
      ]
    );
  } catch (e) {
    console.log(e, "ERROR in inserting slack_post");
  }
};
const getUserWorkspaces = async (email) => {
  try {
    const res = await client.query(`SELECT w.teaminfo FROM slack_workspace as w INNER JOIN slack_github sg ON sg.teamid=w.teamid WHERE sg.email = $1`,[email]);
    return res.rows
  } catch {}
  const t = {
    id: "T0377063THA",
    name: "VSChat",
    url: "https://vschatworkspace.slack.com/",
    domain: "vschatworkspace",
    email_domain: "",
    icon: {
      image_102:
        "https://a.slack-edge.com/80588/img/avatars-teams/ava_0015-102.png",
      image_132:
        "https://a.slack-edge.com/80588/img/avatars-teams/ava_0015-132.png",
      image_230:
        "https://a.slack-edge.com/80588/img/avatars-teams/ava_0015-230.png",
      image_34:
        "https://a.slack-edge.com/80588/img/avatars-teams/ava_0015-34.png",
      image_44:
        "https://a.slack-edge.com/80588/img/avatars-teams/ava_0015-44.png",
      image_68:
        "https://a.slack-edge.com/80588/img/avatars-teams/ava_0015-68.png",
      image_88:
        "https://a.slack-edge.com/80588/img/avatars-teams/ava_0015-88.png",
      image_default: true,
    },
    avatar_base_url: "https://ca.slack-edge.com/",
    is_verified: false,
  };
};

module.exports = {
  findUserExists,
  addUserAuth,
  updateUserAuth,
  findUser,
  setInstallation,
  getInstallation,
  insertSlackPost,
  getUserWorkspaces
};
