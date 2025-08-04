
import express from 'express'
import patientRegsitration from '../routes/patientRegistration.routes.ts';
import cookieParser from 'cookie-parser'
import donorRegistration from '../routes/donorRegistration.routes.ts';
import bloodBank from '../routes/bloodBank.routes.ts';
import patientDetail from '../routes/patientDetails.routes.ts';
import PorDBycity from '../routes/getPatorDonByCity.routes.ts';

const app=express();
app.use(express.json());


//import morgan from 'morgan'

 app.use(express.json());
 import cors from "cors";
 app.use(cors({
   origin: "http://localhost:3000", // <-- include http://
   credentials: true
 }));
// app.use(morgan('dev'))
app.use(express.json()); // Add this to parse JSON request bodies
app.use(cookieParser());

const PORT: number = 3001;


app.use('/', patientRegsitration);
app.use('/',donorRegistration)
app.use('/',bloodBank)
app.use('/',patientDetail)
app.use('/',PorDBycity)

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
