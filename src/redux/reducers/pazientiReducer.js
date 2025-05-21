import { SET_PAZIENTI_RICERCA } from "../actions";


const initialState = {
  pazientiRicerca: [],
};

const pazientiReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PAZIENTI_RICERCA:
      return {
        ...state,
        pazientiRicerca: action.payload,
      };
    default:
      return state;
  }
};

export default pazientiReducer;