import {defineStore} from "pinia";

export const usersInfoStore = defineStore('users', {
    state: () => ({
        email:null,
        name: null,
        role: null,
    }),
    persist: {
        storage: sessionStorage,
    },
});