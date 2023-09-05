//this file contains actions for searchError state. When value is true an error will be shown, when false an error will not be
//shown.

import { createSlice } from "@reduxjs/toolkit";

export const searchErrorSlice = createSlice({
    name: "searchError",
    initialState: {
        value: false
    },
    reducers: {
        setError: (state) => {
            state.value = true;
        },
        removeError: (state) => {
            state.value = false;
        }
    }
});

export const { setError, removeError } = searchErrorSlice.actions;

export default searchErrorSlice.reducer;
