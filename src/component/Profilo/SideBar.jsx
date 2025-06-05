import { Container, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router";

const SideBar = ({ pazienteId }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const vociMenu = [
    { label: "Anamnesi", path: `/anamnesi/${pazienteId}` },
    { label: "Appuntamenti", path: `/appuntamenti/${pazienteId}` },
    { label: "Diagnosi", path: `/diagnosi/${pazienteId}` },
    { label: "Esami", path: `/esami/${pazienteId}` },
    { label: "Piano terapeutico", path:  `/piano-terapeutico/${pazienteId}` },
    { label: "Prescrizioni", path: "/prescrizioni" },
  ];

  return (
    <Container className="mt-4">
      <div className="d-none d-md-block">
        {vociMenu.map((voce, index) => {
          const isActive = location.pathname === voce.path;
          const classes = [
            "border",
            "colorDiv",
            "p-4",
            isActive ? "bg-primary text-white" : "",
            index === 0 ? "rounded-top-3" : "",
            index === vociMenu.length - 1 ? "rounded-bottom-3 shadow-sm" : "",
          ].join(" ");

          return (
            <div
              key={voce.label}
              className={classes}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(voce.path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") navigate(voce.path);
              }}
              aria-current={isActive ? "page" : undefined}
            >
              {voce.label}
            </div>
          );
        })}
      </div>

      <div className="d-flex d-md-none flex-wrap gap-2 justify-content-center">
        {vociMenu.map((voce) => {
          const isActive = location.pathname === voce.path;
          return (
            <Button
              key={voce.label}
              variant={isActive ? "primary" : "info"}
              className="rounded-pill text-white px-3 py-2"
              style={{ border: "none", fontSize: "0.85rem" }}
              onClick={() => navigate(voce.path)}
            >
              {voce.label}
            </Button>
          );
        })}
      </div>
    </Container>
  );
};

export default SideBar;


