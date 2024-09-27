import  {  useEffect  } from "react";
import { useParams } from "react-router-dom";
import { useStudentContext } from "../hooks/useStudentContext";
import { useAuthContext } from "../hooks/useAuthContext";

import "react-datepicker/dist/react-datepicker.css";

const StudentProfile = () => {
  const { students } = useStudentContext();
  const { user } = useAuthContext();


  // Access the student ID from the URL
  const { patient_ID } = useParams();

  const studentdata = students.find((student) => student._id === patient_ID);

  // Fetch attendance counts by start and end dates
 
 
  // Fetch payment status
  useEffect(() => {
    if (studentdata) {
      const fetchPaymentStatus = async () => {
        try {
          const response = await fetch(
            `https://hospital-management-tnwh.onrender.com/api/payments/getAllPaymentStatusBystdId/${studentdata.patient_ID}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
              }
            }
          );
          const data = await response.json();

          if (response.ok) {
           // console.log("okay")
          } else {
            throw new Error('Failed to fetch payment status');
          }
        } catch (error) {
          console.error(error);
        }
      };

      fetchPaymentStatus();
    }
  }, [studentdata, user.token]);

  if (!studentdata) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Student not found</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>PATIENT PROFILE</h1>
      <div style={styles.profileContainer}>
        <div style={styles.detailsCard}>
          <div style={styles.detail}>
            <strong>Patient ID:</strong> {studentdata.patient_ID}
          </div>
          <div style={styles.detail}>
            <strong>Name:</strong> {studentdata.name}
          </div>
          <div style={styles.detail}>
            <strong>Email:</strong> {studentdata.email}
          </div>
          <div style={styles.detail}>
            <strong>Age:</strong> {studentdata.age}
          </div>
          <div style={styles.detail}>
            <strong>Address:</strong> {studentdata.address}
          </div>
          <div style={styles.detail}>
            <strong>Phone:</strong> {studentdata.phone}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '40px auto 20px', // Top margin added, auto center horizontally, bottom margin
    // backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor:'#b5d2ee',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '2rem',
    color: '#333',
  },
  profileContainer: {
   
    display: 'flex',
    justifyContent: 'center',
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    width: '100%',
    justifyContent: 'center',
  },
  detail: {
    marginBottom: '15px',
    fontSize: '1rem',
    color: '#555',
  },
};

export default StudentProfile;
