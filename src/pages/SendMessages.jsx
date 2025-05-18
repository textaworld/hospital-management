import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useSiteDetailsContext } from "../hooks/useSiteDetailsContext";

const SendMessages = () => {
  const { user } = useAuthContext();
  const { sitedetail } = useSiteDetailsContext();
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [message, setMessage] = useState(""); // State to store message content
  const [error, setError] = useState(null); // State to handle errors
  const [charCount, setCharCount] = useState(0); // Character count for the message
  const inst_ID = sitedetail._id;
  const [remainingSMSCount, setRemainingSMSCount] = useState(0);

  useEffect(() => {
    // const TopP = sitedetail.topUpPrice
    // const SMSP = sitedetail.smsPrice

    // console.log(TopP)
    // console.log(SMSP)

    // console.log(sitedetail.topUpPrice / sitedetail.smsPrice)

    const remSmsCount = parseInt(
      sitedetail.topUpPrice / sitedetail.smsPrice - sitedetail.smsCount
    );
    setRemainingSMSCount(remSmsCount);
  }, [sitedetail.smsPrice, sitedetail.topUpPrice, sitedetail.smsCount]);

  // Fetch the phone numbers based on the institute ID
  const fetchChannels = async () => {
    try {
      const response = await fetch(
        `https://hospital-management-tnwh.onrender.com/api/patients/getAllPhoneNumbersByInstId/${inst_ID}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const json = await response.json();

      if (response.ok) {
        setPhoneNumbers(json.data); // Set the fetched phone numbers in state
      } else {
        console.log("Error fetching phone numbers:", json);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchChannels();
    }
  }, [user]);

  // Function to send SMS to a phone number
  const sendSMS = async (phone) => {
    if (!user) {
      setError("You must be logged in");
      return;
    }

    const emailDetails = {
      to: phone,
      message,
      inst_ID,
    };

    try {
      const response = await fetch(
        "https://hospital-management-tnwh.onrender.com/api/sms/send-message",
        {
          method: "POST",
          body: JSON.stringify(emailDetails),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const json = await response.json();
      if (!response.ok) {
        setError(json.error);
      } else {
        setError(null);
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
    }
  };

  // Handle form submission to send SMS to all phone numbers
  const handleSendMessages = () => {
    if (message.trim() === "") {
      setError("Message cannot be empty");
      return;
    }

    phoneNumbers.forEach((phone) => {
      if (remainingSMSCount >= 10) {
        sendSMS(phone);
      } else {
        alert("Your SMS count reached the limit");
      }
    });
  };

  // Limit the message to 140 characters
  const handleMessageChange = (e) => {
    const value = e.target.value;
    if (value.length <= 140) {
      setMessage(value);
      setCharCount(value.length);
    }
  };

  return (
    <div className="container">
      <div className="form-wrapper">
        <h2
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "40px",
          }}
        >
          Send A Message
        </h2>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            value={message}
            placeholder="Enter your message"
            className="form-control"
            onChange={handleMessageChange}
          />
          <small>{charCount}/140 characters</small>
        </div>

        <button className="btn btn-primary" onClick={handleSendMessages}>
          Send Message to All Patients
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default SendMessages;
