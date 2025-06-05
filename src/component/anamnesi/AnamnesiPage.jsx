import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Container, ListGroup, Spinner, Button, Image } from "react-bootstrap";
import ModaleNuovaAnamnesi from "../modali/ModaleNuovaAnamnesi";
import AnamnesiDettaglio from "./AnamnesiDettaglio";

function AnamnesiPaziente() {
  const { pazienteId } = useParams();
  const [anamnesi, setAnamnesi] = useState([]);
  const [selectedAnamnesi, setSelectedAnamnesi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;


  const fetchAnamnesi = () => {
    if (!pazienteId) return;

    setLoading(true);
    fetch(`${apiUrl}/anamnesi/paziente/${pazienteId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore nel recupero anamnesi");
        return res.json();
      })
      .then((data) => setAnamnesi(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnamnesi();
  }, [pazienteId]);


  const createAnamnesi = async (newAnamnesi) => {
    try {
      const res = await fetch(`${apiUrl}/anamnesi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newAnamnesi),
      });
      if (!res.ok) throw new Error("Errore nella creazione anamnesi");
      const created = await res.json();
      setAnamnesi((prev) => [created, ...prev]);
      setShowModal(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const updateAnamnesi = (updatedAnamnesi) => {
    setAnamnesi((prev) =>
      prev.map((a) => (a.id === updatedAnamnesi.id ? updatedAnamnesi : a))
    );
    setSelectedAnamnesi(updatedAnamnesi);
  };
  const deleteAnamnesi = (id) => {
    setAnamnesi((prev) => prev.filter((a) => a.id !== id));
    setSelectedAnamnesi(null);
  };

  if (loading) {
    return (
      <Container className="mt-3 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (selectedAnamnesi) {
    return (
      <AnamnesiDettaglio
        anamnesi={selectedAnamnesi}
        onBack={() => setSelectedAnamnesi(null)}
        onUpdate={updateAnamnesi}
        onDelete={deleteAnamnesi}
      />
    );
  }

  return (
    <Container className="mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Anamnesi</h4>
        <Button
          variant="success"
          onClick={() => {
            setSelectedAnamnesi(null);
            setShowModal(true);
          }}
        >
          Nuova Anamnesi
        </Button>
      </div>

      {anamnesi.length === 0 ? (
        <Container
          className="text-center d-flex flex-column align-items-center justify-content-center"
          style={{ minHeight: "40vh", marginBottom: 30 }}
        >
          <h4 className="my-3">Nessuna anamnesi trovata.</h4>
          <Image
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="Risorsa non trovata"
            style={{ width: 200, opacity: 0.6 }}
            rounded
          />
        </Container>
      ) : (
        <ListGroup>
          {anamnesi.map((a) => (
            <ListGroup.Item
              key={a.id}
              action
              onClick={() => setSelectedAnamnesi(a)}
              style={{ cursor: "pointer" }}
            >
              {a.dataInserimentoAnamnesi
                ? new Date(a.dataInserimentoAnamnesi).toLocaleDateString("it-IT")
                : "-"}{" "}
              – {a.descrizioneAnamnesi || "Descrizione non disponibile"}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {showModal && (
        <ModaleNuovaAnamnesi
          show={showModal}
          onHide={() => setShowModal(false)}
          pazienteId={pazienteId}
          initialData={null}
          onCreated={(data) => createAnamnesi(data)}
        />
      )}
    </Container>
  );
}

export default AnamnesiPaziente;


