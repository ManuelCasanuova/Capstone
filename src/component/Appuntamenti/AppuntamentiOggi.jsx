import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppuntamenti } from "../../redux/actions";
import { ListGroup, Badge, Container, Image, Placeholder } from "react-bootstrap";
import { useAuth } from "../access/AuthContext";  

const AppuntamentiOggi = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const appuntamentiRedux = useSelector((state) => state.appuntamenti.appuntamenti || []);
  const { user } = useAuth();

  const [appuntamentiOggi, setAppuntamentiOggi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      dispatch(fetchAppuntamenti(token)).finally(() => setLoading(false));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (!user) return;

    const oggi = new Date();
    const oggiStr = oggi.toDateString();

    let filtrati = appuntamentiRedux.filter(
      (app) => new Date(app.dataOraAppuntamento).toDateString() === oggiStr
    );

    if (user.roles.includes("ROLE_PAZIENTE")) {
      filtrati = filtrati.filter(app => app.pazienteId === user.pazienteId);
    }

    const ordinati = filtrati.sort(
      (a, b) => new Date(a.dataOraAppuntamento) - new Date(b.dataOraAppuntamento)
    );

    setAppuntamentiOggi(ordinati);
  }, [appuntamentiRedux, user]);

  return (
    <Container className="border rounded-3 shadow-sm p-4 ">
      <h4 className="mb-3">Appuntamenti di oggi</h4>

      {loading ? (
        <ListGroup>
          {[...Array(3)].map((_, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <Placeholder
                  as="div"
                  animation="glow"
                  style={{ width: 40, height: 40, marginRight: 12, borderRadius: "50%" }}
                  className="bg-secondary"
                />
                <div>
                  <Placeholder as="p" animation="glow" className="mb-1">
                    <Placeholder xs={6} />
                  </Placeholder>
                  <Placeholder as="p" animation="glow">
                    <Placeholder xs={4} />
                  </Placeholder>
                </div>
              </div>
              <Placeholder.Button variant="success" xs={2} />
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : appuntamentiOggi.length > 0 ? (
        <ListGroup>
          {appuntamentiOggi.map((app) => (
            <ListGroup.Item
              key={app.id}
              className="d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center">
                <Image
                  src={app.avatar || "https://via.placeholder.com/40x40.png?text=👤"}
                  roundedCircle
                  style={{ width: 40, height: 40, objectFit: "cover", marginRight: 12 }}
                  alt={`${app.nome} ${app.cognome}`}
                />
                <div>
                  <strong style={{ color: "#053961" }}>{app.nome} {app.cognome}</strong>
                  <br />
                  <small className="text-muted">{app.motivoRichiesta}</small>
                </div>
              </div>
              <Badge bg="success">
                {new Date(app.dataOraAppuntamento).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Badge>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p className="text-muted">Nessun appuntamento previsto per oggi.</p>
      )}
    </Container>
  );
};

export default AppuntamentiOggi;


