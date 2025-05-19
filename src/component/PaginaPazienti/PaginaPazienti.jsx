import { Col, Container, Row, Image, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchPazienti, postNuovoPaziente } from "../../redux/actions";
import CardPazienti from "./CardPazienti";
import ModaleNuovoPaziente from "../modali/ModaleNuovoPaziente";
import logo from "../../assets/Logo.png";

const PaginaPazienti = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const utenti = useSelector((state) => state.utenti.utenti);

  const token = localStorage.getItem("token");
  const [mostraComponente, setMostraComponente] = useState("card");
  const [showModal, setShowModal] = useState(false);
  const [paginaCorrente, setPaginaCorrente] = useState(0);
  const [totalePagine, setTotalePagine] = useState(1);

  useEffect(() => {
    const isValidToken = token && token !== "null" && token !== "undefined";
    if (!isValidToken) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      const response = await dispatch(fetchPazienti(token, paginaCorrente));
      if (response?.payload?.totalPages !== undefined) {
        setTotalePagine(response.payload.totalPages);
      }
    };

    fetchData();
  }, [dispatch, token, navigate, paginaCorrente]);

  const handleCambiaComponente = (tipo) => {
    setMostraComponente(tipo);
  };

  const handleSalvaPaziente = async (nuovoPaziente) => {
    const result = await dispatch(postNuovoPaziente(nuovoPaziente, token));

    if (result.success) {
      setShowModal(false);
      dispatch(fetchPazienti(token, paginaCorrente));
    } else {
      alert("Errore nel salvataggio del paziente");
    }
  };

  return (
    <Container className="my-4">
      {/* Header */}
      <div className="d-flex align-items-center">
        <h2 className="me-auto">Pazienti</h2>
        <Image src={logo} alt="Logo" fluid style={{ width: "150px" }} />
      </div>

      {/* Aggiungi paziente */}
      <Button variant="success" onClick={() => setShowModal(true)} className="my-3">
        <i className="bi bi-person-plus me-2"></i>Aggiungi paziente
      </Button>

      {/* Modale nuovo paziente */}
      <ModaleNuovoPaziente
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleSalvaPaziente}
      />

      {/* Navigazione + Switch vista */}
      <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
        {/* Paginazione */}
        <div className="d-flex align-items-center">
          <Button
            variant="outline-secondary"
            onClick={() => setPaginaCorrente((prev) => Math.max(prev - 1, 0))}
            disabled={paginaCorrente === 0}
            className="me-2"
          >
            ← Precedente
          </Button>
          <span>
            Pagina {paginaCorrente + 1} di {totalePagine}
          </span>
          <Button
            variant="outline-secondary"
            onClick={() =>
              setPaginaCorrente((prev) => Math.min(prev + 1, totalePagine - 1))
            }
            disabled={paginaCorrente >= totalePagine - 1}
            className="ms-2"
          >
            Successiva →
          </Button>
        </div>

        {/* Switch visuale */}
        <div className="d-flex">
          <div
            className={`border rounded-start p-2 bg-white ${
              mostraComponente === "card" ? "text-success" : ""
            }`}
            onClick={() => handleCambiaComponente("card")}
            style={{ cursor: "pointer" }}
          >
            <i className="bi bi-grid"></i>
          </div>
          <div
            className={`border border-start-0 rounded-end p-2 bg-white ${
              mostraComponente === "list" ? "text-success" : ""
            }`}
            onClick={() => handleCambiaComponente("list")}
            style={{ cursor: "pointer" }}
          >
            <i className="bi bi-list"></i>
          </div>
        </div>
      </div>

      {/* Contenuto */}
      <Container className="bg-white rounded-3 px-0 mb-2">
        <Row xs={mostraComponente === "card" ? 4 : 1}>
          {utenti && utenti.length > 0 && mostraComponente === "card" &&
            utenti.map((utente) => (
              <Col key={utente.id} className="mb-4">
                <CardPazienti utente={utente} />
              </Col>
            ))}

          {utenti && utenti.length > 0 && mostraComponente === "list" && (
            <Col>
              {utenti.map((utente) => (
                <div
                  key={utente.id}
                  className="d-flex justify-content-between align-items-center border-bottom py-2 px-3"
                >
                  <div className="d-flex align-items-center">
                    <Image
                      src={
                        utente.avatar ||
                        "https://via.placeholder.com/40x40.png?text=👤"
                      }
                      alt={`${utente.nome} ${utente.cognome}`}
                      roundedCircle
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                        marginRight: "12px",
                      }}
                    />
                    <span>
                      <h5>{utente.cognome}</h5>
                    </span>{" "}
                    <span>
                      <p>{utente.nome}</p>
                    </span>
                  </div>

                  <Link
                    to={`/paginaProfilo/${utente.id}`}
                    state={utente}
                    className="btn btn-primary d-flex align-items-center"
                  >
                    Vai al profilo
                  </Link>
                </div>
              ))}
            </Col>
          )}
        </Row>
      </Container>
    </Container>
  );
};

export default PaginaPazienti;
