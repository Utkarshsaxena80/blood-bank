import express from 'express'
import cors from 'cors'
import patientRegsitration from '../routes/patientRegistration.routes';
//import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import donorRegistration from '../routes/donorRegistration.routes';

const app=express();
// app.use(cors({
//     origin:"localhost:5000",
//     methods:['GET','POST'],
//     credentials:true
// }))
//pp.use(morgan('dev'))
app.use(cookieParser())

const PORT:number=3000;

app.post('/patient-registration',patientRegsitration)

app.post('donor-registration',donorRegistration)

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`)
})