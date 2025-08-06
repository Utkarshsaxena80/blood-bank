import express from "express";

const bloodBank = express.Router();
import { bloodR } from "../controllers/bloodBankRegistration.controllers.ts";
bloodBank.post("/bloodbank/register", bloodR);

export default bloodBank;
