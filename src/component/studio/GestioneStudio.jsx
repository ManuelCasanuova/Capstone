import React, { useEffect, useState, useRef } from "react";
import { Button, Col, Form, Row, Spinner, Alert, Card } from "react-bootstrap";
import { useAuth } from "../access/AuthContext";

const GIORNI_SETTIMANA = [
  { key: "MONDAY", nome: "Lunedì" },
  { key: "TUESDAY", nome: "Martedì" },
  { key: "WEDNESDAY", nome: "Mercoledì" },
  { key: "THURSDAY", nome: "Giovedì" },
  { key: "FRIDAY", nome: "Venerdì" },
];

const isClosed = (inizio, fine) => !inizio || !fine;

const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const [hh, mm] = timeStr.split(":");
  return `${hh.padStart(2, "0")}:${mm.padStart(2, "0")}`;
};

const GestioneStudio = () => {
  const { user, token } = useAuth();
  const isPaziente = user?.roles?.includes("ROLE_PAZIENTE");
  const isMedico = !isPaziente;

  const [studio, setStudio] = useState(null);
  const [giorni, setGiorni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [alert, setAlert] = useState({ show: false, variant: "", message: "" });

  const timerRef = useRef(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const showAlert = (variant, message) => {
    setAlert({ show: true, variant, message });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setAlert({ show: false, variant: "", message: "" });
    }, 3000);
  };

  const handleCloseAlert = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setAlert({ show: false, variant: "", message: "" });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resStudio, resOrari] = await Promise.all([
          fetch(`${apiUrl}/studio`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${apiUrl}/studio/orari`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (!resStudio.ok) throw new Error("Errore nel caricamento dello studio");
        if (!resOrari.ok) throw new Error("Errore nel caricamento degli orari");

        const studioData = await resStudio.json();
        let orari = await resOrari.json();
        orari = orari.map(g =>
          g.giorno === "SATURDAY" || g.giorno === "SUNDAY" ? { ...g, chiuso: true } : g
        );

        setStudio(studioData);
        setGiorni(orari);
      } catch (err) {
        showAlert("danger", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => timerRef.current && clearTimeout(timerRef.current);
  }, [apiUrl, token]);

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
      nuovi[index].inizioMattina = checked ? null : "08:00";
      nuovi[index].fineMattina = checked ? null : "13:00";
    } else if (campo === "chiusuraPomeriggio") {
      nuovi[index].inizioPomeriggio = checked ? null : "14:00";
      nuovi[index].finePomeriggio = checked ? null : "18:00";
    }
    setGiorni(nuovi);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res1 = await fetch(`${apiUrl}/studio`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(studio),
      });
      if (!res1.ok) throw new Error("Errore salvataggio studio");

      const res2 = await fetch(`${apiUrl}/studio/orari`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(giorni),
      });
      if (!res2.ok) throw new Error("Errore salvataggio orari");

      showAlert("success", "Modifiche salvate con successo!");
      setEditMode(false);
    } catch (err) {
      showAlert("danger", err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner animation="border" className="mt-4" />;
  if (!studio) return <Alert variant="danger">Studio non trovato</Alert>;

  return (
    <>
      {alert.show && (
        <Alert variant={alert.variant} onClose={handleCloseAlert} dismissible>
          {alert.message}
        </Alert>
      )}

      <Card className="mb-3 p-3 shadow-sm">
        <h4 className="mb-4">Orari di apertura studio</h4>
        <h5>{studio.nome}</h5>
        <p><strong>Indirizzo:</strong> {studio.indirizzo}</p>

        {giorni
          .filter(g => g.giorno !== "SATURDAY" && g.giorno !== "SUNDAY")
          .map((g, i) => {
            const label = GIORNI_SETTIMANA.find(d => d.key === g.giorno)?.nome || g.giorno;

            return (
              <div key={g.giorno} className="mb-3 border rounded p-3 bg-light">
                <Row className="align-items-center mb-2">
                  <Col md={3}>
                    <strong>{label}</strong>
                  </Col>

                  {isMedico && editMode ? (
                    <Col md={9} className="d-flex flex-wrap gap-3 justify-content-center text-center">
                      <Form.Check
                        label="Giornaliera"
                        checked={g.chiuso}
                        onChange={(e) => handleCheckboxChange(i, "chiuso", e.target.checked)}
                      />
                      <Form.Check
                        label="Mattina"
                        checked={!g.inizioMattina}
                        disabled={g.chiuso}
                        onChange={(e) => handleCheckboxChange(i, "chiusuraMattina", e.target.checked)}
                      />
                      <Form.Check
                        label="Pomeriggio"
                        checked={!g.inizioPomeriggio}
                        disabled={g.chiuso}
                        onChange={(e) => handleCheckboxChange(i, "chiusuraPomeriggio", e.target.checked)}
                      />
                    </Col>
                  ) : (
                    <Col md={9}>
                      {g.chiuso ? (
                        <p className="text-danger">Chiusura Giornaliera</p>
                      ) : (
                        <>
                          <p><strong>Mattina:</strong> {!isClosed(g.inizioMattina, g.fineMattina)
                            ? `${formatTime(g.inizioMattina)} - ${formatTime(g.fineMattina)}`
                            : <span className="text-danger">Chiuso</span>}</p>
                          <p><strong>Pomeriggio:</strong> {!isClosed(g.inizioPomeriggio, g.finePomeriggio)
                            ? `${formatTime(g.inizioPomeriggio)} - ${formatTime(g.finePomeriggio)}`
                            : <span className="text-danger">Chiuso</span>}</p>
                        </>
                      )}
                    </Col>
                  )}
                </Row>

                {isMedico && editMode && !g.chiuso && (
                  <Row className="justify-content-center">
                    <Col xs={6} md={3} className="d-flex flex-column align-items-center mb-3">
                      <Form.Label>Apertura M.</Form.Label>
                      <Form.Control
                        type="time"
                        value={g.inizioMattina || ""}
                        disabled={!g.inizioMattina}
                        onChange={(e) => handleOrarioChange(i, "inizioMattina", e.target.value)}
                      />
                    </Col>
                    <Col xs={6} md={3} className="d-flex flex-column align-items-center mb-3">
                      <Form.Label>Chiusura M.</Form.Label>
                      <Form.Control
                        type="time"
                        value={g.fineMattina || ""}
                        disabled={!g.inizioMattina}
                        onChange={(e) => handleOrarioChange(i, "fineMattina", e.target.value)}
                      />
                    </Col>
                    <Col xs={6} md={3} className="d-flex flex-column align-items-center mb-3">
                      <Form.Label>Apertura P.</Form.Label>
                      <Form.Control
                        type="time"
                        value={g.inizioPomeriggio || ""}
                        disabled={!g.inizioPomeriggio}
                        onChange={(e) => handleOrarioChange(i, "inizioPomeriggio", e.target.value)}
                      />
                    </Col>
                    <Col xs={6} md={3} className="d-flex flex-column align-items-center mb-3">
                      <Form.Label>Chiusura P.</Form.Label>
                      <Form.Control
                        type="time"
                        value={g.finePomeriggio || ""}
                        disabled={!g.inizioPomeriggio}
                        onChange={(e) => handleOrarioChange(i, "finePomeriggio", e.target.value)}
                      />
                    </Col>
                  </Row>
                )}
              </div>
            );
          })}

        {isMedico && !editMode && (
          <Button variant="primary" onClick={() => setEditMode(true)}>Modifica Orari</Button>
        )}
        {isMedico && editMode && (
          <Button variant="primary" disabled={saving} onClick={handleSubmit}>
            {saving ? "Salvataggio..." : "Salva modifiche"}
          </Button>
        )}
      </Card>
    </>
  );
};

export default GestioneStudio;




