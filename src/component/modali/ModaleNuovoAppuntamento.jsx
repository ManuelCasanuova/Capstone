import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  createAppuntamento,
  updateAppuntamento,
  fetchPazientiByNomeCognome,
} from "../../redux/actions";

const ModaleNuovoAppuntamento = ({ show, onHide, data, orariDisponibili, token, appuntamentoDaModificare }) => {
  const dispatch = useDispatch();

  const [nomePaziente, setNomePaziente] = useState("");
  const [cognomePaziente, setCognomePaziente] = useState("");
  const [pazientiTrovati, setPazientiTrovati] = useState([]);
  const [pazienteSelezionato, setPazienteSelezionato] = useState(null);
  const [orarioSelezionato, setOrarioSelezionato] = useState("");
  const [motivo, setMotivo] = useState("");
  const [messaggioSuccesso, setMessaggioSuccesso] = useState(null);
  const [errore, setErrore] = useState(null);

  useEffect(() => {
    if (appuntamentoDaModificare) {
      setMotivo(appuntamentoDaModificare.motivoRichiesta || "");
      const orario = new Date(appuntamentoDaModificare.dataOraAppuntamento)
        .toTimeString()
        .slice(0, 5);
      setOrarioSelezionato(orario);
      setNomePaziente(appuntamentoDaModificare.nome || "");
      setCognomePaziente(appuntamentoDaModificare.cognome || "");
      setPazienteSelezionato({ id: appuntamentoDaModificare.pazienteId });
    } else {
      setMotivo("");
      setOrarioSelezionato("");
      setNomePaziente("");
      setCognomePaziente("");
      setPazientiTrovati([]);
      setPazienteSelezionato(null);
    }
  }, [appuntamentoDaModificare]);

  const handleCercaPazienti = async (e) => {
    e.preventDefault();
    if (!nomePaziente.trim() && !cognomePaziente.trim()) {
      setPazientiTrovati([]);
      return;
    }
    try {
      const results = await dispatch(
        fetchPazientiByNomeCognome(token, nomePaziente.trim(), cognomePaziente.trim())
      );
      setPazientiTrovati(results);
      if (appuntamentoDaModificare) {
        const selezionato = results.find(p => p.id === appuntamentoDaModificare.pazienteId);
        if (selezionato) setPazienteSelezionato(selezionato);
      }
    } catch {
      setPazientiTrovati([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orarioSelezionato || !motivo || !pazienteSelezionato) {
      setErrore("Compila tutti i campi e seleziona un paziente.");
      setMessaggioSuccesso(null);
      return;
    }

    const [hh, mm] = orarioSelezionato.split(":");
    const dataOra = new Date(data);
    dataOra.setHours(parseInt(hh, 10));
    dataOra.setMinutes(parseInt(mm, 10));
    dataOra.setSeconds(0);
    dataOra.setMilliseconds(0);

    const appuntamentoPayload = {
      dataOraAppuntamento: dataOra.toISOString(),
      motivoRichiesta: motivo,
      pazienteId: pazienteSelezionato.id,
    };

    try {
      if (appuntamentoDaModificare) {
        await dispatch(updateAppuntamento(token, appuntamentoDaModificare.id, appuntamentoPayload));
        setMessaggioSuccesso("Appuntamento aggiornato con successo!");
      } else {
        await dispatch(createAppuntamento(token, appuntamentoPayload));
        setMessaggioSuccesso("Appuntamento prenotato con successo!");
      }
      setErrore(null);
      setTimeout(() => {
        onHide();
        setMessaggioSuccesso(null);
      }, 1000);
    } catch {
      setErrore("Errore durante la prenotazione. Riprova.");
      setMessaggioSuccesso(null);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{appuntamentoDaModificare ? "Modifica appuntamento" : "Nuovo appuntamento"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleCercaPazienti} className="mb-3 d-flex gap-2">
          <Form.Control
            type="text"
            placeholder="Nome paziente"
            value={nomePaziente}
            onChange={(e) => setNomePaziente(e.target.value)}
          />
          <Form.Control
            type="text"
            placeholder="Cognome paziente"
            value={cognomePaziente}
            onChange={(e) => setCognomePaziente(e.target.value)}
          />
          <Button type="submit">Cerca</Button>
        </Form>

        {pazientiTrovati.length > 0 && (
          <Form.Group className="mb-3">
            <Form.Label>Seleziona paziente</Form.Label>
            <Form.Select
              value={pazienteSelezionato ? pazienteSelezionato.id : ""}
              onChange={(e) => {
                const id = parseInt(e.target.value);
                const selezionato = pazientiTrovati.find(p => p.id === id);
                setPazienteSelezionato(selezionato || null);
              }}
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

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Seleziona orario</Form.Label>
            <Form.Select
              value={orarioSelezionato}
              onChange={(e) => setOrarioSelezionato(e.target.value)}
              required
            >
              <option value="">Seleziona l'orario</option>
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
              placeholder="Descrivi il motivo"
              required
            />
          </Form.Group>

          <Button type="submit" disabled={orariDisponibili.length === 0}>
            {appuntamentoDaModificare ? "Salva modifiche" : "Prenota"}
          </Button>
        </Form>

        {messaggioSuccesso && <p className="text-success mt-3">{messaggioSuccesso}</p>}
        {errore && <p className="text-danger mt-3">{errore}</p>}
      </Modal.Body>
    </Modal>
  );
};

export default ModaleNuovoAppuntamento;
