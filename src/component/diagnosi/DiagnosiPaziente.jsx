import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Container, ListGroup, Button, Image } from "react-bootstrap";
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
    fetchDiagnosi();
  }, [pazienteId]);

  const handleUpdateDiagnosi = (updatedDiagnosi) => {
    setDiagnosi((prev) =>
      prev.map((d) => (d.id === updatedDiagnosi.id ? updatedDiagnosi : d))
    );
    setSelectedDiagnosi(updatedDiagnosi);
  };

  const handleDeleteDiagnosi = () => {
    fetchDiagnosi();
    setSelectedDiagnosi(null);
  };

  if (selectedDiagnosi) {
    return (
      <Container className="mt-3">
        <DettaglioDiagnosi
          diagnosi={selectedDiagnosi}
          onBack={() => setSelectedDiagnosi(null)}
          onDeleteSuccess={handleDeleteDiagnosi}
          onUpdateSuccess={handleUpdateDiagnosi}
        />
      </Container>
    );
  }

  return (
    <Container className="mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Diagnosi</h4>
        <Button variant="success" onClick={() => setShowModal(true)}>
          Nuova Diagnosi
        </Button>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-grow text-success mt-5" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : diagnosi.length === 0 ? (
        <Container
          className="text-center d-flex flex-column align-items-center justify-content-center"
          style={{ minHeight: "40vh", marginBottom: 30 }}
        >
          <h4 className="my-3">Nessuna diagnosi trovata.</h4>
          <Image
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="Risorsa non trovata"
            style={{ width: 200, opacity: 0.6 }}
            rounded
          />
        </Container>
      ) : (
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
      )}

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




