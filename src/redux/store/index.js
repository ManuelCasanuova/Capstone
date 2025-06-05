import { combineReducers, configureStore } from "@reduxjs/toolkit";

import utenteReducer from "../reducers/utentiReducer";
import appuntamentiReducer from "../reducers/appuntamentiReducer";
import pazientiReducer from "../reducers/pazientiReducer";

const mainReducer = combineReducers({


    utenti: utenteReducer,
    appuntamenti: appuntamentiReducer,
    pazientiRicerca: pazientiReducer
});

const store = configureStore({
    reducer: mainReducer,
});

export default store;