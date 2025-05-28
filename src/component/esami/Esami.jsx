import React, { useState, useEffect } from "react";
import { Alert, Button, Table } from "react-bootstrap";
import { useParams } from "react-router";
import ModaleVisualizzaEsame from "../modali/ModaleVisualizzaEsame";
import ModaleUploadEsame from "../modali/ModaleUploadEsame";

const Esami = () => {
  const { pazienteId } = useParams();
  const [esami, setEsami] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showModalVisualizza, setShowModalVisualizza] = useState(false);
  const [showModalUpload, setShowModalUpload] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (pazienteId) {
      fetch(`${apiUrl}/esami/paziente/${pazienteId}`)
        .then((res) => res.json())
        .then(setEsami);
    }
  }, [pazienteId]);

  const apriPdfInModale = async (id) => {
    const res = await fetch(`${apiUrl}/esami/${id}/visualizza`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
    setShowModalVisualizza(true);
  };

  const chiudiModaleVisualizza = () => {
    setShowModalVisualizza(false);
    setPdfUrl(null);
  };

  const handleUploadSuccess = (nuovoEsame) => {
    setEsami([...esami, nuovoEsame]);
    setShowModalUpload(false);
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 1000);
  };

  return (
    <div className="container mt-4">
      <h2>Esami</h2>

      <Button variant="success" className="mb-3" onClick={() => setShowModalUpload(true)}>
        Carica Nuovo Esame
      </Button>

      {showSuccessAlert && (
        <Alert variant="success" dismissible>
          Esame caricato con successo!
        </Alert>
      )}

      {esami.length === 0 ? (
        <p className="text-muted">Nessun esame disponibile per questo paziente.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Data Esame</th>
              <th>Nome File</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {esami.map((esame) => (
             <tr
  key={esame.id}
  className="riga-esame"
  style={{ cursor: "pointer" }}
  onClick={() => apriPdfInModale(esame.id)}
>
  <td>{new Date(esame.dataEsame).toLocaleDateString("it-IT")}</td>
  <td>{esame.nomeFile}</td>
  <td>{esame.note}</td>
</tr>
            ))}
          </tbody>
        </Table>
      )}

      <ModaleVisualizzaEsame
        show={showModalVisualizza}
        pdfUrl={pdfUrl}
        onClose={chiudiModaleVisualizza}
      />

      <ModaleUploadEsame
        show={showModalUpload}
        onHide={() => setShowModalUpload(false)}
        pazienteId={pazienteId}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default Esami;




