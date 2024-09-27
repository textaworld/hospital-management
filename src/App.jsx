//import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

// Context providers
import { AdminContextProvider } from "./context/AdminContext.jsx";
import { AttendanceContextProvider } from "./context/AttendanceContext.jsx";
import { ClassContextProvider } from "./context/ClassContext.jsx";
import { EmailContextProvider } from "./context/EmailContext.jsx";
import { InstitutesContextProvider } from "./context/InstitutesContext.jsx";
import { PaymentsContextProvider } from "./context/PaymentContext.jsx";
import { StudentContextProvider } from "./context/StudentContext.jsx";
import { TuteContextProvider } from "./context/TuteContext.jsx";

// Pages and components
import SuperAdminDashboard from "./pages/SuperAdminDashboard.jsx";
import SuperAdminLogin from "./pages/SuperAdminLogin.jsx";
//import SuperAdminRegister from "./pages/SuperAdminRegister";
import UserRoleAuth from "./Auth/UserRoleAuth.jsx";
import NavBar from "./components/NavBar/NavBar.jsx";
import NavBar2 from "./components/NavBar/NavBar2.jsx";
import SuperAdminNavBar from "./components/NavBar/SuperAdminNavBar.jsx";
import AddChannel from "./pages/AddChannel.jsx";
import AddPatient from "./pages/AddPatient.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import StudentPayment from "./pages/AllPayments.jsx";
import Class from "./pages/Doctors.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Home from "./pages/Home.jsx";
import InstituteIncome from "./pages/InstituteIncome.jsx";
import CreatePayment from "./pages/Payments.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import {
  default as Attendance,
  default as ScanAPatient,
} from "./pages/ScanAPatient.jsx";
import Student from "./pages/Student.jsx";
import StudentProfile from "./pages/StudentProfile.jsx";
import SuperAdminDashboardAdmins from "./pages/SuperAdminDashboardAdmins.jsx";
import SuperAdminForgotPassword from "./pages/SuperAdminForgotPassword.jsx";
import SuperAdminResetPassword from "./pages/SuperAdminResetPassword.jsx";
import TeachersIncome from "./pages/TeachersIncome.jsx";
import UpdateStudent from "./pages/UpdateStudent.jsx";
// Styling imports
import "./components/NavBar/NavBar.css";
import BrodcastMsg from "./pages/AllChannelDetails.jsx";
import ChannelHistory from "./pages/ChannelHistory.jsx";
import DoctorHome from "./pages/DoctorHome.jsx";
import HeadOfficeHome from "./pages/HeadOfficeHome.jsx";
import PatientChannelHistory from "./pages/PatientChannelHistory.jsx";
import PatientChannelView from "./pages/PatientChannelView.jsx";
import PatientScan from "./pages/PatientScan.jsx";
import Prescription from "./pages/Prescription.jsx";
import SACardCreation from "./pages/SACardCreation.jsx";
import SendMessages from "./pages/SendMessages.jsx";
import UpdateChannel from "./pages/UpdateChannel.jsx";
import UpdateClass from "./pages/UpdateClass.jsx";

