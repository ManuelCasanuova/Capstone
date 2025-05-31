import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuth } from "../access/AuthContext"; 

const ModaleUploadEsame = ({ show, onHide, pazienteId, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [note, setNote] = useState("");
  const [dataEsame, setDataEsame] = useState("");
  const { token } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !dataEsame) {
      alert("File e data esame sono obbligatori");
      return;
    }

    const formData = new FormData();
    formData.append("pazienteId", pazienteId);
    formData.append("file", file);
    formData.append("note", note);
    formData.append("dataEsame", dataEsame);

    try {
      const res = await fetch(`${apiUrl}/esami/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: formData,
      });

      if (res.ok) {
        const nuovoEsame = await res.json();
        setFile(null);
        setNote("");
        setDataEsame("");
        onUploadSuccess(nuovoEsame);
      } else {
        alert("Errore durante il caricamento del file.");
      }
    } catch (error) {
      console.error("Errore upload:", error);
      alert("Errore imprevisto durante il caricamento.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Carica Nuovo Esame</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleUpload}>
          <Form.Group className="mb-3">
            <Form.Label>Data Esame</Form.Label>
            <Form.Control
              type="date"
              value={dataEsame}
              onChange={(e) => setDataEsame(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Seleziona PDF</Form.Label>
            <Form.Control
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Note (opzionali)</Form.Label>
            <Form.Control
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Form.Group>

          <Button type="submit" variant="primary">
            Carica Esame
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModaleUploadEsame;

