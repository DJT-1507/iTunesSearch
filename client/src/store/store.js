//reduc store file, defines the action reducers

import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from "./actions/loading";
import searchErrorReducer from "./actions/searchError";

export default configureStore({
    reducer: {
        loading: loadingReducer,
        searchError: searchErrorReducer
    }
});
