import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Container, Spinner, Alert, ListGroup } from "react-bootstrap";

const AppuntamentiPaziente = () => {
  const { id } = useParams();
  const [appuntamenti, setAppuntamenti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8080/appuntamenti/paziente/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
      <h3>Appuntamenti del Paziente</h3>
      <ListGroup>
        {appuntamenti.map((app) => (
          <ListGroup.Item key={app.id} className="d-flex justify-content-between">
           <span>{formatDateTime(app.dataOraAppuntamento)}</span>
           <span>{app.motivoRichiesta}</span>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default AppuntamentiPaziente;

