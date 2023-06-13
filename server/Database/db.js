import mysql from "mysql";
import dotenv from "dotenv";

export const db= mysql.createConnection({
   host:"localhost",
   user:"root",
   password:process.env.db_pass,
   database:"test"
});