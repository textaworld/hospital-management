import  { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePaymentContext } from "../hooks/usePaymentContext";
import { useAuthContext } from "../hooks/useAuthContext";

import "../styles/updateStudent.css";

const UpdateClass = () => {
  const { id } = useParams();
  const { dispatch } = usePaymentContext();
  const { user } = useAuthContext();
  const [subject, setSubject] = useState();
  const [class_ID, setClz_ID] = useState();
  const [teacherEmail, setTEmail] = useState();
  const [drName, setName] = useState("");

  const [teacherPhone, setPhone] = useState();
  const navigate = useNavigate();


  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          "https://hospital-management-tnwh.onrender.com/api/doctors/getDoctorById/" + id,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        const json = await response.json();


        if (response.ok) {
          setClz_ID(json.doctor_ID);
          setSubject(json.specialization);
          setName(json.name)
         // setGrade(json.grade);
          // setTName(json.teacherName);
          setTEmail(json.doctorEmail);
          setPhone(json.doctorPhone);
          // setFees(json.classFees);


          dispatch({ type: "SET_DOCTOR", payload: json });
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
        `https://hospital-management-tnwh.onrender.com/api/doctors/updateDoctor/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            doctor_ID: class_ID,
            specialization: subject,
            doctorPhone: teacherPhone,
            doctorEmail: teacherEmail,
            name: drName, // Ensure the name value is sent correctly
          }),
        }
      );
  
      const json = await response.json();
 
  
      if (response.ok) {
        navigate("/classes"); // Redirect after successful update
      } else {
        setError(json.error); // Set the error state
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
            Doctor ID
          </label>
          <input
            value={class_ID}
            type="text"
            className="form-control"
            onChange={(e) => setClz_ID(e.target.value)}
          />
        </div>{" "}

        <div className="form-input">
          <label htmlFor="" className="form-label">
            Doctor  Name
          </label>
          <input
            value={drName}
            type="text"

            className="form-control"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-input">
          <label htmlFor="" className="form-label">
            Specialization
          </label>
          <input
            value={subject}
            type="text"

            className="form-control"
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        {/* <div className="form-input">
          <label htmlFor="" className="form-label">
            Teachers Name
          </label>
          <input
            value={teacherName}
            type="text"
            placeholder="Enter Teachers Name"
            className="form-control"
            onChange={(e) => setTName(e.target.value)}
          />
        </div> */}
        <div className="form-input">
          <label htmlFor="" className="form-label">
            Doctor Email
          </label>
          <input
            value={teacherEmail}
            type="text"
            className="form-control"
            onChange={(e) => setTEmail(e.target.value)}
          />
        </div>
        {/* <div className="form-input">
          <label htmlFor="" className="form-label">
            Class Fees
          </label>
          <input
            value={classFees}
            type="text"
            placeholder="Enter Fees"
            className="form-control"
            onChange={(e) => setFees(e.target.value)}
          />
        </div> */}
        <div className="form-input">
          <label htmlFor="" className="form-label">
          Doctor Phone
          </label>
          <input
            value={teacherPhone}
            type="number"

            className="form-control"
            onChange={(e) => setPhone(e.target.value)}
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

export default UpdateClass;
