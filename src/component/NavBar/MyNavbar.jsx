import { useEffect, useRef, useState } from "react";
import { Nav, Image } from "react-bootstrap";
import {
  LayoutTextWindowReverse,
  People,
  Power,
  Calendar3,
} from "react-bootstrap-icons";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../access/AuthContext";
import { Modal } from "bootstrap";

const ModaleConferma = ({ show, onConferma, onClose, messaggio }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const modalEl = modalRef.current;
    if (modalEl && show) {
      const bsModal = new Modal(modalEl);
      bsModal.show();

      const handleHidden = () => {
        onClose();
      };

      modalEl.addEventListener("hidden.bs.modal", handleHidden);

      return () => {
        modalEl.removeEventListener("hidden.bs.modal", handleHidden);
      };
    }
  }, [show, onClose]);

  const handleConferma = () => {
    onConferma();
    const modal = Modal.getInstance(modalRef.current);
    modal.hide();
  };

  return (
    <div className="modal fade" tabIndex="-1" ref={modalRef}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Conferma Logout</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Chiudi"
            ></button>
          </div>
          <div className="modal-body">
            <p>{messaggio}</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Annulla
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleConferma}
            >
              Conferma
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [showModaleLogout, setShowModaleLogout] = useState(false);

  const token = localStorage.getItem("token");
  if (!token || location.pathname === "/login") return null;

  const roles = user?.roles || [];
  const isAdmin = roles.includes("ROLE_ADMIN");

  const isActive = (path) => location.pathname === path;

  const handleAvatarClick = () => {
    navigate(`/paginaProfilo/${user?.id}`);
  };

  const confermaLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <div
        className="d-flex flex-column align-items-center vh-100 p-3 bg-light border-end navbar"
        style={{ position: "fixed", top: 0, left: 0, width: "80px" }}
      >
        <Nav className="flex-column align-items-center flex-grow-1">
          <div
            className={`buttonNav rounded-3 p-2 mb-3 cursor-pointer d-flex align-items-center justify-content-center ${
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

          <div
            style={{ cursor: "pointer" }}
            className="mb-3 d-flex justify-content-center"
            onClick={handleAvatarClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleAvatarClick();
            }}
            aria-label="Vai al profilo"
          >
            <Image
              src={user?.avatar}
              roundedCircle
              width={50}
              height={50}
              alt="Profilo"
            />
          </div>
        </Nav>

        <div className="mt-auto">
          <div
            className="buttonNav rounded-3 p-2 cursor-pointer d-flex align-items-center justify-content-center"
            onClick={() => setShowModaleLogout(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setShowModaleLogout(true);
            }}
            aria-label="Logout"
          >
            <Power size={40} color="white" />
          </div>
        </div>
      </div>

      <ModaleConferma
        show={showModaleLogout}
        onConferma={confermaLogout}
        onClose={() => setShowModaleLogout(false)}
        messaggio="Sei sicuro di voler effettuare il logout?"
      />
    </>
  );
};

export default MyNavbar;









