import { defineStore } from 'pinia';

export const userInfoStore = defineStore('user', {
    state: () => ({
        email:null,
        name: null,
        role: null,
    }),
    persist: {
        storage: localStorage,
    },
});