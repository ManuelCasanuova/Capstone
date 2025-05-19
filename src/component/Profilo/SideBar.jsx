import { Container } from "react-bootstrap";
import { Back, Clipboard2Check, Front } from "react-bootstrap-icons";

const SideBar = () => {
    return (
        <Container className="mt-4" >


            <div className="border colorDiv rounded-top-3 p-4 " style={{color:"#074662"}}>Anamnesi</div>
            <div className="border colorDiv p-4" style={{color:"#074662"}}>Esami</div>
            <div className="border colorDiv p-4 " style={{color:"#074662"}}>Prescrizioni</div>  
            <div className="border colorDiv p-4 " style={{color:"#074662"}}>Piano terapeutico</div>
            <div className="border colorDiv shadow-sm  rounded-bottom-3 p-4 " style={{color:"#074662"}}>Appuntamenti</div>


          
           
           



        </Container>
    );
    }
export default SideBar; 