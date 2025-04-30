import { Col, Container, Row } from "react-bootstrap"
import Profilo from "./Profilo"
import SideBar from "./SideBar"

const PaginaProfilo = () => {

    return (
        
        <Container>
            <Row>
                <Col xs={7} className="d-flex justify-content-center">
                <Profilo />
                </Col>

                <Col xs={5} className="d-flex justify-content-center">
                <SideBar />
                </Col>
            </Row>
        </Container>
         
        
    )
}
export default PaginaProfilo