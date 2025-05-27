import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Container, ListGroup, Spinner, Button } from "react-bootstrap";
import ModaleNuovaDiagnosi from "../modali/ModaleNuovaDiagnosi";
import DettaglioDiagnosi from "./DettaglioDiagnosi";

function DiagnosiPaziente() {
  const { pazienteId } = useParams();
  const [diagnosi, setDiagnosi] = useState([]);
  const [selectedDiagnosi, setSelectedDiagnosi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchDiagnosi = () => {
    if (!pazienteId) return;

    setLoading(true);
    fetch(`${apiUrl}/diagnosi/paziente/${pazienteId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setDiagnosi(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    console.log("DiagnosiPaziente caricato con pazienteId:", pazienteId);
    fetchDiagnosi();
  }, [pazienteId]);

  if (loading) {
    return (
      <Container className="mt-3 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (selectedDiagnosi) {
    return (
      <Container className="mt-3">
        <Button
          variant="primary"
          onClick={() => setSelectedDiagnosi(null)}
          className="mb-3"
        >
          ← Torna alla lista
        </Button>
        <DettaglioDiagnosi
          diagnosi={selectedDiagnosi}
          onBack={() => setSelectedDiagnosi(null)}
        />
      </Container>
    );
  }

  return (
    <Container className="mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Diagnosi del paziente</h4>
        <Button onClick={() => setShowModal(true)}>Nuova Diagnosi</Button>
      </div>

      {diagnosi.length === 0 && <p>Nessuna diagnosi trovata.</p>}

      <ListGroup>
        {diagnosi.map((d) => (
          <ListGroup.Item
            key={d.id}
            action
            onClick={() => setSelectedDiagnosi(d)}
            style={{ cursor: "pointer" }}
          >
            {new Date(d.dataDiagnosi).toLocaleDateString("it-IT")} – {d.codiceCIM10}
          </ListGroup.Item>
        ))}
      </ListGroup>

      <ModaleNuovaDiagnosi
        show={showModal}
        onHide={() => setShowModal(false)}
        pazienteId={pazienteId}
        onCreated={async (newDiagnosi) => {
          try {
            const res = await fetch(`${apiUrl}/diagnosi/${newDiagnosi.id}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const diagnosiCompleta = await res.json();
            setDiagnosi((prev) => [diagnosiCompleta, ...prev]);
          } catch {
            setDiagnosi((prev) => [newDiagnosi, ...prev]);
          }
          setShowModal(false);
        }}
      />
    </Container>
  );
}

export default DiagnosiPaziente;
