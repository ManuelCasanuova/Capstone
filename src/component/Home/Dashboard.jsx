import { Col, Container, Row } from "react-bootstrap";
import PatientDashboard from "../Paziente/PatientDashboard";
import WelcomeStudio from "./WelcomeStudio";
import PaginaProfilo from "../Profilo/Profilo";
import PrimoPiano from "./PrimoPiano";



function Dashboard () {
  return (
    <>
    <Container>
        <Row >

          <Col xs={5}>
          <PatientDashboard />
          <WelcomeStudio />
          <PrimoPiano />
          </Col>
            
      

            {/* <PaginaProfilo  /> */}
      
            
        </Row>
    </Container>
    
    </>
  );
}
export default Dashboard;