<script setup>

import IndexCommon from "@/views/index/IndexCommon.vue";
import IndexCommonTop from "@/views/index/indexcommon/IndexCommonTop.vue";
import IndexCommonLeft from "@/views/index/indexcommon/IndexCommonLeft.vue";
</script>

<template>
<!--  <IndexCommon/>-->
  <IndexCommonLeft/>
  <IndexCommonTop/>
  <router-view/>
</template>

<style scoped>

</style>