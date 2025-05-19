import { combineReducers, configureStore } from "@reduxjs/toolkit";
import newsReducer from "../reducers/newsReducer";
import userReducer from "../reducers/userReducer";
import utenteReducer from "../reducers/utentiReducer";

const mainReducer = combineReducers({
    news: newsReducer,
    user: userReducer,
    utenti: utenteReducer
});

const store = configureStore({
    reducer: mainReducer,
});

export default store;