import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";

const ChannelHistory = () => {
  const { id } = useParams();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [hostName, setHostName] = useState("");

  const fetchSiteDetails = async () => {
    if (!user) {
      setError(new Error("User not authenticated"));
      return;
    }
    
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

  const fetchChannels = async () => {
    try {
      const response = await fetch(
        `https://hospital-management-tnwh.onrender.com/api/channelHistory/getChannelHistoryByPatient_ID/${id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const json = await response.json();

      if (Array.isArray(json)) {
        setChannels(json); // Set channels to the array
      } else {
        console.error("Unexpected data format", json.data);
        setChannels([]); // Set empty array if data format is unexpected
      }
    } catch (error) {
      console.error(error);
      setError(error); // Set error state
    }
  };

  useEffect(() => {
    fetchChannels();

    setLoading(false);
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const handleGoBack = () => {
    navigate(-1);
  };

  const handlePrescriptionClick = () => {
    if (id) {
      navigate(`/prescription/${id}`);
    }
  };

  return (
    <div className="instituteTableContainer">
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
      <button
        onClick={handlePrescriptionClick}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#4eacca",
          color: "black",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Write a note
      </button>
      <h1 style={{ display: "flex", justifyContent: "center" }}>
        Channel History
      </h1>
      <table className="instituteTable">
        <thead>
          <tr>
            <th>Sick</th>
            <th>Doctor Name</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {channels.map((channel) => (
            <tr key={channel._id}>
              <td>{channel.sick}</td>
              <td>{channel.doctor_Name}</td>
              <td>
                <Link
                  to={`/patientChannelView/${channel._id}`}
                  className="btn btn-success"
                >
                  <FaEdit />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChannelHistory;
