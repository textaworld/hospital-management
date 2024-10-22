import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClassContext } from "../hooks/useClassContext";
import { useAuthContext } from "../hooks/useAuthContext";
import "../styles/instituteCreate.css"; // Import the CSS file

const CreateClass = ({ onClose, onSuccess }) => {
  const { dispatch } = useClassContext();
  const { user } = useAuthContext();

  const instID = user.instituteId;

  const [class_ID, setClass_ID] = useState("");
  const [subject, setSubject] = useState("");
  const [teacherPhone, setTeacherPhone] = useState("");
  const [name, setName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const classs = {
      inst_ID: instID,
      doctor_ID: class_ID,
      name,
      specialization: subject,
      //teacherName,
      doctorPhone: teacherPhone,
      doctorEmail: teacherEmail,
      //classFees,
    };

    const response = await fetch(
      "https://hospital-management-tnwh.onrender.com/api/doctors/createDoctor",
      {
        method: "POST",
        body: JSON.stringify(classs),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      navigate("/");
    }
    if (response.ok) {
      setClass_ID("");
      //setGrade('');
      setSubject("");
      //setTeacherName('');
      setTeacherPhone("");
      setTeacherEmail("");
      setError(null);
      dispatch({ type: "CREATE_DOCTOR", payload: json });
      onSuccess();
    }
  };

  return (
    <div>
      <div className="overlay" onClick={onClose}></div>
      <div className="create-popup">
        <div className="popup_topic">
          <h3>Add a New Doctor</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <label>
            Doctor ID:
            <input
              type="text"
              onChange={(e) => setClass_ID(e.target.value)}
              value={class_ID}
              placeholder="Enter Doctor ID"
              required
            />
          </label>
          {/* <label>
            Grade:
            <input
              type="number"
              onChange={(e) => setGrade(e.target.value)}
              value={grade}
              placeholder="Enter Grade"
              required
            />
          </label> */}
          <label>
            Name:
            <input
              value={name}
              type="text"
              placeholder="Enter Name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Specialization:
            <input
              value={subject}
              type="text"
              placeholder="Enter Specialization"
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </label>
          {/* <label>
          Teacher's name:
            <input
               value={teacherName}
               type="text"
               placeholder="Enter teacher's name"
               onChange={(e) => setTeacherName(e.target.value)}
              required
            />
          </label> */}
          <label>
            Doctor Phone:
            <input
              value={teacherPhone}
              type="text" // Change to text to use maxLength
              placeholder="Enter Phone number"
              maxLength={11} // Limit input to 11 characters
              onChange={(e) => {
                // Ensure the input is numeric and limits to 11 characters
                const value = e.target.value;
                if (/^\d*$/.test(value) && value.length <= 11) {
                  setTeacherPhone(value);
                }
              }}
              required
            />
          </label>

          <label>
            Docter Email:
            <input
              value={teacherEmail}
              type="email"
              placeholder="Enter Email"
              onChange={(e) => setTeacherEmail(e.target.value)}
              required
            />
          </label>
          {/* <label>
          Class Fees:
            <input
               value={classFees}
               type="number"
               placeholder="Enter Class fee"
              
               onChange={(e) => setClassFees(e.target.value)}
              required
            />
          </label> */}

          <div className="errorContainer">
            {error && <div className="error">{error}</div>}
          </div>
          <div className="buttonContainer">
            <button type="submit" className="addButton">
              Add Doctor
            </button>
            <button className="cancelButton" type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClass;
