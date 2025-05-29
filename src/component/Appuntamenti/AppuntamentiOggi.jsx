import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppuntamenti } from "../../redux/actions";
import { ListGroup, Badge, Container } from "react-bootstrap";

const AppuntamentiOggi = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const appuntamentiRedux = useSelector((state) => state.appuntamenti.appuntamenti || []);

  const [appuntamentiOggi, setAppuntamentiOggi] = useState([]);

  useEffect(() => {
    if (token) {
      dispatch(fetchAppuntamenti(token));
    }
  }, [dispatch, token]);

  useEffect(() => {
    const oggi = new Date();
    const oggiStr = oggi.toDateString();

    const filtrati = appuntamentiRedux.filter(
      (app) => new Date(app.dataOraAppuntamento).toDateString() === oggiStr
    );

    const ordinati = filtrati.sort(
      (a, b) => new Date(a.dataOraAppuntamento) - new Date(b.dataOraAppuntamento)
    );

    setAppuntamentiOggi(ordinati);
  }, [appuntamentiRedux]);

  return (
    <Container className="border rounded-3 shadow-sm p-4" >
      <h4 className="mb-3">Appuntamenti di oggi</h4>
      {appuntamentiOggi.length > 0 ? (
        <ListGroup>
          {appuntamentiOggi.map((app) => (
            <ListGroup.Item
              key={app.id}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <strong style={{color: "#053961"}}>{app.nome} {app.cognome}</strong>
                <br />
                <small className="text-muted">{app.motivoRichiesta}</small>
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