import {defineStore} from "pinia";

export const usersInfoStore = defineStore('users', {
    state: () => ({
        id: null,
        email:null,
        name: null,
        role: null,
    }),
    persist: {
        storage: sessionStorage,
    },
});
