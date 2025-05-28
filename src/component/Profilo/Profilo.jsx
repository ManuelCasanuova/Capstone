import { useState } from "react";
import { Button, Container, Image, Alert } from "react-bootstrap";
import { Person } from "react-bootstrap-icons";
import { useDispatch } from "react-redux";

import ModaleModificaPaziente from "../modali/ModaleModificaPaziente";
import { updatePaziente } from "../../redux/actions";
import { useAuth } from "../access/AuthContext";

const Profilo = ({ utente }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();


  const datiUtente = utente || user;

  const isMedico = user?.roles?.includes("ROLE_ADMIN");

  const [showModale, setShowModale] = useState(false);
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);

  const handleSave = async (updatedPaziente) => {
    const token = localStorage.getItem("token");
    const result = await dispatch(updatePaziente(updatedPaziente.id, updatedPaziente, token));
    if (result.success) {
      setShowModale(false);
      setShowAlertSuccess(true);
      setTimeout(() => setShowAlertSuccess(false), 4000);
    } else {
      setShowAlertError(true);
      setTimeout(() => setShowAlertError(false), 4000);
    }
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 10,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1050,
          width: "90%",
          maxWidth: 500,
        }}
      >
        {showAlertSuccess && (
          <Alert variant="success" onClose={() => setShowAlertSuccess(false)} dismissible>
            Profilo aggiornato con successo!
          </Alert>
        )}
        {showAlertError && (
          <Alert variant="danger" onClose={() => setShowAlertError(false)} dismissible>
            Errore durante l'aggiornamento del profilo.
          </Alert>
        )}
      </div>

      <Container className="rounded-3 border shadow-sm bg-white p-4" style={{ maxWidth: 600 }}>
        <h3 className="d-flex align-items-center justify-content-center m-0 pt-3 mb-4">
          <Person className="me-2" size={26} />
          {isMedico ? "Profilo Medico" : "Informazioni Personali"}
        </h3>

        <div className="d-flex align-items-center mb-4">
          <Image
            src={datiUtente.avatar || "https://via.placeholder.com/60"}
            roundedCircle
            style={{ width: "60px", height: "60px", objectFit: "cover" }}
            className="me-3"
          />
          <div>
            <h4>{datiUtente.nome} {datiUtente.cognome}</h4>
            <p>{isMedico ? datiUtente.email : datiUtente.dataDiNascita}</p>
          </div>
        </div>

        <div className="ms-5 mt-3 pb-3">
          {isMedico && datiUtente.studio ? (
            <>
              <p>Studio: {datiUtente.studio?.nome || "-"}</p>
              <p>Specializzazione: {datiUtente.studio?.specializzazioneMedico || "Non specificata"}</p>
              <p>Indirizzo: {datiUtente.studio?.indirizzo || "-"}</p>
              <p>Telefono: {datiUtente.studio?.telefono || "-"}</p>
              <p>Cellulare: {datiUtente.studio?.telefonoCellulareMedico || "-"}</p>
            </>
          ) : (
            <>
              <p>Genere: {datiUtente.sesso}</p>
              <p>Gruppo Sanguigno: {datiUtente.gruppoSanguigno}</p>
              <p>Codice Fiscale: {datiUtente.codiceFiscale}</p>
              <p>Telefono: {datiUtente.telefonoCellulare} - {datiUtente.telefonoFisso}</p>
              <p>Email: {datiUtente.email}</p>
              <p>Indirizzo residenza: {datiUtente.indirizzoResidenza}</p>
              <p>Indirizzo domicilio: {datiUtente.domicilio}</p>
              <p>Esenzione: {datiUtente.esenzione}</p>
            </>
          )}

          {!isMedico && (
            <Button variant="primary" onClick={() => setShowModale(true)}>
              Modifica Profilo
            </Button>
          )}
        </div>
      </Container>

      {!isMedico && (
        <ModaleModificaPaziente
          show={showModale}
          onHide={() => setShowModale(false)}
          utente={datiUtente}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default Profilo;
