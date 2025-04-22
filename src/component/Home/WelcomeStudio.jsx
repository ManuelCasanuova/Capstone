import { Container } from "react-bootstrap";

function WelcomeStudio() {
  return (
   <Container className="bg-white rounded-3 p-4 border">
        <h1 className="fs-4">Benvenuto nello Studio Medico</h1>
        <p className="text-muted">
            Qui puoi gestire i tuoi pazienti, referti e appuntamenti in modo semplice e veloce.
        </p>
        <p className="text-muted">
            Utilizza il menu per navigare tra le diverse sezioni.
        </p>

   </Container>
  );
}

export default WelcomeStudio;