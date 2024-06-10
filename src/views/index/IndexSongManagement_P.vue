<script setup>

import {reactive, ref} from "vue";
import testImage from '@/assets/test.jpg'
import {Search} from "@element-plus/icons-vue";
import {singerInfoStore} from "@/store/singer.js";
import {useRouter} from "vue-router";
import {fetchAndDisplayFile, get, uploadFile} from "@/net/index.js";
import IndexSingerAdd from "@/views/index/indexSingerManagement/IndexSingerAdd.vue";
import {ElMessage, ElMessageBox, genFileId} from "element-plus";

import IndexSongChange from "@/views/index/indexSongManagement/IndexSongChange.vue";
import IndexSongAdd from "@/views/index/indexSongManagement/IndexSongAdd.vue";
import {playlistInfoStore} from "@/store/playlist.js";



const router=useRouter()
function goTo(route) {
  router.push(route)
}

const multipleTableRef=ref()
//----请求数据
//总页数
const pageCount=ref(4)
//设置一页多少条数据
const pageSize = ref(4);

//响应式获取数据
let tableData = ref([]);

//当前页面
const currentPage = ref(1);

//数据对象
const form=reactive({
  isDisabled:true,

  title:"",
  songType:"",
  release_date:"",
  mp3File: null, // 用于存储文件对象
  lrcFile: null,
})

//获取当前分页
function handlePageChange(page) {
  // console.log(page)
  currentPage.value = page;
  getData(page)
}
//获取仓库信息
const playlistData=playlistInfoStore()

// 将 getData 方法改为异步函数,获取数据
async function getData(page = currentPage.value) {
  get(`http://localhost:8081/api/index/getSongTableList_P?playlist_id=${playlistData.playlist_id}&page=${page}&pageSize=${pageSize.value}`,(data)=>{
    tableData.value = data.songDataList;
    pageCount.value=data.count;
    console.log(tableData.value)
    for (let i=0;i<pageCount.value;i++) {
      fetchAndDisplayFile(`/api/index/getSongAvatar?song_id=${tableData.value[i].song_id}`,(data)=>{
        // console.log(data)
        tableData.value[i].song_path=data;
        // console.log(tableData.value)
      })
    }
  })

}

getData(1)


//----搜索功能
const searchText=ref("")
function getSearch(page) {
  if (typeof page !== 'number') {
    page = currentPage.value;
  }
  get(`http://localhost:8081/api/index/searchSongTableList_P?playlist_id=${playlistData.playlist_id}&&searchText=${searchText.value}&&page=${page}&pageSize=${pageSize.value}`,(data)=>{
    tableData.value = data.songDataList;
    pageCount.value=data.count;
  })
}

//----编辑数据
const dialogFormSongInfoVisible = ref(false)//默认关闭状态
const song_id=ref("")//song_id
function changeInfoDialog(row) {
  song_id.value=row.row.song_id;
  console.log(song_id.value)
  dialogFormSongInfoVisible.value = !dialogFormSongInfoVisible.value
  // console.log(dialogFormVisible.value)
}
//----添加数据
const dialogFormSongAddVisible = ref(false)//默认关闭状态
function changeAddDialog(row) {
  dialogFormSongAddVisible.value = !dialogFormSongAddVisible.value
}
//----删除
//--批量删除
//接收选择框的id
const payload=ref([])
//表格复选框
function handSelectChange(rows) {
  // console.log(rows)
  // 使用 map() 从选中的行中提取出id和email列表
  payload.value = rows.map(row => row.song_id);
  console.log(payload.value);
}
const deleteSongs=()=>{
  // 将数组转换成以逗号分隔的字符串
  const songIds = payload.value.join(',');
  get(`/api/index/deleteSongs_P?songIds=${songIds}`, (data)=>{
    ElMessage.success("删除成功");
    getData(currentPage.value)
  })
}
//请求确认
const handDeleteSongs=()=>{
  ElMessageBox.confirm(
      '是否确认删除',
      'warning',
      {
        confirmButtonText:'确认',
        cancelButtonText:'取消',
        type:'warning'
      }
  ).then(()=>{
    deleteSongs()
    // ElMessage.success("删除成功")
  }).catch(()=>{
    ElMessage.success("已取消")
  })
}
//--单个删除
const payloadOne=ref([])

const deleteSong=()=>{
  // 将数组转换成以逗号分隔的字符串
  const songIds = payloadOne.value.join(',');
  get(`/api/index/deleteSongs_P?songIds=${songIds}`, (data)=>{
    ElMessage.success("删除成功");
    getData(currentPage.value)
  })
}
function handDeleteSong(row){
  ElMessageBox.confirm(
      '是否确认删除',
      'warning',
      {
        confirmButtonText:'确认',
        cancelButtonText:'取消',
        type:'warning'
      }
  ).then(()=>{
    // 直接把 row.id 赋值给 payloadOne.value
    payloadOne.value = [row.row.song_id];
    // console.log(payloadOne.value);
    deleteSong();
  }).catch(()=>{
    ElMessage.success("已取消");
  })
}

