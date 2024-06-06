<script setup>

import {menuInfoStore} from "@/store/menu.js";
import {useRouter} from "vue-router";
import {userInfoStore} from "@/store/user.js";
import {PieChart, User} from "@element-plus/icons-vue";
//获取值
const props=defineProps({
  name:String
})
//仓库
const indexRouter=menuInfoStore()

//跳转
const router=useRouter()
function goTo(route) {
  router.push(route)
}
//返回功能
const comeback=()=>{
  goTo(indexRouter.index_route)
}
</script>

<template>

  <el-row>
    <div>
      <el-button @click="comeback">
        返回
      </el-button>
    </div>
  </el-row>
    <div id="personal_l">
      <div style="padding-top: 4vh;">
        <el-avatar :size="70"/>
      </div>
      <div>
        {{ props.name }}
      </div>
      <div>
        <el-text>
          签名
        </el-text>
      </div>
      <div style="margin-bottom: 3vh;">
        <el-text>
          注册时间：
        </el-text>
      </div>
      <div style="display: flex;justify-content: center;"><!-- 设置水平居中 -->
        <el-card style="height: 8vh;width: 90%; display: flex; align-items: center; justify-content: center;" shadow="always">
          <template #default>
            <el-icon color="blue"><User /></el-icon>
            <el-text>
              个人信息
            </el-text>
          </template>
        </el-card>
      </div>
    </div>


</template>

<style scoped>
  #personal_l{
    height: 100%;
    background-color: #fdfdfd;
    text-align: center;
  }
</style>