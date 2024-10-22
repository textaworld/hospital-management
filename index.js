const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDb = require("./config/db");
const path = require('path'); // Add this line

// import routes
const SuperAdminRoutes = require("./routes/superAdminRoutes");
const InstituteRoutes = require("./routes/HospitalRoutes");
const AdminRoutes = require("./routes/adminRoutes");
const NormalSiteRoutes = require("./routes/normalSiteRoutes");

const PatientRoutes = require("./routes/patientRoutes");
const qrGenerator = require("./routes/QrsGenRoutes");
const AttendanceRouter = require("./routes/attndnceRoutes");
const PaymentRouter = require("./routes/paymentRoutes");
const TuteRouter = require("./routes/tuteRoutes");
const DoctorRouter = require("./routes/doctorRoutes");
const EmailRouter = require("./routes/emailRoute");
const SmsRouter = require("./routes/smsRoutes");
const ChannelRouter = require("./routes/channelRoute");
const ChannelHistoryRouter = require("./routes/channelHistoryRoutes");
const CardRouter = require("./routes/CardRoutes")
const fileUploader = require("./controllers/fileUploader")



dotenv.config();

// express app
const app = express();

// middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

//------
app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});
//-------
app.use("/files", express.static(path.join(__dirname, 'files')));
// Routes
app.use("/api/superAdmin", SuperAdminRoutes);
app.use("/api/institute", InstituteRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/site", NormalSiteRoutes);
app.use("/api/patients",PatientRoutes);
app.use("/api/qr",qrGenerator)
app.use("/api/attendance",AttendanceRouter);
app.use("/api/payments",PaymentRouter);
app.use("/api/tutes",TuteRouter);
app.use("/api/doctors",DoctorRouter);
app.use("/api/emails",EmailRouter);
app.use("/api/sms",SmsRouter);
app.use("/api/channels",ChannelRouter);
app.use("/api/channelHistory",ChannelHistoryRouter);
app.use("/api/card",CardRouter);
app.use("/api/upload", fileUploader)


// connect to db
connectDb();

const PORT = process.env.PORT || 5000;

// listen for requests
app.listen(PORT);
