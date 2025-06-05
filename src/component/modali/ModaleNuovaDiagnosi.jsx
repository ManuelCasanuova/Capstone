import { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

function ModaleNuovaDiagnosi({ show, onHide, pazienteId, onCreated }) {
  const [codiceCIM10, setCodiceCIM10] = useState("");
  const [dataDiagnosi, setDataDiagnosi] = useState("");
  const [trattamentoRaccomandato, setTrattamentoRaccomandato] = useState("");
  const [descrizioneDiagnosi, setDescrizioneDiagnosi] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    console.log("ModaleNuovaDiagnosi – pazienteId:", pazienteId);
  }, [pazienteId, show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!dataDiagnosi || !descrizioneDiagnosi || !pazienteId) {
      setError("Compila tutti i campi obbligatori");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/diagnosi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          codiceCIM10,
          dataDiagnosi,
          pazienteId,
          trattamentoRaccomandato,
          descrizioneDiagnosi,
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = "Errore durante la creazione";

        if (contentType && contentType.includes("application/json")) {
          const errData = await response.json();
          errorMessage = errData.message || errorMessage;
        } else {
          const text = await response.text();
          errorMessage = text || errorMessage;
        }

        throw new Error(errorMessage);
      }

      const newDiagnosi = await response.json();
      onCreated(newDiagnosi);
      onHide();

      setCodiceCIM10("");
      setDataDiagnosi("");
      setTrattamentoRaccomandato("");
      setDescrizioneDiagnosi("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Nuova Diagnosi</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="codiceCIM10">
            <Form.Label>Codice CIM10/Nome Diagnosi</Form.Label>
            <Form.Control
              type="text"
              value={codiceCIM10}
              onChange={(e) => setCodiceCIM10(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="dataDiagnosi">
            <Form.Label>Data Diagnosi *</Form.Label>
            <Form.Control
              type="date"
              value={dataDiagnosi}
              onChange={(e) => setDataDiagnosi(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="descrizioneDiagnosi">
            <Form.Label>Descrizione Diagnosi *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={descrizioneDiagnosi}
              onChange={(e) => setDescrizioneDiagnosi(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="trattamentoRaccomandato">
            <Form.Label>Trattamento Raccomandato</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={trattamentoRaccomandato}
              onChange={(e) => setTrattamentoRaccomandato(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Salvataggio..." : "Salva"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ModaleNuovaDiagnosi;




