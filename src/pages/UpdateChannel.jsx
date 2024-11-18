import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePaymentContext } from "../hooks/usePaymentContext";
import { useAuthContext } from "../hooks/useAuthContext";

import "../styles/updateStudent.css";

const UpdateChannel = () => {
  const { id } = useParams();
  const { dispatch } = usePaymentContext();
  const { user } = useAuthContext();
  const [drID, setDr_ID] = useState("");
  const [channelID, setChannelID] = useState("");
  const [date, setDate] = useState("");
  const [patientID, setPatientID] = useState("");
  const [room, setRoom] = useState("");
  const [time, setTime] = useState("");
  const [drName, setDRName] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [hosName, setHosName] = useState("");
  const inst_ID = user.instituteId;
  const navigate = useNavigate();

  const [error, setError] = useState(null);

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
        // console.log("json",json)

        if (response.ok) {
          setDr_ID(json.doctor_ID);
          setChannelID(json.channel_ID);
          setDate(json.date);
          setPatientID(json.patient_ID);
          setRoom(json.room);
          setTime(json.time);
          // setFees(json.classFees);
        }
      } catch (error) {
        // Handle the error as needed
      }
    };

    if (user) {
      fetchStudents();
    }
  }, [dispatch, user, id]);

  const fetchDoctor = async () => {
    try {
      const response = await fetch(
        `https://hospital-management-tnwh.onrender.com/api/doctors/searchDoctorByDoctor_ID/${drID}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const json = await response.json();
      setDRName(json.name);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDoctor();
    fetchUser();
    fetchHospital();
  }, [patientID, drID]);

  const fetchUser = async () => {
    try {
      const response = await fetch(
        `https://hospital-management-tnwh.onrender.com/api/patients/searchPatientByPatient_ID/${patientID}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const json = await response.json();
      setPhone(json.phone);
      setName(json.name);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchHospital = async () => {
    try {
      const response = await fetch(
        `https://hospital-management-tnwh.onrender.com/api/institute/getone/${inst_ID}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const json = await response.json();
      setHosName(json.name);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStudent = async () => {
    try {
      const response = await fetch(
        `https://hospital-management-tnwh.onrender.com/api/channels/updateChannel/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            doctor_ID: drID,
            patient_ID: patientID,
            channel_ID: channelID,
            date: date,
            room: room,
            time: time,
          }),
        }
      );

      const json = await response.json();

      if (response.ok) {
        sendSMS(phone, channelID, name, room, time, date, hosName);
        navigate("/channels");
      } else {
        setError(json.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sendSMS = async (
    phone,
    channel_ID,
    name,
    room,
    time,
    date,
    hosName
  ) => {
    if (!user) {
      setError("You must be logged in");
      return;
    }

    const to = phone;

    const message = `
    ${hosName}
    
    Dear patient ${name},
    Your appointment details have been updated.\n
    Updated Details:
    Room: ${room}
    Date: ${date}
    Time: ${time}
    Channel ID: ${channel_ID}
    Thank you.`;

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
      setError(json.error);
    }
    if (response.ok) {
      setError(null);
    }
  };

  return (
    <div className="form-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateStudent();
        }}
      >
        <h2 className="form-title">Update Doctor Details</h2>
        <div className="form-input">
          <label htmlFor="" className="form-label">
            Channel ID
          </label>
          <input
            value={channelID}
            type="text"
            className="form-control"
            onChange={(e) => setChannelID(e.target.value)}
          />
        </div>

        <div className="form-input">
          <label htmlFor="" className="form-label">
            Doctor ID
          </label>
          <input
            value={drID}
            type="text"
            className="form-control"
            onChange={(e) => setDr_ID(e.target.value)}
          />
        </div>

        <div className="form-input">
          <label htmlFor="" className="form-label">
            Patient ID
          </label>
          <input
            value={patientID}
            type="text"
            className="form-control"
            onChange={(e) => setPatientID(e.target.value)}
          />
        </div>

        <div className="form-input">
          <label htmlFor="" className="form-label">
            Room
          </label>
          <input
            value={room}
            type="text"
            className="form-control"
            onChange={(e) => setRoom(e.target.value)}
          />
        </div>

        <div className="form-input">
          <label htmlFor="" className="form-label">
            Time
          </label>
          <input
            value={time}
            type="time"
            className="form-control"
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <button type="submit" className="form-button">
          Submit
        </button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default UpdateChannel;
