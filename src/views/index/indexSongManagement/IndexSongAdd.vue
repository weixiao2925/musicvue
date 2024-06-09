<script setup>
import {reactive, ref} from "vue";
import {ElMessage, ElMessageBox, genFileId} from "element-plus";
import {get, post, uploadFile} from "@/net/index.js";
import {UploadFilled} from "@element-plus/icons-vue";
import {singerInfoStore} from "@/store/singer.js";
import {playlistInfoStore} from "@/store/playlist.js";

const props=defineProps({
  isSinger:Boolean
})
const form=reactive({
  isDisabled:true,

  title:"",
  songType:"",
  release_date:"",
  mp3File: null, // 用于存储文件对象
  lrcFile: null,
})

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
    addData()
  }).catch(()=>{
    // ElMessage.error("添加失败")
  })
}
const quit=()=>{
  ElMessageBox.confirm(
      '是否退出添加信息（表单内容将会清除）',
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


function addData() {
  let DateString;

  if(form.release_date instanceof Date) {
    // 获取本地时区偏移量（以分钟计），转换为毫秒
    const timezoneOffset = form.release_date.getTimezoneOffset() * 60000;
    // 创建一个新的Date对象，加上时区偏移量，以保持日期部分不变
    const adjustedDate = new Date(form.release_date.getTime() - timezoneOffset);
    // 现在转换为ISOString，日期应该正确
    DateString = adjustedDate.toISOString().substring(0, 10);
  } else {
    // 如果出于某种原因没有得到Date对象，尝试将其解析为Date对象
    const parsedDate = new Date(form.release_date);
    if (!isNaN(parsedDate)) {
      const timezoneOffset = parsedDate.getTimezoneOffset() * 60000;
      const adjustedDate = new Date(parsedDate.getTime() - timezoneOffset);
      DateString = adjustedDate.toISOString().substring(0, 10);
    } else {
      // 如果解析失败，可能需要处理错误或使用默认值
      console.error('无法解析日期：', form.release_date);
      // 这里可以根据你的需求决定如何处理，比如使用默认日期或通知用户
      form.release_date=""
    }
  }
  if (props.isSinger) {
    const singerData=singerInfoStore()
    post(`http://localhost:8081/api/index/addSong`, {
      title: form.title,
      songType: form.songType,
      release_date: DateString,
      singer_id: singerData.singer_id
    },()=>{
      ElMessage.success("添加成功")
    })
  }else {
    const playlistData=playlistInfoStore()
    post(`http://localhost:8081/api/index/addSong_P`, {
      title: form.title,
      playlist_id: playlistData.playlist_id
    },()=>{
      ElMessage.success("添加成功")
    })
  }

}


</script>

<template>
  <div>

  </div>
  <el-row>
    <div style="padding-left: 2vh;">
      <el-text size="large" type="info">Song information</el-text>
    </div>
  </el-row>
  <div id="personal_r">

    <div style="padding-left: 6vh;">
      <div style="padding: 4vh 0 1vh 0;">
        <el-row>

          <el-text size="large" type="primary">歌曲信息</el-text>
        </el-row>
      </div>
      <el-row>
        <el-form
            label-position="top"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="歌名*" >
                <el-input v-model="form.title" :disabled="form.isDisabled" class="input"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类型">
                <el-input v-model="form.songType" class="input" :disabled="form.isDisabled"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <div v-if="props.isSinger">
                <el-form-item label="发行时间">
                  <el-date-picker
                      v-model="form.release_date"
                      :disabled="form.isDisabled"
                  />
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <div style="padding: 1vh 0 0 0;">

          </div>
          <el-row :gutter="20">

          </el-row>


          <el-button style="margin-right: 4vh;" v-if="form.isDisabled" @click="changeDisable">
            添加信息
          </el-button>
          <el-button style="margin-right: 4vh;" v-if="!form.isDisabled" @click="affirm">
            确认添加
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