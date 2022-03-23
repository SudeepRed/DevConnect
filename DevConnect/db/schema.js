const client = require("./db");
const createdb = async () => {
  try {
    await client.query(`
  CREATE TABLE IF NOT EXISTS workspace (
    workspace_id varchar(50) PRIMARY KEY,
    workspace_name varchar(200) NOT NULL,
    workspace_installation JSON NOT NULL
 )
  `);
  } catch (e) {
    console.log("Failed to create workspace table", e);
  }
  try {
    await client.query(`
  CREATE TABLE IF NOT EXISTS teams (
    team_id SERIAL,
    workspace_id varchar(50) NOT NULL,
    team_name varchar(200) NOT NULL,
 
    PRIMARY KEY (team_id),
    CONSTRAINT fk_workspace_team
        FOREIGN KEY(workspace_id) 
      REFERENCES workspace(workspace_id)
	);`);
  } catch (e) {
    console.log("Failed to create teams table", e);
  }
  try {
    await client.query(`
    CREATE TABLE IF NOT EXISTS goals (
      Goal_id  Serial,
    Team_id int NOT NULL,
    Startdate BIGINT NOT NULL,
    Enddate BIGINT NOT NULL,
    Frequency varchar(50) NOT NULL default 'weekly',
    status varchar(50) NOT NULL default 'Live',
   
      PRIMARY KEY (goal_id, team_id),
      CONSTRAINT fk_goal_team
          FOREIGN KEY(team_id) 
        REFERENCES teams(team_id),
    CONSTRAINT CHK_frq
      CHECK(frequency IN ('daily', 'weekly','fortnightly','monthly')),
    CONSTRAINT CHK_status
      CHECK(status IN ('Live', 'Archive'))
    );`);
  } catch (e) {
    console.log("Failed to create goals table", e);
  }
  try {
    await client.query(`
    CREATE TABLE IF NOT EXISTS objectives (
      objective_id SERIAL,
      goal_id int NOT NULL,
      Team_id int NOT NULL,
      Obj_name text,
     
        PRIMARY KEY (objective_id, goal_id, team_id),
        CONSTRAINT fk_goal_obejctive
            FOREIGN KEY(goal_id, team_id) 
          REFERENCES goals(goal_id, team_id)
      );`);
  } catch (e) {
    console.log("Failed to create objectives table", e);
  }
  try {
    await client.query(`
    CREATE TABLE IF NOT EXISTS keyresults (
      kr_id SERIAL,
      objective_id int NOT NULL,
      goal_id int NOT NULL,
      Team_id int NOT NULL,
      kr_name text,
      kr_progress int NOT NULL default 0,
     
        PRIMARY KEY (kr_id, goal_id, team_id, objective_id),
        CONSTRAINT fk_goal_kr
            FOREIGN KEY(goal_id, team_id, objective_id) 
          REFERENCES objectives(goal_id, team_id, objective_id)
      
      );`);
  } catch (e) {
    console.log("Failed to create keyresults table", e);
  }
  try {
    await client.query(`
    CREATE TABLE IF NOT EXISTS member_team (
      team_id int NOT NULL,
      member_id varchar(50) NOT NULL,
      roles varchar(50) NOT NULL default 'member',
      
     
        PRIMARY KEY (team_id,member_id),
        CONSTRAINT fk_team_member
            FOREIGN KEY(team_id) 
          REFERENCES teams(team_id)
    
      );`);
  } catch (e) {
    console.log("Failed to create member_team table", e);
  }
  try {
    await client.query(`
    CREATE TABLE IF NOT EXISTS channel_team (
      team_id int NOT NULL,
      channel_id varchar(50) NOT NULL,
    
      
     
        PRIMARY KEY (team_id,channel_id),
        CONSTRAINT fk_team_channel
            FOREIGN KEY(team_id) 
          REFERENCES teams(team_id)
    
      );`);
  } catch (e) {
    console.log("Failed to create channel_team  table", e);
  }
  
};

module.exports = {
  createdb,
};
