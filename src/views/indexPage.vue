<script setup>

import IndexCommonTop from "@/views/index/indexcommon/IndexCommonTop.vue";
import IndexCommonLeft from "@/views/index/indexcommon/IndexCommonLeft.vue";
</script>

<template>
  <div class="container">
    <div class="sidebar">
      <IndexCommonLeft/>
    </div>
    <div class="content">
      <IndexCommonTop/>
      <router-view/>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
}

.sidebar {
  position: sticky; /* 这使侧边栏在指定位置粘住 */
  top: 0; /* 从视口顶部0px处开始固定位置 */
  height: 100vh; /* 全高 */
  overflow-x: hidden; /* 防止水平滚动 */
  overflow-y: hidden; /* 不允许竖向滚动（这是在菜单的功能不多时这样设置的） */
}

.content {
  margin-left: -2.3rem;/*暂时先这样*/
  flex-grow: 1; /* 让主体内容区域占据剩余空间 */
  overflow-x: hidden; /* 防止水平滚动 */
}
</style>