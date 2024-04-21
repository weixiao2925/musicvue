<script setup>

import {reactive, ref} from "vue";
import {House, Location, MoreFilled, Notification, Operation} from "@element-plus/icons-vue";

const data=reactive({
  test:"www",
})

//默认状态（true为伸展）
const isCollapse=ref(true)
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
</script>

<template>
  <div id="menu_left" style="float: left;">
    <div>
      <div style="float:left;">
        <div v-if="!isCollapse" style="padding: 10px 10px 10px 20px;">xxx管理系统</div>
        <el-menu
            default-active="1"
            :collapse="isCollapse"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
        >
          <el-menu-item index="1">
            <el-icon size="15px"><House /></el-icon>
            <template #title>系统首页</template>
          </el-menu-item>
          <el-menu-item index="2">
            <el-icon size="15px"><Notification /></el-icon>
            <template #title>用户管理</template>
          </el-menu-item>
          <el-menu-item index="3">
            <el-icon size="15px"><Notification /></el-icon>
            <template #title>xx管理</template>
          </el-menu-item>
          <el-menu-item index="3">
            <el-icon size="15px"><Notification /></el-icon>
            <template #title>xx管理</template>
          </el-menu-item>
        </el-menu>
      </div>
      <div style="float:left;">
        <el-radio-group v-model="isCollapse">
          <el-button @click="toggleCollapse">
            <el-icon><Operation /></el-icon>
          </el-button>
        </el-radio-group>
      </div>
    </div>
  </div>
  <div id="menu_top" style="float:right;">
    <div style="float: right">
      <el-dropdown  type="primary">
        <div>
          <div style="float:left;padding: 10px 0 0 0;">
            <el-avatar :size="'default'" style=""/>
          </div>
          <div style="font-size: 1.2rem;float: right;padding: 15px ;">
            {{data.test}}
          </div>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>

</template>

<style scoped>
  #menu_top{
    width: auto;
    height: 3rem;
    background-color: #11ff00;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
  }
</style>