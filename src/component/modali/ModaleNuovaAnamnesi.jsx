import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";

function ModaleNuovaAnamnesi({ show, onHide, pazienteId, onCreated, initialData }) {
  const [form, setForm] = useState({
    descrizioneAnamnesi: "",
    titolo: "",
    anno: "",
    fattoreDiRischio: {
      fumatore: false,
      dataInizioFumo: "",
      usoAlcol: false,
      dataUltimaAssunzioneAlcol: "",
      usoStupefacente: false,
      dataUltimaAssunzioneStupefacente: "",
      note: "",
    },
  });

  const [showFattori, setShowFattori] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        descrizioneAnamnesi: initialData.descrizioneAnamnesi || "",
        titolo: initialData.titolo || "",
        anno: initialData.anno || "",
        fattoreDiRischio: {
          fumatore: initialData.fattoreDiRischio?.fumatore || false,
          dataInizioFumo: initialData.fattoreDiRischio?.dataInizioFumo?.slice(0, 10) || "",
          usoAlcol: initialData.fattoreDiRischio?.usoAlcol || false,
          dataUltimaAssunzioneAlcol: initialData.fattoreDiRischio?.dataUltimaAssunzioneAlcol?.slice(0, 10) || "",
          usoStupefacente: initialData.fattoreDiRischio?.usoStupefacente || false,
          dataUltimaAssunzioneStupefacente: initialData.fattoreDiRischio?.dataUltimaAssunzioneStupefacente?.slice(0, 10) || "",
          note: initialData.fattoreDiRischio?.note || "",
        },
      });
    } else {
      setForm({
        descrizioneAnamnesi: "",
        titolo: "",
        anno: "",
        fattoreDiRischio: {
          fumatore: false,
          dataInizioFumo: "",
          usoAlcol: false,
          dataUltimaAssunzioneAlcol: "",
          usoStupefacente: false,
          dataUltimaAssunzioneStupefacente: "",
          note: "",
        },
      });
    }
    setShowFattori(false);
  }, [initialData, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFattoreChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((f) => ({
      ...f,
      fattoreDiRischio: {
        ...f.fattoreDiRischio,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      descrizioneAnamnesi: form.descrizioneAnamnesi,
      titolo: form.titolo,
      anno: form.anno ? parseInt(form.anno) : null,
      pazienteId,
      fattoreDiRischio: {
        fumatore: form.fattoreDiRischio.fumatore,
        dataInizioFumo: form.fattoreDiRischio.fumatore ? form.fattoreDiRischio.dataInizioFumo || null : null,
        usoAlcol: form.fattoreDiRischio.usoAlcol,
        dataUltimaAssunzioneAlcol: form.fattoreDiRischio.usoAlcol ? form.fattoreDiRischio.dataUltimaAssunzioneAlcol || null : null,
        usoStupefacente: form.fattoreDiRischio.usoStupefacente,
        dataUltimaAssunzioneStupefacente: form.fattoreDiRischio.usoStupefacente ? form.fattoreDiRischio.dataUltimaAssunzioneStupefacente || null : null,
        note: form.fattoreDiRischio.note,
      },
    };
    onCreated(payload);
  };

  const maxDate = new Date().toISOString().slice(0, 10);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable dialogClassName="rounded-4" contentClassName="bg-light p-4">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold fs-4">{initialData ? "Modifica Anamnesi" : "Nuova Anamnesi"}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group controlId="anno" className="mb-3">
            <Form.Label>Anno di riferimento</Form.Label>
            <Form.Control
              type="number"
              name="anno"
              value={form.anno}
              onChange={handleChange}
              placeholder="Es. 2024"
              min="1928"
              max={new Date().getFullYear()}
              required
            />
          </Form.Group>

          <Form.Group controlId="titolo" className="mb-3">
            <Form.Label>Titolo</Form.Label>
            <Form.Control
              type="text"
              name="titolo"
              value={form.titolo}
              onChange={handleChange}
              placeholder="Inserisci titolo"
              required
            />
          </Form.Group>

          <Form.Group controlId="descrizioneAnamnesi" className="mb-4">
            <Form.Label>Descrizione Anamnesi</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="descrizioneAnamnesi"
              value={form.descrizioneAnamnesi}
              onChange={handleChange}
              placeholder="Inserisci descrizione"
              required
            />
          </Form.Group>

          <Button
            variant={showFattori ? "outline-primary" : "primary"}
            onClick={() => setShowFattori((v) => !v)}
            className="d-flex align-items-center mb-3 gap-2 px-3 py-2"
            style={{ cursor: "pointer", fontWeight: "600" }}
          >
            {showFattori ? <ChevronUp /> : <ChevronDown />}
            <span>Fattori di Rischio</span>
          </Button>

          {showFattori && (
            <>
              <Form.Check
                type="checkbox"
                label="Fumatore"
                name="fumatore"
                checked={form.fattoreDiRischio.fumatore}
                onChange={handleFattoreChange}
                className="mb-2"
              />
              {form.fattoreDiRischio.fumatore && (
                <Form.Group className="mb-3" controlId="dataInizioFumo">
                  <Form.Label>Data Inizio Fumo</Form.Label>
                  <Form.Control
                    type="date"
                    name="dataInizioFumo"
                    max={maxDate}
                    value={form.fattoreDiRischio.dataInizioFumo}
                    onChange={handleFattoreChange}
                  />
                </Form.Group>
              )}

              <Form.Check
                type="checkbox"
                label="Uso Alcol"
                name="usoAlcol"
                checked={form.fattoreDiRischio.usoAlcol}
                onChange={handleFattoreChange}
                className="mb-2"
              />
              {form.fattoreDiRischio.usoAlcol && (
                <Form.Group className="mb-3" controlId="dataUltimaAssunzioneAlcol">
                  <Form.Label>Data Ultima Assunzione Alcol</Form.Label>
                  <Form.Control
                    type="date"
                    name="dataUltimaAssunzioneAlcol"
                    max={maxDate}
                    value={form.fattoreDiRischio.dataUltimaAssunzioneAlcol}
                    onChange={handleFattoreChange}
                  />
                </Form.Group>
              )}

              <Form.Check
                type="checkbox"
                label="Uso Stupefacente"
                name="usoStupefacente"
                checked={form.fattoreDiRischio.usoStupefacente}
                onChange={handleFattoreChange}
                className="mb-2"
              />
              {form.fattoreDiRischio.usoStupefacente && (
                <Form.Group className="mb-3" controlId="dataUltimaAssunzioneStupefacente">
                  <Form.Label>Data Ultima Assunzione Stupefacente</Form.Label>
                  <Form.Control
                    type="date"
                    name="dataUltimaAssunzioneStupefacente"
                    max={maxDate}
                    value={form.fattoreDiRischio.dataUltimaAssunzioneStupefacente}
                    onChange={handleFattoreChange}
                  />
                </Form.Group>
              )}

              <Form.Group controlId="note" className="mb-4">
                <Form.Label>Note</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="note"
                  value={form.fattoreDiRischio.note}
                  onChange={handleFattoreChange}
                  placeholder="Note aggiuntive"
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>

        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" onClick={onHide}>
            Annulla
          </Button>
          <Button variant="primary" type="submit">
            Salva
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ModaleNuovaAnamnesi;











