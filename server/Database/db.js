import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();
const db= mysql.createConnection({
   host:"localhost",
   user:"root",
   password:process.env.db_pass,
   database:"test"
}); 

export default db;