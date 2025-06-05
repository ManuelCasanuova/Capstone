import { useState } from "react";
import { Col, Container, Image, Row, Form, Button, Alert, Modal } from "react-bootstrap";
import logo from "../../assets/Logo.png";
import ModaleConferma from "../modali/ModaleConferma";

function DettaglioDiagnosi({ diagnosi, onBack, onDeleteSuccess, onUpdateSuccess }) {
  const [showConferma, setShowConferma] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...diagnosi });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const handleElimina = () => {
    setShowConferma(true);
  };

  const confermaEliminazione = async () => {
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/diagnosi/${diagnosi.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Errore nell'eliminazione");
      if (onDeleteSuccess) onDeleteSuccess();
      setShowConferma(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleModifica = () => {
    setEditMode(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiUrl}/diagnosi/${diagnosi.id}`, {
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

      const updatedDiagnosi = await res.json();
      setEditMode(false);
      if (onUpdateSuccess) onUpdateSuccess(updatedDiagnosi);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
                {!editMode && (
                  <>
                    <i
                      className="bi bi-pencil"
                      style={{ cursor: "pointer", fontSize: "1.2rem", color: "orange" }}
                      onClick={handleModifica}
                      title="Modifica"
                    ></i>
                    <i
                      className="bi bi-trash text-danger"
                      style={{ cursor: "pointer", fontSize: "1.2rem" }}
                      onClick={handleElimina}
                      title="Elimina"
                    ></i>
                  </>
                )}
              </div>

              {editMode ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="codiceCIM10">
                    <Form.Label>Codice CIM10 / Nome diagnosi</Form.Label>
                    <Form.Control
                      type="text"
                      name="codiceCIM10"
                      value={formData.codiceCIM10 || ""}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="dataInserimentoDiagnosi">
                    <Form.Label>Data Inserimento</Form.Label>
                    <Form.Control
                      type="date"
                      name="dataInserimentoDiagnosi"
                      value={formData.dataInserimentoDiagnosi ? formData.dataInserimentoDiagnosi.split("T")[0] : ""}
                      disabled
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="dataDiagnosi">
                    <Form.Label>Data Diagnosi *</Form.Label>
                    <Form.Control
                      type="date"
                      name="dataDiagnosi"
                      value={formData.dataDiagnosi ? formData.dataDiagnosi.split("T")[0] : ""}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={() => setEditMode(false)} disabled={loading}>
                      Annulla
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? "Salvataggio..." : "Salva"}
                    </Button>
                  </div>
                </Form>
              ) : (
                <>
                  <p className="mb-3">
                    <strong>Codice CIM10 / Nome diagnosi:</strong> <br/> {diagnosi.codiceCIM10}
                  </p>
                  <p className="mb-3">
                    <strong>Data Inserimento:</strong>{" "}<br/>
                    {diagnosi.dataInserimentoDiagnosi
                      ? new Date(diagnosi.dataInserimentoDiagnosi).toLocaleDateString("it-IT")
                      : "-"}
                  </p>
                   <p className="mb-3">
                    <strong>Data Diagnosi:</strong>{" "}<br/>
                    {new Date(diagnosi.dataDiagnosi).toLocaleDateString("it-IT")}
                  </p>
                </>
              )}
            </div>
          </Col>

          <Col xs={12} md={8}>
            <div className="border rounded shadow-sm p-3 mb-4 h-100">
              <p>
                <strong>Descrizione:</strong>
              </p>
              {editMode ? (
                <Form.Group controlId="descrizioneDiagnosi" className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="descrizioneDiagnosi"
                    value={formData.descrizioneDiagnosi || ""}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </Form.Group>
              ) : (
                <p className="mb-3">{diagnosi.descrizioneDiagnosi}</p>
              )}

              {editMode ? (
                <Form.Group controlId="trattamentoRaccomandato" className="mb-3">
                  <Form.Label>Trattamento raccomandato</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="trattamentoRaccomandato"
                    value={formData.trattamentoRaccomandato || ""}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </Form.Group>
              ) : (
                diagnosi.trattamentoRaccomandato && (
                  <>
                     <p >
                      <strong>Trattamento raccomandato:</strong>
                    </p>
                    <p>{diagnosi.trattamentoRaccomandato}</p>
                  </>
                )
              )}
            </div>
          </Col>
        </Row>
      </Container>

      <ModaleConferma
  show={showConferma}
  onConferma={confermaEliminazione}
  onClose={() => setShowConferma(false)}
  messaggio={`Sei sicuro di voler eliminare la diagnosi "${diagnosi.codiceCIM10}"?`}
/>
    </>
  );
}

export default DettaglioDiagnosi;











