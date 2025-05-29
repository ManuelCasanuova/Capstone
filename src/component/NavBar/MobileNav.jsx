import React from "react";
import { Image, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import {
  LayoutTextWindowReverse,
  Calendar3,
} from "react-bootstrap-icons";
import { useAuth } from "../access/AuthContext";

const MobileNav = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
<Nav
  fill
  className="position-fixed bottom-0 start-0 w-100 d-lg-none text-white"
  style={{
    height: "60px",
    zIndex: 1030,
    backgroundColor: "#074662",
  }}
>
  
      <Nav.Item className="h-100">
        <Nav.Link
          as={Link}
          to="/dashboard"
          className="h-100 d-flex flex-column align-items-center justify-content-center text-white"
        >
          <LayoutTextWindowReverse size={28} />
        </Nav.Link>
      </Nav.Item>

   
      <Nav.Item className="h-100 position-relative d-flex align-items-center justify-content-center">
        <div
          style={{
            position: "absolute",
            bottom: "2px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2000,
          }}
          onClick={() => navigate(`/paginaProfilo/${user?.id}`)}
        >
          <Image
            src={user?.avatar}
            roundedCircle
            width={70}
            height={70}
            alt="Profilo"
            className="border border-white shadow"
            style={{ objectFit: "cover", cursor: "pointer" }}
          />
        </div>
      </Nav.Item>

     
      <Nav.Item className="h-100">
        <Nav.Link
          as={Link}
          to="/appuntamenti"
          className="h-100 d-flex flex-column align-items-center justify-content-center text-white"
        >
          <Calendar3 size={28} />
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default MobileNav;