//----文件上传
const uploadMp3Ref=ref(null)
const uploadLrcRef=ref(null)
//获取文件（mp3）
const getMp3FileUpload = (file) => {
  form.mp3File = file; // 将文件对象保存到状态中
  // console.log(form.mp3File );
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
  // console.log(  uploadLrcRef.value.clearFiles())
  uploadLrcRef.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  uploadLrcRef.value.handleStart(file)
}
//上传文件(mp3)
const uploadFile_Button = (row) => {
  // console.log(row.row)
  // 构建请求数据
  // console.log(row.row.song_id)
  const formData_mp3 = new FormData();
  if (form.mp3File !=null){
    formData_mp3.append('file', form.mp3File.raw);
    formData_mp3.append('song_id', row.row.song_id); // 这里需要传递正确的 song_id
    uploadFile('/api/index/upSongMp3', formData_mp3, () => {
      form.mp3File=null
      // uploadMp3Ref.value= null
      ElMessage.success("上传MP3文件成功")
    });
  }
  if (form.lrcFile != null){
    const formData_lrc = new FormData();
    formData_lrc.append('file', form.lrcFile.raw);
    formData_lrc.append('song_id', row.row.song_id); // 这里需要传递正确的 song_id
    uploadFile('/api/index/upSongLrc', formData_lrc, () => {
      form.lrcFile=null
      // uploadLrcRef.value=null
      ElMessage.success("上传lrc文件成功")
    });
  }
  getData()
};

</script>

<template>
<!--  {{singer.singer_id}}-->
<!--  {{singer.singer_name}}-->
  <el-row :gutter="20">
    <el-col :span="6">
      <div>
        <el-input v-model="searchText" placeholder="搜索歌曲名">
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
    </el-col>
    <el-col :span="6">
      <div>
        <el-button type="primary" @click="getSearch">搜索</el-button>
      </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="2">
      <div>
        <el-button type="success" @click="changeAddDialog">添加</el-button>
      </div>
    </el-col>
    <el-col :span="2">

    </el-col>
  </el-row>
  <el-dialog
      v-model="dialogFormSongInfoVisible"
      center
      align-center
      draggable
      destroy-on-close
      @closed="getData"
  >
    <IndexSongChange :song_id="song_id.valueOf()" :is-singer="false"/>
  </el-dialog>
  <el-dialog
      v-model="dialogFormSongAddVisible"
      center
      align-center
      draggable
      destroy-on-close
      @closed="getData"
  >
    <IndexSongAdd :is-singer="false"/>
  </el-dialog>
  <div>
    <el-table
        ref="multipleTableRef"
        style="width: 100%"
        @selection-change="handSelectChange"
        :data="tableData"
        border
        flexible
    >
      <el-table-column  type="selection"/>
      <el-table-column  label="歌曲id" property="song_id"  align="center" min-width="20"/>
      <el-table-column label="歌曲图片"  align="center" min-width="40">
        <template #default="row">
          <el-avatar shape="square" :size="80" :src="row.row.song_path" />
          <el-button size="small">更新图片</el-button>
        </template>
      </el-table-column>
      <el-table-column label="歌曲名" property="title" align="center" min-width="40"/>
      <el-table-column label="类型" property="songType" align="center" min-width="30"/>
      <el-table-column label="歌词" property="xx" align="center"  min-width="140"/>
      <el-table-column label="音频管理" property="userSex" align="center" min-width="55">
        <template #default="row">
          <el-space direction="vertical">
            <div>
              <el-upload
                  :auto-upload="false"
                  :limit="1"
                  ref="uploadMp3Ref"
                  :on-change="getMp3FileUpload"
                  :on-exceed="handleExceed_Mp3"
              >
                <template #trigger>
                  <el-button size="small" >更新音频</el-button>
                </template>
              </el-upload>
            </div>
            <div>
              <el-upload
                  :auto-upload="false"
                  :limit="1"
                  ref="uploadLrcRef"
                  :on-change="getLrcFileUpload"
                  :on-exceed="handleExceed_Lrc"
              >
                <template #trigger>
                  <el-button size="small" >更新歌词</el-button>
                </template>
              </el-upload>
            </div>
            <div>
              <el-button type="warning" size="small" @click="uploadFile_Button(row)">确定更新</el-button>
            </div>
          </el-space>
        </template>
      </el-table-column>
      <el-table-column label="操作" property="name7" align="center" min-width="60">
        <template #default="row">
          <el-button @click="changeInfoDialog(row)">编辑</el-button>
          <el-button type="danger" @click="handDeleteSong(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div>
    <el-button type="danger" @click="handDeleteSongs">批量删除</el-button>
  </div>
  <el-row :gutter="12" justify="center">
    <el-col :span="3">
      <div></div>
    </el-col>
    <el-col :span="3">
      <el-pagination
          layout="prev, pager, next"
          :total="pageCount"
          :page-size="pageSize"
          @current-change="handlePageChange"
      />
    </el-col>
    <el-col :span="4">
      <div></div>
    </el-col>
  </el-row>

</template>

<style scoped>

</style>