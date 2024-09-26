const qrcode = require('qrcode');

exports.qrGenerator = (req, res) => {
  const { patient_ID } = req.body;

  // console.log("patient_ID",patient_ID)

  if (!patient_ID || patient_ID.length === 0) {
    res.status(400).send("Empty Data or Missing patient_ID");
    return;
  }

  const studentDetails = { patient_ID};

  try {
    const options = {
      errorCorrectionLevel: 'low',
      scale: 4,
    };

    qrcode.toDataURL(JSON.stringify(studentDetails), options, (err, qrCodeUrl) => {
      if (err) {
        
        res.status(500).send("Error generating QR code");
      } else {
        res.send(qrCodeUrl);
      }
    });
  } catch (err) {
    
    res.status(500).send("Error generating QR code");
  }
};
