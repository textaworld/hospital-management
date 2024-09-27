import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useSiteDetailsContext } from "../hooks/useSiteDetailsContext";
import { FaTrash, FaEdit, FaMoneyBill } from "react-icons/fa";
import CreateClass from "../components/CreateClass";

const Clz = () => {
  const { user } = useAuthContext();
  const { sitedetail, dispatch: sitedispatch } = useSiteDetailsContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [packageStatus, setPackageStatus] = useState("");
  const [newPackageStatus, setNewPackageStatus] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  // Filter doctors based on search query matching doctor ID or name
  const filteredDoctors = doctors.filter((doc) => {
    const doctorId = doc.doctor_ID ? doc.doctor_ID.toLowerCase() : "";
    const doctorName = doc.name ? doc.name.toLowerCase() : "";

    return (
      doctorId.includes(searchQuery.toLowerCase()) ||
      doctorName.includes(searchQuery.toLowerCase())
    );
  });

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSubmissionSuccess = () => {
    closeModal();
  };

  const fetchSiteDetails = async () => {
    const response = await fetch(
      `https://hospital-management-tnwh.onrender.com/api/site/getone/${user.instituteId}`,
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );
    const json = await response.json();

    if (response.ok) {
      setNewPackageStatus(json.packageStatus);
      sitedispatch({ type: "SET_SITE_DETAILS", payload: json });

      const expirationCheckPerformed = localStorage.getItem(
        "expirationCheckPerformed"
      );

      if (!expirationCheckPerformed) {
        const interval = setInterval(() => {
          const currentTime = new Date();
          const expireTime = new Date(json.expireTime);

          if (currentTime > expireTime) {
            const status = "Deactivate";
            updateDetails({ packageStatus: status });
            setPackageStatus("No");
            clearInterval(interval);
            localStorage.setItem("expirationCheckPerformed", "true");
          } else {
            setPackageStatus("Yes");
          }
        }, 1000);
      } else {
        setPackageStatus("No");
      }
    }
  };

  const updateDetails = async (data) => {
    try {
      const response = await fetch(
        `https://hospital-management-tnwh.onrender.com/api/institute/update/${user.instituteId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update details: ${response.status}`);
      }

      sitedispatch({
        type: "UPDATE_INSTITUTE",
        payload: { _id: sitedetail._id, data },
      });
    } catch (error) {
      console.error("Failed to update details:", error);
    }
  };

  const handleRestartProcess = async () => {
    if (newPackageStatus === "Active") {
      localStorage.removeItem("expirationCheckPerformed");
    }

    await fetchSiteDetails();
  };

  useEffect(() => {
    if (user) {
      fetchSiteDetails();
    }

    return () => {};
  }, [user, packageStatus]);

  useEffect(() => {
    const expirationCheckPerformed = localStorage.getItem(
      "expirationCheckPerformed"
    );

    if (expirationCheckPerformed && packageStatus === "No") {
      handleRestartProcess();
    }
  }, [packageStatus]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(
          `https://hospital-management-tnwh.onrender.com/api/doctors/getAllDoctorsByHospitalId/${sitedetail._id}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        const json = await response.json();

        if (response.ok) {
          setDoctors(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      }
    };

    if (user && sitedetail._id) {
      fetchDoctors();
    }
  }, [user, sitedetail._id]);

  const handleDeleteClass = async (classId) => {
    if (!window.confirm("Are you sure you want to delete this class?")) {
      return;
    }

    try {
      const response = await fetch(
        `https://hospital-management-tnwh.onrender.com/api/doctors/deleteDoctor/${classId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.ok) {
        alert("Deleted Successfully!");
      }
    } catch (error) {
      console.error("Failed to delete doctor:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      {isModalOpen && (
        <CreateClass onClose={closeModal} onSuccess={handleSubmissionSuccess} />
      )}
      <div className="superAdminDashboardContainer">
        <div className="instituteTableContainer">
          <div className="instituteAddButtonContainer">
            <button onClick={openModal}>Add New Doctor</button>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by Doctor ID or Name"
          />

          <table className="instituteTable">
            <thead>
              <tr>
                <th>Doctor ID</th>
                <th>Doctor Name</th>
                <th>Specialization</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Income</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((clz, index) => (
                  <tr key={index}>
                    <td>{clz.doctor_ID}</td>
                    <td>{clz.name}</td>
                    <td>{clz.specialization}</td>
                    <td>{clz.doctorEmail}</td>
                    <td>{clz.doctorPhone}</td>
                    <td>
                      <Link
                        to={`/headOfficeHome/doctorIncome/${clz._id}`}
                        className="btn btn-success"
                      >
                        <FaMoneyBill />
                      </Link>
                    </td>
                    <td>
                      <Link to={`/updateClz/${clz._id}`} className="btn btn-success">
                        <FaEdit />
                      </Link>
                    </td>
                    <td>
                      <Link
                        to="#"
                        className="btn btn-danger"
                        onClick={() => handleDeleteClass(clz._id)}
                      >
                        <FaTrash />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No Doctors found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Clz;
