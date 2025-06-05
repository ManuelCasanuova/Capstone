import { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

function ModalePianoTerapeutico({ show, onHide, pazienteId, onCreated }) {
  const [nomeCommerciale, setNomeCommerciale] = useState("");
  const [codiceATC, setCodiceATC] = useState("");
  const [formaFarmaceutica, setFormaFarmaceutica] = useState("");
  const [dosaggio, setDosaggio] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (show) {
      setNomeCommerciale("");
      setCodiceATC("");
      setFormaFarmaceutica("");
      setDosaggio("");
      setNote("");
      setError(null);
      setLoading(false);
    }
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!nomeCommerciale.trim() || !codiceATC.trim() || !pazienteId) {
      setError("Compila tutti i campi obbligatori.");
      return;
    }

    if (note.length > 1000) {
      setError("Le note non possono superare i 1000 caratteri.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/farmaci`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          nomeCommerciale: nomeCommerciale.trim(),
          codiceATC: codiceATC.trim(),
          formaFarmaceutica: formaFarmaceutica.trim() || null,
          dosaggio: dosaggio.trim() || null,
          note: note.trim() || null,
          pazienteId,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Errore durante la creazione del farmaco";
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          const errData = await response.json();
          errorMessage = errData.message || errorMessage;
        } else {
          const text = await response.text();
          errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const newFarmaco = await response.json();
      onCreated(newFarmaco);
      onHide();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" keyboard={!loading}>
      <Modal.Header closeButton={!loading}>
        <Modal.Title>Nuovo Farmaco Piano Terapeutico</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3" controlId="nomeCommerciale">
            <Form.Label>Nome Commerciale *</Form.Label>
            <Form.Control
              type="text"
              value={nomeCommerciale}
              onChange={(e) => setNomeCommerciale(e.target.value)}
              required
              autoFocus
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="codiceATC">
            <Form.Label>Codice ATC *</Form.Label>
            <Form.Control
              type="text"
              value={codiceATC}
              onChange={(e) => setCodiceATC(e.target.value)}
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formaFarmaceutica">
            <Form.Label>Forma Farmaceutica</Form.Label>
            <Form.Control
              type="text"
              value={formaFarmaceutica}
              onChange={(e) => setFormaFarmaceutica(e.target.value)}
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="dosaggio">
            <Form.Label>Dosaggio</Form.Label>
            <Form.Control
              type="text"
              value={dosaggio}
              onChange={(e) => setDosaggio(e.target.value)}
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="note">
            <Form.Label>Note</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={1000}
              disabled={loading}
              placeholder="Max 1000 caratteri"
            />
            <Form.Text>{note.length}/1000</Form.Text>
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={onHide} disabled={loading} className="me-2">
              Annulla
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Salvataggio..." : "Salva"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ModalePianoTerapeutico;











