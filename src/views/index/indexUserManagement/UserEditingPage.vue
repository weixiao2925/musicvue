<script setup>

import IndividualCenterPage from "@/views/index/individualCenter/IndividualCenterPage.vue";
import {reactive} from "vue";
import {usersInfoStore} from "@/store/users.js";

const userStore=usersInfoStore()
const data=reactive({
  name:userStore.name
})
</script>

<template>
  <IndividualCenterPage :name="data.name" :person="false"/>
</template>

<style scoped>

</style>