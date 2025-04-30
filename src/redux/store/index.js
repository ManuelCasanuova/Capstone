import { combineReducers, configureStore } from "@reduxjs/toolkit";
import newsReducer from "../reducers/newsReducer";

const mainReducer = combineReducers({
    news: newsReducer
});

const store = configureStore({
    reducer: mainReducer,
});

export default store;