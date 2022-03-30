const client = require("./db");
const setInstallation = async (teamid, installation) => {
  console.log("HEre");
  try {
    return await client.query(
      `INSERT INTO slack_workspace (teamid,installation) VALUES ($1,$2)
      ON CONFLICT(teamid) 
      DO 
      UPDATE SET installation = $2`,
      [teamid, installation]
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
module.exports = {
  findUserExists,
  addUserAuth,
  updateUserAuth,
  findUser,
  setInstallation,
  getInstallation,
};