function App() {
  const { user } = useAuthContext();

  const checkUserRole = (userRolee) => {
    return user && user.role === userRolee;
  };

  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Routes>
            <Route
              path="/login"
              element={
                checkUserRole("SUPER_ADMIN") ? (
                  <Navigate to="/sadmin" />
                ) : (
                  <SuperAdminLogin />
                )
              }
            />
            <Route
              path="/adminlogin"
              element={
                checkUserRole("ADMIN") ? (
                  <Navigate to="/" />
                ) : checkUserRole("SUB_ADMIN") ? (
                  <Navigate to="/subadminhome" />
                ) : checkUserRole("DOCTOR") ? (
                  <Navigate to="/doctorhome" />
                ) : checkUserRole("HEAD_OFFICE_ADMIN") ? (
                  <Navigate to="/headOfficeHome" />
                ) : (
                  <AdminLogin />
                )
              }
            />
            <Route path="/forgotpass" element={<ForgotPassword />} />
            <Route
              path="/resetpassword/:adminId/:token"
              element={<ResetPassword />}
            />

            <Route
              path="/spforgotpass"
              element={<SuperAdminForgotPassword />}
            />

            <Route
              path="/spresetpassword/:adminId/:token"
              element={<SuperAdminResetPassword />}
            />

            {/* --------- --------- ---------*/}

            {/* --------- Super Admin Routes ---------*/}

            <Route
              path="/sadmin"
              element={
                <InstitutesContextProvider>
                  <AdminContextProvider>
                    <SuperAdminNavBar />
                    <UserRoleAuth userRole={"SUPER_ADMIN"} />
                  </AdminContextProvider>
                </InstitutesContextProvider>
              }
            >
              <Route
                path="/sadmin/sadminCardCreation"
                element={<SACardCreation />}
              />
              {/* <Route element={<SuperAdminNavBar />} /> */}
              <Route path="/sadmin" element={<SuperAdminDashboard />} />
              <Route
                path="/sadmin/instituteadmins/:id"
                element={<SuperAdminDashboardAdmins />}
              />
            </Route>

            {/* --------- --------  -------- ---------*/}

            {/* --------- Admin Routes ---------*/}

            <Route
              path="/"
              element={
                <StudentContextProvider>
                  <ClassContextProvider>
                    <AttendanceContextProvider>
                      <TuteContextProvider>
                        <PaymentsContextProvider>
                          <EmailContextProvider>
                            {/* <React.Fragment> */}
                            <div className="navbar-wrapper">
                              <NavBar />
                            </div>
                            <UserRoleAuth userRole={"ADMIN"} />
                            {/* </React.Fragment> */}
                          </EmailContextProvider>
                        </PaymentsContextProvider>
                      </TuteContextProvider>
                    </AttendanceContextProvider>
                  </ClassContextProvider>
                </StudentContextProvider>
              }
            >
              <Route path="/" element={<Home />} />
              <Route path="/patients" element={<Student />} />
              <Route path="/payments" element={<StudentPayment />} />
              <Route path="/addPatient" element={<AddPatient />} />
              <Route path="/addAppoinment" element={<AddChannel />} />

              {/* <Route
                path="/startClass/absent/:id"
                element={<AbsentStudents />}
              /> */}
              <Route
                path="/channelHistory/:id"
                element={<PatientChannelHistory />}
              />
              <Route path="/payment/:id" element={<CreatePayment />} />
              <Route path="/doctors" element={<Class />} />
              <Route path="/scan" element={<ScanAPatient />} />
              <Route path="/channels" element={<BrodcastMsg />} />
              <Route path="/sendMsgs" element={<SendMessages />} />
              {/* <Route path="/createClass" element={<CreateClass />} /> */}
              <Route
                path="/studentprofile/:patient_ID"
                element={<StudentProfile />}
              />
              <Route path="/updateStd/:id" element={<UpdateStudent />} />
              <Route path="/updateClz/:id" element={<UpdateClass />} />
              <Route path="/updateChannel/:id" element={<UpdateChannel />} />
              {/* <Route path="/doctorIncome/:id" element={<TeachersIncome />} />
              <Route path="/instituteIncome" element={<InstituteIncome />} /> */}
            </Route>

            {/* ---------  ----------  ---------*/}

            {/* --------- Sub Admin Routes ---------*/}

            <Route
              path="/subadminhome"
              element={
                <StudentContextProvider>
                  <ClassContextProvider>
                    <AttendanceContextProvider>
                      <TuteContextProvider>
                        <PaymentsContextProvider>
                          <EmailContextProvider>
                            <UserRoleAuth userRole={"SUB_ADMIN"} />
                          </EmailContextProvider>
                        </PaymentsContextProvider>
                      </TuteContextProvider>
                    </AttendanceContextProvider>
                  </ClassContextProvider>
                </StudentContextProvider>
              }
            ></Route>
            {/* --------- -------  ------- ---------*/}

            {/*----------- school admin------------- */}
            <Route
              path="/scladminhome"
              element={
                <StudentContextProvider>
                  <ClassContextProvider>
                    <AttendanceContextProvider>
                      <EmailContextProvider>
                        <UserRoleAuth userRole={"SCL_ADMIN"} />
                      </EmailContextProvider>
                    </AttendanceContextProvider>
                  </ClassContextProvider>
                </StudentContextProvider>
              }
            ></Route>

            {/* -------------DOCTOR-----------------*/}
            <Route
              path="/doctorhome"
              element={<UserRoleAuth userRole={"DOCTOR"} />}
            >
              <Route path="/doctorhome" element={<DoctorHome />} />
            </Route>
            <Route path="/doctorhome/patientScan" element={<PatientScan />} />
            <Route
              path="/patientChannelHistory/:id"
              element={<ChannelHistory />}
            />
            <Route path="/prescription/:id" element={<Prescription />} />
            <Route
              path="/patientChannelView/:id"
              element={<PatientChannelView />}
            />

            {/*---------- head office-------------- */}
            <Route
              path="/headOfficeHome"
              element={
                <StudentContextProvider>
                  <ClassContextProvider>
                    <AttendanceContextProvider>
                      <TuteContextProvider>
                        <PaymentsContextProvider>
                          <EmailContextProvider>
                            {/* <React.Fragment> */}
                            <div className="navbar-wrapper">
                              <NavBar2 />
                            </div>
                            <UserRoleAuth userRole={"HEAD_OFFICE_ADMIN"} />
                            {/* </React.Fragment> */}
                          </EmailContextProvider>
                        </PaymentsContextProvider>
                      </TuteContextProvider>
                    </AttendanceContextProvider>
                  </ClassContextProvider>
                </StudentContextProvider>
              }
            >
              {/* Nested routes accessible by HEAD_OFFICE_ADMIN */}
              <Route path="/headOfficeHome" element={<HeadOfficeHome />} />
              <Route path="/headOfficeHome/students" element={<Student />} />
              <Route
                path="/headOfficeHome/payments"
                element={<StudentPayment />}
              />
              <Route
                path="/headOfficeHome/addPatient"
                element={<AddPatient />}
              />
              <Route
                path="/headOfficeHome/attendences"
                element={<Attendance />}
              />
              <Route path="/headOfficeHome/doctors" element={<Class />} />
              <Route
                path="/headOfficeHome/doctorIncome/:id"
                element={<TeachersIncome />}
              />
              <Route
                path="/headOfficeHome/instituteIncome"
                element={<InstituteIncome />}
              />
            </Route>

            {/* <Route path="/headOfficeHome" element={<HeadOfficeHome />} /> */}
            {/* <Route path="/students" element={<Student />} />
            <Route path="/payments" element={<StudentPayment />} />
            <Route path="/addPatient" element={<AddPatient />} />
            <Route path="/attendences" element={<Attendance />} />
            <Route path="/brodcastMsg" element={<BrodcastMsg />} /> */}
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

//Consider adding an error boundary to your tree to customize error handling behavior.
