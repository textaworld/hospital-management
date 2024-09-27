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

  const fetchSiteDetails = async () => {
    if (!user) return; // If user is not logged in, return early
    const response = await fetch(
      `https://hospital-management-tnwh.onrender.com/api/site/getone/${user.instituteId}`,
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );
    const json = await response.json();
   // console.log("json", json);
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
        throw new Error('Failed to fetch channel details');
      }

      const json = await response.json();
      //console.log("channel", json);
      setFileUrl(json.file);
      setChannel(json);
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannel();
  }, [id, user]); // Run effect when id or user changes

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

      {/* Channel Details Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "40px",
          backgroundColor: "#f0f4f8",
        }}
      >
        <div className="border p-4 rounded shadow-lg bg-white">
          <p className="text-gray-700 mb-2">
            <strong>Doctor Name:</strong> {doctor_Name}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Date:</strong> {new Date(date).toLocaleString()}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Sick:</strong> {sick}
          </p>
          <p
            className="text-gray-700 mb-2"
            style={{ maxWidth: "400px", wordWrap: "break-word" }}
          >
            <strong>Description:</strong>
            {description
              ? description.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))
              : "No description provided"}
          </p>
          <p
            className="text-gray-700 mb-2"
            style={{ maxWidth: "400px", wordWrap: "break-word" }}
          >
            <strong>Medicines:</strong>
            {medicine
              ? medicine.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))
              : "No description provided"}
          </p>

          {/* Thumbnail Image */}
          <p className="text-gray-700 mb-2">
            <strong>Image:</strong>
          </p>
          {image && (
            <div className="mt-4">
              <img
                src={image}
                alt="Channel Image"
                style={{ width: "100px", cursor: "pointer" }}
                onClick={handleImageClick}
              />
            </div>
          )}

          {/* Downloadable File Section
          <p className="text-gray-700 mb-2">
            <strong>Uploaded File:</strong>
          </p>
          {fileUrl ? (
            <div className="mt-4">
              <a href={fileUrl} download className="text-blue-600 underline">
                Click here to download {channel.file}
              </a>
            </div>
          ) : (
            <p>No file uploaded</p>
          )} */}
        </div>
      </div>

      {/* Image Popup Modal */}
      {showImagePopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              position: "relative",
            }}
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "#4eacca",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
                padding: "5px",
                width: "7%",
              }}
            >
              X
            </button>
            {/* Large Image */}
            <img
              src={image}
              alt="Channel Image"
              style={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                objectFit: "contain",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientChannelView;
