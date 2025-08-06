import express from "express";
import { bloodBankLogin } from "../controllers/bloodBankLogin.controllers.ts";

const bloodBankLoginRouter: express.Router = express.Router();

bloodBankLoginRouter.post("/bloodbank/login", bloodBankLogin);

export default bloodBankLoginRouter;
