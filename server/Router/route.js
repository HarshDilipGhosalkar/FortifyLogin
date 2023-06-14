import { Router } from "express";
import * as controller from "../controllers/appController.js";
const router=Router();


// post methods
router.route("/register").post(controller.register);
router.route("/registerMail").post();
router.route("/authenticate").post();
router.route("/login").post(controller.login);


// get methods
router.route("/user/:username").get(controller.getUser);
router.route("/ganerateOTP").get();
router.route("/verifyOTP").get();
router.route("/createResetSession").get();

// put methods
router.route("/updateuser").put(controller.updateUser);
router.route("/resetPassword").put();

export default router;