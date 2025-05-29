import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  createAppuntamento,
  updateAppuntamento,
  fetchPazientiByNomeCognome,
} from "../../redux/actions";

const ModaleNuovoAppuntamento = ({
  show,
  onHide,
  data,
  orariDisponibili,
  token,
  appuntamentoDaModificare,
  isPaziente,
  pazienteId,
  pazienteNome,
  pazienteCognome,
  onAppuntamentoSalvato,
}) => {
  const dispatch = useDispatch();

  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [pazientiTrovati, setPazientiTrovati] = useState([]);
  const [pazienteSelezionato, setPazienteSelezionato] = useState(null);
  const [orarioSelezionato, setOrarioSelezionato] = useState("");
  const [motivo, setMotivo] = useState("");
  const [successo, setSuccesso] = useState(null);
  const [errore, setErrore] = useState(null);

  useEffect(() => {
    if (appuntamentoDaModificare) {
      setMotivo(appuntamentoDaModificare.motivoRichiesta || "");
      const orario = new Date(appuntamentoDaModificare.dataOraAppuntamento)
        .toTimeString()
        .slice(0, 5);
      setOrarioSelezionato(orario);

      setNome(appuntamentoDaModificare.nome || "");
      setCognome(appuntamentoDaModificare.cognome || "");
      setPazienteSelezionato({ id: appuntamentoDaModificare.pazienteId });
      setPazientiTrovati([]);
    } else if (pazienteId) {
      setPazienteSelezionato({ id: pazienteId });
      setNome(pazienteNome || "");
      setCognome(pazienteCognome || "");
      setMotivo("");
      setOrarioSelezionato("");
      setPazientiTrovati([]);
      setSuccesso(null);
      setErrore(null);
    } else {
      setMotivo("");
      setOrarioSelezionato("");
      setNome("");
      setCognome("");
      setPazientiTrovati([]);
      setPazienteSelezionato(null);
      setSuccesso(null);
      setErrore(null);
    }
  }, [appuntamentoDaModificare, pazienteId, pazienteNome, pazienteCognome, show]);

  const handleCercaPazienti = async (e) => {
    e.preventDefault();
    if (!nome.trim() && !cognome.trim()) {
      setPazientiTrovati([]);
      return;
    }
    try {
      const risultati = await dispatch(
        fetchPazientiByNomeCognome(token, nome.trim(), cognome.trim())
      );
      setPazientiTrovati(risultati);
    } catch {
      setPazientiTrovati([]);
    }
  };

  const handleSelezionaPaziente = (e) => {
    const idSelezionato = parseInt(e.target.value);
    const paziente = pazientiTrovati.find((p) => p.id === idSelezionato) || null;
    setPazienteSelezionato(paziente);
    if (paziente) {
      setNome(paziente.nome);
      setCognome(paziente.cognome);
    } else {
      setNome("");
      setCognome("");
    }
  };

  const creaDataOraLocal = (dataDate, orarioStr) => {
    if (!dataDate || !orarioStr) return null;
    const [hh, mm] = orarioStr.split(":").map(Number);
    const year = dataDate.getFullYear();
    const month = String(dataDate.getMonth() + 1).padStart(2, "0");
    const day = String(dataDate.getDate()).padStart(2, "0");
    const hours = String(hh).padStart(2, "0");
    const minutes = String(mm).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}:00`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data) {
      setErrore("Seleziona una data valida.");
      setSuccesso(null);
      return;
    }

    if (!orarioSelezionato || !motivo || !pazienteSelezionato?.id) {
      setErrore("Compila tutti i campi e seleziona un paziente.");
      setSuccesso(null);
      return;
    }

    const dataOraLocal = creaDataOraLocal(data, orarioSelezionato);
    if (!dataOraLocal) {
      setErrore("Data o orario non validi.");
      setSuccesso(null);
      return;
    }

    const payload = {
      dataOraAppuntamento: dataOraLocal,
      motivoRichiesta: motivo,
      pazienteId: pazienteSelezionato.id,
    };

    try {
      if (appuntamentoDaModificare) {
        await dispatch(
          updateAppuntamento(token, appuntamentoDaModificare.id, payload)
        );

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/appuntamenti/${appuntamentoDaModificare.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const updatedApp = await res.json();

        if (onAppuntamentoSalvato) onAppuntamentoSalvato(updatedApp);
        setSuccesso("Appuntamento aggiornato con successo!");
      } else {
        await dispatch(createAppuntamento(token, payload));

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/appuntamenti/ultimo?pazienteId=${payload.pazienteId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const newApp = await res.json();

        if (onAppuntamentoSalvato) onAppuntamentoSalvato(newApp);
        setSuccesso("Appuntamento prenotato con successo!");
      }

      setErrore(null);
      setTimeout(() => {
        onHide();
        setSuccesso(null);
      }, 1000);
    } catch {
      setErrore("Errore durante la prenotazione.");
      setSuccesso(null);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {appuntamentoDaModificare ? "Modifica appuntamento" : "Nuovo appuntamento"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {pazienteSelezionato ? (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Nome paziente</Form.Label>
              <Form.Control type="text" value={nome} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cognome paziente</Form.Label>
              <Form.Control type="text" value={cognome} disabled />
            </Form.Group>
          </>
        ) : (
          !isPaziente && !appuntamentoDaModificare && (
            <>
              <Form onSubmit={handleCercaPazienti} className="mb-3 d-flex gap-2">
                <Form.Control
                  type="text"
                  placeholder="Nome paziente"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
                <Form.Control
                  type="text"
                  placeholder="Cognome paziente"
                  value={cognome}
                  onChange={(e) => setCognome(e.target.value)}
                />
                <Button type="submit">Cerca</Button>
              </Form>

              {pazientiTrovati.length > 0 && (
                <Form.Group className="mb-3">
                  <Form.Label>Seleziona paziente</Form.Label>
                  <Form.Select
                    value={pazienteSelezionato?.id || ""}
                    onChange={handleSelezionaPaziente}
                    required
                  >
                    <option value="">Seleziona...</option>
                    {pazientiTrovati.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome} {p.cognome} ({p.email})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}
            </>
          )
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Seleziona orario</Form.Label>
            <Form.Select
              value={orarioSelezionato}
              onChange={(e) => setOrarioSelezionato(e.target.value)}
              required
            >
              <option value=""> Seleziona orario </option>
              {orariDisponibili.map((orario) => (
                <option key={orario} value={orario}>
                  {orario}
                </option>
              ))}
              {orariDisponibili.length === 0 && (
                <option disabled>Nessun orario disponibile</option>
              )}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Motivo prenotazione</Form.Label>
            <Form.Control
              type="text"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Es. Visita di controllo"
              required
            />
          </Form.Group>

          <Button type="submit" disabled={orariDisponibili.length === 0}>
            {appuntamentoDaModificare ? "Salva modifiche" : "Prenota"}
          </Button>
        </Form>

        {successo && <p className="text-success mt-3">{successo}</p>}
        {errore && <p className="text-danger mt-3">{errore}</p>}
      </Modal.Body>
    </Modal>
  );
};

export default ModaleNuovoAppuntamento;







