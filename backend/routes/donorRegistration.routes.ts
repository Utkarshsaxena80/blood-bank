import express from 'express'
import { donorR } from '../controllers/donorR.controllers'

const donorRegistration:express.Router=express.Router()

donorRegistration.post('/donor-registration',donorR)

export default donorRegistration
