import { useState } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import logo from "../../assets/Logo.png";
import ModaleModificaDiagnosi from "../modali/ModaleModificaDiagnosi";
import ModaleConferma from "../modali/ModaleConferma";

function DettaglioDiagnosi({ diagnosi, onBack, onDeleteSuccess }) {
  const [showModifica, setShowModifica] = useState(false);
  const [showConferma, setShowConferma] = useState(false);

  const handleElimina = () => {
    setShowConferma(true);
  };

  const confermaEliminazione = () => {
    const apiUrl = import.meta.env.VITE_API_URL;

    fetch(`${apiUrl}/diagnosi/${diagnosi.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore nell'eliminazione");
        if (onDeleteSuccess) onDeleteSuccess();
      })
      .catch((err) => alert(err.message));
  };

  const handleModifica = () => {
    setShowModifica(true);
  };

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
            <div className="border rounded shadow-sm p-3 mb-4 d-flex flex-column justify-content-center w-100 position-relative">
              <div className="position-absolute top-0 end-0 p-2 d-flex gap-2">
                <i
                  className="bi bi-pencil"
                  style={{ cursor: "pointer", fontSize: "1.2rem" }}
                  onClick={handleModifica}
                ></i>
                <i
                  className="bi bi-trash text-danger"
                  style={{ cursor: "pointer", fontSize: "1.2rem" }}
                  onClick={handleElimina}
                ></i>
              </div>

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

      <ModaleModificaDiagnosi
        show={showModifica}
        onHide={() => setShowModifica(false)}
        diagnosi={diagnosi}
        onUpdated={() => {
          setShowModifica(false);
          onBack();
        }}
      />

      <ModaleConferma
        show={showConferma}
        onConferma={confermaEliminazione}
        onClose={() => setShowConferma(false)}
        messaggio="Sei sicuro di voler eliminare questa diagnosi?"
      />
    </>
  );
}

export default DettaglioDiagnosi;









