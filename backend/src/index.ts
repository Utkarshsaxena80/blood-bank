import express from "express";
import patientRegsitration from "../routes/patientRegistration.routes.ts";
import cookieParser from "cookie-parser";
import donorRegistration from "../routes/donorRegistration.routes.ts";
import bloodBank from "../routes/bloodBank.routes.ts";
import patientDetail from "../routes/patientDetails.routes.ts";
import PorDBycity from "../routes/getPatorDonByCity.routes.ts";
import donate from "../routes/donate.routes.ts";
import getDonations from "../routes/getActiveDonations.routes.ts";
import acceptDonation from "../routes/acceptDonation.routes.ts";

const app = express();
app.use(express.json());

// app.use(cors({
//     origin:"localhost:5000",
//     methods:['GET','POST'],
//     credentials:true
// }))
//pp.use(morgan('dev'))
app.use(cookieParser());

const PORT: number = 3000;

app.use("/", patientRegsitration);
app.use("/", donorRegistration);
app.use("/", bloodBank);
app.use("/", patientDetail);
app.use("/", PorDBycity);
app.use("/", donate);
app.use("/", getDonations);
app.use("/donations", acceptDonation);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
