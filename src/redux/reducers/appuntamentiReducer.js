import { SET_APPUNTAMENTI, AGGIUNGI_APPUNTAMENTO, ELIMINA_APPUNTAMENTO, AGGIORNA_APPUNTAMENTO } from "../actions";

const initialState = {
  appuntamenti: [],
  
};

const appuntamentiReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_APPUNTAMENTI:
      return {
        ...state,
        appuntamenti: action.payload, 
      };

    case AGGIUNGI_APPUNTAMENTO:
      return {
        ...state,
        appuntamenti: [...state.appuntamenti, action.payload], 
      };

    case ELIMINA_APPUNTAMENTO:
      return {
        ...state,
        appuntamenti: state.appuntamenti.filter(app => app.id !== action.payload),
      };

     case AGGIORNA_APPUNTAMENTO:
      return {
        ...state,
        appuntamenti: state.appuntamenti.map((app) =>
        app.id === action.payload.id ? action.payload : app
        ),
      };

    default:
      return state;
  }
};


export default appuntamentiReducer;