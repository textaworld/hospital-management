import  { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useSiteDetailsContext } from "../hooks/useSiteDetailsContext";
import "../styles/qrscanner.css"
import { FaArrowLeft } from 'react-icons/fa';
const PatientScan = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const { sitedetail, dispatch: institute } = useSiteDetailsContext();
  //const instID = user.instituteId;
  const [studentDetails, setStudentDetails] = useState(null);
  const [name, setName] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [qrResult, setQrResult] = useState(null);
  const [hostName, setHostName] = useState("");
  const userHosID = user.instituteId

  const [remainingSMSCount, setRemainingSMSCount] = useState(0); 

  useEffect(() => {

    const TopP = sitedetail.topUpPrice
    const SMSP = sitedetail.smsPrice

 

    const remSmsCount =parseInt((sitedetail.topUpPrice / sitedetail.smsPrice) - sitedetail.smsCount)
    setRemainingSMSCount(remSmsCount);
  }, [sitedetail.smsPrice, sitedetail.topUpPrice , sitedetail.smsCount]);



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
        console.error(error)
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
          qrbox: 350,
        });

        const result = await new Promise((resolve, reject) => {
          qrCodeScanner.render((qrResult) => resolve(qrResult));
        });

        const parsedDetails = JSON.parse(result);
       
        setQrResult(parsedDetails.patient_ID);
        fetchStudentDetails(parsedDetails.patient_ID)

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
      //  console.log("Setting patientHosID to:", data.inst_ID); // Log the value being set
    
        // Check if patient ID matches user hospital ID
        if (data.inst_ID === userHosID) {
          setStudentDetails(data);
        } else {
          alert('Patient is not registered !');
        }
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch student details");
      }

      setName(data.name);


      setLoading(false);
      setScanning(true);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

 

  
  const handleHistoryClick = () => {
    if (studentDetails && studentDetails.patient_ID) {
      navigate(`/patientChannelHistory/${studentDetails.patient_ID}`); 
    }
  };

  
 
 
  const fetchSiteDetails = async () => {
    const response = await fetch(
      `https://hospital-management-tnwh.onrender.com/api/site/getone/${user.instituteId}`,
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );
    const json = await response.json();
    setHostName(json.name);
    if (response.ok) {
      // Check every second (adjust as needed)
    } else {
      console.log("error");
    }
  };

  useEffect(() => {
    fetchSiteDetails();
    // fetchAdminDetails();
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (

   <div>
      <div style={{ background: "#02bffb", width: "100%", boxSizing: "border-box", padding: "10px", position: "relative" }}>
  <button className="navbar-backbutton" onClick={handleGoBack} style={{ background: "transparent", border: "none", cursor: "pointer", position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }}>
    <FaArrowLeft size={24} />
  </button>
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50px" }}>
    <h1 style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>{hostName}</h1>
  </div>
</div>
  
    <div className="qrcontainer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
  <div className="left-section" style={{ width: '100%', maxWidth: '600px', marginBottom: '20px', padding: '20px', backgroundColor: '#f0f0f0' }}>
    <button onClick={handleButtonClick} style={{ marginLeft:"5px",padding: '10px 20px', fontSize: '16px', backgroundColor: '#4eacca', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
      {scanning ? "Stop Scanner" : "Start Scanner"}
    </button>
    <div id="qr-scanner" style={{ width: '100%', height: '300px', marginTop: '20px', border: '1px solid black'}}></div>
  </div>

  <div className="right-section" style={{ width: '100%', maxWidth: '600px', padding: '20px', backgroundColor: '#ffffff',marginTop:'20px' }}>
    {/* {qrResult && <p>Std_id : {qrResult} </p>} */}

    {studentDetails ? (
      <div style={{justifyContent:"center",alignItems: "center",textAlign: "center"}}>
        <p><span style={{color:'red' , fontWeight:'bold'}}>Patient ID:</span> {studentDetails.patient_ID}</p>
        <p><span style={{color:'red' , fontWeight:'bold'}}>Patient Name:</span> {studentDetails.name}</p>
        <p><span style={{color:'red' , fontWeight:'bold'}}>Patient Age:</span> {studentDetails.age}</p>
        
        <div style={{ display: "flex",flexDirection: "column", justifyContent: "center",alignItems: "center",textAlign: "center", marginTop:"50px"}} >
            <button 
              onClick={handleHistoryClick} 
              style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#4eacca', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}
            >
              History
            </button>

           
        </div>

      </div>
    ) : (
      <p style={{display:"flex",justifyContent: "center",alignItems: "center",textAlign: "center",}}>Please Scan the QR code correctly </p>
    )}
  </div>
</div>
   </div>


  );
};

export default PatientScan;




