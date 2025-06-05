import React from "react";
import { Modal, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useAuth } from "../access/AuthContext";

const ModaleNotifiche = ({ show, onClose, notifiche, setNotifiche }) => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const handleClickNotifica = async (notif) => {
    if (!user) return;

    
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/notifiche/${notif.id}/letta`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

   
      setNotifiche((prev) => prev.map(n => n.id === notif.id ? {...n, letta: true} : n));

    } catch (error) {
      console.error("Errore segnando notifica come letta", error);
    }

    onClose();

  
    if (user.roles.includes("ROLE_PAZIENTE")) {
      navigate(`/paginaProfilo/${user.id}`);
    } else if (
      user.roles.includes("ROLE_ADMIN") ||
      user.roles.includes("ROLE_MEDICO")
    ) {
      if (notif.pazienteId) {
        navigate(`/paginaProfilo/${notif.pazienteId}`);
      } else {
        console.warn("Notifica senza paziente associato");
      }
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Notifiche</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {notifiche.length === 0 && <p>Nessuna notifica disponibile</p>}
        <ul style={{ maxHeight: "400px", overflowY: "auto", paddingLeft: 0 }}>
          {notifiche.map((notif) => (
            <li
              key={notif.id}
              style={{
                cursor: notif.destinatario && notif.destinatario.id ? "pointer" : "default",
                marginBottom: "10px",
                listStyle: "none",
                borderBottom: notif.letta ? "none" : "2px solid #007bff",
                paddingBottom: "5px",
              }}
              onClick={() =>
                notif.destinatario && notif.destinatario.id && handleClickNotifica(notif)
              }
              title={notif.messaggio}
            >
              {notif.messaggio}
              {!notif.letta && (
                <Badge bg="danger" className="ms-2" pill>
                  Nuova
                </Badge>
              )}
              <br />
              <small className="text-muted">
                {new Date(notif.dataCreazione).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      </Modal.Body>
      
       
    </Modal>
  );
};

export default ModaleNotifiche;







