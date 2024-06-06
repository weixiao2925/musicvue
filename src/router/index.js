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
                component:()=>import("@/views/index/IndexUserManagement.vue"),
                children:[

                ]
            },
            {
                path:"/index-singer",
                name:"index-singer",
                component:()=>import("@/views/index/IndexSingerManagement.vue")
            },{
                path:"/index-playlist",
                name:"index-playlist",
                component:()=>import("@/views/index/IndexPlaylistManagement.vue")
            },{
                path:"/index-song",
                name:"index-song",
                component:()=>import("@/views/index/IndexSongManagement.vue")
            },{
                path:"/index-individual",
                name:"index-individual",
                component:()=>import("@/views/index/IndexPersonalPage.vue")
            },
            {
                path:"/index-test",
                name:"index-test",
                component:()=>import("@/views/index/Test.vue")
            },
            {
                path:"/index-userEditor",
                name:"index-userEditor",
                component:()=>import("@/views/index/indexUserManagement/UserEditingPage.vue")
            },
            {
                path:"/index-singerEditor",
                name:"index-singerEditor",
                component:()=>import("@/views/index/indexSingerManagement/IndexEditingPage.vue")
            }

        ]
    }

]

const router=createRouter({
    history:createWebHistory(),
    routes
})

export default router;