<script setup>

import {ref} from "vue";
import {Avatar, House, Notification, Operation, User} from "@element-plus/icons-vue";
import {menuInfoStore} from "@/store/menu.js";
import {Icon} from "@iconify/vue";

// 获取仓库数据
const indexRouter=menuInfoStore()

//默认状态（true为伸展）
const isCollapse=ref(false)
const index_route=ref('/index')
const handleSelect=(key, keyPath)=>{
  // console.log(key,keyPath)
  indexRouter.setIndexRoute(key) // 使用 action 更新状态

}
const handleClose=(key,keyPath)=>{
  // console.log(key,keyPath)
}
//伸缩按钮
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};
//跳转



</script>

<template>
<!--  {{indexRouter.index_route}}-->
  <div >
    <div>
      <div id="menu_left" style="float:left;height: 100%;">
        <div v-if="!isCollapse" style="padding: 10px 0 10px 15px;text-align: left">
          <div style="">
            <el-image
                style="width:120px;"
                class="logo"
                src="https://element-plus.org/images/element-plus-logo.svg"
            />
          </div>
          <span style="color: #f3f3f3">
            音乐管理系统
          </span>
        </div>
        <el-menu
            :default-active="indexRouter.index_route"
            :collapse="isCollapse"
            class="el-menu-vertical-demo"
            @select="handleSelect"
            @close="handleClose"
            style="height: 100vh;"
            :router="true"
            background-color="#334155"
            text-color="#fff"
        >
          <el-menu-item index="/index">
            <el-icon size="15px"><House /></el-icon>
            <template #title >
                系统首页
            </template>
          </el-menu-item>
          <el-menu-item index="/index-user">
            <el-icon size="15px"><User /></el-icon>
            <template #title>用户管理</template>
          </el-menu-item>
          <el-menu-item index="/index-singer">
            <el-icon size="15px"><Avatar /></el-icon>
            <template #title>歌手管理</template>
          </el-menu-item>
          <el-menu-item index="/index-playlist">
            <el-icon size="15px"><Operation /></el-icon>
            <template #title>歌单管理</template>
          </el-menu-item>
        </el-menu>
      </div>
      <div style="float:left;background-color: #334155;">
        <el-radio-group v-model="isCollapse" >
          <el-button @click="toggleCollapse" style="height: 2rem;background-color: #334155;color: #f3f3f3" type="primary" >
            <el-icon style=""><Operation /></el-icon>
          </el-button>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<style scoped>

#menu_left{
  float: left;
  height: 100vh;
  background-color: #334155;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 150px;
  height: 100vh;
}
</style>
