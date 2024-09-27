import  { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useSiteDetailsContext } from "../hooks/useSiteDetailsContext";
import { BiAccessibility  } from "react-icons/bi";
import { IoIosNotifications } from "react-icons/io";
import { FaSms } from "react-icons/fa";



const Home = () => {
 
  const { sitedetail, dispatch } = useSiteDetailsContext();
  const { user } = useAuthContext();

  const [studentCount, setStudentCount] = useState(0);
  const [remainingCount, setRemainingCount] = useState(0); 
  const [remainingSMSCount, setRemainingSMSCount] = useState(0); 

  // useEffect(() => {
  //   const fetchStudentIds = async () => {
  //     try {
  //       const response = await fetch(
  //         'https://hospital-management-tnwh.onrender.com/api/students/getAllStudentIds', 
  //         {
  //           headers: { Authorization: `Bearer ${user.token}` },
  //         }
  //       );
  //       const json = await response.json();

  //       if (response.ok) {
  //         // console.log("Student IDs:", json)
  //       }
  //     } catch (error) {
  //       // Handle error
  //       console.error("Failed to fetch student IDs:", error);
  //     }
  //   };

  //   if (user) {
  //     fetchStudentIds();
  //   }
  // }, [user]);

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
          setStudentCount(json.data.length);
          dispatch({ type: "SET_STUDENTS", payload: json.data });
        }
      } catch (error) {
        // Handle error
      }
    };

    if (user) {
      fetchStudents();
    }
  }, [dispatch, user]);
 

  useEffect(() => {
    setRemainingCount(sitedetail.count - studentCount);
  }, [studentCount, sitedetail.count]);

  useEffect(() => {
    const remSmsCount = parseInt((sitedetail.topUpPrice / sitedetail.smsPrice) - sitedetail.smsCount);
    setRemainingSMSCount(remSmsCount);
  }, [sitedetail.smsPrice, sitedetail.topUpPrice, sitedetail.smsCount]);

  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    
    marginLeft: '110px',
    marginTop: '-40px',
    marginBottom:'50px'
  };

  const gridItemStyle = {
    
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width:'270px',
    height:'150px',
    marginTop:'30px',
    background:'#106b03'
   
  };

  const gridItemStyle2 = {
 
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width:'270px',
    height:'150px',
    marginTop:'30px',
    background:'#103d92'
   
  };
  const gridItemStyle3 = {
 
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width:'270px',
    height:'150px',
    marginTop:'30px',
    background:'#b8d109'
   
  };
  
  const gridItemStyle4 = {
 
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width:'270px',
    height:'150px',
    marginTop:'30px',
    background:'#e4570b'
   
  };
  const gridItemStyle5 = {
 
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width:'270px',
    height:'150px',
    marginTop:'30px',
    background:'#bb06a9'
   
  };
  const gridItemStyle6 = {
 
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width:'270px',
    height:'150px',
    marginTop:'30px',
    background:'#430359'
   
  };
  const gridItemStyle7 = {
 
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width:'270px',
    height:'150px',
    marginTop:'30px',
    background:'#f82913'
   
  };
  const gridItemStyle8 = {
 
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width:'270px',
    height:'150px',
    marginTop:'30px',
    background:'#5053c7'
   
  };
  
  
  
  
 

  return (
    <div>
        <h1 style={{display:'flex',justifyContent:'center'}}>ADMIN DASHBOARD</h1>
        <div style={gridContainerStyle}>
          {/* <div style={gridItemStyle}>
          <img src={School} style={iconStyle} />
          <h2>Institute Name: <span style={textStyle}>{sitedetail.name}</span></h2>
          </div>
          <div style={gridItemStyle}>
          <img src={Email} style={iconStyle} />
          <h2>Institute Email: <span style={textStyle}>{sitedetail.email}</span></h2>
          </div> */}
          <div style={gridItemStyle}>
            <h1 style={{marginTop:'10px',marginBottom:'-5px',color:'white'}}>{sitedetail.count}</h1>
          <h3 style={{marginLeft:'-120px',marginBottom:'-70px',color:'white'}}> Patient <br/> Count</h3>
          <BiAccessibility style={{ fontSize: '5em', marginLeft: '160px', color: 'white' }} />
            
          </div>
          <div style={gridItemStyle2}>
            <h1 style={{marginTop:'10px',marginBottom:'-25px',color:'white'}}>{studentCount}</h1>
          <h3 style={{marginLeft:'-120px',marginBottom:'-70px',color:'white'}}> Existing <br/> Count</h3>
          <BiAccessibility style={{ fontSize: '5em', marginLeft: '160px', color: 'white' }} />
            
          </div>
          {/* <div style={gridItemStyle}>
            <img src={ExStudents}  style={iconStyle} />
            <h2 style={{fontSize:'18px'}}>Existing Count: <span style={textStyle}>{studentCount}</span></h2>
          </div> */}

<div style={gridItemStyle3}>
            <h1 style={{marginTop:'10px',marginBottom:'-25px',color:'white'}}>{remainingCount}</h1>
          <h3 style={{marginLeft:'-120px',marginBottom:'-70px',color:'white'}}> Remaining <br/> Count</h3>
          <BiAccessibility style={{ fontSize: '5em', marginLeft: '160px', color: 'white' }} />
            
          </div>


          {/* <div style={gridItemStyle}>
          <img src={RmStds} style={iconStyle} />
          <h2 style={{fontSize:'18px'}}>Remaining Count: <span style={textStyle}>{remainingCount}</span></h2>
          </div> */}

<div style={gridItemStyle4}>
            <h1 style={{marginTop:'10px',marginBottom:'-25px',color:'white'}}>{sitedetail.notification}</h1>
          <h3 style={{marginLeft:'-120px',marginBottom:'-70px',color:'white'}}> Notification <br/> Service</h3>
          <IoIosNotifications style={{ fontSize: '5em', marginLeft: '160px', color: 'white' }} />
             
          </div>


          {/* <div style={gridItemStyle}>
          <img src={Bell} style={iconStyle} />
          <h2 style={{fontSize:'18px'}}>Notification Service: <span style={textStyle}>{sitedetail.notification}</span></h2>
          </div> */}


<div style={gridItemStyle5}>
            <h1 style={{marginTop:'40px',marginBottom:'-25px',color:'white'}}>{sitedetail.topUpPrice}</h1>
          <h3 style={{marginLeft:'-120px',marginBottom:'-70px',color:'white'}}> TopUp <br/> Price</h3>
          <FaSms  style={{ fontSize: '5em', marginLeft: '160px', color: 'white' }} />
          </div>


          {/* <div style={gridItemStyle}>
          <img src={Topup} style={iconStyle} />
          <h2 style={{fontSize:'18px'}}>TopUp Price: <span style={textStyle}>{sitedetail.topUpPrice}</span></h2>
          </div> */}

<div style={gridItemStyle6}>
            <h1 style={{marginTop:'40px',marginBottom:'-25px',color:'white'}}>{sitedetail.smsPrice}</h1>
          <h3 style={{marginLeft:'-120px',marginBottom:'-70px',color:'white'}}> One SMS  <br/> Price</h3>
          <FaSms  style={{ fontSize: '5em', marginLeft: '160px', color: 'white' }} />
          </div>

          {/* <div style={gridItemStyle}>
          <img src={SMS} style={iconStyle} />
          <h2 style={{fontSize:'18px'}}>One SMS Price: <span style={textStyle}>{sitedetail.smsPrice}</span></h2>
          </div> */}

<div style={gridItemStyle7}>
            <h1 style={{marginTop:'40px',marginBottom:'-25px',color:'white'}}>{sitedetail.smsCount}</h1>
          <h3 style={{marginLeft:'-120px',marginBottom:'-70px',color:'white'}}>Sent SMS  <br/> Count</h3>
          <FaSms  style={{ fontSize: '5em', marginLeft: '160px', color: 'white' }} />
          </div>

          {/* <div style={gridItemStyle}>
          <img src={SmSCount} style={iconStyle} />
          <h2 style={{fontSize:'18px'}}>Sent SMS Count: <span style={textStyle}>{sitedetail.smsCount}</span></h2>
          </div> */}


          <div style={gridItemStyle8}>
            <h1 style={{marginTop:'40px',marginBottom:'-25px',color:'white'}}>{remainingSMSCount}</h1>
          <h3 style={{marginLeft:'-120px',marginBottom:'-70px',color:'white'}}> Remaining  <br/> SMS</h3>
          <FaSms  style={{ fontSize: '5em', marginLeft: '160px', color: 'white' }} />
          </div>

          {/* <div style={gridItemStyle}>
          <img src={RMSMS} style={iconStyle} />
          <h2 style={{fontSize:'18px'}}>Remaining SMS: <span style={textStyle}>{remainingSMSCount}</span></h2>
          </div> */}
        </div>
    </div>
  );
};

export default Home;
