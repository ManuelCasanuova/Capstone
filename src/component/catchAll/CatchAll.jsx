import { Container, Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router";

const CatchAll = () => {
  const navigate = useNavigate();

  return (
    <Container
      className="text-center my-5 d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "70vh" }}
    >
      <Image
        src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
        alt="Risorsa non trovata"
        style={{ width: 150, marginBottom: 30, opacity: 0.6 }}
        rounded
      />
      <h1 className="display-4 mb-3">404 - Pagina non trovata</h1>
      <p className="mb-4 fs-5 text-muted">
        Siamo spiacenti, la pagina che stai cercando non esiste o non è disponibile.
      </p>
      <Button variant="primary" size="lg" onClick={() => navigate("/dashboard")}>
        Torna alla Dashboard
      </Button>
    </Container>
  );
};

export default CatchAll;
