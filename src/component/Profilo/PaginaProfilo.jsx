import { Col, Container, Image, Row, Spinner } from "react-bootstrap";
import Profilo from "./Profilo";
import SideBar from "./SideBar";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import logo from "../../assets/Logo.png";

const PaginaProfilo = () => {
  const { id } = useParams(); 
  const [utente, setUtente] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUtente = async () => {
      try {
        const res = await fetch(`${apiUrl}/pazienti/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        if (!res.ok) throw new Error("Errore nella risposta");
        const data = await res.json();
        setUtente(data);
      } catch (error) {
        console.error("Errore fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUtente();
  }, [id, apiUrl]);

  return (
    <Container>

<Row className="align-items-center mt-5 mb-3">
        <Col>
          <h2>
            Profilo 
          </h2>
        </Col>
        <Col xs="auto">
          <Image src={logo} alt="Logo" fluid style={{ width: "150px" }} />
        </Col>
      </Row>

      <Row>
        <Col xs={7} className="d-flex justify-content-center">
          {loading ? (
            <Spinner animation="border" role="status" />
          ) : utente ? (
            <Profilo utente={utente} />
          ) : (
            <p>Utente non trovato.</p>
          )}
        </Col>

        <Col xs={5} className="d-flex justify-content-center">
         {utente && <SideBar pazienteId={utente.id} />}
        </Col>
      </Row>
    </Container>
  );
};

export default PaginaProfilo;