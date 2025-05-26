import React, { useRef, useState } from "react";
import { Nav, Dropdown, Image } from "react-bootstrap";
import {
  Calendar3,
  LayoutTextWindowReverse,
  People,
  Power,
} from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router";

const MyNavbar = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  const [showDropdown, setShowDropdown] = useState(false);
  const avatarRef = useRef(null);

  if (!token || location.pathname === "/login") return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;
  const toggleDropdown = () => setShowDropdown((prev) => !prev);
  const closeDropdown = () => setShowDropdown(false);

  const roles = user?.roles || [];
  const isAdmin = roles.includes("ROLE_ADMIN");
  const isPaziente = roles.includes("ROLE_PAZIENTE");

  const renderAvatarDropdown = () => (
    <Dropdown show={showDropdown} onToggle={() => {}} className="mb-3">
      <div
        ref={avatarRef}
        onClick={toggleDropdown}
        style={{ cursor: "pointer" }}
        className="d-flex justify-content-center align-items-center"
      >
        <Image
          src={user?.avatar || "https://via.placeholder.com/50"}
          roundedCircle
          width={50}
          height={50}
          alt="Profilo"
        />
      </div>

      <Dropdown.Menu align="end" show={showDropdown}>
        <Dropdown.Item
          onClick={() => {
            navigate(`/paginaProfilo/${user?.id}`);
            closeDropdown();
          }}
        >
          Profilo
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            navigate("/settings");
            closeDropdown();
          }}
        >
          Impostazioni
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  const renderLogout = () => (
    <div className="mt-auto">
      <div
        className="buttonNav rounded-3 p-2 cursor-pointer d-flex align-items-center justify-content-center"
        onClick={handleLogout}
      >
        <Power size={40} color="white" />
      </div>
    </div>
  );

  const renderNavbarContent = () => (
    <Nav className="flex-column align-items-center flex-grow-1">
      <div
        className={`buttonNav rounded-3 p-2 mb-3 cursor-pointer d-flex align-items-center justify-content-center ${
          isActive(isAdmin ? "/dashboard" : "/dashboard-paziente") ? "bg-primary" : ""
        }`}
      >
        <Link
          to={isAdmin ? "/dashboard" : "/dashboard-paziente"}
          className="d-flex justify-content-center align-items-center"
        >
          <LayoutTextWindowReverse size={40} color="white" />
        </Link>
      </div>

      {isAdmin && (
        <div
          className={`buttonNav rounded-3 p-2 mb-3 cursor-pointer d-flex align-items-center justify-content-center ${
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
      )}

      <div
        className={`buttonNav rounded-3 p-2 mb-3 cursor-pointer d-flex align-items-center justify-content-center ${
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

      {renderAvatarDropdown()}
    </Nav>
  );

  return (
    <div
      className="d-flex flex-column align-items-center vh-100 p-3 bg-light border-end navbar"
      style={{ position: "fixed", top: 0, left: 0, width: "80px" }}
    >
      {renderNavbarContent()}
      {renderLogout()}
    </div>
  );
};

export default MyNavbar;






