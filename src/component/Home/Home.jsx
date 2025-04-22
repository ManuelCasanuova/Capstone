import { Container, Row } from "react-bootstrap";
import PatientDashboard from "../Paziente/PatientDashboard";
import WelcomeStudio from "./WelcomeStudio";

function Home () {
  return (
    <>
    <Container>
        <Row xs={2}>
            
            <PatientDashboard />
            <WelcomeStudio />
        </Row>
    </Container>
    
    </>
  );
}
export default Home;