import { Col, Container, Image, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import logo from "../../assets/Logo.png";
import cuore from "../../assets/cuore.png";
import AppuntamentiOggi from "../Appuntamenti/AppuntamentiOggi";
import GestioneStudio from "../studio/GestioneStudio";
import { useAuth } from "../access/AuthContext";
import Comunicazioni from "../comunicazioni/Comunicazioni";

const Dashboard = () => {
  const { user, token, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      logout();
      navigate("/login");
    }
  }, [token, logout, navigate]);

  if (loading) return <p>Caricamento in corso...</p>;
  if (!user) {
    navigate("/login");
    return null;
  }

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
        <Col xs={12} md={8}>
          <h2>Dashboard</h2>
          <p>Benvenuto {user.cognome} {user.nome}</p>
        </Col>

        
        <Col xs={12} md={4} className="text-md-end text-center mt-3 mt-md-0">
          <Image
            src={logo}
            alt="Logo"
            fluid
            style={{ maxWidth: "150px" }}
            className="d-none d-md-block"
          />
        </Col>
      </Row>

      <Row className="gy-4" xs={1} md={2}>
       
        <Col xs={{ order: 1 }} md={{ order: 2 }}>
          <AppuntamentiOggi />
          <Comunicazioni />
        </Col>

   
        <Col xs={{ order: 2 }} md={{ order: 1 }}>
          <GestioneStudio />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;


