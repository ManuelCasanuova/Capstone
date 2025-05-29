import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router";

const SideBar = ({ pazienteId }) => {
  const navigate = useNavigate();

  const vociMenu = [
    { label: "Anamnesi", path: "/anamnesi" },
    { label: "Appuntamenti", path: `/appuntamenti/${pazienteId}` },
    { label: "Diagnosi", path: `/diagnosi/${pazienteId}` },
    { label: "Esami", path: `/esami/${pazienteId}` },
    { label: "Piano terapeutico", path: "/piano-terapeutico" },
    { label: "Prescrizioni", path: "/prescrizioni" },
  ];

  return (
    <Container className="mt-4">
      {/* Vista Desktop */}
      <div className="d-none d-md-block">
        {vociMenu.map((voce, index) => {
          const classes = [
            "border",
            "colorDiv",
            "p-4",
            index === 0 ? "rounded-top-3" : "",
            index === vociMenu.length - 1 ? "rounded-bottom-3 shadow-sm" : "",
          ].join(" ");

          return (
            <div
              key={voce.label}
              className={classes}
              style={{ color: "#074662", cursor: "pointer" }}
              onClick={() => navigate(voce.path)}
            >
              {voce.label}
            </div>
          );
        })}
      </div>

   
      <div className="d-flex d-md-none flex-wrap gap-2 justify-content-center">
        {vociMenu.map((voce) => (
          <Button
            key={voce.label}
            variant="info"
            className="rounded-pill text-white px-3 py-2"
            style={{ backgroundColor: "#074662", border: "none", fontSize: "0.85rem" }}
            onClick={() => navigate(voce.path)}
          >
            {voce.label}
          </Button>
        ))}
      </div>
    </Container>
  );
};

export default SideBar;


