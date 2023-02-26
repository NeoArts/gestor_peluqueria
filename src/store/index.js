import { createStore } from "vuex";

export default createStore({
    state: {
        isAuthenticated: false,
        user: null,
        photoName: null
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