import {defineStore} from "pinia";

export const menuInfoStore = defineStore('menu', {
    state: () => ({
        index_route: '/index'
    }),
    actions: {
        setIndexRoute(route) {
            this.index_route = route;
        }
    },
    persist: {
        storage: sessionStorage,
    },
});