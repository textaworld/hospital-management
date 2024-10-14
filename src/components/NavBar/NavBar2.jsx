import React, { useState, useEffect } from "react";
import { NavLink ,useNavigate} from "react-router-dom";
//import { useAuthContext } from '../../hooks/useAuthContext';
import { useSiteDetailsContext } from "../../hooks/useSiteDetailsContext";
import { useLogout } from "../../hooks/useLogout";
import { FaArrowLeft } from 'react-icons/fa';
import { FaSignOutAlt } from 'react-icons/fa';



import "./NavBar.css";

const NavBar = () => {
  const { logout } = useLogout();
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1); // Go back to the previous screen
  };


  const { sitedetail } = useSiteDetailsContext();
  //const { user } = useAuthContext();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = () => {
    logout();
  };


  return (
    <nav>
      <button className="navbar-backbutton" onClick={handleGoBack}>
      <FaArrowLeft />
    </button>
      {/* <div className="title">{sitedetail.name}</div> */}
      
          {/* <NavLink  to="/headOfficeHome" className="title">{sitedetail.name}
          </NavLink> */}
        
      <div className="menu2" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
      </div>
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
       
        <li>
          <NavLink to="/headOfficeHome" className="">
            DashBoard
          </NavLink>
        </li>
        <li>
          <NavLink to="/headOfficeHome/doctors">Doctors</NavLink>
        </li>
        <li>
          <NavLink to="/headOfficeHome/payments">Payments</NavLink>
        </li>
        {/* <li>
        
          <NavLink to="/headOfficeHome/attendences">Attendence</NavLink>
        </li>
        <li>
        
          <NavLink to="/headOfficeHome/brodcastMsg">Section Messages</NavLink>
        </li> */}
        
        <li>
        <button className="navbar-logoutbutton" onClick={handleClick}>
      <FaSignOutAlt/>
    </button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
