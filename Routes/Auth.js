// myProject/Routes/Auth.js
import express from "express";
import {login, register} from "../Controllers/AuthCn.js";

const authRouter = express.Router();


authRouter.route("/register").post(register);


authRouter.route("/").post(login);

export default authRouter;