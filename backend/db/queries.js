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
    console.log(res);
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
    await client.query(`INSERT INTO user_auth (id, profile) VALUES ($1, $2)`, [
      id,
      profile,
    ]);
    return true;
  } catch (e) {
    return false;
  }
};
const updateUserAuth = async (id, profile) => {
  try {
    await client.query(`UPDATE user_auth SET profile=$2 WHERE id=$1`, [
      id,
      profile,
    ]);
    return true;
  } catch (e) {
    return false;
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
