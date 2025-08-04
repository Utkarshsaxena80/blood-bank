import express from "express";
import cors from "cors";
import patientRegistration from "../routes/patientRegistration.routes.ts";
//import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import donorRegistration from '../routes/donorRegistration.routes.ts';
import bloodBank from '../routes/bloodBank.routes.ts';
const app = express();
// app.use(express.json());

// app.use(cors({
//     origin:"localhost:5000",
//     methods:['GET','POST'],
//     credentials:true
// }))
// app.use(morgan('dev'))
app.use(express.json()); // Add this to parse JSON request bodies
app.use(cookieParser());

const PORT: number = 3000;


app.use('/',patientRegsitration)
app.use('/',donorRegistration)
app.use('/',bloodBank)

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
