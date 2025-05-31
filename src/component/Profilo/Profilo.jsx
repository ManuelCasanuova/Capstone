import { useState, useRef } from "react";
import { Button, Card, Image, Alert, Spinner } from "react-bootstrap";
import { Pencil, Person } from "react-bootstrap-icons";
import { useAuth } from "../access/AuthContext";
import ModaleModificaPaziente from "../modali/ModaleModificaPaziente";

const Profilo = ({ utente }) => {
  const { user } = useAuth();

  const datiUtente = utente || user;
  const isMedico = user?.roles?.includes("ROLE_ADMIN");
  const isPaziente = user?.roles?.includes("ROLE_PAZIENTE");

  const canModifyProfile = isMedico || (datiUtente?.id === user?.id);
  const canModifyAvatar = datiUtente?.id === user?.id;

  const [alert, setAlert] = useState({ show: false, variant: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(datiUtente?.avatar || "");
  const [showModale, setShowModale] = useState(false);

  const fileInputRef = useRef(null);
  const apiUrl = import.meta.env.VITE_API_URL;

 const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setLoading(true);
  setAlert({ show: false, variant: "", message: "" });

  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${apiUrl}/utente/${datiUtente.id}/avatar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Errore caricamento avatar: ${response.statusText}`);
    }

    const clone = response.clone();
    let updatedUtente;
    try {
      updatedUtente = await response.json();
    } catch {
      const text = await clone.text();
      updatedUtente = { avatar: text };
    }

    if (updatedUtente.avatar) {
      setAvatarUrl(updatedUtente.avatar);
      setAlert({ show: true, variant: "success", message: "Avatar aggiornato con successo!" });
    } else {
      throw new Error("Risposta del server non contiene avatar");
    }
  } catch (error) {
    setAlert({ show: true, variant: "danger", message: error.message });
  } finally {
    setLoading(false);
  }
};



  const handleSave = async (updatedPaziente) => {
    
    setShowModale(false);
    setAlert({ show: true, variant: "success", message: "Profilo aggiornato con successo!" });
    
  };

  return (
    <>
      {alert.show && (
        <Alert variant={alert.variant} dismissible onClose={() => setAlert({ show: false })}>
          {alert.message}
        </Alert>
      )}

      <Card className="p-4 shadow-sm position-relative">
        <h3 className="d-flex align-items-center justify-content-center mb-4">
          <Person className="me-2" size={26} />
          {isMedico ? "Profilo Medico / Paziente" : "Informazioni Personali"}
        </h3>

        <div
          className="d-flex flex-column align-items-center text-center mb-4 position-relative"
          style={{ width: 80, margin: "0 auto" }}
        >
          <Image
            src={avatarUrl || ""}
            roundedCircle
            style={{ width: 80, height: 80, objectFit: "cover" }}
            className="mb-3"
          />

          {canModifyAvatar && (
            <>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  position: "absolute",
                  top: 2,
                  right: 'calc(50% - 40px)',
                  backgroundColor: "#074662",
                  borderRadius: "50%",
                  width: 24,
                  height: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 0 6px rgba(0,0,0,0.3)",
                  opacity: loading ? 0.6 : 1,
                }}
                title="Modifica immagine profilo"
              >
                {loading ? (
                  <Spinner animation="border" size="sm" variant="light" />
                ) : (
                  <Pencil color="white" size={16} />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
                disabled={loading}
              />
            </>
          )}

          <h4 className="mb-1">
            {datiUtente?.nome || "-"} {datiUtente?.cognome || ""}
          </h4>
          <p className="mb-0">
            {isMedico
              ? datiUtente?.email
              : datiUtente?.dataDiNascita
              ? new Date(datiUtente?.dataDiNascita).toLocaleDateString("it-IT")
              : "-"}
          </p>
        </div>

        {canModifyProfile && (
          <div className="text-center mb-3">
            <Button variant="primary" onClick={() => setShowModale(true)}>
              Modifica Profilo
            </Button>
          </div>
        )}

        <div className="ms-2 mb-4">
          {isMedico && datiUtente?.studio ? (
            <>
              <p>
                <strong>Studio:</strong> {datiUtente.studio?.nome || "-"}
              </p>
              <p>
                <strong>Specializzazione:</strong>{" "}
                {datiUtente.studio?.specializzazioneMedico || "Non specificata"}
              </p>
              <p>
                <strong>Indirizzo:</strong> {datiUtente.studio?.indirizzo || "-"}
              </p>
              <p>
                <strong>Telefono fisso:</strong> {datiUtente.telefonoFisso || "-"}
              </p>
              <p>
                <strong>Cellulare:</strong> {datiUtente.studio?.telefonoCellulareMedico || "-"}
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>Genere:</strong> {datiUtente?.sesso || "-"}
              </p>
              <p>
                <strong>Gruppo Sanguigno:</strong> {datiUtente?.gruppoSanguigno || "-"}
              </p>
              <p>
                <strong>Codice Fiscale:</strong> {datiUtente?.codiceFiscale || "-"}
              </p>
              <p>
                <strong>Telefono:</strong> {datiUtente?.telefonoCellulare || "-"} -{" "}
                {datiUtente?.telefonoFisso || "-"}
              </p>
              <p>
                <strong>Email:</strong> {datiUtente?.email || "-"}
              </p>
              <p>
                <strong>Indirizzo residenza:</strong> {datiUtente?.indirizzoResidenza || "-"}
              </p>
              <p>
                <strong>Indirizzo domicilio:</strong> {datiUtente?.domicilio || "-"}
              </p>
              <p>
                <strong>Esenzione:</strong> {datiUtente?.esenzione || "-"}
              </p>
            </>
          )}
        </div>
      </Card>

      {canModifyProfile && (
        <ModaleModificaPaziente
          show={showModale}
          onHide={() => setShowModale(false)}
          utente={datiUtente}
          onSave={handleSave}
          canChangePassword={isPaziente && datiUtente.id === user.id}
        />
      )}
    </>
  );
};

export default Profilo;









