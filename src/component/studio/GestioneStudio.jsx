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
      setAlert(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleCloseAlert = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setAlert({ show: false, variant: "", message: "" });
  };

  useEffect(() => {
    const fetchOrari = async () => {
      try {
        const res = await fetch(`${apiUrl}/studio/orari`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Errore nel caricamento degli orari");
        let data = await res.json();
        data = data.map((g) =>
          g.giorno === "SATURDAY" || g.giorno === "SUNDAY" ? { ...g, chiuso: true } : g
        );
        setGiorni(data);
      } catch (error) {
        showAlert("danger", error.message);
      }
    };

    const fetchStudioEOrari = async () => {
      try {
        const res = await fetch(`${apiUrl}/studio`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Errore nel caricamento dello studio");
        const studioData = await res.json();
        setStudio(studioData);
        await fetchOrari();
      } catch (error) {
        showAlert("danger", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudioEOrari();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
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

  const safeJson = async (response) => {
    if (response.status === 204) return null;
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      if (!res1.ok) throw new Error("Errore durante il salvataggio dello studio");
      await safeJson(res1);

      const res2 = await fetch(`${apiUrl}/studio/orari`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(giorni),
      });
      if (!res2.ok) throw new Error("Errore durante il salvataggio degli orari");
      await safeJson(res2);

      showAlert("success", "Modifiche salvate correttamente!");
      setEditMode(false);

      // Ricarica i dati aggiornati
      const resStudio = await fetch(`${apiUrl}/studio`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedStudio = await resStudio.json();
      setStudio(updatedStudio);

      const resOrari = await fetch(`${apiUrl}/studio/orari`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let updatedOrari = await resOrari.json();
      updatedOrari = updatedOrari.map((g) =>
        g.giorno === "SATURDAY" || g.giorno === "SUNDAY" ? { ...g, chiuso: true } : g
      );
      setGiorni(updatedOrari);
    } catch (error) {
      showAlert("danger", error.message || "Errore durante il salvataggio");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner animation="border" className="mt-4" />;
  if (!studio) return <Alert variant="danger">Studio non trovato</Alert>;

  return (
    <Container>
      {alert.show && (
        <Alert variant={alert.variant} onClose={handleCloseAlert} dismissible>
          {alert.message}
        </Alert>
      )}

      <Card className="mb-3 p-3 shadow-sm">
        <h4 className="mb-4">Orari di apertura studio</h4>
        <h5>{studio.nome}</h5>
        <p className="mb-2">
          <strong>Indirizzo:</strong> {studio.indirizzo}
        </p>

        {giorni
          .filter((g) => g.giorno !== "SATURDAY" && g.giorno !== "SUNDAY")
          .map((g, i) => {
            const label =
              GIORNI_SETTIMANA.find((day) => day.key === g.giorno)?.nome || g.giorno;
            return (
              <div key={g.giorno} className="mb-3 border rounded p-3 bg-light">
                <Row
                  className={`align-items-center mb-2 justify-content-between ${
                    isMedico && editMode ? "text-center" : ""
                  }`}
                >
                  <Col md={3} className={isMedico && editMode ? "mx-auto" : ""}>
                    <strong>{label}</strong>
                  </Col>

                  {isMedico && editMode ? (
                    <Col
                      md={9}
                      className="d-flex align-items-center gap-3 justify-content-center"
                    >
                      <strong className="me-3">Chiusura:</strong>

                      <Form.Check
                        label="Giornaliera"
                        checked={g.chiuso}
                        onChange={(e) =>
                          handleCheckboxChange(i, "chiuso", e.target.checked)
                        }
                      />
                      <Form.Check
                        label="Mattina"
                        checked={!g.inizioMattina}
                        disabled={g.chiuso}
                        onChange={(e) =>
                          handleCheckboxChange(i, "chiusuraMattina", e.target.checked)
                        }
                      />
                      <Form.Check
                        label="Pomeriggio"
                        checked={!g.inizioPomeriggio}
                        disabled={g.chiuso}
                        onChange={(e) =>
                          handleCheckboxChange(i, "chiusuraPomeriggio", e.target.checked)
                        }
                      />
                    </Col>
                  ) : (
                    <Col md={9}>
                      {g.chiuso ? (
                        <p className="text-danger">Chiusura Giornaliera</p>
                      ) : (
                        <>
                          <p>
                            <strong>Mattina:</strong>{" "}
                            {!isClosed(g.inizioMattina, g.fineMattina) ? (
                              `${formatTime(g.inizioMattina)} - ${formatTime(
                                g.fineMattina
                              )}`
                            ) : (
                              <span className="text-danger">Chiuso</span>
                            )}
                          </p>
                          <p>
                            <strong>Pomeriggio:</strong>{" "}
                            {!isClosed(g.inizioPomeriggio, g.finePomeriggio) ? (
                              `${formatTime(g.inizioPomeriggio)} - ${formatTime(
                                g.finePomeriggio
                              )}`
                            ) : (
                              <span className="text-danger">Chiuso</span>
                            )}
                          </p>
                        </>
                      )}
                    </Col>
                  )}
                </Row>

                {isMedico && editMode && !g.chiuso && (
                  <Row className="justify-content-center">
                    <Col md={3} className="d-flex flex-column align-items-center">
                      <Form.Label>Apertura M.</Form.Label>
                      <Form.Control
                        type="time"
                        value={g.inizioMattina || ""}
                        disabled={!g.inizioMattina}
                        onChange={(e) =>
                          handleOrarioChange(i, "inizioMattina", e.target.value)
                        }
                      />
                    </Col>
                    <Col md={3} className="d-flex flex-column align-items-center">
                      <Form.Label>Chiusura M.</Form.Label>
                      <Form.Control
                        type="time"
                        value={g.fineMattina || ""}
                        disabled={!g.inizioMattina}
                        onChange={(e) =>
                          handleOrarioChange(i, "fineMattina", e.target.value)
                        }
                      />
                    </Col>
                    <Col md={3} className="d-flex flex-column align-items-center">
                      <Form.Label>Apertura P.</Form.Label>
                      <Form.Control
                        type="time"
                        value={g.inizioPomeriggio || ""}
                        disabled={!g.inizioPomeriggio}
                        onChange={(e) =>
                          handleOrarioChange(i, "inizioPomeriggio", e.target.value)
                        }
                      />
                    </Col>
                    <Col md={3} className="d-flex flex-column align-items-center">
                      <Form.Label>Chiusura P.</Form.Label>
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
                )}
              </div>
            );
          })}

        {isMedico && !editMode && (
          <Button variant="primary" onClick={() => setEditMode(true)}>
            Modifica Orari
          </Button>
        )}
        {isMedico && editMode && (
          <Button
            type="button"
            variant="primary"
            disabled={saving}
            onClick={handleSubmit}
          >
            {saving ? "Salvataggio..." : "Salva modifiche"}
          </Button>
        )}
      </Card>
    </Container>
  );
};

export default GestioneStudio;




