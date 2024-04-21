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
        component:()=>import("@/views/indexPage.vue"),
        children: [
            {
                path:"",
                name:"index-home",
                component:()=>import("@/views/index/IndexHome.vue")
            },
            {
                path:"/index-user",
                name:"index-user",
                component:()=>import("@/views/index/IndexUserManagement.vue")
            },
            {
                path:"/index-singer",
                name:"index-singer",
                component:()=>import("@/views/index/IndexSingerManagement.vue")
            }
        ]
    }

]

const router=createRouter({
    history:createWebHistory(),
    routes
})

export default router;