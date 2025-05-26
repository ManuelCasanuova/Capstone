import React, { useEffect, useState, useRef } from "react";
import { Button, Col, Form, Row, Spinner, Alert, Card, Container } from "react-bootstrap";
import { useSelector } from "react-redux";

const GIORNI_SETTIMANA = [
  { key: "MONDAY", nome: "Lunedì" },
  { key: "TUESDAY", nome: "Martedì" },
  { key: "WEDNESDAY", nome: "Mercoledì" },
  { key: "THURSDAY", nome: "Giovedì" },
  { key: "FRIDAY", nome: "Venerdì" },
];

const GestioneStudio = () => {
  const user = useSelector(state => state.user.user);
  const isPaziente = user?.roles?.includes("ROLE_PAZIENTE");

  const [studio, setStudio] = useState(null);
  const [giorni, setGiorni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [salvataggioOk, setSalvataggioOk] = useState(false);
  const [errore, setErrore] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const timerRef = useRef(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const fetchOrari = async () => {
    try {
      const resOrari = await fetch(`${apiUrl}/studio/orari`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resOrari.ok) throw new Error();
      let giorniData = await resOrari.json();
      giorniData = giorniData.map((g) =>
        g.giorno === "SATURDAY" || g.giorno === "SUNDAY" ? { ...g, chiuso: true } : g
      );
      setGiorni(giorniData);
    } catch {
      setErrore("Errore nel caricamento degli orari");
    }
  };

  const fetchStudioEOrari = async () => {
    try {
      const resStudio = await fetch(`${apiUrl}/studio`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resStudio.ok) throw new Error();
      const studioData = await resStudio.json();
      setStudio(studioData);

      await fetchOrari();
    } catch {
      setErrore("Errore nel caricamento dei dati");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudioEOrari();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [apiUrl, token]);

  const isClosed = (inizio, fine) => {
    return !inizio || !fine;
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hh, mm] = timeStr.split(":");
    return `${hh.padStart(2, "0")}:${mm.padStart(2, "0")}`;
  };

  const handleStudioChange = (e) => {
    setStudio({ ...studio, [e.target.name]: e.target.value });
  };

  const handleOrarioChange = (index, field, value) => {
    const nuoviGiorni = [...giorni];
    nuoviGiorni[index][field] = value;
    setGiorni(nuoviGiorni);
  };

  const handleCheckboxChange = (index, campo, checked) => {
    const nuoviGiorni = [...giorni];

    if (campo === "chiuso") {
      nuoviGiorni[index].chiuso = checked;
      if (checked) {
        nuoviGiorni[index].inizioMattina = null;
        nuoviGiorni[index].fineMattina = null;
        nuoviGiorni[index].inizioPomeriggio = null;
        nuoviGiorni[index].finePomeriggio = null;
      }
    } else if (campo === "chiusuraMattina") {
      if (checked) {
        nuoviGiorni[index].inizioMattina = null;
        nuoviGiorni[index].fineMattina = null;
      } else {
        nuoviGiorni[index].inizioMattina = "08:00";
        nuoviGiorni[index].fineMattina = "13:00";
      }
    } else if (campo === "chiusuraPomeriggio") {
      if (checked) {
        nuoviGiorni[index].inizioPomeriggio = null;
        nuoviGiorni[index].finePomeriggio = null;
      } else {
        nuoviGiorni[index].inizioPomeriggio = "14:00";
        nuoviGiorni[index].finePomeriggio = "18:00";
      }
    }

    setGiorni(nuoviGiorni);
  };

  const openAlert = () => {
    setShowAlert(true);
    timerRef.current = setTimeout(() => {
      handleCloseAlert();
    }, 2000);
  };

  const handleCloseAlert = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setShowAlert(false);
    setSalvataggioOk(false);
    setEditMode(false); // torna alla vista normale dopo alert
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrore(null);
    setSalvataggioOk(false);
    setSaving(true);

    try {
      const resStudio = await fetch(`${apiUrl}/studio`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(studio),
      });
      if (!(resStudio.status >= 200 && resStudio.status < 300)) throw new Error();

      const resOrari = await fetch(`${apiUrl}/studio/orari`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(giorni),
      });
      if (!(resOrari.status >= 200 && resOrari.status < 300)) throw new Error();

      setSalvataggioOk(true);
      openAlert();

      await fetchOrari();
    } catch (error) {
      console.error("Errore nel salvataggio:", error);
      setErrore("Errore durante il salvataggio");
      setSalvataggioOk(false);
      openAlert();
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner animation="border" className="mt-4" />;

  if (!studio)
    return (
      <Alert variant="danger" className="mt-4">
        Studio non trovato
      </Alert>
    );

  if (isPaziente) {
    return (
      <Container >
        <h4 className="mb-4">Orari di apertura studio</h4>
        <Card className="mb-3 p-3 shadow-sm">
          <h5>{studio.nome}</h5>
          <p className="mb-1">
            <strong>Indirizzo:</strong> {studio.indirizzo}
          </p>
          <p className="mb-3">
            <strong>Telefono:</strong> {studio.telefono}
          </p>
          {giorni
            .filter((g) => g.giorno !== "SATURDAY" && g.giorno !== "SUNDAY")
            .map((giorno) => {
              const label = GIORNI_SETTIMANA.find((g) => g.key === giorno.giorno)?.nome || giorno.giorno;
              const mattinaChiusa = isClosed(giorno.inizioMattina, giorno.fineMattina);
              const pomeriggioChiuso = isClosed(giorno.inizioPomeriggio, giorno.finePomeriggio);

              return (
                <Card key={giorno.giorno} className="mb-2 p-3">
                  <Card.Title className="mb-2">{label}</Card.Title>
                  {giorno.chiuso ? (
                    <Card.Text className="text-danger">Chiusura Giornaliera</Card.Text>
                  ) : (
                    <>
                      <Card.Text>
                        <strong>Mattina:</strong>{" "}
                        {!mattinaChiusa
                          ? `${formatTime(giorno.inizioMattina)} - ${formatTime(giorno.fineMattina)}`
                          : <span className="text-danger">Chiuso</span>}
                      </Card.Text>
                      <Card.Text>
                        <strong>Pomeriggio:</strong>{" "}
                        {!pomeriggioChiuso
                          ? `${formatTime(giorno.inizioPomeriggio)} - ${formatTime(giorno.finePomeriggio)}`
                          : <span className="text-danger">Chiuso</span>}
                      </Card.Text>
                    </>
                  )}
                </Card>
              );
            })}
        </Card>
      </Container>
    );
  }

  if (!editMode)
    return (
      <Container>
        <h4 className="mb-4">Orari di apertura studio</h4>
        <Card className="mb-3 p-3 shadow-sm">
          <h5>{studio.nome}</h5>
          <p className="mb-1">
            <strong>Indirizzo:</strong> {studio.indirizzo}
          </p>
          <p className="mb-3">
            <strong>Telefono:</strong> {studio.telefono}
          </p>
          {giorni
            .filter((g) => g.giorno !== "SATURDAY" && g.giorno !== "SUNDAY")
            .map((giorno) => {
              const label = GIORNI_SETTIMANA.find((g) => g.key === giorno.giorno)?.nome || giorno.giorno;
              const mattinaChiusa = isClosed(giorno.inizioMattina, giorno.fineMattina);
              const pomeriggioChiuso = isClosed(giorno.inizioPomeriggio, giorno.finePomeriggio);

              return (
                <Card key={giorno.giorno} className="mb-2 p-3">
                  <Card.Title className="mb-2">{label}</Card.Title>
                  {giorno.chiuso ? (
                    <Card.Text className="text-danger">Chiusura Giornaliera</Card.Text>
                  ) : (
                    <>
                      <Card.Text>
                        <strong>Mattina:</strong>{" "}
                        {!mattinaChiusa
                          ? `${formatTime(giorno.inizioMattina)} - ${formatTime(giorno.fineMattina)}`
                          : <span className="text-danger">Chiuso</span>}
                      </Card.Text>
                      <Card.Text>
                        <strong>Pomeriggio:</strong>{" "}
                        {!pomeriggioChiuso
                          ? `${formatTime(giorno.inizioPomeriggio)} - ${formatTime(giorno.finePomeriggio)}`
                          : <span className="text-danger">Chiuso</span>}
                      </Card.Text>
                    </>
                  )}
                </Card>
              );
            })}
          <Button variant="primary" onClick={() => setEditMode(true)}>
            Modifica Orari
          </Button>
        </Card>
      </Container>
    );

  return (
    <>
      {showAlert ? (
        <Alert
          variant={salvataggioOk ? "success" : "danger"}
          onClose={handleCloseAlert}
          dismissible
          className="mt-4 mx-auto"
          style={{ maxWidth: "400px" }}
        >
          {salvataggioOk ? "Modifiche salvate correttamente!" : errore || "Errore durante il salvataggio."}
        </Alert>
      ) : (
        <Container>
          <Form onSubmit={handleSubmit}>
            <h4>Gestione Studio Medico</h4>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nome studio</Form.Label>
                  <Form.Control
                    name="nome"
                    value={studio.nome || ""}
                    onChange={handleStudioChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Telefono</Form.Label>
                  <Form.Control
                    name="telefono"
                    value={studio.telefono || ""}
                    onChange={handleStudioChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Indirizzo</Form.Label>
              <Form.Control
                name="indirizzo"
                value={studio.indirizzo || ""}
                onChange={handleStudioChange}
                required
              />
            </Form.Group>

            <h5 className="mt-4">Orari di apertura settimanali</h5>

            {giorni
              .filter((g) => g.giorno !== "SATURDAY" && g.giorno !== "SUNDAY")
              .map((giorno, index) => {
                const label = GIORNI_SETTIMANA.find((g) => g.key === giorno.giorno)?.nome || giorno.giorno;

                return (
                  <div key={giorno.giorno} className="mb-3 border rounded p-3 bg-light">
                    <Row className="align-items-center mb-2">
                      <Col md={2}>
                        <strong>{label}</strong>
                      </Col>
                      <Col md={3}>
                        <Form.Check
                          type="checkbox"
                          label="Chiusura Giornaliera"
                          checked={giorno.chiuso}
                          onChange={(e) => handleCheckboxChange(index, "chiuso", e.target.checked)}
                        />
                      </Col>
                      <Col md={3}>
                        <Form.Check
                          type="checkbox"
                          label="Chiusura Mattina"
                          checked={!giorno.inizioMattina}
                          onChange={(e) => handleCheckboxChange(index, "chiusuraMattina", e.target.checked)}
                          disabled={giorno.chiuso}
                        />
                      </Col>
                      <Col md={3}>
                        <Form.Check
                          type="checkbox"
                          label="Chiusura Pomeriggio"
                          checked={!giorno.inizioPomeriggio}
                          onChange={(e) => handleCheckboxChange(index, "chiusuraPomeriggio", e.target.checked)}
                          disabled={giorno.chiuso}
                        />
                      </Col>
                    </Row>

                    {!giorno.chiuso && (
                      <>
                        <Row>
                          <Col md={3}>
                            <Form.Label>Inizio mattina</Form.Label>
                            <Form.Control
                              type="time"
                              value={giorno.inizioMattina || ""}
                              disabled={!giorno.inizioMattina}
                              onChange={(e) => handleOrarioChange(index, "inizioMattina", e.target.value)}
                            />
                          </Col>
                          <Col md={3}>
                            <Form.Label>Fine mattina</Form.Label>
                            <Form.Control
                              type="time"
                              value={giorno.fineMattina || ""}
                              disabled={!giorno.inizioMattina}
                              onChange={(e) => handleOrarioChange(index, "fineMattina", e.target.value)}
                            />
                          </Col>
                          <Col md={3}>
                            <Form.Label>Inizio pomeriggio</Form.Label>
                            <Form.Control
                              type="time"
                              value={giorno.inizioPomeriggio || ""}
                              disabled={!giorno.inizioPomeriggio}
                              onChange={(e) => handleOrarioChange(index, "inizioPomeriggio", e.target.value)}
                            />
                          </Col>
                          <Col md={3}>
                            <Form.Label>Fine pomeriggio</Form.Label>
                            <Form.Control
                              type="time"
                              value={giorno.finePomeriggio || ""}
                              disabled={!giorno.inizioPomeriggio}
                              onChange={(e) => handleOrarioChange(index, "finePomeriggio", e.target.value)}
                            />
                          </Col>
                        </Row>
                      </>
                    )}
                  </div>
                );
              })}

            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? "Salvataggio..." : "Salva modifiche"}
            </Button>
          </Form>
        </Container>
      )}
    </>
  );
};

export default GestioneStudio;















