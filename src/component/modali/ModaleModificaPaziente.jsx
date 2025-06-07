import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router";

const ModaleModificaPaziente = ({ show, onHide, utente, onSave, canChangePassword }) => {
  const [formData, setFormData] = useState({ ...utente });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setFormData({ ...utente });
    setError("");
  }, [utente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/pazienti/${utente.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Errore durante l'aggiornamento");
      }

      const updated = await response.json();
      onSave(updated); // notifica il componente Profilo
      onHide();         // chiudi il modale
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCambiaPassword = () => {
    onHide();
    navigate("/cambio-password");
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Modifica Profilo Paziente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={formData.nome || ""}
                onChange={handleChange}
                required
              />
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Cognome</Form.Label>
              <Form.Control
                type="text"
                name="cognome"
                value={formData.cognome || ""}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                required
              />
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Data di Nascita</Form.Label>
              <Form.Control
                type="date"
                name="dataDiNascita"
                value={formData.dataDiNascita ? formData.dataDiNascita.substring(0, 10) : ""}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>Gruppo Sanguigno</Form.Label>
              <Form.Select
                name="gruppoSanguigno"
                value={formData.gruppoSanguigno || ""}
                onChange={handleChange}
                required
              >
                <option value="">Seleziona...</option>
                <option value="A_POSITIVO">A+</option>
                <option value="A_NEGATIVO">A−</option>
                <option value="B_POSITIVO">B+</option>
                <option value="B_NEGATIVO">B−</option>
                <option value="AB_POSITIVO">AB+</option>
                <option value="AB_NEGATIVO">AB−</option>
                <option value="ZERO_POSITIVO">0+</option>
                <option value="ZERO_NEGATIVO">0−</option>
              </Form.Select>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Genere</Form.Label>
              <Form.Select
                name="sesso"
                value={formData.sesso || ""}
                onChange={handleChange}
                required
              >
                <option value="">Seleziona...</option>
                <option value="MASCHILE">Maschio</option>
                <option value="FEMMINILE">Femmina</option>
              </Form.Select>
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>Codice Fiscale</Form.Label>
              <Form.Control
                type="text"
                name="codiceFiscale"
                value={formData.codiceFiscale || ""}
                onChange={handleChange}
                required
              />
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Luogo di Nascita</Form.Label>
              <Form.Control
                type="text"
                name="luogoDiNascita"
                value={formData.luogoDiNascita || ""}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>Indirizzo di Residenza</Form.Label>
              <Form.Control
                type="text"
                name="indirizzoResidenza"
                value={formData.indirizzoResidenza || ""}
                onChange={handleChange}
                required
              />
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Domicilio</Form.Label>
              <Form.Control
                type="text"
                name="domicilio"
                value={formData.domicilio || ""}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>Telefono Cellulare</Form.Label>
              <Form.Control
                type="tel"
                name="telefonoCellulare"
                value={formData.telefonoCellulare || ""}
                onChange={handleChange}
              />
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Telefono Fisso</Form.Label>
              <Form.Control
                type="tel"
                name="telefonoFisso"
                value={formData.telefonoFisso || ""}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>Esenzione</Form.Label>
              <Form.Control
                type="text"
                name="esenzione"
                value={formData.esenzione || ""}
                onChange={handleChange}
              />
            </Col>
            <Col md={6} />
          </Row>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <Button
              variant="outline-secondary"
              onClick={handleCambiaPassword}
              disabled={!canChangePassword}
            >
              Cambia Password
            </Button>

            <div>
              <Button variant="secondary" onClick={onHide} className="me-2">
                Annulla
              </Button>
              <Button type="submit" variant="success" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : "Salva"}
              </Button>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModaleModificaPaziente;




