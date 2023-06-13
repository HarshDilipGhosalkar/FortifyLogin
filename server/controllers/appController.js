import pool from "../Database/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();




/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/
export async function register(req, res) {
    const q = "SELECT * FROM user WHERE email= ? OR username =?";
    const { password, username, email } = req.body;
    try {

        const result = await pool.query(q, [email, username]);

        if (result[0].length) return res.json("user already existed");

        try {

            bcrypt.hash(password, 10)
                .then(hashedPassword => {
                    const q = "INSERT INTO user (`username`, `password`, `email`) VALUES (?,?,?)"
                    pool.query(q, [username, hashedPassword, email]);
                    return res.status(200).json("user successfully created");
                })
        } catch (error) {
            return res.json(error);
        }
    } catch (error) {
        return res.json(error);
    }
}


/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req, res) {
    const { username, password } = req.body;
    try {
        const q = "SELECT * FROM user WHERE username=?";
        pool.query(q, [username])
            .then(user => {
                bcrypt.compare(password, user[0][0].password)
                    .then(passwordCheck => {
                        if (!passwordCheck) return res.status(400).send({ error: "Dont have password" });
                        const id=user[0][0].iduser;
                        
                        const token=jwt.sign({id,username},process.env.JWT_SECRET,{expiresIn:"24h"});
                        return res.status(200).send({
                            msg:"Login successfull",
                            username:username,
                            token
                        })
                    })
                    .catch(error => {
                        return res.status(400).send({ error: "Password does not match" });
                    })
            })
            .catch(() => {
                return res.status(500).send({ error: "user does not found" });
            })
    } catch (error) {
        return res.status(500).json(error)
    }
}

/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req, res) {

}


/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
export async function updateUser(req, res) {

}