import { useParams } from "react-router";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../access/AuthContext";
import Profilo from "./Profilo";
import SideBar from "./SideBar";
import ModaleConferma from "../modali/ModaleConferma";
import { Container, Row, Col, Spinner, Image } from "react-bootstrap";
import { Power } from "react-bootstrap-icons";
import logo from "../../assets/Logo.png";
import cuore from "../../assets/Cuore.png";
import { useNavigate } from "react-router";
import { Modal } from "bootstrap";

const PaginaProfilo = () => {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [paziente, setPaziente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModaleLogout, setShowModaleLogout] = useState(false);

  const isMedico = user?.roles?.includes("ROLE_ADMIN");
  const isViewingOwnProfile = user?.id?.toString() === id;

  const fetchPaziente = useCallback(() => {
    if (!id || isViewingOwnProfile) return;

    setLoading(true);
    fetch(`${apiUrl}/pazienti/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore fetch paziente");
        return res.json();
      })
      .then((data) => setPaziente(data))
      .catch(() => setPaziente(null))
      .finally(() => setLoading(false));
  }, [apiUrl, id, isViewingOwnProfile]);

  useEffect(() => {
    if (!isViewingOwnProfile) {
      fetchPaziente();
    } else {
      setLoading(false);
      setPaziente(null);
    }
  }, [fetchPaziente, isViewingOwnProfile]);

  const datiDaMostrare = isViewingOwnProfile ? user : paziente;
  const shouldShowSidebar = !isMedico || (isMedico && !isViewingOwnProfile);

  const handleLogout = () => {
    const modalElement = document.querySelector(".modal");
    const modal = Modal.getInstance(modalElement);
    if (modal) modal.hide();
    setShowModaleLogout(false);

    setTimeout(() => {
      logout();
      navigate("/login");
    }, 200);
  };

  return (
    <Container className="position-relative">
  
      <Image
        src={cuore}
        alt="Cuore"
        className="d-block d-md-none position-absolute"
        style={{
          top: "0px",
          right: "15px",
          width: "30px",
          zIndex: 10,
        }}
      />

     
    <Row className="align-items-center my-4">
  <Col className="text-end">
    <Image src={logo} alt="Logo" style={{ maxWidth: "150px" }} />
  </Col>
</Row>


      <Row>
        <Col xs={12} md={7} className="d-flex justify-content-center mb-4 mb-md-0">
          {loading ? (
            <div className="spinner-grow text-success mt-5" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : datiDaMostrare ? (
            <Profilo utente={datiDaMostrare} onAggiorna={fetchPaziente} />
          ) : (
            <p>Utente non trovato.</p>
          )}
        </Col>

        <Col xs={12} md={5} className="d-flex flex-column align-items-center">
          {shouldShowSidebar && datiDaMostrare?.id && (
            <SideBar pazienteId={datiDaMostrare.id} />
          )}
        </Col>
      </Row>


      <div
        className="d-md-none position-fixed"
        style={{
          bottom: "100px",
          right: "10px",
          backgroundColor: "#E3F2FD",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 0 8px rgba(0,0,0,0.15)",
          zIndex: 1050,
        }}
        onClick={() => setShowModaleLogout(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setShowModaleLogout(true);
        }}
        aria-label="Logout"
      >
        <Power size={24} color="#074662" />
      </div>

      <ModaleConferma
        show={showModaleLogout}
        onConferma={handleLogout}
        onClose={() => setShowModaleLogout(false)}
        messaggio="Sei sicuro di voler effettuare il logout?"
      />
    </Container>
  );
};

export default PaginaProfilo;










