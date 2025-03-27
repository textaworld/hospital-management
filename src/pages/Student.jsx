import { useEffect, useState } from "react";
import { FaEdit, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { useAuthContext } from "../hooks/useAuthContext";
import { useSiteDetailsContext } from "../hooks/useSiteDetailsContext";
import { useStudentContext } from "../hooks/useStudentContext";
import "../styles/instituteDetails.css";
import "../styles/superAdminDashboard.css";

const Students = () => {
  const { students, dispatch } = useStudentContext();
  const { user } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [ageQuery, setAgeQuery] = useState(""); // New state for age filter
  const { sitedetail } = useSiteDetailsContext();
  const [packageStatus, setPackageStatus] = useState("");
  const [newPackageStatus, setNewPackageStatus] = useState("");
  const navigate = useNavigate();

  // Generate Excel
  const generateExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(
      filteredStudents.map((student) => ({
        "Patient ID": student.patient_ID,
        Name: student.name,
        Email: student.email,
        Age: student.age,
        Address: student.address,
        Phone: student.phone,
      }))
    );

    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "students.xlsx");
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          `https://hospital-management-tnwh.onrender.com/api/patients/getAllPatientsByInsId/${sitedetail._id}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        const json = await response.json();

        if (response.ok) {
          dispatch({ type: "SET_STUDENTS", payload: json.data });
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (user) {
      fetchStudents();
    }
  }, [dispatch, user]);

  // Filtered students by Patient ID, Name, and Age
  const filteredStudents = Array.isArray(students)
    ? students.filter(
        (student) =>
          student.patient_ID
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) &&
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (!ageQuery || student.age.toString() === ageQuery) // Filter by age if ageQuery is set
      )
    : [];

  return (
    <div>
      <div className="superAdminDashboardContainer">
        <div className="instituteTableContainer">
          <div className="instituteAddButtonContainer">
            <button onClick={() => navigate("/addPatient")}>
              Add New Patient
            </button>
            <button style={{ marginLeft: "5px" }} onClick={generateExcel}>
              Generate Excel
            </button>
          </div>
          <div className="filter-container">
            {/* Search by Patient ID or Name */}
            <input
              type="search"
              placeholder="Search by Patient ID or Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="searchInput"
            />
            {/* Search by Age */}
            <input
              type="search"
              placeholder="Search by Age"
              value={ageQuery}
              onChange={(e) => setAgeQuery(e.target.value)}
              className="searchInput"
            />
          </div>

          <table className="instituteTable">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Profile</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr key={index}>
                    <td>{student.patient_ID}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.age}</td>
                    <td>{student.address}</td>
                    <td>{student.phone}</td>
                    <td>
                      <Link
                        to={`/studentprofile/${student._id}`}
                        className="btn btn-success"
                      >
                        <FaUser />
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`/updateStd/${student._id}`}
                        className="btn btn-success"
                      >
                        <FaEdit />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9">No Students found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Students;
