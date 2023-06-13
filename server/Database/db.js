import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();
const pool= mysql.createPool({
   host:"localhost",
   user:"root",
   password:process.env.db_pass,
   database:"test"
}).promise(); 

export default pool;