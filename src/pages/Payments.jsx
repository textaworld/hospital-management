import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { usePaymentContext } from "../hooks/usePaymentContext";
import { useSiteDetailsContext } from "../hooks/useSiteDetailsContext";
import "../styles/payment.css";

const CreatePayment = () => {
  const { id } = useParams();

  const { dispatch } = usePaymentContext();
  const { user } = useAuthContext();
  const { sitedetail, dispatch: institute } = useSiteDetailsContext();
  // const [instNotification, setInstNotification] = useState("");
  const instID = user.instituteId;
  const [name, setName] = useState("");
  const [std_ID, setStd_ID] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false); // State for tracking submission success
  const [channel_ID, setChannelID] = useState("");
  const [remainingSMSCount, setRemainingSMSCount] = useState(0);
  const [userPhone, setUserhone] = useState("");
  const [drName, setDRName] = useState("");
  const [logo, setLogo] = useState("");
  const [hosName, setHosName] = useState("");
  const [qrImage, setQrImage] = useState("");
  const [hosPhone, setHosPhone] = useState("");
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

  //console.log(remainingSMSCount)

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
        // console.log("site",siteDetailsJson)
        setLogo(siteDetailsJson.image);
        setHosName(siteDetailsJson.name);
        setHosPhone(siteDetailsJson.phone);
        if (siteDetailsResponse.ok) {
          // setInstNotification(siteDetailsJson.notification);
          institute({ type: "SET_SITE_DETAILS", payload: siteDetailsJson });
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (user) {
      fetchSiteDetails();
    }
  }, [user, id, institute]);

  //console.log(instNotification)

  const handleSubmit = async (e) => {
    e.preventDefault();
    generateQrCode();
    if (!user) {
      setError("You must be logged in");
      return;
    }

    // Form validation
    if (!name || !std_ID || !amount) {
      setError("All fields are required");
      return;
    }

    const status = "paid";

    const date = new Date();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = monthNames[date.getMonth()];

    const payment = {
      inst_ID: instID,
      doctor_ID: name,
      patient_ID: std_ID,
      amount,
      channel_ID: channel_ID,
      date,
      month,
      status,
    };

    if (qrImage) {
      const response = await fetch(
        "https://hospital-management-tnwh.onrender.com/api/payments/createPayment",
        {
          method: "POST",
          body: JSON.stringify(payment),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const json = await response.json();
      // console.log("payment", json);

      if (response.ok) {
        //generateQrCode()
        generatePDF();
        if (remainingSMSCount >= 10) {
          sendSMS(userPhone, amount, std_ID, channel_ID, drName);
        } else {
          alert("Your SMS account balance is low. Please Topup");
        }
      }

      if (!response.ok) {
        setError(json.error);
        return;
      }
      setError(null);
      setSubmissionSuccess(true);

      dispatch({ type: "CREATE_PAYMENT", payload: json });
    }
  };

  const fetchUser = async () => {
    try {
      //console.log("std_ID",std_ID)
      const response = await fetch(
        `https://hospital-management-tnwh.onrender.com/api/patients/searchPatientByPatient_ID/${std_ID}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const json = await response.json();
      //console.log("user", json);
      setUserhone(json.phone);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [name]);

  const sendSMS = async (phone, amount, std_ID, channel_ID, drName) => {
    if (!user) {
      setError("You must be logged in");
      return;
    }

    //console.log('docsns',drName)
    const to = phone;
    const colomboTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Colombo",
    });

    const message = `Your payment of ${amount} for dr.${drName} has been successfully processed. 
    Your Paitient ID is: ${std_ID}. 
    Channel ID: ${channel_ID}. 
    Time : ${colomboTime}.
    Thank you!`;

    const emailDetails = { to, message, inst_ID: instID };
    //console.log(instID)

    const response = await fetch(
      "https://hospital-management-tnwh.onrender.com/api/sms/send-message",
      {
        method: "POST",
        body: JSON.stringify(emailDetails),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      //navigate("/");
    }
    if (response.ok) {
      setError(null);
      dispatch({ type: "CREATE_EMAIL", payload: json });
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          "https://hospital-management-tnwh.onrender.com/api/doctors/searchDoctorByDoctor_ID/" +
            name,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        const json = await response.json();
        // console.log("docote",json)

        if (response.ok) {
          setDRName(json.name);

          dispatch({ type: "SET_DOCTOR", payload: json });
        }
      } catch (error) {
        // Handle the error as needed
      }
    };

    if (user) {
      fetchStudents();
    }
  }, [dispatch, user, id, qrImage]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          "https://hospital-management-tnwh.onrender.com/api/channels/getChannelById/" +
            id,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        const json = await response.json();
        // console.log(json)

        if (response.ok) {
          setStd_ID(json.patient_ID);
          setName(json.doctor_ID);
          setChannelID(json.channel_ID);
        }
      } catch (error) {
        // Handle the error as needed
      }
    };

    if (user) {
      fetchStudents();
    }
  }, [user, id]);

  //console.log("qrImage",qrImage)

  const generatePDF = () => {
    // Define custom PDF size (A5 size in mm: 148 x 210)
    const doc = new jsPDF({
      orientation: "portrait", // 'portrait' or 'landscape'
      unit: "mm", // The units (options: 'pt', 'mm', 'cm', 'in')
      format: [148, 210], // Custom size [width, height]
    });

    doc.setFont("Times", "normal");

    const colomboTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Colombo",
    });

    if (qrImage) {
      doc.addImage(qrImage, "PNG", 10, 10, 20, 20);
    }

    // Add logo to the top-right corner
    if (logo) {
      const img = new Image();
      img.src = logo;
      img.onload = () => {
        doc.addImage(img, "JPEG", 120, 10, 20, 20); // Adjusted for smaller width
        createPDFContent();
      };
    } else {
      createPDFContent();
    }

    function createPDFContent() {
      const pdfWidth = doc.internal.pageSize.getWidth();
      const text = `${hosName}`;
      const textWidth = doc.getTextWidth(text);
      const xPosition = (pdfWidth - textWidth) / 2;

      const invoiceTextWidth = doc.getTextWidth("Hospital Invoice");
      const xPositionInvo = (pdfWidth - invoiceTextWidth) / 2;

      doc.setFontSize(20);
      doc.text(text, xPosition, 20);
      doc.setFontSize(10);
      doc.text(`Telephone: ${hosPhone}`, xPosition, 25);
      // doc.setFontSize(15);
      // doc.text("Hospital Invoice", xPositionInvo, 30);

      doc.setLineWidth(0.5);
      doc.setLineDash([1, 2], 0);
      doc.line(10, 40, pdfWidth - 10, 40);

      // Add patient and doctor details
      doc.setFontSize(12);
      doc.text(`Patient ID: ${std_ID}`, 10, 70);
      doc.text(`Doctor Name: Dr. ${drName}`, 10, 80);
      doc.text(`Channel ID: ${channel_ID}`, 10, 90);
      doc.text(`Date: ${colomboTime}`, 10, 50);

      doc.setLineDash([1, 1], 0);
      doc.line(10, 100, pdfWidth - 10, 100);

      doc.setFontSize(15);

      doc.text(`Total: Rs. ${amount}`, 10, 110);

      doc.setFontSize(15);
      doc.setTextColor(0, 0, 0);
      doc.text("Thank you!", xPosition, 120);

      doc.save(`${std_ID}_invoice.pdf`);
    }
  };

  const generateQrCode = async () => {
    try {
      // Check if any of the required fields are null or empty
      //console.log("qr triggered")
      const patient_ID = std_ID;
      const student = { patient_ID };

      // console.log("std",student)
      const response = await fetch(
        "https://hospital-management-tnwh.onrender.com/api/qr/qrGenerator",
        {
          method: "POST",
          body: JSON.stringify(student),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      //console.log("resp",response)
      if (!response.ok) {
        // Handle error appropriately

        return;
      }

      const data = await response.text();
      //console.log("qr",data)
      setQrImage(data);
    } catch (error) {
      // Handle error appropriately
    }
  };

  return (
    <div className="container">
      <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
          <h2 style={{ justifyContent: "center", display: "flex" }}>
            Make Payments
          </h2>
          <div className="form-group">
            <label htmlFor="std_ID">Patient ID</label>
            <input
              value={std_ID}
              type="text"
              placeholder="Patient ID"
              className="form-control"
              onChange={(e) => setStd_ID(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Doctor ID</label>
            <input
              value={name}
              type="text"
              placeholder="Doctor ID"
              className="form-control"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Total Amount</label>
            <input
              value={amount}
              type="number"
              placeholder="Enter Amount"
              className="form-control"
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-submit">
            Submit
          </button>
          {error && <div className="error">{error}</div>}
          {submissionSuccess && (
            <div className="success"> submitted successfully!</div>
          )}{" "}
        </form>
      </div>
    </div>
  );
};

export default CreatePayment;
