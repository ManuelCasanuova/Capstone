import { useState, useEffect } from "react";
import { Container, Row, Col, ListGroup, Badge, Button, Alert } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import logo from "../../assets/Logo.png";
import ModaleNuovoAppuntamento from "../modali/ModaleNuovoAppuntamento";
import ModaleConferma from "../modali/ModaleConferma";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../access/AuthContext";

// Funzione spostata fuori dal useEffect per poterla usare in JSX
const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // domenica o sabato
};

const Appuntamenti = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.roles?.includes("ROLE_ADMIN");
  const isPaziente = user?.roles?.includes("ROLE_PAZIENTE");
  const pazienteId = user?.id;

  const pazienteDaPassaggio = location.state?.paziente || null;

  const [pazienteSelezionato, setPazienteSelezionato] = useState(null);
  const [appuntamenti, setAppuntamenti] = useState([]);
  const [dataSelezionata, setDataSelezionata] = useState(new Date());
  const [appuntamentiGiorno, setAppuntamentiGiorno] = useState([]);
  const [orariDisponibili, setOrariDisponibili] = useState([]);
  const [orariStudio, setOrariStudio] = useState([]);
  const [showPrenotaModal, setShowPrenotaModal] = useState(false);
  const [appuntamentoDaModificare, setAppuntamentoDaModificare] = useState(null);
  const [showAlertChiuso, setShowAlertChiuso] = useState(false);
  const [showConferma, setShowConferma] = useState(false);
  const [idDaEliminare, setIdDaEliminare] = useState(null);

  useEffect(() => {
    if (isPaziente) {
      setPazienteSelezionato({
        id: pazienteId,
        nome: user?.nome || "",
        cognome: user?.cognome || "",
      });
    } else if (pazienteDaPassaggio) {
      setPazienteSelezionato(pazienteDaPassaggio);
    } else {
      setPazienteSelezionato(null);
    }
  }, [isPaziente, pazienteId, user, pazienteDaPassaggio]);

  useEffect(() => {
    if (!token) return;

    const fetchAppuntamenti = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/appuntamenti`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setAppuntamenti(data);
        }
      } catch (error) {
        console.error("Errore fetch appuntamenti", error);
      }
    };

    const fetchOrariStudio = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/studio/orari`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const dati = await res.json();
          setOrariStudio(dati);
        }
      } catch (error) {
        console.error("Errore fetch orari studio", error);
      }
    };

    fetchAppuntamenti();
    fetchOrariStudio();
  }, [token]);

  const aggiornaAppuntamenti = async (appuntamentoAggiornato) => {
    setAppuntamenti((prev) => {
      const index = prev.findIndex((a) => a.id === appuntamentoAggiornato.id);
      if (index !== -1) {
        const nuovi = [...prev];
        nuovi[index] = appuntamentoAggiornato;
        return nuovi;
      } else {
        return [appuntamentoAggiornato, ...prev];
      }
    });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/appuntamenti`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const dati = await res.json();
        setAppuntamenti(dati);
      }
    } catch (error) {
      console.error("Errore ricarica appuntamenti dopo aggiornamento", error);
    }
  };

  useEffect(() => {
    const filtered = appuntamenti.filter((app) => {
      const isSameDay =
        new Date(app.dataOraAppuntamento).toDateString() === dataSelezionata.toDateString();
      const isPatientMatch = isAdmin || String(app.pazienteId) === String(pazienteSelezionato?.id);
      return isSameDay && isPatientMatch;
    });

    const ordinati = filtered.sort(
      (a, b) => new Date(a.dataOraAppuntamento) - new Date(b.dataOraAppuntamento)
    );
    setAppuntamentiGiorno(ordinati);

    const giornoSett = dataSelezionata
      .toLocaleDateString("en-US", { weekday: "long" })
      .toUpperCase();

    const giornoStudio = orariStudio.find((g) => g.giorno === giornoSett);

    if (!giornoStudio || giornoStudio.chiuso) {
      setOrariDisponibili([]);
      setShowAlertChiuso(true);
      return;
    }

    const orariSlot = [];

    const creaFascia = (start, end) => {
      if (!start || !end) return;
      let [sh, sm] = start.split(":").map(Number);
      const [eh, em] = end.split(":").map(Number);
      while (sh < eh || (sh === eh && sm < em)) {
        orariSlot.push(`${sh.toString().padStart(2, "0")}:${sm.toString().padStart(2, "0")}`);
        sm += 30;
        if (sm >= 60) {
          sm = 0;
          sh++;
        }
      }
    };

    creaFascia(giornoStudio.inizioMattina, giornoStudio.fineMattina);
    creaFascia(giornoStudio.inizioPomeriggio, giornoStudio.finePomeriggio);

    const occupati = ordinati.map((app) =>
      new Date(app.dataOraAppuntamento).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    );

    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);
    const giornoSelezionato = new Date(dataSelezionata);
    giornoSelezionato.setHours(0, 0, 0, 0);

    const disponibili = orariSlot.filter((orario) => {
      const [hh, mm] = orario.split(":");
      const slotTime = new Date(dataSelezionata);
      slotTime.setHours(parseInt(hh), parseInt(mm), 0, 0);
      const isPast = giornoSelezionato.getTime() === oggi.getTime() && slotTime < new Date();
      return !occupati.includes(orario) && !isPast;
    });

    setOrariDisponibili(disponibili);
    setShowAlertChiuso(disponibili.length === 0);
  }, [dataSelezionata, appuntamenti, isAdmin, pazienteSelezionato, orariStudio]);

  const handleConfermaEliminazione = async () => {
    if (!token || !idDaEliminare) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/appuntamenti/${idDaEliminare}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        setAppuntamenti((prev) => prev.filter((a) => a.id !== idDaEliminare));
      }
    } catch (error) {
      console.error("Errore eliminazione appuntamento", error);
    }
    setShowConferma(false);
    setIdDaEliminare(null);
  };

  const handleModificaAppuntamento = (app) => {
    setAppuntamentoDaModificare(app);
    setShowPrenotaModal(true);
  };

  const handleChiudiModale = () => {
    setShowPrenotaModal(false);
    setAppuntamentoDaModificare(null);
  };

  const handleNavigateToProfilo = (idPaziente) => {
    navigate(`/paginaProfilo/${idPaziente}`);
  };

  const haPrenotazioneInData =
    isPaziente &&
    appuntamenti.some(
      (app) =>
        String(app.pazienteId) === String(pazienteSelezionato?.id) &&
        new Date(app.dataOraAppuntamento).toDateString() === dataSelezionata.toDateString()
    );

  const handleApriNuovoAppuntamento = () => {
    setAppuntamentoDaModificare(null);
    setShowPrenotaModal(true);
  };

  return (
    <Container className="mt-4">
      <div className="d-flex align-items-center mb-4">
        <h2 className="me-auto">Appuntamenti</h2>
        <img src={logo} alt="Logo" style={{ width: "150px" }} />
      </div>

      <Row>
        <Col md={6} className="mb-4">
          <Calendar
            onChange={setDataSelezionata}
            value={dataSelezionata}
            minDate={new Date()}
            tileDisabled={({ date, view }) => {
              if (view !== "month") return false;

              const day = date.getDay();
              if (day === 0 || day === 6) return true; // disabilita sab e dom

              const giornoSett = date
                .toLocaleDateString("en-US", { weekday: "long" })
                .toUpperCase();
              const giornoStudio = orariStudio.find((g) => g.giorno === giornoSett);
              const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

              return isPast || giornoStudio?.chiuso;
            }}
            tileContent={({ date, view }) => {
              if (view === "month") {
                const count = appuntamenti.filter(
                  (app) =>
                    new Date(app.dataOraAppuntamento).toDateString() === date.toDateString()
                ).length;
                return count > 0 ? (
                  <Badge
                    bg="primary"
                    pill
                    style={{ position: "absolute", top: 2, right: 2, fontSize: "0.75rem" }}
                  >
                    {count}
                  </Badge>
                ) : null;
              }
              return null;
            }}
          />
        </Col>

        <Col md={6}>
          <h4 className="mb-3">Appuntamenti per il {dataSelezionata.toLocaleDateString()}</h4>

          {appuntamentiGiorno.length > 0 && (
            <ListGroup>
              {appuntamentiGiorno.map((app) => (
                <ListGroup.Item
                  key={app.id}
                  onClick={() => handleNavigateToProfilo(app.pazienteId)}
                  className="d-flex justify-content-between align-items-center"
                  style={{ cursor: "pointer" }}
                >
                  <div>
                    <div>
                      {isAdmin && (
                        <div>
                          <strong>Paziente:</strong> {app.nome} {app.cognome}
                        </div>
                      )}
                      <strong>Orario:</strong>{" "}
                      {new Date(app.dataOraAppuntamento).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div>
                      <strong>Motivo:</strong> {app.motivoRichiesta}
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    {isAdmin && (
                      <i
                        className="bi bi-pencil"
                        style={{ color: "orange", cursor: "pointer", fontSize: "1.2rem" }}
                        title="Modifica appuntamento"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleModificaAppuntamento(app);
                        }}
                      ></i>
                    )}
                    {(isAdmin || String(app.pazienteId) === String(pazienteSelezionato?.id)) && (
                      <i
                        className="bi bi-trash"
                        style={{ color: "red", cursor: "pointer", fontSize: "1.2rem" }}
                        title="Cancella appuntamento"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIdDaEliminare(app.id);
                          setShowConferma(true);
                        }}
                      ></i>
                    )}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          {haPrenotazioneInData && (
            <Alert variant="warning" className="mt-3">
              Hai già una prenotazione per questa data e non puoi prenotarne altre.
            </Alert>
          )}

          {!haPrenotazioneInData && !isWeekend(dataSelezionata) && (
            <Button variant="primary" className="mt-3" onClick={handleApriNuovoAppuntamento}>
              Nuova prenotazione
            </Button>
          )}

          {showAlertChiuso && (
            <Alert variant="warning" className="mt-5">
              <p>
                Non è più possibile prenotare per questa data, perché lo studio è chiuso
                o tutti gli appuntamenti sono già stati prenotati.
              </p>
              <br />
              <p>Per appuntamenti urgenti, vi invitiamo a contattare lo studio.</p>
            </Alert>
          )}
        </Col>
      </Row>

      <ModaleNuovoAppuntamento
        show={showPrenotaModal}
        onHide={handleChiudiModale}
        data={dataSelezionata}
        orariDisponibili={orariDisponibili}
        token={token}
        appuntamentoDaModificare={appuntamentoDaModificare}
        isPaziente={isPaziente}
        pazienteId={pazienteSelezionato?.id}
        pazienteNome={pazienteSelezionato?.nome}
        pazienteCognome={pazienteSelezionato?.cognome}
        onAppuntamentoSalvato={aggiornaAppuntamenti}
      />

      <ModaleConferma
        show={showConferma}
        onConferma={handleConfermaEliminazione}
        onClose={() => {
          setShowConferma(false);
          setIdDaEliminare(null);
        }}
        messaggio="Sei sicuro di voler eliminare questo appuntamento?"
      />
    </Container>
  );
};

export default Appuntamenti;

