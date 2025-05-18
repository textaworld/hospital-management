import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";
import { FaHistory, FaQrcode, FaSpinner } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useSiteDetailsContext } from "../hooks/useSiteDetailsContext";

const PatientScan = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const { sitedetail, dispatch: institute } = useSiteDetailsContext();
  const navigate = useNavigate();

  // States
  const [studentDetails, setStudentDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [qrResult, setQrResult] = useState(null);
  const [hostName, setHostName] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [scannerInitialized, setScannerInitialized] = useState(false);

  const userHosID = user.instituteId;
  const [remainingSMSCount, setRemainingSMSCount] = useState(0);

  // Calculate remaining SMS count
  useEffect(() => {
    if (sitedetail && sitedetail.topUpPrice && sitedetail.smsPrice) {
      const remSmsCount = parseInt(
        sitedetail.topUpPrice / sitedetail.smsPrice - sitedetail.smsCount
      );
      setRemainingSMSCount(remSmsCount);
    }
  }, [sitedetail]);

  // Fetch site details
  useEffect(() => {
    const fetchSiteDetails = async () => {
      try {
        setLoading(true);
        const siteDetailsResponse = await fetch(
          `https://hospital-management-tnwh.onrender.com/api/site/getone/${user.instituteId}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        if (!siteDetailsResponse.ok) {
          throw new Error("Failed to fetch site details");
        }

        const siteDetailsJson = await siteDetailsResponse.json();
        institute({ type: "SET_SITE_DETAILS", payload: siteDetailsJson });
        setHostName(siteDetailsJson.name);
        setLoading(false);
      } catch (error) {
        setError("Unable to load hospital details");
        setLoading(false);
        displayError("Network error. Please check your connection.");
      }
    };

    if (user) {
      fetchSiteDetails();
    }
  }, [user, id, institute]);

  // QR Scanner setup
  useEffect(() => {
    let qrCodeScanner;

    const startScanner = async () => {
      try {
        setScannerInitialized(true);
        qrCodeScanner = new Html5QrcodeScanner("qr-scanner", {
          fps: 20,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
        });

        qrCodeScanner.render(
          (qrResult) => {
            try {
              const parsedDetails = JSON.parse(qrResult);
              if (!parsedDetails.patient_ID) {
                displayError("Invalid QR code format");
                return;
              }
              setQrResult(parsedDetails.patient_ID);
              qrCodeScanner.clear();
              setScannerInitialized(false);
            } catch (error) {
              displayError(
                "Invalid QR code. Please scan a valid patient QR code."
              );
              qrCodeScanner.resume();
            }
          },
          (errorMessage) => {
            // Ignore errors during normal scanning
            console.log(errorMessage);
          }
        );
      } catch (error) {
        displayError("Could not start scanner. Please try again.");
        setScanning(false);
        setScannerInitialized(false);
      }
    };

    if (scanning && !scannerInitialized) {
      startScanner();
    }

    return () => {
      if (qrCodeScanner) {
        qrCodeScanner.clear();
        setScannerInitialized(false);
      }
    };
  }, [scanning]);

  // Fetch patient details when QR result is available
  useEffect(() => {
    if (qrResult !== null) {
      fetchStudentDetails(qrResult);
      setScanning(false);
    }
  }, [qrResult]);

  // QR scanner toggle
  const handleScanToggle = () => {
    if (scanning) {
      // If currently scanning, stop
      setScanning(false);
      setScannerInitialized(false);
      // Clear any existing scanner
      const scannerElement = document.getElementById("qr-scanner");
      if (scannerElement) {
        scannerElement.innerHTML = "";
      }
    } else {
      // If not scanning, start
      setStudentDetails(null);
      setQrResult(null);
      setScanning(true);
    }
  };

  // Display error message with auto-hide
  const displayError = (message) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
    }, 5000);
  };

  // Fetch patient details
  const fetchStudentDetails = async (patient_ID) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://hospital-management-tnwh.onrender.com/api/patients/getPatientById/${patient_ID}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to fetch patient details");
      }

      const data = await response.json();

      if (data.inst_ID !== userHosID) {
        displayError("Patient is not registered with this hospital");
        setStudentDetails(null);
      } else {
        setStudentDetails(data);
      }

      setLoading(false);
    } catch (error) {
      setError(error.message);
      displayError("Could not retrieve patient information");
      setLoading(false);
      setStudentDetails(null);
    }
  };

  // Navigate to patient history
  const handleHistoryClick = () => {
    if (studentDetails && studentDetails.patient_ID) {
      navigate(`/patientChannelHistory/${studentDetails.patient_ID}`);
    } else {
      displayError("No patient selected");
    }
  };

  // Go back to previous page
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}

      {/* Error notification */}
      {showError && (
        <div className="fixed top-16 right-4 left-4 md:left-auto md:w-96 bg-red-500 text-white p-3 rounded-md shadow-lg z-50 transition-opacity duration-300 flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            onClick={() => setShowError(false)}
            className="ml-2 text-white hover:text-gray-200"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {/* Scanner section */}
          <section className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Patient Scanner
              </h2>
              <button
                onClick={handleScanToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  scanning
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-sky-500 hover:bg-sky-600 text-white"
                }`}
              >
                <FaQrcode />
                {scanning ? "Stop Scanner" : "Start Scanner"}
              </button>
            </div>

            <div
              className={`mt-4 flex justify-center ${
                scanning ? "block" : "hidden"
              }`}
            >
              <div
                id="qr-scanner"
                className="w-full max-w-md aspect-square border border-gray-300 rounded-lg overflow-hidden"
              ></div>
            </div>

            {!scanning && !studentDetails && !loading && (
              <div className="text-center py-8 text-gray-500">
                <FaQrcode className="mx-auto mb-2 text-4xl" />
                <p>
                  Click &quot;Start Scanner&quot; to scan a patient&apos;s QR
                  code
                </p>
              </div>
            )}
          </section>

          {/* Patient info section */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Patient Information
            </h2>

            {loading && (
              <div className="flex justify-center items-center py-8">
                <FaSpinner className="animate-spin text-sky-500 text-2xl mr-2" />
                <span>Loading...</span>
              </div>
            )}

            {!loading && studentDetails ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-gray-500 text-sm">Patient ID</p>
                    <p className="font-semibold">{studentDetails.patient_ID}</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-gray-500 text-sm">Name</p>
                    <p className="font-semibold">{studentDetails.name}</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-gray-500 text-sm">Age</p>
                    <p className="font-semibold">{studentDetails.age}</p>
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleHistoryClick}
                    className="flex items-center gap-2 px-6 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors"
                  >
                    <FaHistory />
                    View Patient History
                  </button>
                </div>
              </div>
            ) : (
              !loading && (
                <div className="text-center py-6 text-gray-500">
                  {error ? (
                    <p className="text-red-500">{error}</p>
                  ) : (
                    <p>
                      No patient information available. Please scan a valid QR
                      code.
                    </p>
                  )}
                </div>
              )
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-3 text-center text-sm">
        <p>
          © {new Date().getFullYear()} {hostName} | Patient Management System
        </p>
      </footer>
    </div>
  );
};

export default PatientScan;
