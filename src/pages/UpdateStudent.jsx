import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import "../styles/updateStudent.css";
import { useStudentContext } from "../hooks/useStudentContext";

const UpdateStudent = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { students } = useStudentContext();
  const studentdata = students.find((student) => student._id === id);

  const [name, setName] = useState("");
  const [patient_ID, setPatient_ID] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (studentdata) {
      setPatient_ID(studentdata.patient_ID || "");
      setName(studentdata.name || "");
      setEmail(studentdata.email || "");
      setAge(studentdata.age || "");
      setAddress(studentdata.address || "");
      setPhone(studentdata.phone || "");
    }
  }, [studentdata]);

  const updateStudent = async () => {
    try {
      const response = await fetch(
        `https://hospital-management-tnwh.onrender.com/api/patients/updatePatient/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            patient_ID,
            name,
            email,
            age,
            address,
            phone,
          }),
        }
      );

      const json = await response.json();

      if (response.ok) {
        navigate("/students"); // Redirect to the students page after successful update
      } else {
        setError(json.error); // Set the error state
      }
    } catch (error) {
      console.error(error);
      setError("Failed to update student.");
    }
  };

  return (
    <div className="form-container">
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent the default form submission behavior
          updateStudent();
        }}
      >
        <h2 className="form-title">Update Patient Details</h2>
        <div className="form-input">
          <label htmlFor="patient_ID" className="form-label">
            Patient ID
          </label>
          <input
            value={patient_ID}
            type="text"
            placeholder="Enter Patient ID"
            className="form-control"
            onChange={(e) => setPatient_ID(e.target.value)}
          />
        </div>
        <div className="form-input">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            value={name}
            type="text"
            placeholder="Enter Name"
            className="form-control"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-input">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            value={email}
            type="text"
            placeholder="Enter Email"
            className="form-control"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-input">
          <label htmlFor="age" className="form-label">
            Age
          </label>
          <input
            value={age}
            type="text"
            placeholder="Enter Age"
            className="form-control"
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div className="form-input">
          <label htmlFor="address" className="form-label">
            Address
          </label>
          <input
            value={address}
            type="text"
            placeholder="Enter Address"
            className="form-control"
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="form-input">
          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input
            value={phone}
            type="number"
            placeholder="Enter Phone"
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

export default UpdateStudent;
