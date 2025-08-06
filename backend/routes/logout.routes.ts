import express from "express";
import { logout } from "../controllers/logout.controllers.ts";

const logoutRouter: express.Router = express.Router();

logoutRouter.post("/logout", logout);

export default logoutRouter;
