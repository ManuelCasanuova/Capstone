import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card, Image } from "react-bootstrap";
import ModaleConferma from "../modali/ModaleConferma";
import logo from "../../assets/Logo.png";

function AnamnesiDettaglio({ anamnesi, onUpdate, onDelete }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...anamnesi });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConferma, setShowConferma] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const handleElimina = () => {
    setShowConferma(true);
  };

  const confermaEliminazione = async () => {
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/anamnesi/${anamnesi.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Errore nell'eliminazione anamnesi");
      if (onDelete) onDelete(anamnesi.id);
      setShowConferma(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleModifica = () => {
    setEditMode(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("fattoreDiRischio.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        fattoreDiRischio: {
          ...prev.fattoreDiRischio,
          [key]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/anamnesi/${anamnesi.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Errore durante l'aggiornamento");
      }
      const updated = await res.json();
      setEditMode(false);
      if (onUpdate) onUpdate(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!anamnesi) return null;

  const fattore = formData.fattoreDiRischio || {};

  return (
    <>
      <Container className="mb-3 d-flex justify-content-between align-items-center">
        <h2>Dettaglio Anamnesi</h2>
        <Image src={logo} alt="Logo" fluid style={{ maxWidth: "150px" }} />
      </Container>

      <Container>
        <Row>
          

          <Col xs={12} md={8}>
            {!editMode ? (
              <Card className="p-3 shadow-sm">

                <Row className="mb-3">
  <Col xs={6}> <p>
    <strong>Anno evento:</strong> {formData.anno || "-"}
  </p>
  </Col>
  <Col xs={6}>
  <p>
    <strong>Evento:</strong> {formData.titolo || "-"}
    </p>
  </Col>
</Row>



                <p className="mb-2">
                  <strong>Descrizione evento/Anamnesi:</strong>
                </p>
                <p>{formData.descrizioneAnamnesi || "-"}</p>
              </Card>
            ) : (
              
               <Form onSubmit={handleSubmit}>
  <Form.Group controlId="titolo" className="mb-3">
    <Form.Label>Titolo</Form.Label>
    <Form.Control
      type="text"
      name="titolo"
      value={formData.titolo || ""}
      onChange={handleChange}
      disabled={loading}
      required
      maxLength={60}
    />
  </Form.Group>

  <Form.Group controlId="anno" className="mb-3">
    <Form.Label>Anno</Form.Label>
    <Form.Control
      type="number"
      name="anno"
      value={formData.anno || ""}
      onChange={handleChange}
      disabled={loading}
      min={1920}
      max={new Date().getFullYear()}
      required
    />
  </Form.Group>

  <Form.Group controlId="descrizioneAnamnesi" className="mb-3">
    <Form.Label>Descrizione Anamnesi</Form.Label>
    <Form.Control
      as="textarea"
      rows={6}
      name="descrizioneAnamnesi"
      value={formData.descrizioneAnamnesi || ""}
      onChange={handleChange}
      disabled={loading}
      required
    />
  </Form.Group>

                <Button variant="secondary" onClick={() => setEditMode(false)} disabled={loading}>
                  Annulla
                </Button>
                <Button className="ms-2" variant="primary" type="submit" disabled={loading}>
                  {loading ? "Salvataggio..." : "Salva"}
                </Button>
              </Form>
            )}
          </Col>

<Col xs={12} md={4}>
            <Card className="p-3 shadow-sm position-relative">
              {!editMode && (
                <div
                  className="position-absolute top-0 end-0 p-2 d-flex gap-2"
                  style={{ zIndex: 1 }}
                >
                  <i
                    className="bi bi-pencil"
                    style={{ cursor: "pointer", fontSize: "1.2rem", color: "orange" }}
                    onClick={handleModifica}
                    title="Modifica"
                  />
                  <i
                    className="bi bi-trash text-danger"
                    style={{ cursor: "pointer", fontSize: "1.2rem" }}
                    onClick={handleElimina}
                    title="Elimina"
                  />
                </div>
              )}

              {!editMode ? (
                <>
                  <p className="mb-3">
                    <strong>Data Inserimento:</strong>{" "}
                    {formData.dataInserimentoAnamnesi
                      ? new Date(formData.dataInserimentoAnamnesi).toLocaleDateString("it-IT")
                      : "-"}
                  </p>
                <p className="mb-3">
                    <strong>Fumatore:</strong> <br/> {fattore.fumatore ? "Sì" : "No"}
                  </p>
                  {fattore.fumatore && (
                   <p className="mb-3">
                      <strong>Data Inizio Fumo:</strong> <br/>{" "}
                      {fattore.dataInizioFumo
                        ? new Date(fattore.dataInizioFumo).toLocaleDateString("it-IT")
                        : "-"}
                    </p>
                  )}
                <p className="mb-3">
                    <strong>Uso Alcol:</strong> <br/>{fattore.usoAlcol ? "Sì" : "No"}
                  </p>
                  {fattore.usoAlcol && (
                   <p className="mb-3">
                      <strong>Data Ultima Assunzione Alcol:</strong> <br/>{" "} 
                      {fattore.dataUltimaAssunzioneAlcol
                        ? new Date(fattore.dataUltimaAssunzioneAlcol).toLocaleDateString("it-IT")
                        : "-"}
                    </p>
                  )}
                  <p className="mb-3">
                    <strong>Uso Stupefacente:</strong> <br/> {fattore.usoStupefacente ? "Sì" : "No"}
                  </p>
                  {fattore.usoStupefacente && (
                    <p className="mb-3">
                      <strong>Data Ultima Assunzione Stupefacente:</strong>{" "}
                      {fattore.dataUltimaAssunzioneStupefacente
                        ? new Date(fattore.dataUltimaAssunzioneStupefacente).toLocaleDateString("it-IT")
                        : "-"}
                    </p>
                  )}
                  <p className="mb-3">
                    <strong>Note:</strong> {fattore.note || "-"}
                  </p>
                </>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Form.Check
                    type="checkbox"
                    label="Fumatore"
                    name="fattoreDiRischio.fumatore"
                    checked={fattore.fumatore || false}
                    onChange={handleChange}
                  />
                  {fattore.fumatore && (
                    <Form.Group controlId="dataInizioFumo" className="mb-3 mt-2">
                      <Form.Label>Data Inizio Fumo</Form.Label>
                      <Form.Control
                        type="date"
                        name="fattoreDiRischio.dataInizioFumo"
                        value={fattore.dataInizioFumo || ""}
                        onChange={handleChange}
                        max={new Date().toISOString().slice(0, 10)}
                      />
                    </Form.Group>
                  )}

                  <Form.Check
                    type="checkbox"
                    label="Uso Alcol"
                    name="fattoreDiRischio.usoAlcol"
                    checked={fattore.usoAlcol || false}
                    onChange={handleChange}
                  />
                  {fattore.usoAlcol && (
                    <Form.Group controlId="dataUltimaAssunzioneAlcol" className="mb-3 mt-2">
                      <Form.Label>Data Ultima Assunzione Alcol</Form.Label>
                      <Form.Control
                        type="date"
                        name="fattoreDiRischio.dataUltimaAssunzioneAlcol"
                        value={fattore.dataUltimaAssunzioneAlcol || ""}
                        onChange={handleChange}
                        max={new Date().toISOString().slice(0, 10)}
                      />
                    </Form.Group>
                  )}

                  <Form.Check
                    type="checkbox"
                    label="Uso Stupefacente"
                    name="fattoreDiRischio.usoStupefacente"
                    checked={fattore.usoStupefacente || false}
                    onChange={handleChange}
                  />
                  {fattore.usoStupefacente && (
                    <Form.Group controlId="dataUltimaAssunzioneStupefacente" className="mb-3 mt-2">
                      <Form.Label>Data Ultima Assunzione Stupefacente</Form.Label>
                      <Form.Control
                        type="date"
                        name="fattoreDiRischio.dataUltimaAssunzioneStupefacente"
                        value={fattore.dataUltimaAssunzioneStupefacente || ""}
                        onChange={handleChange}
                        max={new Date().toISOString().slice(0, 10)}
                      />
                    </Form.Group>
                  )}

                  <Form.Group controlId="note" className="mb-3 mt-2">
                    <Form.Label>Note</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="fattoreDiRischio.note"
                      value={fattore.note || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  
                </Form>
              )}
            </Card>
          </Col>

        </Row>
      </Container>

      <ModaleConferma
        show={showConferma}
        onConferma={confermaEliminazione}
        onClose={() => setShowConferma(false)}
        messaggio={`Sei sicuro di voler eliminare questa anamnesi?`}
      />
      {error && (
        <div className="alert alert-danger text-center mt-3" role="alert">
          {error}
        </div>
      )}
    </>
  );
}

export default AnamnesiDettaglio;

