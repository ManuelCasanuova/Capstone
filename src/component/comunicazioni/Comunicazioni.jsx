import { useEffect, useState } from "react";
import { useAuth } from "../access/AuthContext";
import { Trash, Pencil } from "react-bootstrap-icons";
import ModaleComunicazione from "../modali/ModaleComunicazione";
import ModaleConferma from "../modali/ModaleConferma"; 
import { Placeholder } from "react-bootstrap";

function Comunicazioni() {
  const { user, token } = useAuth();
  const [comunicazioni, setComunicazioni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [comunicazioneDaModificare, setComunicazioneDaModificare] = useState(null);
  const [showConferma, setShowConferma] = useState(false);
  const [idDaEliminare, setIdDaEliminare] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (user && token) {
      const endpoint = user.roles.includes("ROLE_PAZIENTE") 
        ? `${apiUrl}/comunicazioni/globali` 
        : `${apiUrl}/comunicazioni`;

      fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error("Errore nel caricamento delle comunicazioni");
          return res.json();
        })
        .then(setComunicazioni)
        .catch(err => {
          console.error(err);
          setComunicazioni([]);
        })
        .finally(() => setLoading(false));
    }
  }, [user, token]);

  const confermaEliminazione = (id) => {
    setIdDaEliminare(id);
    setShowConferma(true);
  };

  const elimina = () => {
    fetch(`${apiUrl}/comunicazioni/${idDaEliminare}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      setComunicazioni(prev => prev.filter(c => c.id !== idDaEliminare));
      setShowConferma(false);
      setIdDaEliminare(null);
    });
  };

  const apriModale = (comunicazione = null) => {
    setComunicazioneDaModificare(comunicazione);
    setShowModal(true);
  };

  const chiudiModale = () => {
    setShowModal(false);
    setComunicazioneDaModificare(null);
  };

  const aggiornaLista = (nuova) => {
    setComunicazioni(prev => {
      const esiste = prev.find(c => c.id === nuova.id);
      if (esiste) {
        return prev.map(c => c.id === nuova.id ? nuova : c);
      } else {
        return [nuova, ...prev];
      }
    });
  };

  return (
    <div className="container mt-4 border rounded shadow-sm p-4 bg-white">
      <h4 className="mb-4">Comunicazioni dallo Studio</h4>

      {loading ? (
        <ul className="list-group mb-3">
          {[...Array(3)].map((_, index) => (
            <li key={index} className="list-group-item bg-light">
              <Placeholder as="h4" animation="glow" className="mb-2">
                <Placeholder xs={6} />
              </Placeholder>
              <Placeholder as="small" animation="glow">
                <Placeholder xs={4} />
              </Placeholder>
              <Placeholder as="p" animation="glow" className="mt-3">
                <Placeholder xs={8} /> <Placeholder xs={6} /> <Placeholder xs={5} />
              </Placeholder>
            </li>
          ))}
        </ul>
      ) : comunicazioni.length === 0 ? (
        <>
          <div className="alert alert-info" role="alert">
            Nessuna comunicazione presente.
          </div>
          {user?.roles?.includes("ROLE_ADMIN") && (
            <div className="text-center">
              <button className="btn btn-primary w-100" onClick={() => apriModale()}>
                Nuova Comunicazione
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <ul className="list-group mb-3">
            {comunicazioni.map(c => (
              <li
                key={c.id}
                className="list-group-item bg-light d-flex justify-content-between align-items-start flex-column flex-md-row"
              >
                <div className="mb-2 mb-md-0">
                  <h4>{c.oggetto}</h4>
                  <small className="text-muted">
                    {new Date(c.dataComunicazione).toLocaleDateString("it-IT", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric"
                    })}
                  </small>
                  <p className="mt-3">{c.testo}</p>
                </div>
                {user?.roles?.includes("ROLE_ADMIN") && (
                  <div className="mt-2 mt-md-0 d-flex gap-2 align-items-center">
                    <button
                      className="btn btn-sm btn-outline-warning d-flex align-items-center justify-content-center"
                      onClick={() => apriModale(c)}
                      title="Modifica"
                      style={{ width: "38px", height: "38px" }}
                    >
                      <Pencil />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center"
                      onClick={() => confermaEliminazione(c.id)}
                      title="Elimina"
                      style={{ width: "38px", height: "38px" }}
                    >
                      <Trash />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {user?.roles?.includes("ROLE_ADMIN") && (
            <div className="text-center">
              <button className="btn btn-primary w-100" onClick={() => apriModale()}>
                Nuova Comunicazione
              </button>
            </div>
          )}
        </>
      )}

      {showModal && (
        <ModaleComunicazione
          comunicazione={comunicazioneDaModificare}
          onClose={chiudiModale}
          onSave={aggiornaLista}
        />
      )}

      <ModaleConferma
        show={showConferma}
        messaggio="Sei sicuro di voler eliminare questa comunicazione?"
        onConferma={elimina}
        onClose={() => setShowConferma(false)}
      />
    </div>
  );
}

export default Comunicazioni;






