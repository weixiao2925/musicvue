<script lang="js" setup>
import { ref } from 'vue'
import {useRouter} from "vue-router";


const router=useRouter()
const goTo=(tab)=>{
  router.push({name:tab.props.name})
}

const activeName = ref('index-home');
</script>
<template>

  <el-tabs v-model="activeName" @tab-click="goTo">
    <el-tab-pane name="index-home" label="user1" >

    </el-tab-pane>
    <el-tab-pane name="two" label="user2">
      user2
    </el-tab-pane>
  </el-tabs>
</template>



<style>

</style>