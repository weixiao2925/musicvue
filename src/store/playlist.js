import { defineStore } from 'pinia';

export const playlistInfoStore = defineStore('playlist', {
    state: () => ({
        playlist_id:null,
        playlist_name: null,
    }),
    persist: {
        storage: sessionStorage,
    },
});