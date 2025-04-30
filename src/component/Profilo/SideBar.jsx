import { Container } from "react-bootstrap";
import { Back, Clipboard2Check, Front } from "react-bootstrap-icons";

const SideBar = () => {
    return (
        <Container className="bg-white rounded-3 p-3">


            <ul className="ps-0">
                <li className="d-flex align-items-center">
                    <Front className="fs-4 me-2" />
                    <span className="fs-5">Anamnesi</span>
                </li>
                <li className="d-flex align-items-center">
                    <Back className="fs-4 me-2" />
                    <span className="fs-5">Diagnosi</span>
                </li>
                <li className="d-flex align-items-center">
                    <Clipboard2Check className="fs-4 me-2" />
                    <span className="fs-5">Esami</span>
                </li>   
            </ul>
           



        </Container>
    );
    }
export default SideBar;