import express from "express";
import { donorLogin } from "../controllers/donorLogin.controllers.ts";

const donorLoginRouter: express.Router = express.Router();

donorLoginRouter.post("/donor/login", donorLogin);

export default donorLoginRouter;
