import {createRouter,createWebHistory} from "vue-router";

const routes=[
    {
        path:"/",
        name:"welcome",
        component:()=>import("@/views/WelcomePage.vue"),
        children:[
            {
                path:"",
                name:"welcome-login",
                component:()=>import("@/views/welcome/LoginPage.vue"),
            }
        ]
    },
    {
        path:"/index",
        name:"index",
        component:()=>import("@/views/indexPage.vue")
    }

]

const router=createRouter({
    history:createWebHistory(),
    routes
})

export default router;