import { Container } from "react-bootstrap";
import { useNavigate } from "react-router";

const SideBar = ({ pazienteId }) => {
  const navigate = useNavigate();

  return (
    <Container className="mt-4">

      <div
        className="border colorDiv rounded-top-3 p-4"
        style={{ color: "#074662", cursor: "pointer" }}
        onClick={() => navigate("/anamnesi")}
      >
        Anamnesi
      </div>

      <div
        className="border colorDiv p-4"
        style={{ color: "#074662", cursor: "pointer" }}
        onClick={() => navigate("/esami")}
      >
        Esami
      </div>

      <div
        className="border colorDiv p-4"
        style={{ color: "#074662", cursor: "pointer" }}
        onClick={() => navigate("/prescrizioni")}
      >
        Prescrizioni
      </div>

      <div
        className="border colorDiv p-4"
        style={{ color: "#074662", cursor: "pointer" }}
        onClick={() => navigate("/piano-terapeutico")}
      >
        Piano terapeutico
      </div>

       <div
        className="border colorDiv p-4"
        style={{ color: "#074662", cursor: "pointer" }}
        onClick={() => navigate(`/diagnosi/${pazienteId}`)}
      >
        Diagnosi
      </div>

      <div
        className="border colorDiv shadow-sm rounded-bottom-3 p-4"
        style={{ color: "#074662", cursor: "pointer" }}
        onClick={() => navigate(`/appuntamenti/${pazienteId}`)}
      >
        Appuntamenti
      </div>

    </Container>
  );
};

export default SideBar;
