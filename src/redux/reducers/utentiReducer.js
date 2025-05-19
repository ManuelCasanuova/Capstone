import { LOGOUT, SET_UTENTI, AGGIORNA_PAZIENTE, AGGIUNGI_PAZIENTE } from "../actions";



const utentiReducer = (state = { utenti: [] }, action) => {
  switch (action.type) {
    case SET_UTENTI:
      return { ...state, utenti: action.payload };

    case AGGIUNGI_PAZIENTE:
 
  const nuovaLista = [action.payload, ...state.utenti];
  nuovaLista.sort((a, b) => a.cognome.localeCompare(b.cognome));
  return {
    ...state,
    utenti: nuovaLista,
  };

  case AGGIORNA_PAZIENTE:
  const listaAggiornata = state.utenti.map((utente) =>
    utente.id === action.payload.id ? action.payload : utente
  );
  listaAggiornata.sort((a, b) => a.cognome.localeCompare(b.cognome));
  return {
    ...state,
    utenti: listaAggiornata,
  };

    case LOGOUT:
      return { ...state, utenti: [] };

    default:
      return state;
  }
};

export default utentiReducer;