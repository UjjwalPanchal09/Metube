import { createSlice } from "@reduxjs/toolkit";

const registerSlice = createSlice({
    name : "register",
    initialState : {
        user : null,
        registered : false,
        loading: false,
        error : null
    },
    reducers : {
        registrationStart: (state) => {
            state.loading = true;
            state.registered = false;
            state.error = null;
        },
        registrationSuccess: (state,action) => {
            state.user = action.payload;
            state.registered = true;
            state.loading = false;
            state.error = null;
        },
        registrationFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.registered = false;
        }        
    }
})

export const { registrationStart, registrationSuccess, registrationFailure } = registerSlice.actions;

export default registerSlice.reducer;