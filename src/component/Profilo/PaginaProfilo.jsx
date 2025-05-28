import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../access/AuthContext";
import Profilo from "./Profilo";
import SideBar from "./SideBar";
import { Container, Row, Col, Spinner, Image } from "react-bootstrap";
import logo from "../../assets/Logo.png";

const PaginaProfilo = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [paziente, setPaziente] = useState(null);
  const [loading, setLoading] = useState(true);

  const isMedico = user?.roles?.includes("ROLE_ADMIN");
  const isViewingOwnProfile = user?.id?.toString() === id;

  useEffect(() => {
    if (!id) return;

    if (!isViewingOwnProfile) {
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
    } else {
      setLoading(false);
      setPaziente(null);
    }
  }, [id, apiUrl, isViewingOwnProfile]);

  const datiDaMostrare = isViewingOwnProfile ? user : paziente;

  const shouldShowSidebar = !isMedico || (isMedico && !isViewingOwnProfile);

  return (
    <Container>
      <Row className="align-items-center mt-5 mb-3">
        <Col>
          <h2>Profilo</h2>
        </Col>
        <Col xs="auto">
          <Image src={logo} alt="Logo" fluid style={{ width: "150px" }} />
        </Col>
      </Row>

      <Row>
        <Col xs={7} className="d-flex justify-content-center">
          {loading ? (
            <Spinner animation="border" />
          ) : datiDaMostrare ? (
            <Profilo utente={datiDaMostrare} />
          ) : (
            <p>Utente non trovato.</p>
          )}
        </Col>

        <Col xs={5} className="d-flex justify-content-center">
          {shouldShowSidebar && datiDaMostrare?.id && (
            <SideBar pazienteId={datiDaMostrare.id} />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PaginaProfilo;



