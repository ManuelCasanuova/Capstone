import React, { useState, useEffect } from "react";
import { Alert, Button, Table, Image } from "react-bootstrap";
import { useParams } from "react-router";
import ModaleVisualizzaEsame from "../modali/ModaleVisualizzaEsame";
import ModaleUploadEsame from "../modali/ModaleUploadEsame";
import { useAuth } from "../access/AuthContext";

const Esami = () => {
  const { pazienteId } = useParams();
  const { token, loading } = useAuth();
  const [esami, setEsami] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showModalVisualizza, setShowModalVisualizza] = useState(false);
  const [showModalUpload, setShowModalUpload] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!loading && pazienteId && token) {
      const fetchEsami = async () => {
        try {
          const res = await fetch(`${apiUrl}/esami/paziente/${pazienteId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Errore ${res.status}: ${text}`);
          }

          const data = await res.json();

          data.sort((a, b) => new Date(b.dataCaricamento) - new Date(a.dataCaricamento));

          setEsami(data);
          setError(null);
        } catch (err) {
          console.error(err);
          setError("Errore nel recupero degli esami.");
          setEsami([]);
        }
      };

      fetchEsami();
    }
  }, [loading, pazienteId, token, apiUrl]);

  const apriPdfInModale = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/esami/${id}/visualizza`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Errore ${res.status}: ${text}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setShowModalVisualizza(true);
    } catch (err) {
      console.error(err);
      setError("Errore nel caricamento del PDF.");
    }
  };

  const chiudiModaleVisualizza = () => {
    setShowModalVisualizza(false);
    setPdfUrl(null);
  };

  const handleUploadSuccess = (nuovoEsame) => {
    setEsami((prevEsami) => {
      const updated = [...prevEsami, nuovoEsame];
      updated.sort((a, b) => new Date(b.dataCaricamento) - new Date(a.dataCaricamento));
      return updated;
    });
    setShowModalUpload(false);
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 1000);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Esami</h2>

        <Button variant="success" className="mb-3" onClick={() => setShowModalUpload(true)}>
          Carica Nuovo Esame
        </Button>
      </div>

      {showSuccessAlert && (
        <Alert variant="success" dismissible>
          Esame caricato con successo!
        </Alert>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {esami.length === 0 && !error ? (
        <div className="text-center d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "40vh", marginBottom: 30 }}>
          <h4 className="my-3">Nessun esame disponibile per questo paziente.</h4>
          <Image
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="Nessun esame"
            style={{ width: 200, opacity: 0.6 }}
            rounded
          />
        </div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Data Esame</th>
              <th>Nome File</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {esami.map((esame) => (
              <tr
                key={esame.id}
                className="riga-esame"
                style={{ cursor: "pointer" }}
                onClick={() => apriPdfInModale(esame.id)}
              >
                <td>{new Date(esame.dataEsame).toLocaleDateString("it-IT")}</td>
                <td>{esame.nomeFile}</td>
                <td>{esame.note}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <ModaleVisualizzaEsame
        show={showModalVisualizza}
        pdfUrl={pdfUrl}
        onClose={chiudiModaleVisualizza}
      />

      <ModaleUploadEsame
        show={showModalUpload}
        onHide={() => setShowModalUpload(false)}
        pazienteId={pazienteId}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default Esami;



