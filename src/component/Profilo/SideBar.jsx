import { Container } from "react-bootstrap";
import { useNavigate } from "react-router";

const SideBar = ({ pazienteId }) => {
  const navigate = useNavigate();

  const vociMenu = [
    { label: "Anamnesi", path: "/anamnesi" },
    { label: "Esami", path: `/esami/${pazienteId}` },
    { label: "Prescrizioni", path: "/prescrizioni" },
    { label: "Piano terapeutico", path: "/piano-terapeutico" },
    { label: "Diagnosi", path: `/diagnosi/${pazienteId}` },
    { label: "Appuntamenti", path: `/appuntamenti/${pazienteId}` },
  ];

  return (
    <Container className="mt-4">
      {vociMenu.map((voce, index) => (
        <div
          key={voce.label}
          className={`border colorDiv p-4 ${index === 0 ? "rounded-top-3" : ""} ${index === vociMenu.length - 1 ? "rounded-bottom-3 shadow-sm" : ""}`}
          style={{ color: "#074662", cursor: "pointer" }}
          onClick={() => navigate(voce.path)}
        >
          {voce.label}
        </div>
      ))}
    </Container>
  );
};

export default SideBar;
