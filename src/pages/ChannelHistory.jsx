import { useEffect, useState } from "react";
import { FaArrowLeft, FaEye, FaFileMedical } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

const ChannelHistory = () => {
  const { id } = useParams();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [hostName, setHostName] = useState("");
  const API_BASE_URL = "https://hospital-management-tnwh.onrender.com/api";

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setError(new Error("User not authenticated"));
        setLoading(false);
        return;
      }

      try {
        // Fetch site details
        await fetchSiteDetails();
        // Fetch channel history
        await fetchChannels();
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const fetchSiteDetails = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/site/getone/${user.instituteId}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch site details");
      }

      const json = await response.json();
      setHostName(json.name);
    } catch (err) {
      console.error("Error fetching site details:", err);
      throw err;
    }
  };

  const fetchChannels = async () => {
    if (!user || !id) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/channelHistory/getChannelHistoryByPatient_ID/${id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch channel history");
      }

      const json = await response.json();

      if (Array.isArray(json)) {
        setChannels(json);
      } else {
        console.error("Unexpected data format:", json);
        setChannels([]);
      }
    } catch (err) {
      console.error("Error fetching channels:", err);
      throw err;
    }
  };

  const handleGoBack = () => navigate(-1);

  const handleWriteNote = () => {
    if (id) {
      navigate(`/prescription/${id}`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading patient data...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error.message}</p>
        <button onClick={handleGoBack} className="btn-primary">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <header className="page-header">
        <button
          className="back-button"
          onClick={handleGoBack}
          aria-label="Go back"
        >
          <FaArrowLeft />
        </button>
        <h1 className="hospital-name">{hostName}</h1>
      </header>

      <main className="content-container">
        <div className="actions-bar">
          <h1 className="page-title">Patient Channel History</h1>
          <button onClick={handleWriteNote} className="btn-primary">
            <FaFileMedical className="icon-left" />
            Write a Note
          </button>
        </div>

        {channels.length === 0 ? (
          <div className="empty-state">
            <p>No channel history found for this patient.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Condition</th>
                  <th>Doctor</th>
                  <th>Actions</th>
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
                        className="btn-icon"
                        title="View details"
                      >
                        <FaEye />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChannelHistory;
