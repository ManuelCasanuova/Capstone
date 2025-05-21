import { Card } from "react-bootstrap";
import { Link } from "react-router";



const CardPazienti = ({ utente }) => {
  return (
    <Card className="shadow-sm text-center">
      <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
        <Card.Img
          variant="top"
          src={utente.avatar}
          style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }}
        />
      </div>
      <Card.Body>
        <h5>{utente.cognome}</h5>
        <p>{utente.nome}</p>
        <Link
          to={`/paginaProfilo/${utente.id}`}
          state={utente}
          className="btn btn-outline-primary w-100 mt-3"
        >
          Vai al profilo
        </Link>
      </Card.Body>
    </Card>
  );
};

export default CardPazienti;