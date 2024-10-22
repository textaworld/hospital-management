import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { FaArrowLeft } from "react-icons/fa";

const PatientChannelView = () => {
  const { id } = useParams();
  const [channel, setChannel] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [hostName, setHostName] = useState("");
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [fileUrl, setFileUrl] = useState(null); // URL for file download
  const [uploadedFiles, setUploadedFiles] = useState([]); // State for uploaded files
  const [channelID, setChannelID] = useState("");

  const fetchSiteDetails = async () => {
    if (!user) return; // If user is not logged in, return early
    const response = await fetch(
      `https://hospital-management-tnwh.onrender.com/api/site/getone/${user.instituteId}`,
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );
    const json = await response.json();
    setHostName(json.name);
  };

  useEffect(() => {
    fetchSiteDetails();
  }, [user]); // Run effect when user changes

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
      setFileUrl(json.file);
      setChannel(json);
      setChannelID(json.channel_ID); // Set channelID here
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // New function to fetch uploaded files
  const fetchUploadedFiles = async (channelID) => {
    try {
      if (!channelID) {
        console.error("channelID is undefined");
        return;
      }
      const response = await fetch(`https://hospital-management-tnwh.onrender.com/api/upload/getFilesByChannelID/${channelID}`);

      if (!response.ok) {
        throw new Error("Failed to fetch uploaded files");
      }

      const json = await response.json();
      console.log("json",json)
      setUploadedFiles(json.data); // Assuming the API response contains an array of files in 'data'
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
      setError(error);
    }
  };

  // New useEffect to fetch uploaded files when channelID changes
  useEffect(() => {
    if (channelID) {
      fetchUploadedFiles(channelID); // Call with channelID
    }
  }, [channelID]);

  useEffect(() => {
    fetchChannel();
  }, [id, user]); 

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading channel details: {error.message}</p>;

  const {
    doctor_Name,
    patient_ID,
    date,
    description,
    sick,
    image,
    medicine,
  } = channel;

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleImageClick = () => {
    setShowImagePopup(true);
  };

  const closePopup = () => {
    setShowImagePopup(false);
  };

  return (
    <div className="instituteTableContainer">
      {/* Header Section */}
      <div
        style={{
          background: "#02bffb",
          width: "100%",
          boxSizing: "border-box",
          padding: "15px",
          position: "relative",
          borderBottom: "2px solid #0294d5",
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
            left: "15px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <FaArrowLeft size={24} color="#fff" />
        </button>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60px",
          }}
        >
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#fff", margin: 0 }}>
            {hostName}
          </h1>
        </div>
      </div>

      {/* Channel Details Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "30px",
          backgroundColor: "#f0f4f8",
          padding: "20px",
        }}
      >
        <div
          style={{
            border: "1px solid #e2e8f0",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
            backgroundColor: "#ffffff",
            maxWidth: "800px",
            width: "100%",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                    borderBottom: "2px solid #e2e8f0",
                    color: "#2d3748",
                    fontSize: "1.2rem",
                  }}
                >
                  Field
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                    borderBottom: "2px solid #e2e8f0",
                    color: "#2d3748",
                    fontSize: "1.2rem",
                  }}
                >
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "12px", color: "black" }}><strong>Doctor Name:</strong></td>
                <td style={{ padding: "12px", color: "black" }}>{doctor_Name}</td>
              </tr>
              <tr>
                <td style={{ padding: "12px", color: "black" }}><strong>Date:</strong></td>
                <td style={{ padding: "12px", color: "black" }}>{new Date(date).toLocaleString()}</td>
              </tr>
              <tr>
                <td style={{ padding: "12px", color: "black" }}><strong>Sick:</strong></td>
                <td style={{ padding: "12px", color: "black" }}>{sick}</td>
              </tr>
              <tr>
                <td style={{ padding: "12px", color: "black" }}><strong>Description:</strong></td>
                <td style={{ padding: "12px", color: "black" }}>
                  {description
                    ? description.split("\n").map((line, index) => (
                        <React.Fragment key={index}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))
                    : "No description provided"}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "12px", color: "black" }}><strong>Medicines:</strong></td>
                <td style={{ padding: "12px", color: "black" }}>
                  {medicine
                    ? medicine.split("\n").map((line, index) => (
                        <React.Fragment key={index}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))
                    : "No medicines provided"}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "12px", color: "black" }}><strong>Image:</strong></td>
                <td style={{ padding: "12px", color: "black" }}>
                  {image && (
                    <img
                      src={image}
                      alt="Channel Image"
                      style={{
                        width: "100px",
                        cursor: "pointer",
                        borderRadius: "8px",
                        transition: "transform 0.3s",
                      }}
                      onClick={handleImageClick}
                    />
                  )}
                </td>
              </tr>
              <tr>
          <td style={{ padding: "12px", color: "black" }}><strong>Uploaded Files:</strong></td>
          <td style={{ padding: "12px", color: "black" }}>
            {uploadedFiles.length > 0 ? (
              uploadedFiles.map((file, index) => (
                <div key={index}>
                  <a
                   href={`https://hospital-management-tnwh.onrender.com/files/${file.pdf}`}
                    target="_blank"
                    
                    rel="noopener noreferrer"
                    style={{
                      color: "#3182ce",
                      textDecoration: "underline",
                      transition: "color 0.3s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = "#2b6cb0")}
                    onMouseOut={(e) => (e.currentTarget.style.color = "#3182ce")}
                  >
                    {file.pdf} {/* Display the filename */}
                  </a>
                </div>
              ))
            ) : (
              <p>No files uploaded</p>
            )}
          </td>
        </tr>
            </tbody>
          </table>

          {/* Uploaded Files Section */}
          {/* // <div>
          //   <h2 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>Uploaded Files</h2>
          //   <ul style={{ listStyleType: "none", padding: 0 }}>
          //     {uploadedFiles.length > 0 ? ( */}
          {/* //       uploadedFiles.map((file) => (
          //         <li key={file.id} style={{ marginBottom: "10px" }}>
          //           <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
          //             {file.fileName}
          //           </a>
          //         </li>
          //       ))
          //     ) : (
          //       <p>No uploaded files found.</p>
          //     )}
          //   </ul>
          // </div> */}

          {/* Image Popup */}
          {showImagePopup && (
            <div className="image-popup">
              <div className="image-popup-content">
                <span className="close" onClick={closePopup}>&times;</span>
                <img src={fileUrl} alt="Popup" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientChannelView;
