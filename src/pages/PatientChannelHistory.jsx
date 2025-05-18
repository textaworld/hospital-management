import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import "../styles/instituteDetails.css";
const PatientChannelHistory = () => {
  const { id } = useParams(); // Get patient_ID from URL parameters
  const [channels, setChannels] = useState([]); // Initialize as an array
  const [payments, setPayments] = useState([]); // New state for payments
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const fetchChannels = async () => {
    try {
      const response = await fetch(
        `https://hospital-management-tnwh.onrender.com/api/channels/getAllChannelsByPatientId/${id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const json = await response.json();
      //console.log("channels", json);

      if (Array.isArray(json.data)) {
        setChannels(json.data); // Set channels to the array
      } else {
        console.error("Unexpected data format", json.data);
        setChannels([]); // Set empty array if data format is unexpected
      }
    } catch (error) {
      console.error(error);
      setError(error); // Set error state
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await fetch(
        `https://hospital-management-tnwh.onrender.com/api/payments/getAllPaymentsByPatientID/${id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const json = await response.json();
      //console.log("payments", json);

      if (Array.isArray(json.data)) {
        setPayments(json.data); // Set payments to the array
      } else {
        console.error("Unexpected data format", json.data);
        setPayments([]); // Set empty array if data format is unexpected
      }
    } catch (error) {
      console.error(error);
      setError(error); // Set error state
    }
  };

  useEffect(() => {
    fetchChannels();
    fetchPayments();
    setLoading(false); // Stop loading after data is fetched
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="superAdminDashboardContainer">
      <div className="instituteTableContainer">
        <h1 style={{ justifyContent: "center", display: "flex" }}>
          CHANNEL HISTORY
        </h1>
        <table className="instituteTable">
          <thead>
            <tr>
              <th>Channel ID</th>
              <th>Doctor ID</th>
              <th>Date</th>
              <th>Time</th>
              <th>Room</th>
            </tr>
          </thead>
          <tbody>
            {channels.map((channel) => (
              <tr key={channel._id}>
                <td>{channel.channel_ID}</td>
                <td>{channel.doctor_ID}</td>
                <td>{channel.date}</td>
                <td>{channel.time}</td>
                <td>{channel.room}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h1 style={{ justifyContent: "center", display: "flex" }}>
          PAYMENT HISTORY
        </h1>
        <table className="instituteTable">
          <thead>
            <tr>
              <th>Channel ID</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td>{payment.channel_ID}</td>
                <td>{payment.amount}</td>
                <td>{payment.date}</td>
                <td>{payment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientChannelHistory;
