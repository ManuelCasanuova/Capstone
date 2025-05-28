import React, { useEffect, useState, useRef } from "react";
import { Button, Col, Form, Row, Spinner, Alert, Card, Container } from "react-bootstrap";
import { useAuth } from "../access/AuthContext";

const GIORNI_SETTIMANA = [
  { key: "MONDAY", nome: "Lunedì" },
  { key: "TUESDAY", nome: "Martedì" },
  { key: "WEDNESDAY", nome: "Mercoledì" },
  { key: "THURSDAY", nome: "Giovedì" },
  { key: "FRIDAY", nome: "Venerdì" },
];

const GestioneStudio = () => {
  const { user, token } = useAuth();
  const isPaziente = user?.roles?.includes("ROLE_PAZIENTE");
  const isMedico = !isPaziente;

  const [studio, setStudio] = useState(null);
  const [giorni, setGiorni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [salvataggioOk, setSalvataggioOk] = useState(false);
  const [errore, setErrore] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const timerRef = useRef(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchOrari = async () => {
    try {
      const res = await fetch(`${apiUrl}/studio/orari`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      let data = await res.json();
      data = data.map(g =>
        g.giorno === "SATURDAY" || g.giorno === "SUNDAY" ? { ...g, chiuso: true } : g
      );
      setGiorni(data);
    } catch {
      setErrore("Errore nel caricamento degli orari");
    }
  };

  const fetchStudioEOrari = async () => {
    try {
      const res = await fetch(`${apiUrl}/studio`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const studioData = await res.json();
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
    return () => timerRef.current && clearTimeout(timerRef.current);
  }, []);

  const isClosed = (inizio, fine) => !inizio || !fine;
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hh, mm] = timeStr.split(":");
    return `${hh.padStart(2, "0")}:${mm.padStart(2, "0")}`;
  };

  const handleStudioChange = (e) => {
    setStudio({ ...studio, [e.target.name]: e.target.value });
  };

  const handleOrarioChange = (index, field, value) => {
    const nuovi = [...giorni];
    nuovi[index][field] = value;
    setGiorni(nuovi);
  };

  const handleCheckboxChange = (index, campo, checked) => {
    const nuovi = [...giorni];
    if (campo === "chiuso") {
      nuovi[index].chiuso = checked;
      if (checked) {
        nuovi[index].inizioMattina = null;
        nuovi[index].fineMattina = null;
        nuovi[index].inizioPomeriggio = null;
        nuovi[index].finePomeriggio = null;
      }
    } else if (campo === "chiusuraMattina") {
      if (checked) {
        nuovi[index].inizioMattina = null;
        nuovi[index].fineMattina = null;
      } else {
        nuovi[index].inizioMattina = "08:00";
        nuovi[index].fineMattina = "13:00";
      }
    } else if (campo === "chiusuraPomeriggio") {
      if (checked) {
        nuovi[index].inizioPomeriggio = null;
        nuovi[index].finePomeriggio = null;
      } else {
        nuovi[index].inizioPomeriggio = "14:00";
        nuovi[index].finePomeriggio = "18:00";
      }
    }
    setGiorni(nuovi);
  };

  const openAlert = () => {
    setShowAlert(true);
    timerRef.current = setTimeout(() => handleCloseAlert(), 2000);
  };

  const handleCloseAlert = () => {
    timerRef.current && clearTimeout(timerRef.current);
    timerRef.current = null;
    setShowAlert(false);
    setSalvataggioOk(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrore(null);
    setSalvataggioOk(false);
    setSaving(true);

    try {
      const res1 = await fetch(`${apiUrl}/studio`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(studio),
      });
      if (!res1.ok) throw new Error();

      const res2 = await fetch(`${apiUrl}/studio/orari`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(giorni),
      });
      if (!res2.ok) throw new Error();

      setSalvataggioOk(true);
      openAlert();
      await fetchOrari();
    } catch {
      setErrore("Errore durante il salvataggio");
      setSalvataggioOk(false);
      openAlert();
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner animation="border" className="mt-4" />;
  if (!studio) return <Alert variant="danger">Studio non trovato</Alert>;

  return (
    <Container>
      {showAlert && (
        <Alert
          variant={salvataggioOk ? "success" : "danger"}
          onClose={handleCloseAlert}
          dismissible
        >
          {salvataggioOk
            ? "Modifiche salvate correttamente!"
            : errore || "Errore durante il salvataggio."}
        </Alert>
      )}

      <h4 className="mb-4">Orari di apertura studio</h4>
      <Card className="mb-3 p-3 shadow-sm">
        <h5>{studio.nome}</h5>
        <p>
          <strong>Indirizzo:</strong> {studio.indirizzo}
        </p>
        <p>
          <strong>Telefono:</strong> {studio.telefono}
        </p>

        {giorni
          .filter((g) => g.giorno !== "SATURDAY" && g.giorno !== "SUNDAY")
          .map((g, i) => {
            const label =
              GIORNI_SETTIMANA.find((day) => day.key === g.giorno)?.nome || g.giorno;
            return (
              <div key={g.giorno} className="mb-3 border rounded p-3 bg-light">
                <Row className="align-items-center mb-2">
                  <Col md={2}>
                    <strong>{label}</strong>
                  </Col>

                  {/* Solo se medico: checkbox e input editabili */}
                  {isMedico ? (
                    <>
                      <Col md={3}>
                        <Form.Check
                          label="Chiusura Giornaliera"
                          checked={g.chiuso}
                          onChange={(e) =>
                            handleCheckboxChange(i, "chiuso", e.target.checked)
                          }
                        />
                      </Col>
                      <Col md={3}>
                        <Form.Check
                          label="Chiusura Mattina"
                          checked={!g.inizioMattina}
                          disabled={g.chiuso}
                          onChange={(e) =>
                            handleCheckboxChange(i, "chiusuraMattina", e.target.checked)
                          }
                        />
                      </Col>
                      <Col md={3}>
                        <Form.Check
                          label="Chiusura Pomeriggio"
                          checked={!g.inizioPomeriggio}
                          disabled={g.chiuso}
                          onChange={(e) =>
                            handleCheckboxChange(i, "chiusuraPomeriggio", e.target.checked)
                          }
                        />
                      </Col>
                    </>
                  ) : null}
                </Row>

                {/* Se medico: input orari abilitati, altrimenti solo testo */}
                {isMedico ? (
                  !g.chiuso && (
                    <Row>
                      <Col md={3}>
                        <Form.Label>Inizio mattina</Form.Label>
                        <Form.Control
                          type="time"
                          value={g.inizioMattina || ""}
                          disabled={!g.inizioMattina}
                          onChange={(e) =>
                            handleOrarioChange(i, "inizioMattina", e.target.value)
                          }
                        />
                      </Col>
                      <Col md={3}>
                        <Form.Label>Fine mattina</Form.Label>
                        <Form.Control
                          type="time"
                          value={g.fineMattina || ""}
                          disabled={!g.inizioMattina}
                          onChange={(e) =>
                            handleOrarioChange(i, "fineMattina", e.target.value)
                          }
                        />
                      </Col>
                      <Col md={3}>
                        <Form.Label>Inizio pomeriggio</Form.Label>
                        <Form.Control
                          type="time"
                          value={g.inizioPomeriggio || ""}
                          disabled={!g.inizioPomeriggio}
                          onChange={(e) =>
                            handleOrarioChange(i, "inizioPomeriggio", e.target.value)
                          }
                        />
                      </Col>
                      <Col md={3}>
                        <Form.Label>Fine pomeriggio</Form.Label>
                        <Form.Control
                          type="time"
                          value={g.finePomeriggio || ""}
                          disabled={!g.inizioPomeriggio}
                          onChange={(e) =>
                            handleOrarioChange(i, "finePomeriggio", e.target.value)
                          }
                        />
                      </Col>
                    </Row>
                  )
                ) : (
                  <>
                    {/* Vista paziente: testo orari */}
                    {g.chiuso ? (
                      <p className="text-danger">Chiusura Giornaliera</p>
                    ) : (
                      <>
                        <p>
                          <strong>Mattina:</strong>{" "}
                          {!isClosed(g.inizioMattina, g.fineMattina)
                            ? `${formatTime(g.inizioMattina)} - ${formatTime(
                                g.fineMattina
                              )}`
                            : "Chiuso"}
                        </p>
                        <p>
                          <strong>Pomeriggio:</strong>{" "}
                          {!isClosed(g.inizioPomeriggio, g.finePomeriggio)
                            ? `${formatTime(g.inizioPomeriggio)} - ${formatTime(
                                g.finePomeriggio
                              )}`
                            : "Chiuso"}
                        </p>
                      </>
                    )}
                  </>
                )}
              </div>
            );
          })}
      </Card>

      {/* Mostro bottone salva solo se medico */}
      {isMedico && (
        <Button
          type="button"
          variant="primary"
          disabled={saving}
          onClick={handleSubmit}
        >
          {saving ? "Salvataggio..." : "Salva modifiche"}
        </Button>
      )}
    </Container>
  );
};

export default GestioneStudio;

















