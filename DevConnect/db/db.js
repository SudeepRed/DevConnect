const {Pool}=require('pg')
require("dotenv").config();

const client=new Pool(JSON.parse(process.env.db))
module.exports=client