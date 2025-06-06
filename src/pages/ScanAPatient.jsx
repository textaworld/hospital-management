import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useSiteDetailsContext } from "../hooks/useSiteDetailsContext";

import "../styles/qrscanner.css";

const QrScn = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const { sitedetail, dispatch: institute } = useSiteDetailsContext();
  const [studentDetails, setStudentDetails] = useState(null);
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [qrResult, setQrResult] = useState(null);
  const [patientHosID, setPatientHosId] = useState("");
  const userHosID = user.instituteId;

  const [remainingSMSCount, setRemainingSMSCount] = useState(0);

  useEffect(() => {
    const TopP = sitedetail.topUpPrice;
    const SMSP = sitedetail.smsPrice;

    // console.log(TopP)
    // console.log(SMSP)

    // console.log(sitedetail.topUpPrice / sitedetail.smsPrice)

    const remSmsCount = parseInt(
      sitedetail.topUpPrice / sitedetail.smsPrice - sitedetail.smsCount
    );
    setRemainingSMSCount(remSmsCount);
  }, [sitedetail.smsPrice, sitedetail.topUpPrice, sitedetail.smsCount]);

  // console.log(remainingSMSCount)

  useEffect(() => {
    const fetchSiteDetails = async () => {
      try {
        const siteDetailsResponse = await fetch(
          `https://hospital-management-tnwh.onrender.com/api/site/getone/${user.instituteId}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        const siteDetailsJson = await siteDetailsResponse.json();

        if (siteDetailsResponse.ok) {
          institute({ type: "SET_SITE_DETAILS", payload: siteDetailsJson });
        }
      } catch (error) {
        console.err(error);
      }
    };

    if (user) {
      fetchSiteDetails();
    }
  }, [user, id, institute]);

  useEffect(() => {
    let qrCodeScanner;

    const startScanner = async () => {
      try {
        qrCodeScanner = new Html5QrcodeScanner("qr-scanner", {
          fps: 20,
          qrbox: 300,
        });

        const result = await new Promise((resolve, reject) => {
          qrCodeScanner.render((qrResult) => resolve(qrResult));
        });

        const parsedDetails = JSON.parse(result);
        // console.log("qr details",parsedDetails)
        setQrResult(parsedDetails.patient_ID);
        fetchStudentDetails(parsedDetails.patient_ID);
        qrCodeScanner.stop();
        setScanning(false);
      } catch (error) {
        setScanning(false);
      }
    };

    if (scanning) {
      startScanner();
    }

    return () => {
      if (scanning && qrCodeScanner) {
        qrCodeScanner.clear();
      }
    };
  }, [scanning]);

  useEffect(() => {
    //  console.log("qrResult",qrResult)
    if (qrResult !== null) {
      fetchStudentDetails(qrResult);

      setScanning(false); // Stop scanning after fetching details
    }
  }, [qrResult, id]);

  // scaner button handle
  const handleButtonClick = () => {
    setScanning(!scanning);
  };

  const fetchStudentDetails = async (patient_ID) => {
    try {
      const response = await fetch(
        `https://hospital-management-tnwh.onrender.com/api/patients/getPatientById/${patient_ID}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await response.json();
      // console.log("Fetched data:", data.inst_ID); // Logs the fetched ID

      setPatientHosId(data.inst_ID); // Set state with fetched ID
      //  console.log("Setting patientHosID to:", data.inst_ID); // Log the value being set

      // Check if patient ID matches user hospital ID
      if (data.inst_ID === userHosID) {
        setStudentDetails(data);
      } else {
        alert("Patient is not registered !");
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch student details");
      }
      setScanning(true);
    } catch (error) {
      console.error(error); // Log any errors
    }
  };

  const handleHistoryClick = () => {
    if (studentDetails && studentDetails.patient_ID) {
      navigate(`/channelHistory/${studentDetails.patient_ID}`);
    }
  };

  return (
    <div
      className="qrcontainer"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        className="left-section"
        style={{
          width: "100%",
          maxWidth: "600px",
          marginBottom: "20px",
          padding: "20px",
          backgroundColor: "#f0f0f0",
        }}
      >
        <button
          onClick={handleButtonClick}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "#ffffff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {scanning ? "Stop Scanner" : "Start Scanner"}
        </button>
        <div
          id="qr-scanner"
          style={{
            width: "100%",
            height: "300px",
            marginTop: "20px",
            border: "1px solid #ccc",
          }}
        ></div>
      </div>

      <div
        className="right-section"
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "20px",
          backgroundColor: "#ffffff",
        }}
      >
        {studentDetails ? (
          <div>
            <p>
              <span style={{ color: "red", fontWeight: "bold" }}>
                Patient ID:
              </span>{" "}
              {studentDetails.patient_ID}
            </p>
            <p>
              <span style={{ color: "red", fontWeight: "bold" }}>
                Patient Name:
              </span>{" "}
              {studentDetails.name}
            </p>
            <p>
              <span style={{ color: "red", fontWeight: "bold" }}>Age:</span>{" "}
              {studentDetails.age}
            </p>
            <button
              onClick={handleHistoryClick}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#4eacca",
                color: "#ffffff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              History
            </button>
          </div>
        ) : (
          <p>Unable to parse student details from QR code</p>
        )}
      </div>
    </div>
  );
};

export default QrScn;
