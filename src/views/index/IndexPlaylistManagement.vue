<script setup>

import {reactive, ref} from "vue";
import testImage from '@/assets/test.jpg'
import {Search} from "@element-plus/icons-vue";
import {useRouter} from "vue-router";
import {fetchAndDisplayFile, get, uploadFile} from "@/net/index.js";
import {ElMessage, ElMessageBox, genFileId} from "element-plus";
import {singerInfoStore} from "@/store/singer.js";
import {playlistInfoStore} from "@/store/playlist.js";
import IndexSingerEditingPage from "@/views/index/indexSingerManagement/IndexSingerEditingPage.vue";
import IndexPlaylistEditingPage from "@/views/index/indexPlaylistManagement/IndexPlaylistEditingPage.vue";





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


//获取当前分页
function handlePageChange(page) {
  // console.log(page)
  currentPage.value = page;
  getData(page)
}


// 将 getData 方法改为异步函数,获取数据
async function getData(page = currentPage.value) {
  get(`http://localhost:8081/api/index/getPlayListTableList?page=${page}&pageSize=${pageSize.value}`,(data)=>{
    tableData.value = data.playListDataList;
    pageCount.value=data.count;
    // console.log(tableData.value)
    for (let i=0;i<pageCount.value;i++) {
      fetchAndDisplayFile(`/api/index/getPlaylistAvatar?playlist_id=${tableData.value[i].playlist_id}`,(data)=>{
        // console.log(data)
        tableData.value[i].playList_path=data;
        // console.log(tableData.value)
      })
    }
  })
}

getData(1)

//----跳转到歌曲管理
function putSinger(table) {
  // ;console.log(table.row.singer_id)
  //获取singer仓库
  const playlistStore=playlistInfoStore()
  playlistStore.playlist_id=table.row.playlist_id;
  playlistStore.playlist_name=table.row.playlist_name;
  goTo('/index-song_P')
}

//搜索功能
const searchText=ref("")
function getSearch(page) {
  if (typeof page !== 'number') {
    page = currentPage.value;
  }
  get(`http://localhost:8081/api/index/searchPlayListTableList?searchText=${searchText.value}&page=${page}&pageSize=${pageSize.value}`,(data)=>{
    tableData.value = data.playListDataList;
    pageCount.value=data.count;
  })
}


//----删除
//--批量删除
//接收选择框的id
const payload=ref([])
//表格复选框
function handSelectChange(rows) {
  // console.log(rows)
  // 使用 map() 从选中的行中提取出id和email列表
  payload.value = rows.map(row => row.playlist_id);
  console.log(payload.value);
}
const deletePlayLists=()=>{
  // 将数组转换成以逗号分隔的字符串
  const songIds = payload.value.join(',');
  get(`/api/index/deleteSongs?songIds=${songIds}`, (data)=>{
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
    deletePlayLists()
    // ElMessage.success("删除成功")
  }).catch(()=>{
    ElMessage.success("已取消")
  })
}
//--单个删除
const payloadOne=ref([])

const deletePlayList=()=>{
  // 将数组转换成以逗号分隔的字符串
  const playListIds = payloadOne.value.join(',');
  get(`/api/index/deletePlayLists?playListIds=${playListIds}`, (data)=>{
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
    payloadOne.value = [row.row.playlist_id];
    // console.log(payloadOne.value);
    deletePlayList();
  }).catch(()=>{
    ElMessage.success("已取消");
  })
}

//----跳转编辑页
const dialogFormVisible_change = ref(false)
const playlist_id=ref("")
function editingSinger(row) {
  playlist_id.value = row.row.playlist_id;
  dialogFormVisible_change.value=!dialogFormVisible_change.value;
}
//----文件上传
const form=reactive({
  aFile:null
})
const uploadRef=ref(null)
//获取文件（mp3）
const getFileUpload = (file) => {
  form.aFile = file; // 将文件对象保存到状态中
  // console.log(form.mp3File );
};

//替换文件（）
const handleExceed = (files) => {
  uploadRef.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  uploadRef.value.handleStart(file)
}
//上传文件()
const uploadFile_Button = (row) => {
  // console.log(row.row)
  // 构建请求数据
  // console.log(row.row.song_id)
  uploadRef.value.clearFiles()
  const formData = new FormData();
  if (form.aFile !=null){
    formData.append('file', form.aFile.raw);
    formData.append('playlist_id', row.row.playlist_id); // 这里需要传递正确的 song_id
    uploadFile('/api/index/upPlaylistAvatar', formData, () => {
      form.aFile=null
      // uploadRef.value= null
      ElMessage.success("上传图片文件成功")
    });
  }
  getData()
};
</script>

<template>
  <el-row :gutter="20">
    <el-col :span="6">
      <div>
        <el-input v-model="searchText" placeholder="搜索歌单名和用户邮箱">
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
  <div>
    <el-button type="danger" @click="handDeleteSongs">批量删除</el-button>
  </div>

  <el-dialog v-model="dialogFormVisible_change"
             destroy-on-close
             center
             draggable
             @closed="getData"
  >
    <IndexPlaylistEditingPage :playlist_id="playlist_id.valueOf()"/>
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
      <el-table-column  label="歌单id" property="playlist_id"  align="center" min-width="20"/>
      <el-table-column label="歌单照片"  align="center" min-width="50">
        <template #default="row">
          <el-avatar shape="square" :size="80" :src="row.row.playList_path" />
          <el-upload
              :auto-upload="false"
              :limit="1"
              ref="uploadRef"
              :on-change="getFileUpload"
              :on-exceed="handleExceed"
          >
            <template #trigger>
              <el-button size="small">更新图片</el-button>
            </template>
          </el-upload>
          <el-button size="small" type="warning" @click="uploadFile_Button(row)">确认更新</el-button>
        </template>
      </el-table-column>
      <el-table-column label="标题" property="playlist_name" align="center" min-width="40"/>
      <el-table-column label="创建者" property="user_name" align="center" min-width="40"/>
      <el-table-column label="风格" property="category" align="center" min-width="40"/>
      <el-table-column label="简介" property="intro" align="center"  min-width="100"/>
      <el-table-column label="歌曲管理" property="userSex" align="center" min-width="60">
        <template #default="row">
          <el-button @click="putSinger(row)">
            歌曲管理
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" property="name7" align="center">
        <template #default="row">
          <el-button  @click="editingSinger(row)">编辑</el-button>
          <el-button type="danger" @click="handDeleteSong(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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