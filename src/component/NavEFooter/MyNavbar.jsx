import React from "react";
import { Nav } from "react-bootstrap";
import { Calendar3, LayoutTextWindowReverse, People, Power } from "react-bootstrap-icons";
import { Link, useLocation, useNavigate } from "react-router";

const MyNavbar = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();

  if (!token || location.pathname === "/login") {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className="d-flex flex-column vh-100 p-3 bg-light border-end navbar"
      style={{ position: "fixed", top: 0, left: 0 }}
    >
      <Nav className="flex-column flex-grow-1">
        <div
          className={`buttonNav rounded-3 px-2 py-3 mb-3 cursor-pointer d-flex align-items-center justify-content-center ${
            isActive("/dashboard") ? "bg-primary" : ""
          }`}
        >
          <Link
            to="/dashboard"
            className="d-flex justify-content-center align-items-center"
          >
            <LayoutTextWindowReverse size={40} color="white" />
          </Link>
        </div>

        <div
          className={`buttonNav rounded-3 px-2 py-3 mb-3 cursor-pointer d-flex align-items-center justify-content-center ${
            isActive("/pazienti") ? "bg-primary" : ""
          }`}
        >
          <Link
            to="/pazienti"
            className="d-flex justify-content-center align-items-center"
          >
            <People size={40} color="white" />
          </Link>
        </div>

        <div
          className={`buttonNav rounded-3 px-2 py-3 mb-3 cursor-pointer d-flex align-items-center justify-content-center ${
            isActive("/appuntamenti") ? "bg-primary" : ""
          }`}
        >
          <Link
            to="/appuntamenti"
            className="d-flex justify-content-center align-items-center"
          >
            <Calendar3 size={40} color="white" />
          </Link>
        </div>

        <div className="mt-auto">
          <div
  className="buttonNav rounded-3 px-2 py-3 cursor-pointer d-flex align-items-center justify-content-center"
  onClick={handleLogout}
>
  <Power size={40} color="white" />
</div>
        </div>
      </Nav>
    </div>
  );
};

export default MyNavbar;