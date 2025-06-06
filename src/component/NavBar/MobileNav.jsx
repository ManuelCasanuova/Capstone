import React from "react";
import { Image, Nav } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router";
import {
  LayoutTextWindowReverse,
  Calendar3,
  People,
} from "react-bootstrap-icons";
import { useAuth } from "../access/AuthContext";

const MobileNav = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isMedico = user?.roles?.includes("ROLE_ADMIN");
  const isPaziente = user?.roles?.includes("ROLE_PAZIENTE");

  const isActive = (path) => location.pathname === path;
  const iconColor = (active) => (active ? "var(--bs-success)" : "white");

  const avatarItem = (
    <Nav.Item
      className="d-flex align-items-center justify-content-center"
      style={{ flex: "0 0 70px" }}
    >
      <div
        onClick={() => navigate(`/paginaProfilo/${user?.id}`)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") navigate(`/paginaProfilo/${user?.id}`);
        }}
        aria-label="Vai al profilo"
        style={{ cursor: "pointer" }}
      >
        <Image
          src={user?.avatar}
          roundedCircle
          width={50}
          height={50}
          alt="Profilo"
          className="border border-white shadow"
          style={{ objectFit: "cover" }}
        />
      </div>
    </Nav.Item>
  );

  return (
    <Nav
      fill
      className="position-fixed bottom-0 start-0 w-100 d-lg-none text-white"
      style={{
        height: "60px",
        zIndex: 1030,
        backgroundColor: "#074662",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <Nav.Item style={{ flex: "1" }}>
        <Nav.Link
          as={Link}
          to="/dashboard"
          className="d-flex flex-column align-items-center justify-content-center text-white"
          style={{ height: "100%" }}
        >
          <LayoutTextWindowReverse size={28} color={iconColor(isActive("/dashboard"))} />
        </Nav.Link>
      </Nav.Item>

      {isPaziente && avatarItem}

      {isMedico && (
        <Nav.Item style={{ flex: "1" }}>
          <Nav.Link
            as={Link}
            to="/pazienti"
            className="d-flex flex-column align-items-center justify-content-center text-white"
            style={{ height: "100%" }}
          >
            <People size={28} color={iconColor(isActive("/pazienti"))} />
          </Nav.Link>
        </Nav.Item>
      )}

      {(isMedico || isPaziente) && (
        <Nav.Item style={{ flex: "1" }}>
          <Nav.Link
            as={Link}
            to="/appuntamenti"
            className="d-flex flex-column align-items-center justify-content-center text-white"
            style={{ height: "100%" }}
          >
            <Calendar3 size={28} color={iconColor(isActive("/appuntamenti"))} />
          </Nav.Link>
        </Nav.Item>
      )}

      {isMedico && avatarItem}
    </Nav>
  );
};

export default MobileNav;
















