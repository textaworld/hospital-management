import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import "../styles/payment.css";

const CreateChannel = () => {
  const { user } = useAuthContext();
  const [inst_ID] = useState(user.instituteId);
  const [channel_ID, setChannel_ID] = useState("");
  const [patient_ID, setPatient_ID] = useState("");
  const [doctor_ID, setDoctor_ID] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [room, setRoom] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [hosName, setHosName] = useState("");
  const [drName, setDRName] = useState("");
  const [doctorsList, setDoctorsList] = useState([]);
  const [error, setError] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [patientIds, setPatientIds] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          `https://hospital-management-tnwh.onrender.com/api/patients/getAllPatientsByInsId/${inst_ID}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        const json = await response.json();

        // Check if data array exists and has items
        if (json && json.data && json.data.length > 0) {
          console.log("Setting patient IDs");
          // Ensure patientIds is set as an array
          const ids = json.data.map((patient) => patient.patient_ID); // Collect all patient IDs into an array
          setPatientIds(ids); // Set the state with the array of patient IDs
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (user) {
      fetchStudents();
    }
  }, [user]);

  // Log patientIds after it has been updated
  useEffect(() => {
    if (patientIds) {
      console.log("Updated patientIds:", patientIds);
    }
  }, [patientIds]);

  const channelIDMaker = () => {
    const now = new Date(); // Get the current date and time
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Get month (01-12)
    const day = String(now.getDate()).padStart(2, "0"); // Get day (01-31)
    const time = now.toTimeString().slice(0, 5).replace(":", ""); // Format: HHMM
    const channelID = `CID${month}${day}T${time}`; // Concatenate CID with formatted month, day, and time
    return channelID;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("gg");
    if (!user) {
      setError("You must be logged in");
      return;
    }

    console.log("Missing fields:", {
      patient_ID,
      doctor_ID,
      date,
      time,
      room,
    });
    // Form validation
    if (!patient_ID || !doctor_ID || !date || !time || !room) {
      setError("All fields are required");
      return;
    }

    if (!patientIds.includes(patient_ID)) {
      alert("The patient ID is not valid or doesn't exist.");
      return;
    }

    const channel_ID = channelIDMaker();

    console.log(channel_ID);

    const channel = {
      inst_ID,
      channel_ID,
      patient_ID,
      doctor_ID,
      date,
      time,
      room,
    };
    console.log("object", channel);
    try {
      const response = await fetch(
        "https://hospital-management-tnwh.onrender.com/api/channels/createChannel",
        {
          method: "POST",
          body: JSON.stringify(channel),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
        return;
      }
      if (response.ok) {
        sendSMS(phone, channel_ID, name, room, time, date, hosName);
        setPatient_ID("");
        setChannel_ID("");
        setDoctor_ID("");
        setDate("");
        setTime("");
        setRoom("");
        alert("Appoinment added successfully!");
      }

      setError(null);
      setSubmissionSuccess(true);
    } catch (err) {
      console.error("Error creating channel:", err.message);
      setError(err.message);
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

  const fetchUser = async () => {
    try {
      const response = await fetch(
        `https://hospital-management-tnwh.onrender.com/api/patients/searchPatientByPatient_ID/${patient_ID}`,
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

  const fetchDoctor = async () => {
    try {
      const response = await fetch(
        `https://hospital-management-tnwh.onrender.com/api/doctors/searchDoctorByDoctor_ID/${doctor_ID}`,
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

  const fetchDoctors = async () => {
    try {
      const response = await fetch(
        `https://hospital-management-tnwh.onrender.com/api/doctors/getAllDoctorsByHospitalId/${inst_ID}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const json = await response.json();

      const formattedDoctors = json.data.map((doctor) => ({
        name: doctor.name, // Assuming the doctor object has a 'name' field
        id: doctor.doctor_ID,
      }));

      setDoctorsList(formattedDoctors);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchDoctor();
    fetchDoctors();
    fetchHospital();
  }, [patient_ID, doctor_ID]);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setPatient_ID(input);

    if (input) {
      const filtered = patientIds.filter((id) =>
        id.toLowerCase().startsWith(input.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0); // Show suggestions if any match
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setPatient_ID(suggestion);
    setShowSuggestions(false);
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
    Your appointment with Dr. ${drName} is confirmed.\n
    Details:
    Room: ${room}
    Date: ${date}
    Time: ${time}
    Channel ID: ${channel_ID}
    Please be on time for your appointment.`;

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
    <div className="container">
      <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
          <h2>Create An Apoinment</h2>
          {/* <div className="form-group">
            <label htmlFor="channel_ID">Channel ID</label>
            <input
              value={channel_ID}
              type="text"
              placeholder="Enter Channel ID"
              className="form-control"
              onChange={(e) => setChannel_ID(e.target.value)}
            />
          </div> */}

          <div className="form-group">
            <label htmlFor="patient_ID">Patient ID</label>
            <div className="dropdown">
              <input
                value={patient_ID}
                type="text"
                placeholder="Search Patient ID"
                className="form-control"
                onChange={handleInputChange}
                onBlur={() => setShowSuggestions(false)} // Close suggestions on blur
                onFocus={() =>
                  setShowSuggestions(filteredSuggestions.length > 0)
                } // Show suggestions on focus
              />
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="dropdown-list">
                  {filteredSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="dropdown-item"
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="doctor_ID">Doctor</label>
            <select
              value={doctor_ID}
              className="form-control"
              onChange={(e) => setDoctor_ID(e.target.value)}
            >
              <option value="">Select a Doctor</option>
              {doctorsList.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} {/* Displaying the doctor's name */}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              value={date}
              type="date"
              className="form-control"
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="time">Time</label>
            <input
              value={time}
              type="time"
              className="form-control"
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="room">Room</label>
            <input
              value={room}
              type="text"
              placeholder="Enter Room"
              className="form-control"
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-submit">
            Submit
          </button>
          {error && <div className="error">{error}</div>}
          {submissionSuccess && (
            <div className="success">Channel created successfully!</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateChannel;
