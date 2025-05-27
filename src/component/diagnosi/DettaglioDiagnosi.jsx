import { Col, Container, Image, Row } from "react-bootstrap";
import logo from "../../assets/Logo.png";

function DettaglioDiagnosi({ diagnosi, onBack }) {
  if (!diagnosi) return null;

  return (
    <>
      <Container className="mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="mb-3">Dettaglio Diagnosi</h2>
          <Image src={logo} alt="Logo" fluid style={{ width: "150px" }} />
        </div>
      </Container>

      <Container>
        <Row>
          <Col xs={12} md={4} className="d-flex">
            <div className="border rounded shadow-sm p-3 mb-4 d-flex flex-column justify-content-center w-100">
              <p className="mb-3">
                <strong>Codice CIM10:</strong> {diagnosi.codiceCIM10}
              </p>
              <p className="mb-3">
                <strong>Data Inserimento:</strong>{" "}
                {diagnosi.dataInserimentoDiagnosi
                  ? new Date(diagnosi.dataInserimentoDiagnosi).toLocaleDateString("it-IT")
                  : "-"}
              </p>
              <p>
                <strong>Data Diagnosi:</strong>{" "}
                {new Date(diagnosi.dataDiagnosi).toLocaleDateString("it-IT")}
              </p>
            </div>
          </Col>

          <Col xs={12} md={8}>
            <div className="border rounded shadow-sm p-3 mb-4 h-100">
              <p>
                <strong>Descrizione:</strong>
              </p>
              <p className="mb-3">{diagnosi.descrizioneDiagnosi}</p>

              {diagnosi.trattamentoRaccomandato && (
                <>
                  <p>
                    <strong>Trattamento raccomandato:</strong>
                  </p>
                  <p>{diagnosi.trattamentoRaccomandato}</p>
                </>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default DettaglioDiagnosi;






