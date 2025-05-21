import { Col, Container, Row, Image, Button, Form, Alert, InputGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchPazienti, postNuovoPaziente } from "../../redux/actions";
import CardPazienti from "./CardPazienti";
import ModaleNuovoPaziente from "../modali/ModaleNuovoPaziente";
import logo from "../../assets/Logo.png";
import { Search } from "react-bootstrap-icons";

const PaginaPazienti = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const utentiRedux = useSelector((state) => state.utenti.utenti);

  const token = localStorage.getItem("token");

  const [mostraComponente, setMostraComponente] = useState("card");
  const [showModal, setShowModal] = useState(false);
  const [paginaCorrente, setPaginaCorrente] = useState(0);
  const [totalePagine, setTotalePagine] = useState(1);

  const [ricercaNome, setRicercaNome] = useState("");
  const [listaFiltrata, setListaFiltrata] = useState(null);
  const [alertNessunRisultato, setAlertNessunRisultato] = useState(false);

  useEffect(() => {
    const isValidToken = token && token !== "null" && token !== "undefined";
    if (!isValidToken) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      if (listaFiltrata === null) {
        const response = await dispatch(fetchPazienti(token, paginaCorrente));
        if (response?.payload?.totalPages !== undefined) {
          setTotalePagine(response.payload.totalPages);
        }
      }
    };

    fetchData();
  }, [dispatch, token, navigate, paginaCorrente, listaFiltrata]);

  const handleCambiaComponente = (tipo) => {
    setMostraComponente(tipo);
  };

  const handleSalvaPaziente = async (nuovoPaziente) => {
    const result = await dispatch(postNuovoPaziente(nuovoPaziente, token));
    if (result.success) {
      setShowModal(false);
      setListaFiltrata(null);

      const response = await dispatch(fetchPazienti(token, paginaCorrente));
      if (response?.payload?.totalPages !== undefined) {
        setTotalePagine(response.payload.totalPages);
      }

      if (utentiRedux.length >= 10 && paginaCorrente === totalePagine - 1) {
        setPaginaCorrente((prev) => prev + 1);
      }
    } else {
      alert("Errore nel salvataggio del paziente");
    }
  };

  const handleRicerca = async (e) => {
    e.preventDefault();
    const nome = ricercaNome.trim();

    if (!nome) {
      setListaFiltrata(null);
      setAlertNessunRisultato(false);
      return;
    }

    const response = await dispatch(fetchPazienti(token, 0, nome));

    if (response.success) {
      if (response.payload.content.length === 0) {
        setAlertNessunRisultato(true);
        setListaFiltrata([]);
      } else {
        setAlertNessunRisultato(false);
        setListaFiltrata(response.payload.content);
      }
    } else {
      setAlertNessunRisultato(true);
      setListaFiltrata([]);
    }
  };

  const chiudiAlert = () => {
    setAlertNessunRisultato(false);
    setListaFiltrata(null);
    setRicercaNome("");
  };

  const listaDaMostrare = listaFiltrata !== null ? listaFiltrata : utentiRedux;

  return (
    <>
      <Container className="mb-3">
        <div className="d-flex align-items-center">
          <h2 className="me-auto">Pazienti</h2>
          <Image src={logo} alt="Logo" fluid style={{ width: "150px" }} />
        </div>
      </Container>

      <Container>
        <Form onSubmit={handleRicerca} className="mb-3" style={{ maxWidth: "400px" }}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Cerca paziente per cognome o nome"
              value={ricercaNome}
              onChange={(e) => setRicercaNome(e.target.value)}
              size="sm"
            />
            <Button type="submit" size="sm" className="p-2 border bg-white">
              <Search color="#053961" />
            </Button>
          </InputGroup>
        </Form>

        {alertNessunRisultato && (
          <div className="text-center py-5">
            <Alert
              variant="warning"
              dismissible
              onClose={chiudiAlert}
              className="mt-5 mx-auto"
              style={{ maxWidth: "600px" }}
            >
              Nessun paziente trovato per la ricerca "{ricercaNome}"
            </Alert>
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
              alt="Nessun risultato"
              className="mt-5"
              style={{ width: "200px", opacity: 0.6 }}
            />
          </div>
        )}

        {!alertNessunRisultato && (
          <>
            <Button variant="success" onClick={() => setShowModal(true)} className="mb-3">
              <i className="bi bi-person-plus me-2"></i>Aggiungi paziente
            </Button>

            <ModaleNuovoPaziente show={showModal} onHide={() => setShowModal(false)} onSubmit={handleSalvaPaziente} />

            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center">
                <Button
                  variant="outline-secondary"
                  onClick={() => setPaginaCorrente((prev) => Math.max(prev - 1, 0))}
                  disabled={paginaCorrente === 0}
                  className="me-2"
                  size="sm"
                >
                  ← Precedente
                </Button>
                <span className="pagination-text">
                  Pagina {paginaCorrente + 1} di {totalePagine}
                </span>
                <Button
                  variant="outline-secondary"
                  onClick={() => setPaginaCorrente((prev) => Math.min(prev + 1, totalePagine - 1))}
                  disabled={paginaCorrente >= totalePagine - 1}
                  className="ms-2"
                  size="sm"
                >
                  Successiva →
                </Button>
              </div>

              <div className="d-flex">
                <div
                  className={`border rounded-start p-2 bg-white ${mostraComponente === "card" ? "text-success" : ""}`}
                  onClick={() => handleCambiaComponente("card")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="bi bi-grid"></i>
                </div>
                <div
                  className={`border border-start-0 rounded-end p-2 bg-white ${mostraComponente === "list" ? "text-success" : ""}`}
                  onClick={() => handleCambiaComponente("list")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="bi bi-list"></i>
                </div>
              </div>
            </div>

            <Container className="bg-white rounded-3 px-0 mb-2">
              <Row xs={mostraComponente === "card" ? 4 : 1}>
                {listaDaMostrare && listaDaMostrare.length > 0 &&
                  (mostraComponente === "card" ? (
                    listaDaMostrare.map((utente) => (
                      <Col key={utente.id} className="mb-4">
                        <CardPazienti utente={utente} />
                      </Col>
                    ))
                  ) : (
                    <Col>
                      {listaDaMostrare.map((utente) => (
                        <div
                          key={utente.id}
                          className="d-flex justify-content-between align-items-center border-bottom py-2 px-3"
                        >
                          <div className="d-flex align-items-center">
                            <Image
                              src={utente.avatar || "https://via.placeholder.com/40x40.png?text=👤"}
                              alt={`${utente.nome} ${utente.cognome}`}
                              roundedCircle
                              style={{ width: "40px", height: "40px", objectFit: "cover", marginRight: "12px" }}
                            />
                            <div>
                              <h5 className="mb-0">{utente.cognome}</h5>
                              <p className="mb-0 text-muted small">{utente.nome}</p>
                            </div>
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
                  ))
                }
              </Row>
            </Container>
          </>
        )}
      </Container>
    </>
  );
};

export default PaginaPazienti;
