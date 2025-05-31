import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Container, Spinner, Alert, ListGroup, Button, Image } from "react-bootstrap";

const AppuntamentiPaziente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appuntamenti, setAppuntamenti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState(null);
  const [pazienteInfo, setPazienteInfo] = useState({ nome: "", cognome: "" });
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${apiUrl}/appuntamenti/paziente/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
      .then((data) => {
        setAppuntamenti(data);
        setLoading(false);
      })
      .catch((err) => {
        setErrore(err);
        setLoading(false);
      });

    fetch(`${apiUrl}/pazienti/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
      .then((data) => {
        setPazienteInfo({ nome: data.nome, cognome: data.cognome });
      })
      .catch(() => setPazienteInfo({ nome: "", cognome: "" }));
  }, [id]);

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = date.toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${formattedDate} - ${formattedTime}`;
  };

  if (loading) return <Spinner animation="border" />;
  if (errore) return <Alert variant="danger">Errore: {errore}</Alert>;

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between">
        <h3>Appuntamenti del Paziente</h3>
        <Button
          variant="success"
          className="mb-3"
          onClick={() =>
            navigate("/appuntamenti", {
              state: {
                paziente: { id, nome: pazienteInfo.nome, cognome: pazienteInfo.cognome },
              },
            })
          }
        >
          Aggiungi Appuntamento
        </Button>
      </div>

      {appuntamenti.length === 0 ? (
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ minHeight: "50vh" }}
        >
          <h4 className="my-5">Nessun appuntamento trovato.</h4>
          <Image
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="Nessun appuntamento"
            style={{ width: 150, marginBottom: 30, opacity: 0.6 }}
            rounded
          />
          
        </div>
      ) : (
        <ListGroup>
          {appuntamenti.map((app) => (
            <ListGroup.Item key={app.id} className="d-flex justify-content-between">
              <span>{formatDateTime(app.dataOraAppuntamento)}</span>
              <span>{app.motivoRichiesta}</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
};

export default AppuntamentiPaziente;







