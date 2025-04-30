import { Col, Container, Row, ListGroup } from "react-bootstrap";
import CardPazienti from "./CardPazienti";
import { useState } from "react";
import { Link } from "react-router";
import Filtro from "./Filtro";

const PaginaPazienti = () => {
    const [mostraComponente, setMostraComponente] = useState('card'); // Stato iniziale: mostra le card

    const handleCambiaComponente = (componenteDaMostrare) => {
        setMostraComponente(componenteDaMostrare);
    };

    return (
        <>

        <div className="d-flex justify-content-end mb-3 me-3">
        <div
        className="border rounded-s-3 rounded-start p-2 bg-white "
         onClick={() => handleCambiaComponente('card')}
         style={{ cursor: 'pointer' }} >   
         <i className="bi bi-grid"></i>
        </div>


        <div
        className="border border-start-0 rounded-s-3 rounded-end p-2 bg-white  "
         onClick={() => handleCambiaComponente('list')}
         style={{ cursor: 'pointer' }} >
         <i className="bi bi-list"></i></div>
        </div>
            

            <Container>

            <Filtro />

                <Row xs={4}>
                    
                   

                    {mostraComponente === 'card' && (
                        <>
                            <Col><CardPazienti /></Col>
                            <Col><CardPazienti /></Col>
                            <Col><CardPazienti /></Col>
                            <Col><CardPazienti /></Col>
                            <Col><CardPazienti /></Col>
                            
                        </>
                    )}

                    {mostraComponente === 'list' && (
                        <Col xs={12} className="mt-3">
                            <ListGroup className="d-flex justify-content-center">

                            <Link to={"/paginaProfilo"} >
                                <ListGroup.Item>Primo elemento</ListGroup.Item>
                            </Link>

                               
                                <ListGroup.Item active>Secondo elemento</ListGroup.Item>
                                <ListGroup.Item disabled>Terzo elemento</ListGroup.Item>
                                <ListGroup.Item action href="#link1">Link 1</ListGroup.Item>
                                <ListGroup.Item action as="button" onClick={() => alert('Cliccato')}>Bottone</ListGroup.Item>
                            </ListGroup>
                        </Col>
                    )}
                </Row>
            </Container>
        </>
    );
};

export default PaginaPazienti;