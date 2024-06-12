<script setup>
import {Lock, Message} from "@element-plus/icons-vue";
import {reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import {loginP} from "@/net/index.js";
import {useRouter} from "vue-router";
import {userInfoStore} from "@/store/user.js";

const form=reactive({
  email:'',
  password:'',
  remember_me:false,
})

//限制
//绑定表单对象
const formRef=ref()
const rule=reactive({
  email:[
    {required:true,message:"请输入邮箱地址",trigger:"blur"},
    {type:'email',message: "请输入邮箱的正确形式",trigger:["blur","change"]},
  ],
  password:[
    {required:true,message:"请输入密码",trigger:"blur"},
    {min:6,max:20,message: "密码在6-20个字符之间"},
  ]
})
//按钮限制
const submit=()=>{
  formRef.value.validate(valid=>{
    if(valid){
      // ElMessage.success("验证通过")
      userLogin()
    }else {
      ElMessage.error("请输入对应信息")
    }
  })
}
//跳转
const router=useRouter()
function goTo(route) {
  router.push(route)
}
//获取pinia数据并存入

//登录
function userLogin() {
  const userStore=userInfoStore()
  loginP(form.email,form.password,form.remember_me,
      (data)=>{
        userStore.email=data.username
        userStore.name=data.name;
        userStore.role=data.role;
        // console.log(userStore.name)
        // console.log(data)
    goTo('/index')
  })
}
</script>

<template>
  <div style="background-color: #fdecea;width: 100%;height: 100%;position: absolute">
    <div id="main" style="text-align: center;">
      <h2 style="color: #ea3f19;margin-bottom: 0.3rem;padding:2.8rem 0 0 0">Welcome Back</h2>
      <el-text type="info" size="large">请输入对应信息</el-text>
      <div style="margin-left: 2.5rem;">
        <el-form :rules="rule" :model="form" ref="formRef">
          <el-form-item prop="email">
            <el-input style="margin-top: 1rem;  width: 20rem;" placeholder="输入邮箱" clearable v-model="form.email" >
              <template #prefix>
                <el-icon><Message style="color: red"/></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input style="margin-top: 1rem;  width: 20rem;" placeholder="输入密码" show-password v-model="form.password">
              <template #prefix>
                <el-icon><Lock style="color: red"/></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox style="" v-model="form.remember_me">
              自动登录
            </el-checkbox>
          </el-form-item>
          <el-button style=" margin-right: 2.5rem;;width: 20rem" type="danger" plain @click="submit">
            login in
          </el-button>
        </el-form>
      </div>
    </div>
  </div>

</template>

<style scoped>
#main{
  width: 25rem;
  height:20rem;
  margin-top: 12%;
  margin-left: 33%;
  background-color: #fdfdfd;
  border-radius: 1rem;
}
</style>