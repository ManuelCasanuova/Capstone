import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Badge,
  Button,
} from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import logo from "../../assets/Logo.png";
import { useDispatch, useSelector } from "react-redux";
import { deleteAppuntamento, fetchAppuntamenti } from "../../redux/actions";
import ModaleNuovoAppuntamento from "../modali/ModaleNuovoAppuntamento";
import { useNavigate } from "react-router";

const ORARI_MATTINA = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30",
];

const ORARI_POMERIGGIO = [
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30",
];

const Appuntamenti = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const appuntamentiRedux = useSelector(
    (state) => state.appuntamenti.appuntamenti || []
  );

  const [dataSelezionata, setDataSelezionata] = useState(new Date());
  const [appuntamentiGiorno, setAppuntamentiGiorno] = useState([]);
  const [orariDisponibili, setOrariDisponibili] = useState([]);
  const [showPrenotaModal, setShowPrenotaModal] = useState(false);
  const [appuntamentoDaModificare, setAppuntamentoDaModificare] = useState(null);

  useEffect(() => {
    if (token && appuntamentiRedux.length === 0) {
      dispatch(fetchAppuntamenti(token));
    }
  }, [dispatch, token, appuntamentiRedux.length]);

  useEffect(() => {
    const filtered = appuntamentiRedux.filter(
      (app) =>
        new Date(app.dataOraAppuntamento).toDateString() ===
        dataSelezionata.toDateString()
    );

    const ordinati = filtered.sort(
      (a, b) => new Date(a.dataOraAppuntamento) - new Date(b.dataOraAppuntamento)
    );

    setAppuntamentiGiorno(ordinati);

    const giorno = dataSelezionata.getDate();
    const fascia = giorno % 2 === 1 ? ORARI_MATTINA : ORARI_POMERIGGIO;

    const occupati = ordinati.map((app) => {
      const dataUTC = new Date(app.dataOraAppuntamento);
      const orarioLocale = dataUTC.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
      return orarioLocale;
    });

    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);
    const giornoSelezionato = new Date(dataSelezionata);
    giornoSelezionato.setHours(0, 0, 0, 0);

    const disponibili = fascia.filter((orario) => {
      const [hh, mm] = orario.split(":");
      const slotTime = new Date(dataSelezionata);
      slotTime.setHours(parseInt(hh, 10));
      slotTime.setMinutes(parseInt(mm, 10));
      slotTime.setSeconds(0);
      slotTime.setMilliseconds(0);

      const isPast = giornoSelezionato.getTime() === oggi.getTime() && slotTime < new Date();
      return !occupati.includes(orario) && !isPast;
    });

    setOrariDisponibili(disponibili);
  }, [dataSelezionata, appuntamentiRedux]);

  const handleDeleteAppuntamento = async (id) => {
    try {
      await dispatch(deleteAppuntamento(token, id));
    } catch (error) {
      console.error("Errore durante l'eliminazione:", error);
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

  const handleNavigateToProfilo = (pazienteId) => {
    navigate(`/paginaProfilo/${pazienteId}`);
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
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;
              const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
              return view === "month" && (isWeekend || isPast);
            }}
            tileContent={({ date, view }) => {
              if (view === "month") {
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                if (isWeekend) return null;

                const count = appuntamentiRedux.filter(
                  (app) =>
                    new Date(app.dataOraAppuntamento).toDateString() ===
                    date.toDateString()
                ).length;

                return count > 0 ? (
                  <Badge
                    bg="primary"
                    pill
                    style={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      fontSize: "0.75rem",
                    }}
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
            Appuntamenti per il {dataSelezionata.toLocaleDateString()}
          </h4>

          {appuntamentiGiorno.length > 0 ? (
            <ListGroup>
              {appuntamentiGiorno.map((app) => (
                <ListGroup.Item
                  key={app.id}
                  onClick={() => handleNavigateToProfilo(app.pazienteId)}
                  className="d-flex justify-content-between align-items-center"
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={app.avatar || "https://via.placeholder.com/40x40.png?text=👤"}
                      alt={`${app.nome} ${app.cognome}`}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginRight: 10,
                      }}
                    />
                    <div>
                      <div>{app.nome} {app.cognome}</div>
                      <small className="text-muted">{app.motivoRichiesta}</small>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <Badge bg="success" pill>
                      {new Date(app.dataOraAppuntamento).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Badge>
                    <i
                      className="bi bi-pencil"
                      style={{ color: "orange", cursor: "pointer", fontSize: "1.2rem" }}
                      title="Modifica appuntamento"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleModificaAppuntamento(app);
                      }}
                    ></i>
                    <i
                      className="bi bi-trash"
                      style={{ color: "red", cursor: "pointer", fontSize: "1.2rem" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAppuntamento(app.id);
                      }}
                    ></i>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p className="text-muted mt-3">
              Nessun appuntamento per questo giorno.
            </p>
          )}

          <Button
            variant="primary"
            className="mt-3"
            onClick={() => setShowPrenotaModal(true)}
          >
            Nuova prenotazione
          </Button>
        </Col>
      </Row>

      <ModaleNuovoAppuntamento
        show={showPrenotaModal}
        onHide={handleChiudiModale}
        data={dataSelezionata}
        orariDisponibili={orariDisponibili}
        token={token}
        appuntamentoDaModificare={appuntamentoDaModificare}
      />
    </Container>
  );
};

export default Appuntamenti;


