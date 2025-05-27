import { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

function ModaleModificaDiagnosi({ show, onHide, diagnosi, onUpdated }) {
  const [codiceCIM10, setCodiceCIM10] = useState("");
  const [dataDiagnosi, setDataDiagnosi] = useState("");
  const [trattamentoRaccomandato, setTrattamentoRaccomandato] = useState("");
  const [descrizioneDiagnosi, setDescrizioneDiagnosi] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (diagnosi) {
      setCodiceCIM10(diagnosi.codiceCIM10 || "");
      setDataDiagnosi(diagnosi.dataDiagnosi || "");
      setTrattamentoRaccomandato(diagnosi.trattamentoRaccomandato || "");
      setDescrizioneDiagnosi(diagnosi.descrizioneDiagnosi || "");
    }
  }, [diagnosi]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/diagnosi/${diagnosi.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          codiceCIM10,
          dataDiagnosi,
          trattamentoRaccomandato,
          descrizioneDiagnosi,
        }),
      });

      if (!res.ok) throw new Error("Errore durante l'aggiornamento");

      onUpdated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Modifica Diagnosi</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Codice CIM10</Form.Label>
            <Form.Control
              type="text"
              value={codiceCIM10}
              onChange={(e) => setCodiceCIM10(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Data Diagnosi</Form.Label>
            <Form.Control
              type="date"
              value={dataDiagnosi}
              onChange={(e) => setDataDiagnosi(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descrizione Diagnosi</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={descrizioneDiagnosi}
              onChange={(e) => setDescrizioneDiagnosi(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Trattamento Raccomandato</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={trattamentoRaccomandato}
              onChange={(e) => setTrattamentoRaccomandato(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Salvataggio..." : "Salva Modifiche"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ModaleModificaDiagnosi;
