const client = require("./db");
const createdb = async () => {
  try {
    await client.query(`
    CREATE TABLE IF NOT EXISTS user_auth (
      id int PRIMARY KEY,
      profile JSON
    )
  `);
  } catch (e) {
    console.log("Failed to create user_auth table", e);
  }
  try{
    await client.query(`CREATE TABLE IF NOT EXISTS slack_workspace (
      teamid varchar(50) PRIMARY KEY,
      installation JSON NOT NULL
    )`)
  }catch (e) {
    console.log("Failed to create slack_workspace table", e);
  }
  
  
};

module.exports = {
  createdb,
};
