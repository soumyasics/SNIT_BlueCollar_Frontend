import React, { useState } from "react";
import "../Dashboard/AdminSidebar.css";
import dashlogo from "../../../Assets/dashlogo.png";
import homelogo from "../../../Assets/home.png";
import notification from "../../../Assets/notification.png";
import user from "../../../Assets/user.png";
import req from "../../../Assets/managereq.png";
import payment from "../../../Assets/payment.png";
import complaints from "../../../Assets/complaints.png";
import logout from "../../../Assets/logout.png";
import Collapse from "@mui/material/Collapse";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { Link, useNavigate } from "react-router-dom";

function AdminSidebar() {
  const [openRequests, setOpenRequests] = useState(false);
  const navigate=useNavigate()

  const handleRequestsClick = () => {
    setOpenRequests(!openRequests);
  };

  const confirmLogout = () => {
    localStorage.removeItem("adminid");
    navigate("/admin-login")
  };


  return (
    <div className="col-3">
      <div className="admindash-sidebarmain">
        <div className="admindash-buttonshape">
          <img src={dashlogo} alt="Dashboard" />
          <span>Dashboard</span>
        </div>
        <div className="admindash-icons">
          <div>
            <img src={homelogo} alt="Home" />
            <span>Home</span>
          </div>
          <br />
          <div>
            <img src={notification} alt="Notification" />
            <span>Notification</span>
          </div>
          <br />
          <div>
            <img src={user} alt="Manage Users" />
            <span>Manage Users</span>
          </div>
          <br />
          <div onClick={handleRequestsClick} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
            <img src={req} alt="Manage Requests" />
            <span>Manage Requests</span>
            {openRequests ? <ArrowDropUpIcon style={{color:"white"}}/> : <ArrowDropDownIcon style={{color:"white"}}/>}
          </div>
          <Collapse in={openRequests}>
            <div className="dropdown-content">
             <Link to="/admin-workerreq" style={{textDecoration:"none"}}> <div className="dropdown-item ri-checkbox-blank-line"> Worker Request</div></Link>
             <Link to="/admin-employerreq" style={{textDecoration:"none"}}>  <div className="dropdown-item ri-checkbox-blank-line"> Employer Request</div></Link>
              {/* <div className="dropdown-item">Request 3</div> */}
            </div>
          </Collapse>
          <br />
          <div>
            <img src={payment} alt="Manage Payments" />
            <span>Manage Payments</span>
          </div>
          <br />
          <div>
            <img src={complaints} alt="Management Complaints" />
            <span>Management Complaints</span>
          </div>
          <br />
          <div>
            <img src={logout} alt="Logout" />
            <span ><button type="submit" onClick={confirmLogout} className="btn btn-primary">Logout</button></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSidebar;