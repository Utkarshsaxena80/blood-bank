import express from 'express'
import type {Router} from 'express'
import { patientR } from '../controllers/patientRegis.controllers.ts'

const patientRegistration:express.Router=express.Router()

patientRegistration.post('/register-patient',patientR)

export default patientRegistration  
