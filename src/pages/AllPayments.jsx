import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx"; // Import XLSX library
import { useAuthContext } from "../hooks/useAuthContext";
import { usePaymentContext } from "../hooks/usePaymentContext";
import { useSiteDetailsContext } from "../hooks/useSiteDetailsContext";

const Payments = () => {
  const { payments, dispatch } = usePaymentContext();
  const { user } = useAuthContext();
  const { sitedetail } = useSiteDetailsContext();

  const [paymentss, setPayments] = useState([]);
  const [searchTermID, setSearchTermID] = useState("");
  const [searchTermDoctorID, setSearchTermDoctorID] = useState("");
  const [searchTermChannelID, setSearchTermChannelID] = useState("");
  const [searchTermDate, setSearchTermDate] = useState("");
  const [scrollPosition, setScrollPosition] = useState(0);
  const role = user.role;

  const fetchPayments = async () => {
    try {
      const response = await fetch(
        `https://hospital-management-tnwh.onrender.com/api/payments/getAllPaymentsByInsId/${sitedetail._id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const json = await response.json();

      if (response.ok) {
        setPayments(json.data);
        dispatch({ type: "SET_PAYMENTS", payload: json.data });
      }
    } catch (error) {
      // Handle error
    }
  };

  useEffect(() => {
    if (user) {
      fetchPayments();
    }
  }, [dispatch, user, sitedetail._id]);

  const formatDateToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const filteredPayments = paymentss.filter((payment) => {
    const patientIDMatch = payment?.patient_ID
      ?.toLowerCase()
      .includes(searchTermID.toLowerCase());
    const doctorIDMatch = payment?.doctor_ID
      ?.toLowerCase()
      .includes(searchTermDoctorID.toLowerCase());
    const channelIDMatch = payment?.channel_ID
      ?.toLowerCase()
      .includes(searchTermChannelID.toLowerCase());

    const dateFormatted = formatDateToDDMMYYYY(payment.date);
    const dateMatch = dateFormatted.includes(searchTermDate);

    return patientIDMatch && doctorIDMatch && channelIDMatch && dateMatch;
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      paymentss.map((payment) => ({
        Patient_ID: payment.patient_ID,
        Doctor_ID: payment.doctor_ID,
        Channel_ID: payment.channel_ID,
        Amount: payment.amount,
        Date: formatDateToDDMMYYYY(payment.date),
        Status: payment.status,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "Payments.xlsx");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, scrollPosition);
  }, [scrollPosition]);

  const handleDelete = async (paymentID) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) {
      return;
    }

    try {
      const response = await fetch(
        `https://hospital-management-tnwh.onrender.com/api/payments/deletePayment/${paymentID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.ok) {
        setPayments(paymentss.filter((payment) => payment._id !== paymentID));
      }
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div>
      <div className="superAdminDashboardContainer">
        <div className="instituteTableContainer">
          <p>You can search by Patient ID, Doctor ID, Channel ID, or Date</p>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Search by Patient ID"
              value={searchTermID}
              onChange={(e) => setSearchTermID(e.target.value)}
            />
            <input
              type="text"
              placeholder="Search by Doctor ID"
              value={searchTermDoctorID}
              onChange={(e) => setSearchTermDoctorID(e.target.value)}
            />
            <input
              type="text"
              placeholder="Search by Channel ID"
              value={searchTermChannelID}
              onChange={(e) => setSearchTermChannelID(e.target.value)}
            />
            <input
              type="text"
              placeholder="Search by Date (dd/mm/yyyy)"
              value={searchTermDate}
              onChange={(e) => setSearchTermDate(e.target.value)}
            />
          </div>

          {role === "HEAD_OFFICE_ADMIN" && (
            <div style={{ display: "flex", justifyContent: "end" }}>
              <Link to="/headOfficeHome/instituteIncome">
                <button>Hospital Income</button>
              </Link>
            </div>
          )}

          {/* Button to export to Excel */}
          <div style={{ marginBottom: "20px" }}>
            <button onClick={exportToExcel} className="export-btn">
              Export to Excel
            </button>
          </div>

          <table className="instituteTable">
            <thead>
              <tr className="test">
                <th>Patient ID</th>
                <th>Doctor ID</th>
                <th>Channel ID</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment, index) => {
                  const colomboTime = formatDateToDDMMYYYY(payment.date);
                  return (
                    <tr key={index}>
                      <td>{payment.patient_ID}</td>
                      <td>{payment.doctor_ID}</td>
                      <td>{payment.channel_ID}</td>
                      <td>{payment.amount}</td>
                      <td>{colomboTime}</td>
                      <td>{payment.status}</td>
                      <td>
                        <Link
                          to="#"
                          className="btn btn-danger"
                          onClick={() => handleDelete(payment._id)}
                        >
                          <FaTrash />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7">No Payments found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
