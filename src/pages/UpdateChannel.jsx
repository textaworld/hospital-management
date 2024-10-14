import  { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePaymentContext } from "../hooks/usePaymentContext";
import { useAuthContext } from "../hooks/useAuthContext";

import "../styles/updateStudent.css";

const UpdateChannel = () => {
  const { id } = useParams();
  const { dispatch } = usePaymentContext();
  const { user } = useAuthContext();
    const [drID,setDr_ID] = useState("")
    const [channelID,setChannelID] = useState("")
    const [date,setDate] = useState("")
    const [patientID,setPatientID] = useState("")
    const [room,setRoom] = useState("")
    const [time,setTime] = useState("")

  const navigate = useNavigate();


  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          "https://hospital-management-tnwh.onrender.com/api/channels/getChannelById/" + id,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        const json = await response.json();
       // console.log("json",json)


        if (response.ok) {
          setDr_ID(json.doctor_ID);
          setChannelID(json.channel_ID);
          setDate(json.date)
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
            date:date ,
            room: room, 
            time:time
          }),
        }
      );
  
      const json = await response.json();
 
  
      if (response.ok) {
        navigate("/channels"); 
      } else {
        setError(json.error); 
      }
    } catch (error) {
      console.error(error);
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
