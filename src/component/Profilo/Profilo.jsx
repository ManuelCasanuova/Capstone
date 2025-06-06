import { useEffect, useState, useRef } from "react";
import { Button, Card, Image, Alert, Spinner, Row, Col } from "react-bootstrap";
import { Pencil, Person, CheckCircle } from "react-bootstrap-icons";
import { useAuth } from "../access/AuthContext";
import ModaleModificaPaziente from "../modali/ModaleModificaPaziente";

const Profilo = ({ utente }) => {
  const { user, aggiornaAvatarUtente, aggiornaUtente } = useAuth();

  const [datiUtente, setDatiUtente] = useState(utente);

  useEffect(() => {
    setDatiUtente(utente || user);
  }, [utente, user]);

  const isMedico = user?.roles?.includes("ROLE_ADMIN");
  const isPaziente = user?.roles?.includes("ROLE_PAZIENTE");

  const canModifyProfile = isMedico || datiUtente?.id === user?.id;
  const canModifyAvatar = datiUtente?.id === user?.id;

  const [alert, setAlert] = useState({ show: false, variant: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(datiUtente?.avatar || "");
  const [showModale, setShowModale] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  const fileInputRef = useRef(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    let timer;
    if (showCheck) {
      timer = setTimeout(() => setShowCheck(false), 2000);
    }
    return () => clearTimeout(timer);
  }, [showCheck]);

  useEffect(() => {
    setAvatarUrl(datiUtente?.avatar || "");
  }, [datiUtente?.avatar]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setAlert({ show: false, variant: "", message: "" });
    setShowCheck(false);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${apiUrl}/utente/avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Errore caricamento avatar: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.avatar) {
        setAvatarUrl(data.avatar);
        aggiornaAvatarUtente(data.avatar);
        setDatiUtente((prev) => ({ ...prev, avatar: data.avatar }));
        setShowCheck(true);
      } else {
        throw new Error("Risposta del server non contiene avatar");
      }
    } catch (error) {
      setAlert({ show: true, variant: "danger", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (datiAggiornati) => {
    setDatiUtente(datiAggiornati);
    aggiornaUtente && aggiornaUtente(datiAggiornati);
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
          {"Informazioni Personali"}
        </h3>

        <div className="mb-4">
          <Row className="align-items-center">
            <Col xs={8} className="text-start">
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
            </Col>
            <Col xs={4} className="text-end">
              <div style={{ position: "relative", width: 80, height: 80, marginLeft: "auto" }}>
                <Image
                  src={avatarUrl || ""}
                  roundedCircle
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                {canModifyAvatar && (
                  <>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        position: "absolute",
                        top: 5,
                        right: 5,
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
                        zIndex: 10,
                      }}
                      title="Modifica immagine profilo"
                    >
                      {loading ? (
                        <Spinner animation="border" size="sm" variant="success" />
                      ) : showCheck ? (
                        <CheckCircle color="limegreen" size={16} />
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
              </div>
            </Col>
          </Row>
        </div>

        <div className="ms-2 mb-4">
          {isMedico && datiUtente?.studio ? (
            <>
              <p className="mb-1">
                <strong>Studio:</strong> <br /> {datiUtente.studio?.nome || "-"}
              </p>
              <p className="mb-1">
                <strong>Specializzazione:</strong> <br />
                {datiUtente.studio?.specializzazioneMedico || "Non specificata"}
              </p>
              <p className="mb-1">
                <strong>Indirizzo:</strong> <br /> {datiUtente.studio?.indirizzo || "-"}
              </p>
              <p className="mb-1">
                <strong>Telefono fisso:</strong> <br /> {datiUtente.telefonoFisso || "-"}
              </p>
              <p className="mb-1">
                <strong>Cellulare:</strong> <br /> {datiUtente.studio?.telefonoCellulareMedico || "-"}
              </p>
            </>
          ) : (
            <Row>
              <Col md={6}>
                <p className="mb-1">
                  <strong>Data di nascita:</strong> <br />
                  {new Date(datiUtente?.dataDiNascita).toLocaleDateString("it-IT")}
                </p>
                <p className="mb-1">
                  <strong>Genere:</strong> <br /> {datiUtente?.sesso || "-"}
                </p>
                <p className="mb-1">
                  <strong>Gruppo Sanguigno:</strong> <br /> {datiUtente?.gruppoSanguigno || "-"}
                </p>
                <p className="mb-1">
                  <strong>Codice Fiscale:</strong> <br /> {datiUtente?.codiceFiscale || "-"}
                </p>
                <p className="mb-1">
                  <strong>Esenzione:</strong> <br /> {datiUtente?.esenzione || "-"}
                </p>
              </Col>
              <Col md={6}>
                <p className="mb-1">
                  <strong>Telefono fisso:</strong> <br /> {datiUtente?.telefonoFisso || "-"}
                </p>
                <p className="mb-1">
                  <strong>Telefono cellulare:</strong> <br /> {datiUtente?.telefonoCellulare || "-"}
                </p>
                <p className="mb-1">
                  <strong>Indirizzo residenza:</strong> <br /> {datiUtente?.indirizzoResidenza || "-"}
                </p>
                <p className="mb-1">
                  <strong>Indirizzo domicilio:</strong> <br /> {datiUtente?.domicilio || "-"}
                </p>
              </Col>
            </Row>
          )}
          {canModifyProfile && (
            <div className="text-center mt-3">
              <Button variant="primary" onClick={() => setShowModale(true)} className="w-100">
                Modifica Profilo
              </Button>
            </div>
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




















