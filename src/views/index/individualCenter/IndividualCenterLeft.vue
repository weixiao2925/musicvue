<script setup>

import {menuInfoStore} from "@/store/menu.js";
import {useRouter} from "vue-router";
import {userInfoStore} from "@/store/user.js";
import {PieChart, User} from "@element-plus/icons-vue";
import {reactive, ref} from "vue";
import {fetchAndDisplayFile, get, uploadFile} from "@/net/index.js";
import {usersInfoStore} from "@/store/users.js";
import {ElMessage} from "element-plus";
//获取值
const props=defineProps({
  name:String,
  person:Boolean,
})
//仓库
const indexRouter=menuInfoStore()
const users=usersInfoStore()
const avatarRef=ref()
const form=reactive({
  isDisabled:true,
  person:props.person,
  name:props.name,
  id:users.id,
  sex:"",
  email:"",
  birth_date:"",
  signature:"",
  nation:"中国",
  region:"",
  avatarUrl:"",
  registrationTime:"",
})
//根据身份给表格赋值
function getUserData() {
  if (form.person){
    const rootUserData=userInfoStore()
    get(`/api/index/getRootPersonalOne?username=${rootUserData.email}`,(data)=>{
      form.id=rootUserData.id;
      form.name=data.userDataOne.name
      form.sex=data.userDataOne.sex
      form.email=data.userDataOne.email
      form.birth_date=new Date(data.userDataOne.birth_date).toDateString()
      form.signature=data.userDataOne.signature
      form.region=data.userDataOne.region
      form.avatarUrl=data.userDataOne.avatarUrl
      form.registrationTime=data.userDataOne.registrationTime
    })
  }
  else {
    const UsersData=usersInfoStore()
    get(`/api/index/getPersonalOne?username=${UsersData.email}`,(data)=>{
      form.id=UsersData.id;
      form.name=data.userDataOne.name
      form.sex=data.userDataOne.sex
      form.email=data.userDataOne.email
      form.birth_date=new Date(data.userDataOne.birth_date).toDateString()
      form.signature=data.userDataOne.signature
      form.region=data.userDataOne.region
      form.avatarUrl=data.userDataOne.avatarUrl
      form.registrationTime=data.userDataOne.registrationTime
    })
  }
}
getUserData()
//获取头像
const getAvatar=()=>{
  fetchAndDisplayFile(`/api/index/getUserAvatar?user_id=${form.id}`,(data)=>{
    avatarRef.value=data;
  })
}
getAvatar()
//修改头像
const changeAvatar=(file)=>{
  console.log(file)
  const vo = reactive({
    user_id:form.id,
    file:file.raw,
  })
  uploadFile('/api/index/upUserAvatar',vo,()=>{
    ElMessage.success("更换成功")
    getAvatar()
  })
}
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
      <div class="avatar-uploader">
        <el-upload
            :on-change="changeAvatar"
            action="#"
            :show-file-list="false"
        >
          <div class="avatar-uploader-trigger">
            <el-avatar :src="avatarRef" :size="70"></el-avatar>
            <div class="avatar-uploader-mask">
              更换头像
            </div>
          </div>
        </el-upload>
      </div>
      <div>
        {{ form.name }}
      </div>
      <div>
        <el-text>
          {{form.signature===null?'暂无签名':form.signature}}
        </el-text>
      </div>
      <div style="margin-bottom: 3vh;">
        <el-text>
          注册时间：{{form.registrationTime}}
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
  .avatar-uploader {
    padding-top:  50px;
    position: relative;
    display: inline-block;
  }

  .avatar-uploader-trigger {
    position: relative;
    display: inline-block;
  }

  .avatar-uploader-mask {
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
    width: 98%;
    height: 92%;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    font-size: 12px;
    text-align: center;
    line-height: 70px; /* 这个值应该等于头像的高度 */
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .avatar-uploader-trigger:hover .avatar-uploader-mask {
    opacity: 1;
  }
</style>
