import { useState } from "react";
import { Container, Row, Col, Button, Alert, Image, Form } from "react-bootstrap";
import { Pencil, Trash } from "react-bootstrap-icons";
import ModaleConferma from "../modali/ModaleConferma";
import logo from "../../assets/Logo.png";

const DettaglioPianoTerapeutico = ({
  farmaco,
  onBack,
  onDeleteSuccess,
  onUpdateSuccess,
  apiUrl,
  token,
}) => {
  const [showConferma, setShowConferma] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...farmaco });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!farmaco) return null;

  const handleElimina = () => setShowConferma(true);

  const confermaEliminazione = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/farmaci/${farmaco.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Errore durante la cancellazione");
      }
      onDeleteSuccess(farmaco.id);
      setShowConferma(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleModifica = () => setEditMode(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/farmaci/${farmaco.id}`, {
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
      const updatedFarmaco = await res.json();
      setEditMode(false);
      onUpdateSuccess(updatedFarmaco);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container className="mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <h2>Dettaglio Piano Terapeutico</h2>
          <Image src={logo} alt="Logo" fluid style={{ width: "150px" }} />
        </div>
      </Container>

      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={6} lg={5} className="position-relative">
            <div className="border rounded shadow-sm p-4 position-relative">
              <div className="position-absolute top-0 end-0 p-3 d-flex gap-3">
                {!editMode && (
                  <>
                  
                    <Pencil
                      role="button"
                      size={22}
                      
                      style={{ cursor: "pointer", color: "orange" }}
                      onClick={handleModifica}
                      title="Modifica farmaco"
                    />
                  
                    <Trash
                      role="button"
                      size={22}
                      className="text-danger"
                      style={{ cursor: "pointer" }}
                      onClick={handleElimina}
                      title="Elimina farmaco"
                    />
                  </>
                )}
              </div>

              {editMode ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="nomeCommerciale">
                    <Form.Label>Nome Commerciale</Form.Label>
                    <Form.Control
                      type="text"
                      name="nomeCommerciale"
                      value={formData.nomeCommerciale || ""}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="codiceATC">
                    <Form.Label>Codice ATC</Form.Label>
                    <Form.Control
                      type="text"
                      name="codiceATC"
                      value={formData.codiceATC || ""}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formaFarmaceutica">
                    <Form.Label>Forma Farmaceutica</Form.Label>
                    <Form.Control
                      type="text"
                      name="formaFarmaceutica"
                      value={formData.formaFarmaceutica || ""}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="dosaggio">
                    <Form.Label>Dosaggio</Form.Label>
                    <Form.Control
                      type="text"
                      name="dosaggio"
                      value={formData.dosaggio || ""}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="note">
                    <Form.Label>Note</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="note"
                      value={formData.note || ""}
                      onChange={handleChange}
                      maxLength={1000}
                      disabled={loading}
                    />
                    <Form.Text>{(formData.note || "").length}/1000</Form.Text>
                  </Form.Group>

                  <div className="d-flex justify-content-between">
                    <Button
                      variant="secondary"
                      onClick={() => setEditMode(false)}
                      disabled={loading}
                    >
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
                    <strong>Data Inserimento:</strong>{" "} <br/>
                    {new Date(farmaco.dataInserimento).toLocaleDateString("it-IT")}
                  </p>
                <p className="mb-3">
                    <strong>Nome Commerciale:</strong> <br/> {farmaco.nomeCommerciale}
                  </p>
                 <p className="mb-3">
                    <strong>Codice ATC:</strong> <br/> {farmaco.codiceATC}
                  </p>
                  <p className="mb-3">
                    <strong>Forma Farmaceutica:</strong>{" "}<br/>
                    {farmaco.formaFarmaceutica || "-"}
                  </p>
                 <p className="mb-3">
                    <strong>Dosaggio:</strong> <br/>{farmaco.dosaggio || "-"}
                  </p>
                 <p className="mb-3">
                    <strong>Note:</strong><br/> {farmaco.note || "-"}
                  </p>
                  {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                </>
              )}
            </div>
          </Col>
        </Row>
      </Container>

      <ModaleConferma
        show={showConferma}
        onConferma={confermaEliminazione}
        onClose={() => setShowConferma(false)}
        messaggio={`Sei sicuro di voler eliminare il farmaco "${farmaco.nomeCommerciale}"?`}
      />
    </>
  );
};

export default DettaglioPianoTerapeutico;


