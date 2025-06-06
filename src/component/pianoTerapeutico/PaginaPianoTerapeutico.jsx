import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Container, ListGroup, Button, Image } from "react-bootstrap";
import ModalePianoTerapeutico from "../modali/ModalePianoTerapeutico";
import DettaglioPianoTerapeutico from "./DettaglioPianoTerapeutico";

function PaginaPianoTerapeutico() {
  const { pazienteId } = useParams();
  const [farmaci, setFarmaci] = useState([]);
  const [selectedFarmaco, setSelectedFarmaco] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const fetchFarmaci = () => {
    if (!pazienteId) return;
    setLoading(true);

    fetch(`${apiUrl}/farmaci/paziente/${pazienteId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setFarmaci(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFarmaci();
  }, [pazienteId]);

  const handleDeleteSuccess = (deletedId) => {
    setFarmaci((prev) => prev.filter((f) => f.id !== deletedId));
    setSelectedFarmaco(null);
  };

  const handleUpdateSuccess = (updatedFarmaco) => {
    setFarmaci((prev) =>
      prev.map((f) => (f.id === updatedFarmaco.id ? updatedFarmaco : f))
    );
    setSelectedFarmaco(updatedFarmaco);
  };

  if (loading) {
    return (
      <Container className="mt-3 text-center">
        <h4>Piano Terapeutico</h4>
        <div className="text-center">
          <div className="spinner-grow text-success mt-5" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (selectedFarmaco) {
    return (
      <DettaglioPianoTerapeutico
        farmaco={selectedFarmaco}
        onBack={() => setSelectedFarmaco(null)}
        onDeleteSuccess={handleDeleteSuccess}
        onUpdateSuccess={handleUpdateSuccess}
        apiUrl={apiUrl}
        token={token}
      />
    );
  }

  return (
    <Container className="mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Piano Terapeutico</h4>
        <Button variant="success" onClick={() => setShowModal(true)}>
          Nuovo Inserimento
        </Button>
      </div>

      {farmaci.length === 0 ? (
        <Container
          className="text-center d-flex flex-column align-items-center justify-content-center"
          style={{ minHeight: "40vh", marginBottom: 30 }}
        >
          <h4 className="my-3">Nessun piano terapeutico trovato.</h4>
          <Image
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="Nessun farmaco"
            style={{ width: 200, opacity: 0.6 }}
            rounded
          />
        </Container>
      ) : (
        <ListGroup>
          {farmaci.map((farmaco) => (
            <ListGroup.Item
              key={farmaco.id}
              action
              onClick={() => setSelectedFarmaco(farmaco)}
              style={{ cursor: "pointer" }}
            >
              {new Date(farmaco.dataInserimento).toLocaleDateString("it-IT")} - {farmaco.nomeCommerciale}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      <ModalePianoTerapeutico
        show={showModal}
        onHide={() => setShowModal(false)}
        pazienteId={pazienteId}
        onCreated={async (newFarmaco) => {
          try {
            const res = await fetch(`${apiUrl}/farmaci/${newFarmaco.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const farmacoCompleto = await res.json();
            setFarmaci((prev) => [farmacoCompleto, ...prev]);
          } catch {
            setFarmaci((prev) => [newFarmaco, ...prev]);
          }
          setShowModal(false);
        }}
      />
    </Container>
  );
}

export default PaginaPianoTerapeutico;








