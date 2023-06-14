import db from "../Database/db.js";
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

        db.query(q, [email, username], (err, result) => {
            console.log(result);
            if (result.length !== 0) return res.send({ msg: "User ALready exists...!" });
            try {

                bcrypt.hash(password, 10)
                    .then(hashedPassword => {
                        const q = "INSERT INTO user (`username`, `password`, `email`) VALUES (?,?,?)"
                        db.query(q, [username, hashedPassword, email]);
                        return res.status(200).json("user successfully created");
                    })
            } catch (error) {
                return res.send({ error });
            }
        });
    } catch (error) {
        return res.send({ error });
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
        db.query(q, [username], (err, data) => {
            console.log(data[0].password);
            if (err) return res.status(400).send({ error: "user not found" });
            bcrypt.compare(password, data[0].password)
                .then(passwordCheck => {
                    if (!passwordCheck) return res.status(400).send({ error: "Dont have password" });
                    const id = data[0].iduser;

                    const token = jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: "24h" });
                    return res.status(200).send({
                        msg: "Login successfull",
                        username: username,
                        token
                    })
                })
                .catch(error => {
                    return res.status(400).send({ error: "Password does not match" });
                })
        })
    } catch (error) {
        return res.status(500).send({ error })
    }
}

/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req, res) {
    const { username } = req.params;
    console.log(username);
    try {
        if (!username) return res.status(501).send({ error: "Invalidusername" })
        const q = "SELECT * FROM user WHERE username=?";
        pool.query(q, [username], (err, data) => {
            if (err) return res.status(404).send({ error: "User not found" });
            return res.send(data[0]);
        })
    } catch (error) {
        return res.status(400).send({ error: "cannot find user data" });
    }
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