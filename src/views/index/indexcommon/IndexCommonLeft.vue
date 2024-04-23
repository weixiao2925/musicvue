<script setup>

import {reactive, ref, watch} from "vue";
import {House, Notification, Operation} from "@element-plus/icons-vue";

const data=reactive({
  test:"www",
})

//默认状态（true为伸展）
const isCollapse=ref(true)
const index_c=ref('/index')
const handleOpen=(key,keyPath)=>{
  console.log(key,keyPath)
}
const handleClose=(key,keyPath)=>{
  console.log(key,keyPath)
}
//伸缩按钮
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};
//跳转



</script>

<template>
  <div >
    <div>
      <div id="menu_left" style="float:left;height: 100%;">
        <div v-if="!isCollapse" style="padding: 10px 10px 10px 20px;">xxx管理系统</div>
        <el-menu
            :default-active="index_c"
            :collapse="isCollapse"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            style="height: 100vh"
            :router="true"
        >
          <el-menu-item index="/index">
            <el-icon size="15px"><House /></el-icon>
            <template #title>系统首页</template>
          </el-menu-item>
          <el-menu-item index="/index-user">
            <el-icon size="15px"><Notification /></el-icon>
            <template #title>用户管理</template>
          </el-menu-item>
          <el-menu-item index="/index-singer">
            <el-icon size="15px"><Notification /></el-icon>
            <template #title>xx管理</template>
          </el-menu-item>
          <el-menu-item index="/index-playlist">
            <el-icon size="15px"><Notification /></el-icon>
            <template #title>xx管理</template>
          </el-menu-item>
        </el-menu>
      </div>
      <div style="float:left;">
        <el-radio-group v-model="isCollapse">
          <el-button @click="toggleCollapse" style="height: 2rem" plain >
            <el-icon ><Operation /></el-icon>
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
  background-color: #cee7c9;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 150px;
  height: 100vh;
}
</style>