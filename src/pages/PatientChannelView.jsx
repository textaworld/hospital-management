import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaFileDownload,
  FaFilePdf,
  FaImage,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

const PatientChannelView = () => {
  const { id } = useParams();
  const [channel, setChannel] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [hostName, setHostName] = useState("");
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [channelID, setChannelID] = useState("");

  const fetchSiteDetails = async () => {
    if (!user) return;
    try {
      const response = await fetch(
        `https://hospital-management-tnwh.onrender.com/api/site/getone/${user.instituteId}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch site details");
      const json = await response.json();
      setHostName(json.name);
    } catch (err) {
      console.error("Error fetching site details:", err);
    }
  };

  const fetchChannel = async () => {
    if (!user) {
      setError(new Error("User is not logged in"));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://hospital-management-tnwh.onrender.com/api/channelHistory/getChannelHistoryById/${id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch channel details");
      }

      const json = await response.json();
      setChannel(json);
      setFileUrl(json.image); // Set the image URL directly
      setChannelID(json.channel_ID);
    } catch (error) {
      console.error("Error fetching channel:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUploadedFiles = async (channelID) => {
    try {
      if (!channelID) {
        console.error("channelID is undefined");
        return;
      }
      const response = await fetch(
        `https://hospital-management-tnwh.onrender.com/api/upload/getFilesByChannelID/${channelID}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch uploaded files");
      }

      const json = await response.json();
      setUploadedFiles(json.data || []);
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
    }
  };

  useEffect(() => {
    fetchSiteDetails();
  }, [user]);

  useEffect(() => {
    fetchChannel();
  }, [id, user]);

  useEffect(() => {
    if (channelID) {
      fetchUploadedFiles(channelID);
    }
  }, [channelID]);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.2rem",
          color: "#4a5568",
        }}
      >
        <div
          style={{
            display: "inline-block",
            position: "relative",
            width: "80px",
            height: "80px",
          }}
        >
          <div
            style={{
              boxSizing: "border-box",
              display: "block",
              position: "absolute",
              width: "64px",
              height: "64px",
              margin: "8px",
              border: "8px solid #02bffb",
              borderRadius: "50%",
              animation: "spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite",
              borderColor: "#02bffb transparent transparent transparent",
            }}
          ></div>
        </div>
        <style>
          {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
        </style>
      </div>
    );

  if (error)
    return (
      <div
        style={{
          padding: "20px",
          backgroundColor: "#fed7d7",
          color: "#9b2c2c",
          borderRadius: "5px",
          margin: "20px",
          textAlign: "center",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>Error loading channel details</h3>
        <p>{error.message}</p>
        <button
          onClick={handleGoBack}
          style={{
            backgroundColor: "#9b2c2c",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Go Back
        </button>
      </div>
    );

  const { doctor_Name, patient_ID, date, description, sick, image, medicine } =
    channel;

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleImageClick = () => {
    setShowImagePopup(true);
  };

  const closePopup = () => {
    setShowImagePopup(false);
  };

  // Format date in a user-friendly way
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(to right, #02bffb, #0294d5)",
          padding: "20px 15px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          position: "relative",
          borderBottom: "2px solid #0294d5",
          marginBottom: "30px",
        }}
      >
        <button
          onClick={handleGoBack}
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            position: "absolute",
            left: "15px",
            top: "50%",
            transform: "translateY(-50%)",
            padding: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.3s ease",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)")
          }
        >
          <FaArrowLeft size={20} color="#fff" />
        </button>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#fff",
              margin: 0,
              textAlign: "center",
              textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            {hostName || "Patient Records"}
          </h1>
        </div>
      </div>

      {/* Patient Information Card */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "0 20px 40px",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            overflow: "hidden",
            marginBottom: "30px",
          }}
        >
          {/* Card Header */}
          <div
            style={{
              background: "linear-gradient(to right, #02bffb, #0294d5)",
              padding: "20px",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <h2
              style={{
                color: "white",
                margin: 0,
                fontWeight: "600",
                fontSize: "1.5rem",
              }}
            >
              Patient Details
            </h2>
            <div
              style={{
                display: "flex",
                color: "white",
                marginTop: "10px",
                fontSize: "0.9rem",
                opacity: 0.9,
              }}
            >
              <div style={{ marginRight: "20px" }}>
                <strong>Patient ID:</strong> {patient_ID || "N/A"}
              </div>
              <div>
                <strong>Visit Date:</strong> {formatDate(date)}
              </div>
            </div>
          </div>

          {/* Doctor Info */}
          <div
            style={{
              padding: "20px",
              borderBottom: "1px solid #e2e8f0",
              backgroundColor: "#f8fafc",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#02bffb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  marginRight: "15px",
                }}
              >
                {doctor_Name ? doctor_Name.charAt(0).toUpperCase() : "D"}
              </div>
              <div>
                <h3
                  style={{
                    margin: "0 0 5px 0",
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    color: "#2d3748",
                  }}
                >
                  Dr. {doctor_Name || "N/A"}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.9rem",
                    color: "#718096",
                  }}
                >
                  Attending Physician
                </p>
              </div>
            </div>
          </div>

          {/* Medical Details */}
          <div style={{ padding: "20px" }}>
            {/* Diagnosis */}
            <div
              style={{
                marginBottom: "20px",
                padding: "15px",
                borderRadius: "8px",
                backgroundColor: "#f0fdf4",
                border: "1px solid #dcfce7",
              }}
            >
              <h3
                style={{
                  margin: "0 0 10px 0",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  color: "#166534",
                }}
              >
                Diagnosis
              </h3>
              <p
                style={{
                  margin: 0,
                  color: "#374151",
                  lineHeight: "1.5",
                  wordBreak: "break-word",
                }}
              >
                {sick || "No diagnosis recorded"}
              </p>
            </div>

            {/* Description */}
            <div
              style={{
                marginBottom: "20px",
                padding: "15px",
                borderRadius: "8px",
                backgroundColor: "#eff6ff",
                border: "1px solid #dbeafe",
              }}
            >
              <h3
                style={{
                  margin: "0 0 10px 0",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  color: "#1e40af",
                }}
              >
                Clinical Notes
              </h3>
              <p
                style={{
                  margin: 0,
                  color: "#374151",
                  lineHeight: "1.5",
                  whiteSpace: "pre-line",
                  wordBreak: "break-word",
                }}
              >
                {description || "No clinical notes provided"}
              </p>
            </div>

            {/* Medication */}
            <div
              style={{
                marginBottom: "20px",
                padding: "15px",
                borderRadius: "8px",
                backgroundColor: "#fff7ed",
                border: "1px solid #ffedd5",
              }}
            >
              <h3
                style={{
                  margin: "0 0 10px 0",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  color: "#9a3412",
                }}
              >
                Prescribed Medication
              </h3>
              <p
                style={{
                  margin: 0,
                  color: "#374151",
                  lineHeight: "1.5",
                  whiteSpace: "pre-line",
                  wordBreak: "break-word",
                }}
              >
                {medicine || "No medications prescribed"}
              </p>
            </div>

            {/* Image */}
            {image && (
              <div
                style={{
                  marginBottom: "20px",
                  padding: "15px",
                  borderRadius: "8px",
                  backgroundColor: "#faf5ff",
                  border: "1px solid #e9d5ff",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    color: "#6b21a8",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FaImage style={{ marginRight: "8px" }} /> Medical Images
                </h3>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "10px 0",
                  }}
                >
                  <img
                    src={image}
                    alt="Medical Image"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "300px",
                      borderRadius: "8px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      cursor: "pointer",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                    onClick={handleImageClick}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "scale(1.02)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 16px rgba(0, 0, 0, 0.15)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 8px rgba(0, 0, 0, 0.1)";
                    }}
                  />
                </div>
                <p
                  style={{
                    margin: "10px 0 0 0",
                    fontSize: "0.85rem",
                    color: "#6b7280",
                    textAlign: "center",
                  }}
                >
                  Click on the image to enlarge
                </p>
              </div>
            )}

            {/* Uploaded Files */}
            <div
              style={{
                padding: "15px",
                borderRadius: "8px",
                backgroundColor: "#f1f5f9",
                border: "1px solid #e2e8f0",
              }}
            >
              <h3
                style={{
                  margin: "0 0 10px 0",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  color: "#475569",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FaFileDownload style={{ marginRight: "8px" }} /> Attached
                Documents
              </h3>
              {uploadedFiles.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {uploadedFiles.map((file, index) => (
                    <a
                      key={index}
                      href={`https://hospital-management-tnwh.onrender.com/files/${file.pdf}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 15px",
                        backgroundColor: "white",
                        borderRadius: "6px",
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                        textDecoration: "none",
                        color: "#4b5563",
                        transition: "all 0.2s ease",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "#f9fafb";
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 6px rgba(0, 0, 0, 0.05)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "white";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 1px 3px rgba(0, 0, 0, 0.1)";
                      }}
                    >
                      <FaFilePdf
                        style={{
                          color: "#e53e3e",
                          marginRight: "10px",
                          fontSize: "1.2rem",
                        }}
                      />
                      <span>{file.pdf || `Document ${index + 1}`}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <p
                  style={{
                    margin: 0,
                    color: "#6b7280",
                    textAlign: "center",
                    padding: "10px",
                  }}
                >
                  No documents attached to this record
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Popup Overlay */}
      {showImagePopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={closePopup}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "90%",
              maxHeight: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closePopup}
              style={{
                position: "absolute",
                top: "-40px",
                right: "-10px",
                backgroundColor: "transparent",
                border: "none",
                color: "white",
                fontSize: "30px",
                cursor: "pointer",
                zIndex: 1001,
              }}
            >
              &times;
            </button>
            <img
              src={image}
              alt="Full-size Medical Image"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                borderRadius: "8px",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.25)",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientChannelView;
