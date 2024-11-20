<script setup>

import {reactive} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {get} from "@/net/index.js";
import {userInfoStore} from "@/store/user.js";
import {usersInfoStore} from "@/store/users.js";

const props=defineProps({
  name:String,
  person:Boolean
})
const form=reactive({
  isDisabled:true,

  person:props.person,

  name:props.name,
  sex:"",
  email:"",
  birth_date:"",
  signature:"",
  nation:"中国",
  region:"",
  avatarUrl:"",
  registrationTime:"",
  dataLoading:true,
})
// console.log(form.name)
const changeDisable=()=>{
  form.isDisabled=!form.isDisabled
}
const affirm=()=>{
  ElMessageBox.confirm(
      '是否确认该编辑',
      'warning',
      {
        confirmButtonText:'确认',
        cancelButtonText:'还不确认',
        type:'warning'
      }
  ).then(()=>{
    changeDisable()
    changeData()
  }).catch(()=>{
    ElMessage.success("还不确认")
  })
}
const quit=()=>{
  ElMessageBox.confirm(
      '是否退出编辑（表单内容将会清除）',
      'warning',
      {
        confirmButtonText:'确认退出',
        cancelButtonText:'取消',
        type:'warning'
      }
  ).then(()=>{
    ElMessage.success("退出成功")
    changeDisable()
  }).catch(()=>{
    ElMessage.success("已取消")
  })
}

//根据身份给表格赋值
function getUserData() {
  if (form.person){
    const rootUserData=userInfoStore()
    get(`/api/index/getRootPersonalOne?username=${rootUserData.email}`,(data)=>{
      form.name=data.userDataOne.name
      form.sex=data.userDataOne.sex
      form.email=data.userDataOne.email
      form.birth_date=new Date(data.userDataOne.birth_date).toDateString()
      form.signature=data.userDataOne.signature
      form.region=data.userDataOne.region
      form.avatarUrl=data.userDataOne.avatarUrl
      form.registrationTime=data.userDataOne.registrationTime
      form.dataLoading=false
    })
  }
  else {
    const UsersData=usersInfoStore()
    get(`/api/index/getPersonalOne?username=${UsersData.email}`,(data)=>{
      form.name=data.userDataOne.name
      form.sex=data.userDataOne.sex
      form.email=data.userDataOne.email
      form.birth_date=new Date(data.userDataOne.birth_date).toDateString()
      form.signature=data.userDataOne.signature
      form.region=data.userDataOne.region
      form.avatarUrl=data.userDataOne.avatarUrl
      form.registrationTime=data.userDataOne.registrationTime
      form.dataLoading=false
    })
  }
}
getUserData()

function changeData() {
  let birthDateString;

  if(form.birth_date instanceof Date) {
    // 获取本地时区偏移量（以分钟计），转换为毫秒
    const timezoneOffset = form.birth_date.getTimezoneOffset() * 60000;
    // 创建一个新的Date对象，加上时区偏移量，以保持日期部分不变
    const adjustedDate = new Date(form.birth_date.getTime() - timezoneOffset);
    // 现在转换为ISOString，日期应该正确
    birthDateString = adjustedDate.toISOString().substring(0, 10);
  } else {
    // 如果出于某种原因没有得到Date对象，尝试将其解析为Date对象
    const parsedDate = new Date(form.birth_date);
    if (!isNaN(parsedDate)) {
      const timezoneOffset = parsedDate.getTimezoneOffset() * 60000;
      const adjustedDate = new Date(parsedDate.getTime() - timezoneOffset);
      birthDateString = adjustedDate.toISOString().substring(0, 10);
    } else {
      // 如果解析失败，可能需要处理错误或使用默认值
      console.error('无法解析日期：', form.birth_date);
      // 这里可以根据你的需求决定如何处理，比如使用默认日期或通知用户
      return;
    }
  }

  // 继续你的数据更新逻辑...
  get(`/api/index/changePersonalOne?username=${form.email}&name=${form.name}&sex=${form.sex}&birthDateString=${birthDateString}&region=${form.region}&signature=${form.signature}`, (data) => {
    ElMessage.success("修改成功")
  })
}

</script>

<template>
  <div>

  </div>
  <el-row>
    <div style="padding-left: 2vh;">
        <el-text size="large" type="info">Personal information</el-text>
    </div>
  </el-row>
  <div id="personal_r" v-loading="form.dataLoading">

    <div style="padding-left: 6vh;">
      <div style="padding: 4vh 0 1vh 0;">
        <el-row>
          <el-text size="large" type="primary">个人信息</el-text>
        </el-row>
      </div>
      <el-row>
        <el-form
          label-position="top"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="名字" >
                  <el-input v-model="form.name" :disabled="form.isDisabled" class="input"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别">
                  <el-input v-model="form.sex" class="input" :disabled="form.isDisabled"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="注册时间">
                  <el-input v-model="form.registrationTime" class="input" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出生年月">
                <el-date-picker
                    v-model="form.birth_date"
                    :disabled="form.isDisabled"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="电子邮箱地址">
                  <el-input v-model="form.email" class="input" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <div style="padding: 1vh 0 0 0;">
            <el-row>
              <el-text size="large" type="primary">个人地址</el-text>
            </el-row>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="国家">
                  <el-input v-model="form.nation" class="input" :disabled="form.isDisabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="城市">
                  <el-input v-model="form.region" class="input" :disabled="form.isDisabled"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <div style="padding: 1vh 0 0 0;">
            <el-row>
              <el-text size="large" type="primary">个人签名</el-text>
            </el-row>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="签名">
                  <el-input
                    type="textarea"
                    :rows="4"
                    placeholder="用户个人签名"
                    :disabled="form.isDisabled"
                    v-model="form.signature"

                  ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-button style="margin-right: 4vh;" v-if="form.isDisabled" @click="changeDisable">
            编辑
          </el-button>
          <el-button style="margin-right: 4vh;" v-if="!form.isDisabled" @click="affirm">
            确认
          </el-button>
          <el-button v-if="!form.isDisabled" @click="quit">
            退出
          </el-button>
        </el-form>
      </el-row>
    </div>
  </div>
</template>

<style scoped>
#personal_r{
  height: 100%;
  width: 100%;
  background-color: #fdfdfd;

}
:deep(.input){
  width: 47vh;
}
</style>
