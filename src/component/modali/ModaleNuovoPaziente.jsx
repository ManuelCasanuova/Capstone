import { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const ModaleNuovoPaziente = ({ show, onHide, onSubmit }) => {
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    dataDiNascita: "",
    gruppoSanguigno: "",
    sesso: "",
    codiceFiscale: "",
    luogoDiNascita: "",
    indirizzoResidenza: "",
    domicilio: "",
    telefonoCellulare: "",
    telefonoFisso: "",
    esenzione: "",
    password: "Password123!" // password predefinita
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    console.log("Dati paziente da inviare:", formData);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Nuovo Paziente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Cognome</Form.Label>
                <Form.Control
                  type="text"
                  name="cognome"
                  value={formData.cognome}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Data di nascita</Form.Label>
                <Form.Control
                  type="date"
                  name="dataDiNascita"
                  value={formData.dataDiNascita}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Gruppo Sanguigno</Form.Label>
                <Form.Select
                  name="gruppoSanguigno"
                  value={formData.gruppoSanguigno}
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
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Genere</Form.Label>
                <Form.Select
                  name="sesso"
                  value={formData.sesso}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleziona...</option>
                  <option value="MASCHILE">Maschile</option>
                  <option value="FEMMINILE">Femminile</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Codice Fiscale</Form.Label>
            <Form.Control
              type="text"
              name="codiceFiscale"
              value={formData.codiceFiscale}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Luogo di nascita</Form.Label>
                <Form.Control
                  type="text"
                  name="luogoDiNascita"
                  value={formData.luogoDiNascita}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Indirizzo di residenza</Form.Label>
                <Form.Control
                  type="text"
                  name="indirizzoResidenza"
                  value={formData.indirizzoResidenza}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Domicilio</Form.Label>
            <Form.Control
              type="text"
              name="domicilio"
              value={formData.domicilio}
              onChange={handleChange}
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Telefono Cellulare</Form.Label>
                <Form.Control
                  type="tel"
                  name="telefonoCellulare"
                  value={formData.telefonoCellulare}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Telefono Fisso</Form.Label>
                <Form.Control
                  type="tel"
                  name="telefonoFisso"
                  value={formData.telefonoFisso}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Esenzione</Form.Label>
            <Form.Control
              type="text"
              name="esenzione"
              value={formData.esenzione}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-flex justify-content-end mt-4">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Annulla
            </Button>
            <Button type="submit" variant="success">
              Salva
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModaleNuovoPaziente;