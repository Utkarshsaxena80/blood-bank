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
import cors from "cors";

const app = express();
app.use(express.json());

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

app.use(cookieParser());

const PORT: number = 5000;

// Your routes
app.use("/", patientRegsitration);
app.use("/", donorRegistration);
app.use("/", bloodBank);
app.use("/", patientDetail);
app.use("/", PorDBycity);
app.use("/", donate);
app.use("/", getDonations);
app.use("/donations", acceptDonation);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
