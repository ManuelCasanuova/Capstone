import { useEffect, useState } from "react";
import { Bell, BellFill } from "react-bootstrap-icons";
import { Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useAuth } from "../access/AuthContext";
import ModaleNotifiche from "../modali/ModaleNotifiche";

const Notifiche = () => {
  const { token } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [notifiche, setNotifiche] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchNotifiche = async () => {
      try {
        const res = await fetch(`${apiUrl}/notifiche`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setNotifiche(data);
        } else {
          console.error("Errore nel recupero delle notifiche");
        }
      } catch (error) {
        console.error("Errore fetch notifiche:", error);
      }
    };

    fetchNotifiche();
  }, [apiUrl, token]);

  const numeroNonLette = notifiche.filter((n) => !n.letta).length;
  const Icona = numeroNonLette > 0 ? BellFill : Bell;

  return (
    <>
      <OverlayTrigger placement="bottom" overlay={<Tooltip>Notifiche</Tooltip>}>
        <div
          style={{ position: "relative", cursor: "pointer", display: "inline-block" }}
          onClick={() => setShowModal(true)}
        >
          <Icona size={26} color="#053961" />
          {numeroNonLette > 0 && (
            <Badge
              bg="danger"
              pill
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                fontSize: "0.7rem",
                transform: "translate(50%, -50%)",
                boxShadow: "0 0 0 2px white",
                zIndex: 10,
              }}
            >
              {numeroNonLette}
            </Badge>
          )}
        </div>
      </OverlayTrigger>

      <ModaleNotifiche
        show={showModal}
        onClose={() => setShowModal(false)}
        notifiche={notifiche}
        setNotifiche={setNotifiche}
      />
    </>
  );
};

export default Notifiche;




