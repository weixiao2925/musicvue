<script setup>

import IndividualCenterRight from "@/views/index/individualCenter/IndividualCenterRight.vue";
import IndividualCenterLeft from "@/views/index/individualCenter/IndividualCenterLeft.vue";
import {reactive} from "vue";

const props=defineProps({
  name:String,
  person:Boolean
})

const data=reactive({
  name:"",
  person:false
})
data.person=props.person
data.name=props.name
</script>

<template>
  <div id="app">
    <el-row :gutter="50" justify="end">
      <el-col :span="7">
        <div id="personal_l">
          <IndividualCenterLeft :name="data.name" :person="data.person"/>
        </div>
      </el-col>
      <el-col :span="16">
        <div id="personal_r">
          <IndividualCenterRight :name="data.name" :person="data.person"/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
#app{
  width: 100%;
  height: 94%;
  background: linear-gradient(#F3F4F8FF,#F3F3F3FF);
}
#personal_l {
  height: 80vh;
  background-color: #f8f3f6;
}
#personal_r {
  height: 90vh;
  background-color: #f3f3f3;
}
</style>