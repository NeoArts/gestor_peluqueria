import { createStore } from "vuex";

export default createStore({
    state: {
        isAuthenticated: false,
        user: null,
        photoName: null,
        InvComponents: 0,
        proEdit: null,
        CliComponents: 0,
        cliEdit: null,
        SerComponents: 0,
        serEdit: null,
        CajaInv: 0,

    },
    mutations: {
        setAuthenticated(state, value){
            state.isAuthenticated = value;
        },
        setUser(state, value){
            state.user = value
        },
        setPhotoName(state, value){
            state.photoName = value
        }
    },
});