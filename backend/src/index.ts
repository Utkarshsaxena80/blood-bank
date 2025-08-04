import express from 'express'
import cors from 'cors'
import patientRegsitration from '../routes/patientRegistration.routes';


const app=express();
app.use(cors({
    origin:"localhost:5000",
    methods:['GET','POST'],
    credentials:true
}))

const PORT:number=3000;

app.post('/patient-registration',patientRegsitration)

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`)
})