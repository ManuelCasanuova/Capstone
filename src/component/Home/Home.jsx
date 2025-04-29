import { Col, Container, Row } from "react-bootstrap";
import PatientDashboard from "../Paziente/PatientDashboard";
import WelcomeStudio from "./WelcomeStudio";
import { Calendar } from '@progress/kendo-react-dateinputs';

function Home () {
  return (
    <>
    <Container>
        <Row xs={2}>
            <Col><PatientDashboard /></Col>
            <Col><WelcomeStudio /></Col>
            <Col><Calendar weekNumber={true} showOtherMonth={true}/></Col>
            
        </Row>
    </Container>
    
    </>
  );
}
export default Home;