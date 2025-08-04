import express from 'express'

const bloodBank=express.Router()
import { bloodR } from '../controllers/bloodBankRegistration.controllers';
bloodBank.post('/register-bloodBank',bloodR);