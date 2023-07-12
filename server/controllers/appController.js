import db from "../Database/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { query } from "express";
dotenv.config();



/** middleware for verify user */
export async function verifyUser(req, res, next) {
    try {

        const { email } = req.method == "GET" ? req.query : req.body;

        // check the user existance
        const q = "SELECT * FROM user WHERE email=?";
        db.query(q, [email], (err, data) => {
            if (err) return res.status(400).send({ error: "user not found" });
            if (data.length === 0) return res.status(404).send({ error: "userss not found" });
            next();
        })


    } catch (error) {
        return res.status(404).send({ error: "Authentication Error" });
    }
}

/** middleware for verify Id */
export async function verifyId(req, res, next) {
    try {

        const id = req.query.id;

        const q = "SELECT * FROM user WHERE iduser=?";
        db.query(q, [id], (err, data) => {
            if (err) return res.send({ error: err });
            if (data.length === 0) return res.status(404).send({ msg: "Id not found" });
            next();
        })

    } catch (error) {
        return res.status(404).send({ error: "Authentication Error" });
    }
}

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


    try {
        const { username, password, email } = req.body;
        const q = "SELECT * FROM user WHERE email= ? OR username =?";
        // check the existing user
        const useroremailexists = new Promise((resolve, reject) => {
            db.query(q, [email, username], (err, result) => {
                if (err) reject(new Error(err))
                if (result.length !== 0) reject({ error: "Please use unique Email and Userame" });


                resolve();
            });
        });

        useroremailexists
            .then(() => {

                console.log("creating");
                bcrypt.hash(password, 10)
                    .then(hashedPassword => {
                        const q = "INSERT INTO user (`username`, `password`, `email`) VALUES (?,?,?)"
                        db.query(q, [username, hashedPassword, email]);
                        return res.status(201).send({ msg: "User successfully created!" });
                    }).catch(error => {
                        return res.status(500).send({ error: "unable to hash password" })
                    })



            }).catch(error => {
                return res.status(500).send({ error })
            })

    } catch (error) {
        return res.status(500).send(error)
    }
}

/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req, res) {
    const { email, password } = req.body;
    try {
        const q = "SELECT * FROM user WHERE email=?";
        db.query(q, [email], (err, data) => {
            
            if (err) return res.status(400).send({ error: "user not found" });
            console.log("password",data[0].password,password);
            bcrypt.compare(password, data[0].password)
                .then(passwordCheck => {
                    if (!passwordCheck) return res.status(400).send({ error: "Dont have password" });
                    const id = data[0].iduser;

                    const token = jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: "24h" });
                    return res.status(200).send({
                        msg: "Login successfull",
                        email: email,
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
    const { email } = req.params;
    console.log(email);
    try {
        if (!email) return res.status(501).send({ error: "Invalid username" })
        const q = "SELECT * FROM user WHERE email=?";
        db.query(q, [email], (err, data) => {
            if (err) return res.status(404).send({ error: "User not found" });
            const { password, ...rest } = data[0];
            return res.status(201).send(rest);
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
    // const id = req.query.id;
    const { id } = req.user;
    if (id) {
        const body = req.body;
        console.log(body);
        const q = "UPDATE user SET ? WHERE iduser=?";
        db.query(q, [body, id], (err, data) => {
            if (err) return res.send({ error: "Id not found" });
            return res.status(200).send({ msg: "Data updated successfully" });
        })
    } else {
        return res.status(401).send({ error: "id not found" });
    }
}

/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res) {
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
    res.status(201).send({ code: req.app.locals.OTP })
}


/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
    const { code } = req.query;
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password
        return res.status(201).send({ msg: 'Verify Successsfully!' })
    }
    return res.status(400).send({ error: "Invalid OTP" });
}


// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
    if (req.app.locals.resetSession) {
        return res.status(201).send({ flag: req.app.locals.resetSession })
    }
    return res.status(440).send({ error: "Session expired!" })
}

// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res) {
    try {

        if (!req.app.locals.resetSession) return res.status(440).send({ error: "Session expired!" });

        const { username, password } = req.body;

        try {
            bcrypt.hash(password, 10)
                .then(hashedPassword => {
                    const q = "UPDATE user SET password=? WHERE username=?";
                    db.query(q, [hashedPassword, username], (err, data) => {
                        if (err) return res.status(500).send({ error: "could not reset password" })
                        req.app.locals.resetSession = false; // reset session
                        return res.status(201).send({ msg: "Record Updated...!" })
                    })
                })
                .catch(e => {
                    return res.status(500).send({
                        error: "Enable to hashed password"
                    })
                })
        } catch (error) {
            return res.status(500).send({ error })
        }

    } catch (error) {
        return res.status(401).send({ error })
    }
}
