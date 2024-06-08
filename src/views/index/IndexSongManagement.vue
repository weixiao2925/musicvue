<script setup>

import {ref} from "vue";
import testImage from '@/assets/test.jpg'
import {Search} from "@element-plus/icons-vue";
import {singerInfoStore} from "@/store/singer.js";
import {useRouter} from "vue-router";
import {get} from "@/net/index.js";
import IndexSingerAdd from "@/views/index/indexSingerManagement/IndexSingerAdd.vue";
import {ElMessage, ElMessageBox} from "element-plus";

import IndexSongChange from "@/views/index/indexSongManagement/IndexSongChange.vue";
import IndexSongAdd from "@/views/index/indexSongManagement/IndexSongAdd.vue";



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
//获取仓库信息
const singerData=singerInfoStore()

// 将 getData 方法改为异步函数,获取数据
async function getData(page = currentPage.value) {
  get(`http://localhost:8081/api/index/getSongTableList?singer_id=${singerData.singer_id}&page=${page}&pageSize=${pageSize.value}`,(data)=>{
    tableData.value = data.songDataList;
    pageCount.value=data.count;
  })
}

getData(1)


//----搜索功能
const searchText=ref("")
function getSearch(page) {
  if (typeof page !== 'number') {
    page = currentPage.value;
  }
  get(`http://localhost:8081/api/index/searchSongTableList?singer_id=${singerData.singer_id}&&searchText=${searchText.value}&&page=${page}&pageSize=${pageSize.value}`,(data)=>{
    tableData.value = data.songDataList;
    pageCount.value=data.count;
  })
}

//----编辑数据
const dialogFormSongInfoVisible = ref(false)//默认关闭状态
const song_id=ref("")//song_id
function changeInfoDialog(row) {
  song_id.value=row.row.song_id;
  // console.log(song_id.value)
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
  get(`/api/index/deleteSongs?songIds=${songIds}`, (data)=>{
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
    <IndexSongChange :song_id="song_id.valueOf()" :is-singer="true"/>
  </el-dialog>
  <el-dialog
      v-model="dialogFormSongAddVisible"
      center
      align-center
      draggable
      destroy-on-close
      @closed="getData"
  >
    <IndexSongAdd />
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
          <el-avatar shape="square" :size="80" :src="row.row.avatarUrl" />
          <el-button size="small">更新图片</el-button>
        </template>
      </el-table-column>
      <el-table-column label="歌曲名" property="title" align="center" min-width="40"/>
      <el-table-column label="类型" property="songType" align="center" min-width="30"/>
      <el-table-column label="歌词" property="xx" align="center"  min-width="160"/>
      <el-table-column label="音频管理" property="userSex" align="center" min-width="35">
        <template #default="row">
          <el-space direction="vertical">
            <div>
              <el-button size="small">更新音频</el-button>
            </div>
            <div>
              <el-button size="small">更新歌词</el-button>
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