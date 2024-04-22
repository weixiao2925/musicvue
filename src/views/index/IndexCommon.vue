<script setup>

import {reactive, ref, watch} from "vue";
import {House, Notification, Operation} from "@element-plus/icons-vue";
import {useRouter} from "vue-router";

const data=reactive({
  test:"www",
})

//默认状态（true为伸展）
const isCollapse=ref(true)
const index_c=ref('1')
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
  <div id="menu_left" style="float: left;height: 100vh;background-color: #cee7c9">
    <div>
      <div style="float:left;height: 100%;">
        <div v-if="!isCollapse" style="padding: 10px 10px 10px 20px;">xxx管理系统</div>
        <el-menu
            :default-active="index_c"
            :collapse="isCollapse"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
        >

          <el-menu-item index="1" >
            <el-icon size="15px"><House /></el-icon>
            <template #title>系统首页</template>
          </el-menu-item>
          <el-menu-item index="2" >
            <el-icon size="15px"><Notification /></el-icon>
            <template #title>用户管理</template>
          </el-menu-item>
          <el-menu-item index="3" >
            <el-icon size="15px"><Notification /></el-icon>
            <template #title>xx管理</template>
          </el-menu-item>
          <el-menu-item index="4" >
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

<!--  顶部-->
  <div style="display:flex;">
    <div id="tabs-container" style="flex-grow: 1;background-color: #11ff00">
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
                {{data.test}}
              </div>
            </transition>
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