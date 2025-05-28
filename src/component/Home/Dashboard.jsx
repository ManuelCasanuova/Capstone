import { Col, Container, Image, Row } from "react-bootstrap";
import PrimoPiano from "./PrimoPiano";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import logo from "../../assets/Logo.png";
import AppuntamentiOggi from "../Appuntamenti/AppuntamentiOggi";
import GestioneStudio from "../studio/GestioneStudio";
import { useAuth } from "../access/AuthContext";


const Dashboard = () => {
  const { user, token, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      logout(); 
      navigate("/login");
    }
  }, [token, logout, navigate]);

  if (loading) {
    return <p>Caricamento in corso...</p>;
  }

  if (!user) {

    navigate("/login");
    return null;
  }

  return (
    <Container>
      <div className="d-flex ">
        <div className="mt-5">
          <h2>Dashboard</h2>
          <p>Benvenuto {user.cognome} {user.nome}</p>
        </div>
        <div className="ms-auto">
          <Image src={logo} alt="Logo" fluid style={{ width: "150px" }} />
        </div>
      </div>

      <Row xs={2}>
        <Col>
          <GestioneStudio />
        </Col>
        <Col>
          <AppuntamentiOggi />
          <PrimoPiano />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
