import { Col, Container, Row, Image, Button, Form, Alert, Placeholder } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchPazienti, postNuovoPaziente, fetchPazientiByNomeCognome } from "../../redux/actions";
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

  const [nomeRicerca, setNomeRicerca] = useState("");
  const [cognomeRicerca, setCognomeRicerca] = useState("");
  const [listaFiltrata, setListaFiltrata] = useState(null);
  const [alertNessunRisultato, setAlertNessunRisultato] = useState(false);

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isSmallScreen) {
      setMostraComponente("list");
    }
  }, [isSmallScreen]);

  const caricaPazienti = async (pagina = 0) => {
    const response = await dispatch(fetchPazienti(token, pagina));
    if (response?.payload?.totalPages !== undefined) {
      setTotalePagine(response.payload.totalPages);
    }
  };

  useEffect(() => {
    const isValidToken = token && token !== "null" && token !== "undefined";
    if (!isValidToken) {
      navigate("/login");
      return;
    }
    if (listaFiltrata === null) {
      caricaPazienti(paginaCorrente);
    }
  }, [dispatch, token, navigate, paginaCorrente, listaFiltrata]);

  const handleCambiaComponente = (tipo) => {
    if (!isSmallScreen) {
      setMostraComponente(tipo);
    }
  };

  const handleSalvaPaziente = async (nuovoPaziente) => {
    const payloadSanificato = {
      pazienteRequest: { ...nuovoPaziente.pazienteRequest },
      password: nuovoPaziente.password,
    };

    delete payloadSanificato.pazienteRequest.avatar;
    delete payloadSanificato.pazienteRequest.id;

    if (!payloadSanificato.password || payloadSanificato.password.trim() === "") {
      delete payloadSanificato.password;
    }

    const result = await dispatch(postNuovoPaziente(payloadSanificato, token));

    if (result.success) {
      setShowModal(false);
      setListaFiltrata(null);
      setPaginaCorrente(0);
      await caricaPazienti(0);
    } else {
      alert("Errore nel salvataggio del paziente");
    }
  };

  const handleRicerca = async (e) => {
    e.preventDefault();

    if (!nomeRicerca.trim() && !cognomeRicerca.trim()) {
      setListaFiltrata(null);
      setAlertNessunRisultato(false);
      setMostraComponente("card");
      return;
    }

    try {
      const risultati = await dispatch(fetchPazientiByNomeCognome(token, nomeRicerca.trim(), cognomeRicerca.trim()));
      const dati = risultati.payload || risultati;

      if (Array.isArray(dati)) {
        if (dati.length === 0) {
          setAlertNessunRisultato(true);
          setListaFiltrata([]);
        } else {
          setAlertNessunRisultato(false);
          setListaFiltrata(dati);
          setMostraComponente(dati.length === 1 ? "singleCard" : "list");
        }
      } else {
        setAlertNessunRisultato(true);
        setListaFiltrata([]);
      }
    } catch {
      setAlertNessunRisultato(true);
      setListaFiltrata([]);
    }
  };

  const chiudiAlert = () => {
    setAlertNessunRisultato(false);
    setListaFiltrata(null);
    setNomeRicerca("");
    setCognomeRicerca("");
    setMostraComponente("card");
    caricaPazienti(paginaCorrente);
  };

  const listaDaMostrare = listaFiltrata !== null ? listaFiltrata : utentiRedux;

  return (
    <>
      <Container>
        <div className="d-flex align-items-center">
          <h2 className="me-auto">Pazienti</h2>
          <Image src={logo} alt="Logo" fluid style={{ width: "150px" }} />
        </div>
      </Container>

      <Container>
        <Form onSubmit={handleRicerca} className="mb-3" style={{ maxWidth: "600px" }}>
          <Row className="g-2 align-items-center">
            <Col xs={12} md={5}>
              <Form.Control type="text" placeholder="Nome" value={nomeRicerca} onChange={(e) => setNomeRicerca(e.target.value)} size="sm" />
            </Col>
            <Col xs={12} md={5}>
              <Form.Control type="text" placeholder="Cognome" value={cognomeRicerca} onChange={(e) => setCognomeRicerca(e.target.value)} size="sm" />
            </Col>
            <Col xs={12} md={2}>
              <Button type="submit" size="sm" className="d-flex justify-content-center align-items-center p-0" variant="outline-primary" style={{ borderRadius: "50%", width: "36px", height: "36px" }} title="Cerca">
                <Search color="#0d6efd" size={20} />
              </Button>
            </Col>
          </Row>
        </Form>

        {listaFiltrata && listaFiltrata.length > 0 && !alertNessunRisultato && (
          <Button variant="primary" size="sm" onClick={chiudiAlert} className="mb-3 me-3 p-2 rounded-2">
            Azzera ricerca
          </Button>
        )}

        {(!listaFiltrata || alertNessunRisultato) && (
          <Button variant="success" onClick={() => setShowModal(true)} className="mb-3">
            <i className="bi bi-person-plus me-2"></i>Aggiungi paziente
          </Button>
        )}

        {alertNessunRisultato && (
          <div className="text-center py-5">
            <Alert variant="warning" dismissible onClose={chiudiAlert} className="mt-5 mx-auto" style={{ maxWidth: "600px" }}>
              Nessun paziente trovato per la ricerca
            </Alert>
            <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="Nessun risultato" className="mt-5" style={{ width: "200px", opacity: 0.6 }} />
          </div>
        )}

        {!alertNessunRisultato && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center">
                <Button variant="outline-primary" onClick={() => setPaginaCorrente((prev) => Math.max(prev - 1, 0))} disabled={paginaCorrente === 0} className="me-2" size="sm">←</Button>
                <span className="pagination-text">Pagina {paginaCorrente + 1} di {totalePagine}</span>
                <Button variant="outline-primary" onClick={() => setPaginaCorrente((prev) => Math.min(prev + 1, totalePagine - 1))} disabled={paginaCorrente >= totalePagine - 1} className="ms-2" size="sm">→</Button>
              </div>

              {!isSmallScreen && mostraComponente !== "singleCard" && (
                <div className="d-flex">
                  <div className={`border rounded-start p-2 bg-white ${mostraComponente === "card" ? "text-success" : ""}`} onClick={() => handleCambiaComponente("card")} style={{ cursor: "pointer" }}>
                    <i className="bi bi-grid"></i>
                  </div>
                  <div className={`border border-start-0 rounded-end p-2 bg-white ${mostraComponente === "list" ? "text-success" : ""}`} onClick={() => handleCambiaComponente("list")} style={{ cursor: "pointer" }}>
                    <i className="bi bi-list"></i>
                  </div>
                </div>
              )}
            </div>

            <Container className="bg-white rounded-3 px-0 mb-2">
              {listaFiltrata === null && utentiRedux.length === 0 ? (
                <Row className="p-4">
                  {[...Array(12)].map((_, index) => (
                    <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
                      <div className="border rounded shadow-sm p-3 text-center">
                        <Placeholder animation="wave">
                          <Placeholder as="div" className="rounded-circle mx-auto mb-3" style={{ width: "80px", height: "80px" }} />
                          <Placeholder xs={8} className="mb-2" />
                          <Placeholder xs={6} />
                        </Placeholder>
                      </div>
                    </Col>
                  ))}
                </Row>
              ) : mostraComponente === "singleCard" && listaDaMostrare.length === 1 ? (
                <Row className="justify-content-center">
                  <Col xs={10} sm={8} md={4} lg={3}>
                    <CardPazienti utente={listaDaMostrare[0]} />
                  </Col>
                </Row>
              ) : (
                <Row xs={mostraComponente === "card" ? 4 : 1}>
                  {mostraComponente === "card"
                    ? listaDaMostrare.map((utente) => (
                        <Col key={utente.id} className="mb-4">
                          <CardPazienti utente={utente} />
                        </Col>
                      ))
                    : (
                      <Col>
                        {listaDaMostrare.map((utente) => (
                          <div key={utente.id} className="d-flex justify-content-between align-items-center border-bottom py-2 px-3">
                            <div className="d-flex align-items-center mb-2">
                              <Image src={utente.avatar || "https://via.placeholder.com/40x40.png?text=👤"} alt={`${utente.nome} ${utente.cognome}`} roundedCircle style={{ width: "40px", height: "40px", objectFit: "cover", marginRight: "12px" }} />
                              <div>
                                <h5 className="mb-0">{utente.cognome}</h5>
                                <p className="mb-0 text-muted small">{utente.nome}</p>
                              </div>
                            </div>
                            <Link to={`/paginaProfilo/${utente.id}`} state={utente} className="btn btn-primary d-flex align-items-center">Vai al profilo</Link>
                          </div>
                        ))}
                      </Col>
                    )}
                </Row>
              )}
            </Container>
          </>
        )}
      </Container>

      <ModaleNuovoPaziente show={showModal} onHide={() => setShowModal(false)} onSubmit={handleSalvaPaziente} />
    </>
  );
};

export default PaginaPazienti;


