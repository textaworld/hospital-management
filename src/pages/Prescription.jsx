import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaCamera,
  FaFileUpload,
  FaNotesMedical,
  FaPills,
  FaUserMd,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

const Prescription = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  // State variables
  const inst_ID = user.instituteId;
  const [sick, setSick] = useState("");
  const [doctor_Name, setDoctor_Name] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [medicine, setMedicine] = useState("");
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState("");
  const [pdfPreview, setPdfPreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [hostName, setHostName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Colors and styling constants
  const colors = {
    primary: "#1976d2",
    secondary: "#f5f5f5",
    accent: "#2196f3",
    error: "#f44336",
    success: "#4caf50",
    text: "#333333",
    lightText: "#757575",
    border: "#e0e0e0",
    white: "#ffffff",
  };

  // Fetch site details
  const fetchSiteDetails = async () => {
    try {
      const response = await fetch(
        `https://hospital-management-tnwh.onrender.com/api/site/getone/${user.instituteId}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const json = await response.json();

      if (response.ok) {
        setHostName(json.name);
      }
    } catch (err) {
      console.error("Error fetching site details:", err);
    }
  };

  // Fetch patient details
  const fetchPatients = async () => {
    try {
      const response = await fetch(
        `https://hospital-management-tnwh.onrender.com/api/patients/getPatientByPatient_Id/${id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setPhone(data.patient.phone);
      }
    } catch (error) {
      console.error("Error fetching patient details:", error);
    }
  };

  useEffect(() => {
    fetchSiteDetails();
    fetchPatients();
  }, []);

  // Image handling
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // PDF file handling
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size should be less than 10MB");
        return;
      }

      setFile(selectedFile);

      // Create preview URL for PDF
      const reader = new FileReader();
      reader.onloadend = () => {
        setPdfPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    // Validation
    if (!user) {
      setError("You must be logged in");
      setIsLoading(false);
      return;
    }

    if (!doctor_Name.trim()) {
      setError("Doctor name is required");
      setIsLoading(false);
      return;
    }

    if (!sick.trim()) {
      setError("Patient condition is required");
      setIsLoading(false);
      return;
    }

    try {
      const date = new Date();
      const channel_ID = `${date.getFullYear()}${
        date.getMonth() + 1
      }${date.getDate()}_${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;

      // Prepare form data
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
      formData.append("channel_ID", channel_ID);

      // Submit prescription data
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

      if (!response.ok) {
        throw new Error(json.error || "Failed to submit prescription");
      }

      // Upload file if provided
      if (file) {
        await uploadFile(formData);
      }

      // Send SMS notification
      if (phone) {
        await sendSMS(phone, doctor_Name, description, medicine, date);
      }

      // Reset form
      setDoctor_Name("");
      setDescription("");
      setSick("");
      setImage("");
      setMedicine("");
      setFile("");
      setPdfPreview(null);

      setSuccess("Patient prescription added successfully!");
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err) {
      console.error("Error submitting prescription:", err);
      setError(
        err.message || "An error occurred while submitting the prescription"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Upload file helper
  const uploadFile = async (formData) => {
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

      if (!fileUploadResponse.ok) {
        throw new Error(jsonResponse.error || "File upload failed");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      throw err;
    }
  };

  // Send SMS notification
  const sendSMS = async (phone, doctor_Name, description, medicine, date) => {
    if (!user) {
      throw new Error("You must be logged in");
    }

    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const to = phone;
    const message = `Dear Patient, 

Your recent consultation with Dr. ${doctor_Name} on ${formattedDate} has been completed. Here are the details:

- Condition: ${sick}
- Description: ${description}
- Prescribed Medicine: ${medicine}

Please follow the instructions provided and take the prescribed medication as directed. If you have any questions or experience any issues, feel free to contact our clinic.

Take care and get well soon!

Regards,
${hostName}`;

    const emailDetails = { to, message, inst_ID };

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
      throw new Error(json.error || "Failed to send SMS notification");
    }
  };

  // Navigation
  const handleGoBack = () => {
    navigate(-1);
  };

  // Common input field style
  const inputStyle = {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: `1px solid ${colors.border}`,
    transition: "border 0.3s, box-shadow 0.3s",
    outline: "none",
    boxSizing: "border-box",
  };

  // Common label style
  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontSize: "16px",
    color: colors.text,
    fontWeight: "500",
  };

  return (
    <div
      style={{
        backgroundColor: colors.secondary,
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
          width: "100%",
          boxSizing: "border-box",
          padding: "15px",
          position: "relative",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <button
          onClick={handleGoBack}
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            position: "absolute",
            left: "15px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.3s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.3)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
          }
          aria-label="Go back"
        >
          <FaArrowLeft color={colors.white} size={18} />
        </button>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "40px",
          }}
        >
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "600",
              margin: 0,
              color: colors.white,
              textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            {hostName || "Hospital Management"}
          </h1>
        </div>
      </div>

      {/* Main Form */}
      <div
        style={{
          maxWidth: "700px",
          margin: "30px auto",
          background: colors.white,
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
            borderBottom: `1px solid ${colors.border}`,
            paddingBottom: "15px",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "600",
              color: colors.primary,
              margin: "0 0 5px 0",
            }}
          >
            Add Prescription
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: colors.lightText,
              margin: 0,
            }}
          >
            Fill in the details below to create a prescription for patient ID:{" "}
            {id}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div
            style={{
              backgroundColor: "rgba(76, 175, 80, 0.1)",
              color: colors.success,
              padding: "12px 20px",
              borderRadius: "8px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              fontWeight: "500",
            }}
          >
            <span style={{ marginRight: "10px" }}>✓</span>
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            style={{
              backgroundColor: "rgba(244, 67, 54, 0.1)",
              color: colors.error,
              padding: "12px 20px",
              borderRadius: "8px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              fontWeight: "500",
            }}
          >
            <span style={{ marginRight: "10px" }}>⚠</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {/* Doctor Name */}
            <div style={{ marginBottom: "5px" }}>
              <label style={labelStyle}>
                <FaUserMd
                  style={{ marginRight: "8px", verticalAlign: "middle" }}
                />
                Doctor Name<span style={{ color: colors.error }}>*</span>
              </label>
              <input
                type="text"
                onChange={(e) => setDoctor_Name(e.target.value)}
                value={doctor_Name}
                placeholder="Enter doctor's full name"
                style={inputStyle}
                required
              />
            </div>

            {/* Patient Condition */}
            <div style={{ marginBottom: "5px" }}>
              <label style={labelStyle}>
                <FaNotesMedical
                  style={{ marginRight: "8px", verticalAlign: "middle" }}
                />
                Patient Condition<span style={{ color: colors.error }}>*</span>
              </label>
              <input
                type="text"
                onChange={(e) => setSick(e.target.value)}
                value={sick}
                placeholder="Enter patient's condition or diagnosis"
                style={inputStyle}
                required
              />
            </div>

            {/* Medicines */}
            <div style={{ marginBottom: "5px" }}>
              <label style={labelStyle}>
                <FaPills
                  style={{ marginRight: "8px", verticalAlign: "middle" }}
                />
                Prescribed Medicines
                <span style={{ color: colors.error }}>*</span>
              </label>
              <textarea
                onChange={(e) => setMedicine(e.target.value)}
                value={medicine}
                placeholder="Enter medicine names, dosage, and schedule"
                rows="4"
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  minHeight: "100px",
                }}
                required
              />
              <p
                style={{
                  margin: "5px 0 0 0",
                  fontSize: "14px",
                  color: colors.lightText,
                }}
              >
                Include dosage instructions (e.g., &quot;1 tablet twice daily
                after meals&quot;)
              </p>
            </div>

            {/* Description */}
            <div style={{ marginBottom: "5px" }}>
              <label style={labelStyle}>
                <FaNotesMedical
                  style={{ marginRight: "8px", verticalAlign: "middle" }}
                />
                Additional Instructions
              </label>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                placeholder="Enter additional instructions or notes for the patient"
                rows="4"
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  minHeight: "100px",
                }}
              />
            </div>

            {/* File Upload Section */}
            <div
              style={{
                marginBottom: "5px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {/* Image Upload */}
              <div
                style={{
                  padding: "20px",
                  border: `1px dashed ${colors.border}`,
                  borderRadius: "8px",
                  backgroundColor: "rgba(0,0,0,0.01)",
                }}
              >
                <label style={labelStyle}>
                  <FaCamera
                    style={{ marginRight: "8px", verticalAlign: "middle" }}
                  />
                  Upload Image (optional)
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "20px",
                  }}
                >
                  <input
                    type="file"
                    accept=".jpg, .png, .jpeg"
                    onChange={handleImageChange}
                    style={{
                      fontSize: "14px",
                      width: "100%",
                      maxWidth: "300px",
                    }}
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    style={{
                      display: "inline-block",
                      padding: "10px 15px",
                      backgroundColor: colors.accent,
                      color: colors.white,
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                      textAlign: "center",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = "#1e88e5")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = colors.accent)
                    }
                  >
                    <FaCamera style={{ marginRight: "8px" }} />
                    Select Image
                  </label>
                  {image && (
                    <div
                      style={{
                        marginTop: "10px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={image}
                        alt="Preview"
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: `1px solid ${colors.border}`,
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setImage("")}
                        style={{
                          marginTop: "5px",
                          background: "none",
                          border: "none",
                          color: colors.error,
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        Remove image
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* PDF Upload */}
              <div
                style={{
                  padding: "20px",
                  border: `1px dashed ${colors.border}`,
                  borderRadius: "8px",
                  backgroundColor: "rgba(0,0,0,0.01)",
                }}
              >
                <label style={labelStyle}>
                  <FaFileUpload
                    style={{ marginRight: "8px", verticalAlign: "middle" }}
                  />
                  Upload PDF Document (optional)
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "20px",
                  }}
                >
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    style={{
                      fontSize: "14px",
                      width: "100%",
                      maxWidth: "300px",
                    }}
                    id="pdf-upload"
                  />
                  <label
                    htmlFor="pdf-upload"
                    style={{
                      display: "inline-block",
                      padding: "10px 15px",
                      backgroundColor: colors.accent,
                      color: colors.white,
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                      textAlign: "center",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = "#1e88e5")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = colors.accent)
                    }
                  >
                    <FaFileUpload style={{ marginRight: "8px" }} />
                    Select PDF
                  </label>
                  {pdfPreview && (
                    <div
                      style={{
                        marginTop: "10px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <a
                        href={pdfPreview}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: colors.primary,
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            padding: "8px 12px",
                            backgroundColor: "rgba(25, 118, 210, 0.1)",
                            borderRadius: "4px",
                            marginRight: "10px",
                          }}
                        >
                          PDF
                        </span>
                        View PDF
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setFile("");
                          setPdfPreview(null);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          color: colors.error,
                          cursor: "pointer",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div
              style={{
                textAlign: "center",
                marginTop: "30px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  backgroundColor: isLoading ? "#cccccc" : colors.primary,
                  color: colors.white,
                  padding: "14px 30px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontSize: "16px",
                  fontWeight: "600",
                  transition: "background-color 0.3s",
                  minWidth: "200px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseOver={(e) => {
                  if (!isLoading)
                    e.currentTarget.style.backgroundColor = "#0d5aa7";
                }}
                onMouseOut={(e) => {
                  if (!isLoading)
                    e.currentTarget.style.backgroundColor = colors.primary;
                }}
              >
                {isLoading ? "Submitting..." : "Save Prescription"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          color: colors.lightText,
          fontSize: "14px",
          marginTop: "30px",
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <p style={{ margin: "0" }}>
          © {new Date().getFullYear()}{" "}
          {hostName || "Hospital Management System"} | All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Prescription;
