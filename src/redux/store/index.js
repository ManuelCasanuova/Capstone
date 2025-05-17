import { combineReducers, configureStore } from "@reduxjs/toolkit";
import newsReducer from "../reducers/newsReducer";
import userReducer from "../reducers/userReducer";

const mainReducer = combineReducers({
    news: newsReducer,
    user: userReducer
});

const store = configureStore({
    reducer: mainReducer,
});

export default store;