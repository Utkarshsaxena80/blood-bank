import express from "express";
import { patientLogin } from "../controllers/patientLogin.controllers.ts";

const patientLoginRouter: express.Router = express.Router();

patientLoginRouter.post("/patient/login", patientLogin);

export default patientLoginRouter;
