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
  const isPaziente = user?.roles?.includes("ROLE_PAZIENTE");

  const [showModale, setShowModale] = useState(false);
  const [alert, setAlert] = useState({ show: false, variant: "", message: "" });

  const canModify =
    (isMedico && datiUtente) || // medico può modificare qualsiasi profilo paziente
    (isPaziente && datiUtente.id === user.id); // paziente solo il proprio

  const handleSave = async (updatedPaziente) => {
    const token = localStorage.getItem("token");
    const result = await dispatch(updatePaziente(updatedPaziente.id, updatedPaziente, token));
    if (result.success) {
      setShowModale(false);
      setAlert({ show: true, variant: "success", message: "Profilo aggiornato con successo!" });
    } else {
      setAlert({ show: true, variant: "danger", message: "Errore durante l'aggiornamento del profilo." });
    }
    setTimeout(() => setAlert({ show: false, variant: "", message: "" }), 4000);
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
        {alert.show && (
          <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
            {alert.message}
          </Alert>
        )}
      </div>

      <Container
        className="rounded-3 border shadow-sm bg-white p-4"
        style={{ maxWidth: 600, marginTop: "6rem" }}
      >
        <h3 className="d-flex align-items-center justify-content-center mb-4">
          <Person className="me-2" size={26} />
          {isMedico ? "Profilo Medico / Paziente" : "Informazioni Personali"}
        </h3>

        <div className="d-flex align-items-center mb-4">
          <Image
            src={datiUtente?.avatar || ""}
            roundedCircle
            style={{ width: 60, height: 60, objectFit: "cover" }}
            className="me-3"
          />
          <div>
            <h4 className="mb-1">
              {datiUtente?.nome || "-"} {datiUtente?.cognome || ""}
            </h4>
            <p className="mb-0">{isMedico ? datiUtente?.email : datiUtente?.dataDiNascita || "-"}</p>
          </div>
        </div>

        <div className="ms-4 mb-4">
          {isMedico && datiUtente?.studio ? (
            <>
              <p><strong>Studio:</strong> {datiUtente.studio?.nome || "-"}</p>
              <p><strong>Specializzazione:</strong> {datiUtente.studio?.specializzazioneMedico || "Non specificata"}</p>
              <p><strong>Indirizzo:</strong> {datiUtente.studio?.indirizzo || "-"}</p>
              <p><strong>Telefono fisso:</strong> {datiUtente.telefonoFisso || "-"}</p>
              <p><strong>Cellulare:</strong> {datiUtente.studio?.telefonoCellulareMedico || "-"}</p>
            </>
          ) : (
            <>
              <p><strong>Genere:</strong> {datiUtente?.sesso || "-"}</p>
              <p><strong>Gruppo Sanguigno:</strong> {datiUtente?.gruppoSanguigno || "-"}</p>
              <p><strong>Codice Fiscale:</strong> {datiUtente?.codiceFiscale || "-"}</p>
              <p><strong>Telefono:</strong> {datiUtente?.telefonoCellulare || "-"} - {datiUtente?.telefonoFisso || "-"}</p>
              <p><strong>Email:</strong> {datiUtente?.email || "-"}</p>
              <p><strong>Indirizzo residenza:</strong> {datiUtente?.indirizzoResidenza || "-"}</p>
              <p><strong>Indirizzo domicilio:</strong> {datiUtente?.domicilio || "-"}</p>
              <p><strong>Esenzione:</strong> {datiUtente?.esenzione || "-"}</p>
            </>
          )}
        </div>

        {canModify && (
          <Button variant="primary" onClick={() => setShowModale(true)}>
            Modifica Profilo
          </Button>
        )}
      </Container>

      {canModify && (
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

