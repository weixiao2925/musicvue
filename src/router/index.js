import {createRouter,createWebHistory} from "vue-router";
import {unauthorized_} from "@/net/index.js";

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
                path:"/index-song_P",
                name:"index-song_P",
                component:()=>import("@/views/index/IndexSongManagement_P.vue")
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
            // {
            //     path:"/index-singerEditor",
            //     name:"index-singerEditor",
            //     component:()=>import("@/views/index/indexSingerManagement/IndexSingerEditingPage.vue")
            // }

        ]
    }

]

const router=createRouter({
    history:createWebHistory(),
    routes
})
// 路由守卫
router.beforeEach((to,from,next)=>{
    const isUnauthorized=unauthorized_()
    if (to.name.startsWith('welcome-')&& !isUnauthorized){//已经登录了，就不能访问welcome-的页面，直接定向到index页面
        next('/index')
    }else if (to.fullPath.startsWith('/index')&& isUnauthorized){//要是用户没登陆直接访问index就定向到/
        next('/')
    }else {//正常情况就正常访问
        next()
    }
})
export default router;
