// myProject/Routes/Weather.js
import express from "express";
import { getCurrentWeather, getAll } from "../Controllers/weatherCn.js";
import isLogin from "../middleware/isLogin.js";
import isAdmin from "../middleware/isAdmin.js";

const weatherRouter = express.Router();

weatherRouter.route("/").get(getAll);

weatherRouter.route("/current").get(getCurrentWeather);

export default weatherRouter;
