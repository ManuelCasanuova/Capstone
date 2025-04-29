import { Col, Container, Row } from "react-bootstrap";
import PatientDashboard from "../Paziente/PatientDashboard";
import WelcomeStudio from "./WelcomeStudio";

function Home () {
  return (
    <>
    <Container>
        <Row xs={2}>
            <Col><PatientDashboard /></Col>
            <Col><WelcomeStudio /></Col>
            
        </Row>
    </Container>
    
    </>
  );
}
export default Home;