const client = require("./db");
const createdb = async () => {
  try {
    await client.query(`
    CREATE TABLE IF NOT EXISTS user_auth (
      id int PRIMARY KEY,
      email varchar(100) UNIQUE NOT NULL,
      profile JSON
       
    )
  `);
  } catch (e) {
    console.log("Failed to create user_auth table", e);
  }
  try {
    await client.query(`CREATE TABLE IF NOT EXISTS slack_workspace (
      teamid varchar(50) PRIMARY KEY,
      installation JSON NOT NULL,
      teaminfo JSON NOT NULL
    )`);
  } catch (e) {
    console.log("Failed to create slack_workspace table", e);
  }
  try {
    await client.query(`CREATE INDEX IF NOT EXISTS idx_email_github 
    ON user_auth(email)`);
  } catch (e) {
    console.log("Failed to create index on email github auth", e);
  }
  try {
    await client.query(`CREATE TABLE IF NOT EXISTS slack_posts(
      teamid varchar(50) NOT NULL,
      message text NOT NULL,
      userid varchar(50) NOT NULL,
      ts numeric PRIMARY KEY,
      channelid varchar(50) NOT NULL,
      category varchar(25) NOT NULL,
      title text NOT NULL,
      priority varchar(25) NOT NULL,
      message_link varchar(500)
      
    )`);
  } catch (e) {
    console.log("Failed to create slack_posts table", e);
  }
  try {
    await client.query(`CREATE TABLE IF NOT EXISTS slack_github(
      email varchar(100) NOT NULL,
        teamid varchar(50) NOT NULL,
        PRIMARY KEY (email,teamid),
        CONSTRAINT fk_github
            FOREIGN KEY(email) 
          REFERENCES user_auth(email),
        CONSTRAINT fk_slack
            FOREIGN KEY(teamid) 
          REFERENCES slack_workspace(teamid)
        
      ) `);
  } catch (e) {
    console.log("Failed to create slack_posts table", e);
  }
  try {
    await client.query(`ALTER TABLE slack_posts ADD COLUMN IF NOT EXISTS priority_id  int GENERATED ALWAYS AS
    (case when priority = ('High')
          then 3
   when priority = ('Urgent')
     then 4
   when priority = ('Medium')
   then 2
   when priority = ('Low')
   then 0
          else 1
     end ) STORED; `);
  } catch (e) {
    console.log("Failed to Alter slack_posts table", e);
  }
  try {
    await client.query(
      ` ALTER TABLE slack_posts ADD COLUMN IF NOT EXISTS channel_name varchar(100) DEFAULT null;`
    );
  } catch (e) {
    console.log("Failed to Alter slack_posts table", e);
  }
  try {
    await client.query(
      ` ALTER TABLE slack_posts ADD COLUMN IF NOT EXISTS user_avatar varchar(1000) DEFAULT null;`
    );
  } catch (e) {
    console.log("Failed to Alter slack_posts table", e);
  }
  try {
    await client.query(
      ` ALTER TABLE slack_posts ADD COLUMN IF NOT EXISTS user_name varchar(100) DEFAULT null;`
    );
  } catch (e) {
    console.log("Failed to Alter slack_posts table", e);
  }
};

module.exports = {
  createdb,
};
