//this file contains the loading actions, when state value is true a loading wheel will be shown, when false wheel not shown

import { createSlice } from "@reduxjs/toolkit";

export const loadingSlice = createSlice({
    name: "loading",
    initialState: {
        value: false
    },
    reducers: {
        setLoading: (state) => {
            state.value = true;
        },
        setLoaded: (state) => {
            state.value = false;
        }
    }
});

export const { setLoading, setLoaded } = loadingSlice.actions;

export default loadingSlice.reducer;
