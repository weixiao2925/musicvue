<script setup>
import {reactive} from "vue";
import {userInfoStore} from "@/store/user.js";
import {logout} from "@/net/index.js";
import {useRouter} from "vue-router";



//跳转
const router=useRouter()
function goTo(route) {
  router.push(route)
}

function lougoutP() {
  logout(()=>{
    goTo('/')
  })
}
function personage() {
    goTo('/index-individual')
}

//公共仓库
const userStore=userInfoStore()
// console.log(userStore.name)
//用户信息赋值
const tableData=reactive({
  test:userStore.name,
})

</script>

<template>
  <!--  顶部-->
  <div style="display:flex;">
    <div id="tabs-container" style="flex-grow: 1;background-color: #96ff7f">
      <!--        先占一行-->
    </div>
    <div id="menu_top" style="float:right;">
      <div style="float: right">
        <el-dropdown  type="primary">
          <div>
            <div style="float:left;padding: 1px 0 0 0;">
              <el-avatar :size="'default'" style=""/>
            </div>
            <transition name="el-fade-in">
              <div style="font-size: 1rem;float: right;padding: 10px ;">
                {{tableData.changeInfoDialog}}
              </div>
            </transition>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="personage">个人中心</el-dropdown-item>
              <el-dropdown-item @click="lougoutP">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<style scoped>
#menu_top{
  width: auto;
  height: 2.1rem;
  background-color: #11ff00;
}
#tabs-container {
  /* 确保tabs-container可以根据内容自动伸缩，并填充额外空间 */
  flex-grow: 1;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 150px;
  height: 100%;
}
</style>