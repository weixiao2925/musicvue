<script setup>

import IndividualCenterPage from "@/views/index/individualCenter/IndividualCenterPage.vue";
import {reactive} from "vue";
import {userInfoStore} from "@/store/user.js";
//仓库
const userStore=userInfoStore()
const data=reactive({
  name:userStore.name
})
</script>

<template>
  <IndividualCenterPage :name="data.name" :person="true"/>
</template>

<style scoped>

</style>