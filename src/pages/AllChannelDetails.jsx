import { useEffect, useState } from "react";
import { FaEdit, FaMoneyBill, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { useAuthContext } from "../hooks/useAuthContext";
import { useSiteDetailsContext } from "../hooks/useSiteDetailsContext";
import "../styles/instituteDetails.css";
import "../styles/superAdminDashboard.css";

const Channels = () => {
  const [channels, setChannels] = useState([]);
  const { user } = useAuthContext();
  const { sitedetail } = useSiteDetailsContext();
  const navigate = useNavigate();

  // Separate search states for each field
  const [channelIdQuery, setChannelIdQuery] = useState("");
  const [patientIdQuery, setPatientIdQuery] = useState("");
  const [doctorIdQuery, setDoctorIdQuery] = useState("");
  const [dateQuery, setDateQuery] = useState("");
  const [timeQuery, setTimeQuery] = useState("");

  // Helper function to format date to MM/DD/YYYY
  const formatDateToMMDDYYYY = (dateString) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const generateExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(
      filteredChannels.map((channel) => ({
        "Channel ID": channel.channel_ID,
        "Patient ID": channel.patient_ID,
        "Doctor ID": channel.doctor_ID,
        Date: formatDateToMMDDYYYY(channel.date),
        Time: channel.time,
        Room: channel.room,
      }))
    );
    XLSX.utils.book_append_sheet(wb, ws, "Channels");
    XLSX.writeFile(wb, "channels.xlsx");
  };

  const fetchChannels = async () => {
    try {
      const response = await fetch(
        `https://hospital-management-tnwh.onrender.com/api/channels/getAllChannelsByHospitalId/${sitedetail._id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const json = await response.json();
      if (response.ok) {
        setChannels(json.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (channel_ID) => {
    if (!window.confirm("Are you sure you want to delete this channel?")) {
      return;
    }

    try {
      const response = await fetch(
        `https://hospital-management-tnwh.onrender.com/api/channels/deleteChannel/${channel_ID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (response.ok) {
        setChannels((prevChannels) =>
          prevChannels.filter((channel) => channel._id !== channel_ID)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchChannels();
    }
  }, [user, sitedetail]);

  // Filtering logic for each search bar
  const filteredChannels = channels.filter((channel) => {
    const formattedDate = formatDateToMMDDYYYY(channel.date); // Format the channel date
    return (
      channel.channel_ID.toLowerCase().includes(channelIdQuery.toLowerCase()) &&
      channel.patient_ID.toLowerCase().includes(patientIdQuery.toLowerCase()) &&
      channel.doctor_ID.toLowerCase().includes(doctorIdQuery.toLowerCase()) &&
      formattedDate.includes(dateQuery) && // Compare formatted date
      channel.time.toLowerCase().includes(timeQuery.toLowerCase())
    );
  });

  return (
    <div>
      <div className="superAdminDashboardContainer">
        <div className="instituteTableContainer">
          <div className="instituteAddButtonContainer">
            <button onClick={() => navigate("/addAppoinment")}>
              Add New Channel
            </button>
            <button style={{ marginLeft: "5px" }} onClick={generateExcel}>
              Generate Excel
            </button>
          </div>

          {/* Separate Search Inputs for Each Field */}
          <div className="filter-container">
            <input
              type="search"
              placeholder="Search by Channel ID"
              value={channelIdQuery}
              onChange={(e) => setChannelIdQuery(e.target.value)}
              className="searchInput"
            />
            <input
              type="search"
              placeholder="Search by Patient ID"
              value={patientIdQuery}
              onChange={(e) => setPatientIdQuery(e.target.value)}
              className="searchInput"
            />
            <input
              type="search"
              placeholder="Search by Doctor ID"
              value={doctorIdQuery}
              onChange={(e) => setDoctorIdQuery(e.target.value)}
              className="searchInput"
            />
            <input
              type="search"
              placeholder="Search by Date (MM/DD/YYYY)"
              value={dateQuery}
              onChange={(e) => setDateQuery(e.target.value)}
              className="searchInput"
            />
            <input
              type="search"
              placeholder="Search by Time"
              value={timeQuery}
              onChange={(e) => setTimeQuery(e.target.value)}
              className="searchInput"
            />
          </div>

          <table className="instituteTable">
            <thead>
              <tr>
                <th>Channel ID</th>
                <th>Patient ID</th>
                <th>Doctor ID</th>
                <th>Date</th>
                <th>Time</th>
                <th>Room</th>
                <th>Payments</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredChannels.length > 0 ? (
                filteredChannels.map((channel, index) => {
                  const formattedDate = formatDateToMMDDYYYY(channel.date);
                  return (
                    <tr key={index}>
                      <td>{channel.channel_ID}</td>
                      <td>{channel.patient_ID}</td>
                      <td>{channel.doctor_ID}</td>
                      <td>{formattedDate}</td>
                      <td>{channel.time}</td>
                      <td>{channel.room}</td>
                      <td>
                        <Link
                          to={`/payment/${channel._id}`}
                          className="btn btn-success"
                        >
                          <FaMoneyBill />
                        </Link>
                      </td>
                      <td>
                        <Link
                          to={`/updateChannel/${channel._id}`}
                          className="btn btn-success"
                        >
                          <FaEdit />
                        </Link>
                      </td>
                      <td>
                        <Link
                          to="#"
                          className="btn btn-danger"
                          onClick={() => handleDelete(channel._id)}
                        >
                          <FaTrash />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9">No Channels found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Channels;
