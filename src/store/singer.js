import { defineStore } from 'pinia';

export const singerInfoStore = defineStore('singer', {
    state: () => ({
        singer_id:null,
        singer_name: null,
    }),
    persist: {
        storage: sessionStorage,
    },
});