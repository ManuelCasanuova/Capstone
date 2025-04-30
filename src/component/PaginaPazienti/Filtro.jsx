import { Container } from "react-bootstrap";

const Filtro = () => {

    return (
       <Container className="border rounded-3 p-3 bg-white mt-3">
            <h4 className="text-center">Filtri</h4>
            <div className="d-flex justify-content-between">
                <div className="d-flex align-items-center">
                    <label htmlFor="filtroNome" className="me-2">Nome:</label>
                    <input type="text" id="filtroNome" className="form-control" />
                </div>
                <div className="d-flex align-items-center">
                    <label htmlFor="filtroCognome" className="me-2">Cognome:</label>
                    <input type="text" id="filtroCognome" className="form-control" />
                </div>
            </div>
            <div className="d-flex justify-content-between mt-3">
                <button className="btn btn-primary">Applica Filtri</button>
                <button className="btn btn-secondary">Resetta Filtri</button>
            </div>

       </Container>
    );
};

export default Filtro;