import React, { useState } from "react";
import { Image, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router";  

import {
  LayoutTextWindowReverse,
  FileEarmarkText,
  PersonCircle,
  Gear,
  BoxArrowRight,
} from "react-bootstrap-icons";
import { useAuth } from "../access/AuthContext";

const MobileNav = () => {
const { user, logout } = useAuth();
const navigate = useNavigate();

  return (
    <Nav
      fill
      className="position-fixed bottom-0 start-0 w-100 border-top d-lg-none bg-white"
      style={{ height: "60px", zIndex: 1100 }}
    >
      <Nav.Item>
        <Nav.Link as={Link} to="/dashboard" className="d-flex flex-column align-items-center justify-content-center p-0">
          <LayoutTextWindowReverse size={24} />
          
        </Nav.Link>
      </Nav.Item>

     <Nav.Item>


  <Nav.Item className="d-flex flex-column align-items-center justify-content-center p-0" style={{ cursor: "default" }}>
  <Image
    src={user?.avatar}
    roundedCircle
    width={50}
    height={50}
    alt="Profilo"
    style={{ cursor: "pointer" }}
    onClick={() => {
      navigate(`/paginaProfilo/${user?.id}`);
      if (closeDropdown) closeDropdown();
    }}
  />

</Nav.Item>



</Nav.Item>

     

     
      <Nav.Item>
        <Nav.Link as={Link} to="/login" className="d-flex flex-column align-items-center justify-content-center p-0">
          <BoxArrowRight size={24} />
          <small>Logout</small>
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default MobileNav;
