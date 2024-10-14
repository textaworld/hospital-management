import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import QrCode from "../components/qrGenerator";
import { useStudentContext } from "../hooks/useStudentContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useSiteDetailsContext } from "../hooks/useSiteDetailsContext";
import { FaDownload, FaCheck } from "react-icons/fa";

import "../styles/createStudent.css";
//import { backgroundImage } from "html2canvas/dist/types/css/property-descriptors/background-image";

const CreateStudent = () => {
  const { dispatch } = useStudentContext();
  const { user } = useAuthContext();
  const { sitedetail } = useSiteDetailsContext();

  const instID = user.instituteId;
  const [inst_ID, setInst_ID] = useState("");
  const [name, setName] = useState("");
  const [patient_ID, setPatient_ID] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");

  const [age, setAge] = useState("");
  const [qrImage, setQrImage] = useState("");
  const [image, setImage] = useState(null);
  const [bgImage, setBgImage] = useState(null);
  const [isDownload, setIsDownload] = useState(false);
  const [error, setError] = useState(null);
  const idCardRef = useRef(null);
  const cardStatus = sitedetail.stdCardcardStatus;
  const [isBgImageSelected, setIsBgImageSelected] = useState(false);
  const [iscardStatus,setCardStatus] = useState("")

  // console.log(cardStatus)

  const isAnyCheckboxChecked = () => {
    // return Object.values(classStates).some(
    //   (classState) => classState.isChecked
    // );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
  };

  const handleBGImageChange = (e) => {
    const file = e.target.files[0];
    setBgImage(URL.createObjectURL(file));
    setIsBgImageSelected(true); 
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const student = {
      inst_ID: instID,
      patient_ID,
      name,
      email,
      age,
      address,
      phone,
      // stdCount: sitedetail.count,
    };

    const response = await fetch(
      "https://hospital-management-tnwh.onrender.com/api/patients/createPatient",
      {
        method: "POST",
        body: JSON.stringify(student),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);

      // Display error message in an alert
      alert(`Error: ${json.error}`);
    }

    if (response.ok) {
      setInst_ID("");
      setPatient_ID("");
      setName("");
      setEmail("");
      setAge("");
      setAddress("");
      setPhone("");
      // setStdCount("");
      setIsDownload(false)
      setQrImage(null);
      setImage(null);
      setError(null);
      // setIsDownloadEnabled(true);
      // setIsSubmitted(true);

      // Display success message in an alert
      alert("Patient added successfully!");
      dispatch({ type: "CREATE_STUDENT", payload: json });
    }
  };

  const generateQrCode = async () => {
    try {
      // Check if any of the required fields are null or empty

      const student = { patient_ID };

      const response = await fetch("https://hospital-management-tnwh.onrender.com/api/qr/qrGenerator", {
        method: "POST",
        body: JSON.stringify(student),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        // Handle error appropriately

        return;
      }

      const data = await response.text();
      setQrImage(data);
    } catch (error) {
      // Handle error appropriately
    }
  };

  const handleDownload = () => {
    // if (!isSubmitted) {
    //   // Prevent download if form is not submitted
    //   alert("Please submit the form before downloading the ID card.");

    // }
    const scale = 3; // You can adjust the scale factor as needed

    html2canvas(idCardRef.current, {
      scale: scale,
    }).then((canvas) => {
      const link = document.createElement("a");

      // Convert canvas to data URL with JPEG MIME type and maximum quality
      link.href = canvas.toDataURL("image/jpeg", 1.0);

      link.download = `${patient_ID}.jpg`;
      link.click();
      setIsDownload(true);
    });
    createCard()
  };

  const createCard = async () => {

    const status = 'created'

    const date = new Date();
    const card = {
      inst_ID: instID,
      patient_ID,
          date,
          status
    };

    const response = await fetch(
      "https://hospital-management-tnwh.onrender.com/api/card/createCard",
      {
        method: "POST",
        body: JSON.stringify(card),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const json = await response.json();


    if (!response.ok) {
      setError(json.error);
      return;
    }
  };

  useEffect(() => {
    const cardDetails = async () => {
      try {
        const cardDetailsResponse = await fetch(
          `https://hospital-management-tnwh.onrender.com/api/card/getCardByPatientId/${patient_ID}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        const siteDetailsJson = await cardDetailsResponse.json();
  
        if (cardDetailsResponse.ok) {
          setCardStatus(siteDetailsJson.status)
          // Add any additional logic here to handle the data
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    if (user) {
      cardDetails();
    }
  }, [patient_ID]);
  

  return (
    <div>
      <div className="superAdminDashboardContainer">
        <div className="createStudentMainContaner">
          <div className="createStudentFormContaner">
            <form onSubmit={handleSubmit}>
              <div className="createStudentFormContanerTopic">
                <h3>Add Patient</h3>
              </div>

              <label>
                Patient ID
                <input
                  value={patient_ID}
                  type="text"
                  placeholder="Enter Patient ID"
                  required
                  onChange={(e) => setPatient_ID(e.target.value)}
                />
              </label>

              <label>
                Name
                <input
                  value={name}
                  type="text"
                  placeholder="Enter Name"
                  required
                  title="Name must contain only alphabets"
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

              <label>
                Email
                <input
                  value={email}
                  type="email"
                  placeholder="Enter Email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                  title="Enter a valid email address"
                />
              </label>

              <label>
                Age
                <input
                  value={age}
                  type="number"
                  placeholder="Enter Age"
                  onChange={(e) => setAge(e.target.value)}
                  required
                  min="0"
                  max="100"
                />
              </label>

              <label>
                Address
                <input
                  value={address}
                  type="text"
                  placeholder="Enter Address"
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </label>

              <label>
                Phone
                <input
                  value={phone}
                  type="tel"
                  placeholder="Enter Phone Num"
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  pattern="[0-9]{11}"
                  title="Enter a valid 10 digit phone number"
                />
              </label>

              <label>
                Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
              </label>

              <div className="errorContainer">
                {error && <div className="error">{error}</div>}
              </div>

              <button type="submit" className="createstudentsubmitButton">
                Submit
              </button>
            </form>
          </div>
          <div className="createStudentIdCardContaner">
            <div className="id-card-container" ref={idCardRef}>
              <div className="id-card-qr">
                {/* <img src={image1} alt="ID Card1" width="180px" /> */}
                {qrImage && <QrCode qrImage={qrImage} />}
              </div>

              <div className="id-card-Bgimage">
                <img src={bgImage} />
              </div>

              <div className="id-card-image">
                <img src={image} />
              </div>

              <div className="id-card-details">
                <div>
                  <input
                    type="text"
                    id="std_ID"
                    value={patient_ID}
                    disabled
                    style={{
                      width: "250px",
                      height: "25px",
                      fontWeight: "bold",
                      fontSize: "22px",
                      marginBottom: "5px",
                      marginTop: "8px",
                    }}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    disabled
                    style={{ width: "260px", height: "25px", fontSize: "20px" }}
                  />
                </div>
                <div>
                  <input
                    id="address"
                    value={address}
                    disabled
                    style={{
                      width: "360px",
                      height: "25px",
                      marginTop: "0px",
                      fontSize: "15px",
                    }}
                  />
                </div>
              </div>

              <div className="id-card-logo">
                <img src={sitedetail.image} alt="Logo" />
              </div>

              {!isBgImageSelected && (
                <div className="id-card">
                  <p>{sitedetail.name}</p>
                </div>
              )}
            </div>

            <div>
              <label>
                Background Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBGImageChange}
                  required
                />
              </label>
            </div>

            <div className="createStudentIdCardContanerButton">
              {/* Step 1 */}
              <div
                className="stepBox"
                style={{
                  borderColor:
                    patient_ID && isAnyCheckboxChecked()
                      ? "rgb(23,  211, 23)"
                      : "#ccc",
                }}
              >
                <h3
                  className="stepTitle"
                  style={{
                    color:
                      patient_ID && isAnyCheckboxChecked()
                        ? "rgb(23, 211, 23)"
                        : "black",
                  }}
                >
                  Step 1
                </h3>

                <div className="stepIconGreen">
                  <FaCheck />
                </div>

                <p className="stepDescription">
                  Please fill all fields. Make sure to provide accurate
                  information.
                </p>
              </div>

              {/* Step 2 */}
              <div
                className="stepBox"
                style={{ borderColor: qrImage ? "rgb(23, 211, 23)" : "#ccc" }}
              >
                <h3
                  className="stepTitle"
                  style={{ color: qrImage ? "rgb(23, 211, 23)" : "black" }}
                >
                  Step 2
                </h3>
                <p className="stepDescription">Generate QR Code</p>
                {qrImage ? (
                  <div className="stepIconGreen">
                    <FaCheck />
                  </div>
                ) : null}

                {cardStatus === "yes" && (
                  <button
                    type="button"
                    onClick={generateQrCode}
                    className="stepButton"
                  >
                    Generate QR Code
                  </button>
                )}
              </div>

              {/* Step 3 */}
              <div
                className="stepBox"
                style={{
                  borderColor: isDownload ? "rgb(23, 211, 23)" : "#ccc",
                }}
              >
                <h3
                  className="stepTitle"
                  style={{ color: isDownload ? "rgb(23, 211, 23)" : "black" }}
                >
                  Step 3
                </h3>
                <p className="stepDescription">Download ID Card</p>
                {qrImage && patient_ID ? (
  iscardStatus !== 'created' ? (
    <button
      className="btn btn-primary"
      onClick={handleDownload}
      // disabled={!isDownloadEnabled || !isSubmitted}
    >
      Download ID Card <FaDownload />
    </button>
  ) : (
    <p style={{color:'red'}}>You can't Create a ID card with same Patient ID . <br/> Please contact the Admin</p> // Show this message if cardStatus is 'created'
  )
) : null}

                {isDownload ? (
                  <div className="stepIconGreen">
                    <FaCheck />
                  </div>
                ) : null}
              </div>

              {/* Step 4 */}
              <div className="stepBox">
                <h3 className="stepTitle">Step 4</h3>
                <p className="stepDescription">Finalize submission</p>
                {isDownload ? (
                  <div>
                    <p style={{ color: "rgb(23, 211, 23)" }}>Ready to submit</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStudent;
