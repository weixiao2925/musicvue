<script setup>
import {reactive} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {get, post} from "@/net/index.js";

const props=defineProps({
  singer_id:String
})

const form=reactive({
  isDisabled:true,

  singer_id:props.singer_id,
  singer_name:'',
  sex:'',
  nationality:'',
  birth_date:'',
  intro:''
})
// console.log(form.name)
const changeDisable=()=>{
  form.isDisabled=!form.isDisabled
}
const affirm=()=>{
  ElMessageBox.confirm(
      '是否确认该添加',
      'warning',
      {
        confirmButtonText:'确认',
        cancelButtonText:'还不确认',
        type:'warning'
      }
  ).then(()=>{
    changeDisable()
    changeSingerData()
  }).catch(()=>{
    ElMessage.success("还不确认")
  })
}
const quit=()=>{
  ElMessageBox.confirm(
      '是否退出添加（表单内容将会清除）',
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
//获取数据
function getData() {
  get(`/api/index/getSingerOneData?singer_id=${form.singer_id}`,(data)=>{
    form.singer_name=data.singerDataOne.singer_name;
    form.sex=data.singerDataOne.sex
    form.nationality=data.singerDataOne.nationality
    form.birth_date=data.singerDataOne.birth_date
    form.intro=data.singerDataOne.intro
  })
}
getData()
//修改
function changeSingerData() {
  let birthDateString;
  if (form.birth_date===null || form.birth_date===''){

  }else {
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
        // return;

      }
    }
  }
  get(`/api/index/changeSinger?singer_id=${form.singer_id}&singer_name=${form.singer_name}&sex=${form.sex}&nationality=${form.nationality}&birthDateString=${birthDateString}&intro=${form.intro}`,(data)=>{
    ElMessage.success("信息修改成功")
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
  <div id="personal_r">

    <div style="padding-left: 6vh;">
      <div style="padding: 4vh 0 1vh 0;">
        <el-row>
          <el-text size="large" type="primary">xx信息</el-text>
        </el-row>
      </div>
      <el-row>
        <el-form
            label-position="top"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="名字*" >
                <el-input v-model="form.singer_name" :disabled="form.isDisabled" class="input"></el-input>
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
              <el-form-item label="国家">
                <el-input v-model="form.nationality" class="input" :disabled="form.isDisabled"></el-input>
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




          <div style="padding: 1vh 0 0 0;">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-text size="large" type="primary">xx介绍</el-text>
              </el-col>
<!--              <el-col :span="12">-->
<!--                <el-text size="large" type="primary">xx头像</el-text>-->
<!--              </el-col>-->
            </el-row>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="简介">
                <el-input
                    type="textarea"
                    :rows="4"
                    placeholder="xx简介"
                    :disabled="form.isDisabled"
                    v-model="form.intro"

                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
            </el-col>
<!--            <el-col :span="6">-->
<!--              <el-avatar :size="80" style="margin-top: 2vh"/>-->
<!--              <el-button style="margin-top: 1vh;width: 12vh">上传头像</el-button>-->
<!--            </el-col>-->
          </el-row>
          <div style="padding: 1vh 0 0 0;">

          </div>
          <el-row :gutter="20">

          </el-row>


          <el-button style="margin-right: 4vh;" v-if="form.isDisabled" @click="changeDisable">
            添加信息
          </el-button>
          <el-button style="margin-right: 4vh;" v-if="!form.isDisabled" @click="affirm">
            添加
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