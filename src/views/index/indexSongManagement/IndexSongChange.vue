<script setup>
import {reactive, ref} from "vue";
import {ElMessage, ElMessageBox, genFileId} from "element-plus";
import {get,uploadFile} from "@/net/index.js";
import {UploadFilled} from "@element-plus/icons-vue";
import {singerInfoStore} from "@/store/singer.js";

const props=defineProps({
  song_id:String,
})
const form=reactive({
  isDisabled:true,

  song_id:props.song_id,
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
    ElMessage.success("修改成功")
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

//给表格赋值
//获取仓库信息
const singerData=singerInfoStore()
function getUserData() {
  get(`/api/index/getSongDataOne?singer_id=${singerData.singer_id}&song_id=${form.song_id}`,(data)=>{
    form.title=data.songDataOne.title
    form.songType=data.songDataOne.songType
    form.release_date=data.songDataOne.release_date
  })
}
getUserData()

function changeData() {
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
      return;
    }
  }
  get(`/api/index/changeSongs?song_id=${form.song_id}&title=${form.title}&songType=${form.songType}&release_date=${DateString}`, (data) => {
    ElMessage.success("信息修改成功")
  })
  uploadFile_Button()
}

//文件上传

const uploadMp3Ref=ref(null)
const uploadLrcRef=ref(null)
//获取文件（mp3）
const getMp3FileUpload = (file) => {
  form.mp3File = file; // 将文件对象保存到状态中
  console.log(form.mp3File );
};

//替换文件（mp3）
const handleExceed_Mp3 = (files) => {
  uploadMp3Ref.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  uploadMp3Ref.value.handleStart(file)
}
//获取文件（lrc）
const getLrcFileUpload = (file) => {
  form.lrcFile = file; // 将文件对象保存到状态中
  // console.log(form.lrcFile );
};

//替换文件（lrc）
const handleExceed_Lrc = (files) => {
  uploadLrcRef.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  uploadLrcRef.value.handleStart(file)
}
//上传文件(mp3)
const uploadFile_Button = () => {
  // 构建请求数据
  const formData_mp3 = new FormData();
  formData_mp3.append('file', form.mp3File.raw);
  formData_mp3.append('song_id', form.song_id); // 这里需要传递正确的 song_id
  uploadFile('/api/index/upSongMp3', formData_mp3, () => {
    ElMessage.success("上传MP3文件成功")
  });
  const formData_lrc = new FormData();
  formData_lrc.append('file', form.lrcFile.raw);
  formData_lrc.append('song_id', form.song_id); // 这里需要传递正确的 song_id
  uploadFile('/api/index/upSongLrc', formData_lrc, () => {
    ElMessage.success("上传lrc文件成功")
  });
};
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
              <el-form-item label="发行时间">
                <el-date-picker
                    v-model="form.release_date"
                    :disabled="form.isDisabled"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <div>
            <el-upload
                :auto-upload="false"
                :disabled="form.isDisabled"
                :limit="1"
                drag
                ref="uploadMp3Ref"
                :on-change="getMp3FileUpload"
                :on-exceed="handleExceed_Mp3"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                将歌曲mp3文件放到这里或 <em>点击上传</em>
              </div>
            </el-upload>
            <el-upload
                :auto-upload="false"
                :disabled="form.isDisabled"
                :limit="1"
                drag
                ref="uploadLrcRef"
                :on-change="getLrcFileUpload"
                :on-exceed="handleExceed_Lrc"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                将歌词lrc文件放到这里或 <em>点击上传</em>
              </div>
            </el-upload>
<!--            <el-button @click="uploadFile_Button">提交</el-button>-->
          </div>
          <div style="padding: 1vh 0 0 0;">

          </div>
          <el-row :gutter="20">

          </el-row>


          <el-button style="margin-right: 4vh;" v-if="form.isDisabled" @click="changeDisable">
            编辑信息
          </el-button>
          <el-button style="margin-right: 4vh;" v-if="!form.isDisabled" @click="affirm">
            确认编辑
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