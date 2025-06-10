import { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, ListGroup, Badge, Button, Alert } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import logo from "../../assets/Logo.png";
import ModaleNuovoAppuntamento from "../modali/ModaleNuovoAppuntamento";
import ModaleConferma from "../modali/ModaleConferma";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../access/AuthContext";

// Costanti per i ruoli
const ROLE_ADMIN = "ROLE_ADMIN";
const ROLE_PAZIENTE = "ROLE_PAZIENTE";

// Funzione di utilità per verificare se una data è un weekend
const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = Domenica, 6 = Sabato
};

const Appuntamenti = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_URL;

  const isAdmin = user?.roles?.includes(ROLE_ADMIN);
  const isPaziente = user?.roles?.includes(ROLE_PAZIENTE);
  const pazienteId = user?.id;

  const pazienteDaPassaggio = location.state?.paziente || null;

  // --- State Variables ---
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

  // --- Effetti collaterali ---

  // Inizializza il paziente selezionato all'avvio o al cambio utente/passaggio di stato
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

  // Carica tutti gli appuntamenti e gli orari dello studio
  useEffect(() => {
    if (!token) return;

    const fetchAppuntamenti = async () => {
      try {
        const res = await fetch(`${apiUrl}/appuntamenti`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setAppuntamenti(data);
        } else {
          console.error("Errore nel recupero degli appuntamenti:", res.statusText);
        }
      } catch (error) {
        console.error("Errore fetch appuntamenti", error);
      }
    };

    const fetchOrariStudio = async () => {
      try {
        const res = await fetch(`${apiUrl}/studio/orari`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const dati = await res.json();
          setOrariStudio(dati);
        } else {
          console.error("Errore nel recupero degli orari dello studio:", res.statusText);
        }
      } catch (error) {
        console.error("Errore fetch orari studio", error);
      }
    };

    fetchAppuntamenti();
    fetchOrariStudio();
  }, [token, apiUrl]);

  // Aggiorna gli appuntamenti e ricarica dal server
  const aggiornaAppuntamenti = useCallback(
    async (appuntamentoAggiornato) => {
      // Aggiorna lo stato locale per reattività immediata
      setAppuntamenti((prev) => {
        const index = prev.findIndex((a) => a.id === appuntamentoAggiornato.id);
        if (index !== -1) {
          const nuovi = [...prev];
          nuovi[index] = appuntamentoAggiornato;
          return nuovi;
        } else {
          return [appuntamentoAggiornato, ...prev]; // Aggiunge se non trovato (nuovo appuntamento)
        }
      });

      // Ricarica tutti gli appuntamenti dal server per garantire consistenza
      try {
        const res = await fetch(`${apiUrl}/appuntamenti`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const dati = await res.json();
          setAppuntamenti(dati);
        } else {
          console.error("Errore ricarica appuntamenti dopo aggiornamento:", res.statusText);
        }
      } catch (error) {
        console.error("Errore ricarica appuntamenti dopo aggiornamento", error);
      }
    },
    [apiUrl, token]
  );

  // Filtra gli appuntamenti per il giorno selezionato e calcola gli orari disponibili
  useEffect(() => {
    const filtraAppuntamentiPerGiorno = () => {
      const filtered = appuntamenti.filter((app) => {
        const isSameDay =
          new Date(app.dataOraAppuntamento).toDateString() === dataSelezionata.toDateString();
        const isPatientMatch =
          isAdmin || String(app.pazienteId) === String(pazienteSelezionato?.id);
        return isSameDay && isPatientMatch;
      });

      const ordinati = filtered.sort(
        (a, b) => new Date(a.dataOraAppuntamento) - new Date(b.dataOraAppuntamento)
      );
      setAppuntamentiGiorno(ordinati);
      return ordinati;
    };

    const calcolaOrariDisponibili = (appuntamentiDelGiorno) => {
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
      const addTimeSlots = (start, end) => {
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

      addTimeSlots(giornoStudio.inizioMattina, giornoStudio.fineMattina);
      addTimeSlots(giornoStudio.inizioPomeriggio, giornoStudio.finePomeriggio);

      const occupati = appuntamentiDelGiorno.map((app) =>
        new Date(app.dataOraAppuntamento).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );

      const oggi = new Date();
      oggi.setHours(0, 0, 0, 0);
      const giornoSelezionatoSenzaOra = new Date(dataSelezionata);
      giornoSelezionatoSenzaOra.setHours(0, 0, 0, 0);

      const disponibili = orariSlot.filter((orario) => {
        const [hh, mm] = orario.split(":");
        const slotTime = new Date(dataSelezionata);
        slotTime.setHours(parseInt(hh), parseInt(mm), 0, 0);
        // Verifica se lo slot è nel passato solo se il giorno selezionato è oggi
        const isPast =
          giornoSelezionatoSenzaOra.getTime() === oggi.getTime() && slotTime < new Date();
        return !occupati.includes(orario) && !isPast;
      });

      setOrariDisponibili(disponibili);
      setShowAlertChiuso(disponibili.length === 0);
    };

    const filteredAndSortedAppuntamenti = filtraAppuntamentiPerGiorno();
    calcolaOrariDisponibili(filteredAndSortedAppuntamenti);
  }, [dataSelezionata, appuntamenti, isAdmin, pazienteSelezionato, orariStudio]);

  // --- Handlers ---

  const handleConfermaEliminazione = async () => {
    if (!token || !idDaEliminare) return;

    try {
      const res = await fetch(`${apiUrl}/appuntamenti/${idDaEliminare}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setAppuntamenti((prev) => prev.filter((a) => a.id !== idDaEliminare));
      } else {
        console.error("Errore nell'eliminazione dell'appuntamento:", res.statusText);
      }
    } catch (error) {
      console.error("Errore eliminazione appuntamento", error);
    } finally {
      setShowConferma(false);
      setIdDaEliminare(null);
    }
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

  const handleApriNuovoAppuntamento = () => {
    setAppuntamentoDaModificare(null);
    setShowPrenotaModal(true);
  };

  // --- Variabili derivate ---
  const haPrenotazioneInData =
    isPaziente &&
    appuntamenti.some(
      (app) =>
        String(app.pazienteId) === String(pazienteSelezionato?.id) &&
        new Date(app.dataOraAppuntamento).toDateString() === dataSelezionata.toDateString()
    );

  // --- Render ---
  return (
    <Container>
      <div className="d-flex align-items-center mb-4">
        <h2 className="me-auto">Appuntamenti</h2>
        <img src={logo} alt="Logo" style={{ width: "150px" }} />
      </div>

      <Row>
        <Col md={6} className="mb-4">
          <Calendar
            onChange={setDataSelezionata}
            value={dataSelezionata}
            minDate={new Date()} // Non permette di selezionare date passate
            tileDisabled={({ date, view }) => {
              if (view !== "month") return false; // Applica la logica solo alla vista del mese

              const today = new Date();
              today.setHours(0, 0, 0, 0); // Azzera ore, minuti, secondi per confronto solo sulla data

              const currentDate = new Date(date);
              currentDate.setHours(0, 0, 0, 0);

              // Disabilita weekend
              if (isWeekend(date)) return true;

              // Disabilita date passate
              if (currentDate < today) return true;

              // Disabilita giorni in cui lo studio è chiuso
              const giornoSett = date
                .toLocaleDateString("it-IT", { weekday: "long" })
                .toUpperCase();
              const giornoStudio = orariStudio.find((g) => g.giorno === giornoSett);

              return giornoStudio?.chiuso;
            }}
            tileContent={({ date, view }) => {
              if (view === "month") {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const currentDate = new Date(date);
                currentDate.setHours(0, 0, 0, 0);

                // Non mostrare badge per weekend o date passate
                if (isWeekend(date) || currentDate < today) return null;

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
          <h4 className="mb-3">
            Appuntamenti del{" "}
            {dataSelezionata.toLocaleDateString("it-IT", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h4>

          {appuntamentiGiorno.length > 0 ? (
            <ListGroup>
              {appuntamentiGiorno.map((app) => (
                <ListGroup.Item
                  key={app.id}
                  onClick={() => handleNavigateToProfilo(app.pazienteId)}
                  className="d-flex justify-content-between align-items-center shadow-sm"
                  style={{ cursor: "pointer" }}
                >
                  <div>
                    {isAdmin && (
                      <div>
                        <strong>Paziente:</strong> {app.nome} {app.cognome}
                      </div>
                    )}
                    <div>
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
                          e.stopPropagation(); // Evita che l'onClick del ListGroup.Item si attivi
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
                          e.stopPropagation(); // Evita che l'onClick del ListGroup.Item si attivi
                          setIdDaEliminare(app.id);
                          setShowConferma(true);
                        }}
                      ></i>
                    )}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <Alert variant="info" className="mt-3">
              Nessun appuntamento per il giorno selezionato.
            </Alert>
          )}

          {haPrenotazioneInData && (
            <Alert variant="warning" className="mt-3">
              Hai già una prenotazione per questa data e non puoi prenotarne altre.
            </Alert>
          )}

          {!haPrenotazioneInData && !isWeekend(dataSelezionata) && !showAlertChiuso && (
            <Button variant="primary" className="mt-3" onClick={handleApriNuovoAppuntamento}>
              Nuova prenotazione
            </Button>
          )}

          {showAlertChiuso && (
            <Alert variant="warning" className="mt-5">
              <p>
                Non è più possibile prenotare per questa data, perché lo studio è chiuso o tutti
                gli appuntamenti sono già stati prenotati.
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

