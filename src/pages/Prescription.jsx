import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import "../styles/payment.css"; // Assuming this file already exists for custom styles
import { useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useStudentContext } from "../hooks/useStudentContext";
import PdfComp from "./PdfComp";

const Prescription = () => {
  const { id } = useParams();
  const { user } = useAuthContext();

  const inst_ID = user.instituteId;
  const [sick, setSick] = useState("");
  const [doctor_Name, setDoctor_Name] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [hostName, setHostName] = useState("");
  const navigate = useNavigate();

  const [medicine, setMedicine] = useState("");
  const [phone, setPhone] = useState("");

  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);

  const [file, setFile] = useState("");


  const fetchSiteDetails = async () => {
    const response = await fetch(
      `https://hospital-management-tnwh.onrender.com/api/site/getone/${user.instituteId}`,
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );
    const json = await response.json();
    //console.log("json", json);
    setHostName(json.name);
    if (response.ok) {
      // Check every second (adjust as needed)
    } else {
   //   console.log("error");
    }
  };

  useEffect(() => {
    fetchSiteDetails();
    // fetchAdminDetails();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch(
        `https://hospital-management-tnwh.onrender.com/api/patients/getPatientByPatient_Id/${id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const data = await response.json();
      setPhone(data.patient.phone);
    //  console.log("json", data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchPatients();
  }, []);

//  console.log("1file", file);



  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!user) {
      setError("You must be logged in");
      return;
    }
  
    // Form validation
    if (!doctor_Name || !sick) {
      setError("Doctor Name and Sick fields are required");
      return;
    }
  
    const date = new Date();
    const channel_ID = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}_${date.getHours()}${date.getMinutes()}${date.getSeconds()}`; // Generate channel_ID
  
    // Use FormData to append fields and the file
    const formData = new FormData();
    formData.append("inst_ID", inst_ID);
    formData.append("patient_ID", id);
    formData.append("doctor_Name", doctor_Name);
    formData.append("sick", sick);
    formData.append("date", date);
    formData.append("image", image);
    formData.append("description", description);
    formData.append("medicine", medicine);
    formData.append("file", file);
    formData.append("channel_ID", channel_ID); // Append the channel_ID
  
    try {
      const response = await fetch(
        "https://hospital-management-tnwh.onrender.com/api/channelHistory/createChannelHistory",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
  
      const json = await response.json();
      await uploadFile(formData); // Call uploadFile with the same formData
  
      if (!response.ok) {
        setError(json.error);
        return;
      }
  
      //console.log("phone", phone);
      sendSMS(phone, doctor_Name, description, medicine, date);
      setDoctor_Name("");
      setDescription("");
      setSick("");
      setImage("");
      alert("Patient Details added successfully!");
  
      setError(null);
    } catch (err) {
      console.error("Error creating channel:", err.message);
      setError(err.message);
    }
  };

  const uploadFile = async (formData) => {
   // console.log("hello")
    try {
      const fileUploadResponse = await fetch(
        "https://hospital-management-tnwh.onrender.com/api/upload/upload-files",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
  
      const jsonResponse = await fileUploadResponse.json();
      //console.log("jsonResponse:", jsonResponse);
      
      if (!fileUploadResponse.ok) {
        console.error("File upload failed:", jsonResponse.error);
        throw new Error(jsonResponse.error);
      }
  
    //  console.log("File uploaded successfully:", jsonResponse);
    } catch (err) {
      console.error("Error uploading file:", err.message);
      throw err; // Rethrow to handle it in the main submit function
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const sendSMS = async (phone, doctor_Name, description, medicine, date) => {
    if (!user) {
      setError("You must be logged in");
      return;
    }
   // console.log("phone", phone);
    const to = phone;

    const message = `Dear Patient, 

    Your recent consultation with Dr. ${doctor_Name} on ${date} has been completed. Here are the details:
    
    - Description: ${description}
    - Prescribed Medicine: ${medicine}
    
    Please follow the instructions provided and take the prescribed medication as directed. If you have any questions or experience any issues, feel free to contact our clinic.
    
    Take care and get well soon!
    
    Regards,`;

    const emailDetails = { to, message, inst_ID };

   // console.log("emailDetails", emailDetails);

    const response = await fetch("https://hospital-management-tnwh.onrender.com/api/sms/send-message", {
      method: "POST",
      body: JSON.stringify(emailDetails),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();
    //console.log(json);

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      setError(null);
    }
  };

  return (
    <div style={{ overflowY: "auto", backgroundColor: "#f9f9f9" }}>
      <div
        style={{
          background: "#02bffb",
          width: "100%",
          boxSizing: "border-box",
          padding: "10px",
          position: "relative",
        }}
      >
        <button
          className="navbar-backbutton"
          onClick={handleGoBack}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <FaArrowLeft size={24} />
        </button>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50px",
          }}
        >
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>
            {hostName}
          </h1>
        </div>
      </div>
      <div
        className="formContainer"
        style={{
          maxWidth: "600px",
          margin: "30px auto",
          background: "#fff",
          padding: "20px",
          paddingRight: "20px",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#333" }}>
            Add a Note
          </h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ padding: "20px" }}>
            <div className="formGroup" style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "1rem",
                  color: "#333",
                }}
              >
                Doctor Name:
              </label>
              <input
                type="text"
                onChange={(e) => setDoctor_Name(e.target.value)}
                value={doctor_Name}
                placeholder="Enter Doctor Name"
                style={{
                  width: "100%",
                  padding: "8px",
                  fontSize: "1rem",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div className="formGroup" style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "1rem",
                  color: "#333",
                }}
              >
                Sick:
              </label>
              <input
                type="text"
                onChange={(e) => setSick(e.target.value)}
                value={sick}
                placeholder="Enter Sick"
                style={{
                  width: "100%",
                  padding: "8px",
                  fontSize: "1rem",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div className="formGroup" style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "1rem",
                  color: "#333",
                }}
              >
                Medicines:
              </label>
              <textarea
                onChange={(e) => setMedicine(e.target.value)}
                value={medicine}
                placeholder="Enter Medicines"
                rows="4"
                style={{
                  width: "100%",
                  padding: "8px",
                  fontSize: "1rem",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div className="formGroup" style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "1rem",
                  color: "#333",
                }}
              >
                Description:
              </label>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                placeholder="Enter a description"
                rows="4"
                style={{
                  width: "100%",
                  padding: "8px",
                  fontSize: "1rem",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div className="formGroup" style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "1rem",
                  color: "#333",
                }}
              >
                Image:
              </label>
              <input
                type="file"
                accept=".jpg, .png, .jpeg"
                onChange={handleImageChange}
                style={{ fontSize: "1rem" }}
              />
              {image && (
                <div style={{ marginTop: "10px" }}>
                  <img
                    src={image}
                    alt="Uploaded Preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              )}
            </div>

            <div className="formGroup" style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "1rem",
                  color: "#333",
                }}
              >
                File(Optional):
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e)=> setFile(e.target.files[0])}
                style={{ fontSize: "1rem" }}
              />
              {pdfPreview && (
                <div style={{ marginTop: "10px" }}>
                  <a
                    href={pdfPreview}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View PDF
                  </a>
                </div>
              )}
            </div>

            <div
              className="buttonContainer"
              style={{ textAlign: "center", marginTop: "20px" }}
            >
              <button
                className="addButton"
                type="submit"
                style={{
                  backgroundColor: "#02bffb",
                  color: "#fff",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div
            className="error"
            style={{ color: "red", marginTop: "10px", textAlign: "center" }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Prescription;
