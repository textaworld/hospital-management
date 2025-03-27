import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { TbGridScan } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";

const DoctorHome = () => {
  const { user } = useAuthContext();
  const [hostName, setHostName] = useState("");
  const navigate = useNavigate();

  const fetchSiteDetails = async () => {
    const response = await fetch(
      `https://hospital-management-tnwh.onrender.com/api/site/getone/${user.instituteId}`,
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );
    const json = await response.json();
    setHostName(json.name);
    if (response.ok) {
      // Check every second (adjust as needed)
    } else {
      console.log("error");
    }
  };

  //  const fetchAdminDetails = async () => {
  //             try {
  //                 console.log("userID",user)
  //               const response = await fetch(`https://hospital-management-tnwh.onrender.com/api/admin/getone/${user._id}`, {
  //                 headers: { Authorization: `Bearer ${user.token}` },
  //               });
  //               const json = await response.json();

  //               console.log("fetchAdminDetails",json)
  //             } catch (err) {

  //               console.error('Error fetching admin details:', err);
  //             }
  // };

  useEffect(() => {
    fetchSiteDetails();
    // fetchAdminDetails();
  }, []);

  const { logout } = useLogout();

  const handleClick = () => {
    logout();
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous screen
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: "#02bffb",
            width: "100%",
            boxSizing: "border-box",
            padding: "10px",
            position: "relative",
          }}
        >
          <button
            className="navbar-backbutton"
            onClick={handleGoBack}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <FaArrowLeft size={24} />
          </button>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50px",
            }}
          >
            <h1 style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>
              {hostName}
            </h1>
          </div>
        </div>

        {/* <div style={{background: "#4eacca",padding: "0px 20px",borderRadius: "15px",marginTop: "60px",}} >
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
            Welcome Doctor
          </h1>
        </div> */}
        <div style={{ marginTop: "100px", textAlign: "center" }}>
          <Link
            to={"patientScan"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <button
              style={{
                padding: "20px",
                backgroundColor: "#4eacca",
                color: "white",
                border: "none",
                cursor: "pointer",
                borderRadius: "7px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <TbGridScan size={36} />
              <h1 style={{ margin: 0 }}>Scan a Patient</h1>
            </button>
          </Link>
        </div>

        <button
          onClick={handleClick}
          style={{
            marginTop: "300px",
            cursor: "pointer",
            color: "#f8f8f8",
            padding: "8px",
            backgroundColor: "#0f172a",
            borderRadius: "5px",
            border: "1px solid #0f172a",
          }}
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default DoctorHome;
