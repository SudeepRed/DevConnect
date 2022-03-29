const client = require("./db");
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
};
