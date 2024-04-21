<script setup>

import {reactive, ref, watch} from "vue";
import {House, Location, MoreFilled, Notification, Operation} from "@element-plus/icons-vue";

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

//-----tab测试
const tabs = ref([]); // 存储打开的Tabs
const activeTab = ref(''); // 当前激活的Tab

// ...其他代码保持不变

// 打开或激活一个Tab
const openTab = (index, title) => {
  let tab = tabs.value.find(t => t.index === index);
  if (!tab) {
    tab = { index, title };
    tabs.value.push(tab);
  }
  activeTab.value = index;
};

// 关闭一个Tab
const closeTab = (tabIndex) => {
  const index = tabs.value.findIndex(t => t.index === tabIndex);
  if (index !== -1) {
    tabs.value.splice(index, 1);

    // 如果关闭的是当前激活的Tab，并且还有其它Tab打开，激活最后一个Tab
    if (activeTab.value === tabIndex && tabs.value.length) {
      activeTab.value = tabs.value[tabs.value.length - 1].index;
    }
  }
};
// 添加激活对应菜单的逻辑
const activateMenu = (index) => {
  index_c.value = index;
};

watch(activeTab, (newVal) => {
  activateMenu(newVal);
});
</script>

<template>
  <div id="menu_left" style="float: left;">
    <div>
      <div style="float:left;">
        <div v-if="!isCollapse" style="padding: 10px 10px 10px 20px;">xxx管理系统</div>
        <el-menu
            :default-active="index_c"
            :collapse="isCollapse"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
        >
          <el-menu-item index="1" @click="openTab('1', '系统首页')">
            <el-icon size="15px"><House /></el-icon>
            <template #title>系统首页</template>
          </el-menu-item>
          <el-menu-item index="2" @click="openTab('2', '用户管理')">
            <el-icon size="15px"><Notification /></el-icon>
            <template #title>用户管理</template>
          </el-menu-item>
          <el-menu-item index="3" @click="openTab('3', 'xx管理')">
            <el-icon size="15px"><Notification /></el-icon>
            <template #title>xx管理</template>
          </el-menu-item>
          <el-menu-item index="4" @click="openTab('4', 'xx管理')">
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
      <!-- 顶部Tab显示区域 -->
      <div id="tabs-container" style="float:left;">
        <el-tabs v-model="activeTab" type="card" closable @tab-remove="closeTab" @update:modelValue="activateMenu">
          <el-tab-pane
              v-for="tab in tabs"
              :key="tab.index"
              :label="tab.title"
              :name="tab.index"
          >
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
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

</template>

<style scoped>
  #menu_top{
    width: auto;
    height: 2.1rem;
    background-color: #11ff00;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 150px;
    height: 100%;
  }
</style>