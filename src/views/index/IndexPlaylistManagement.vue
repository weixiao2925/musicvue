<script setup>

import {ref} from "vue";
import testImage from '@/assets/test.jpg'
import {Search} from "@element-plus/icons-vue";
import {useRouter} from "vue-router";
import {get} from "@/net/index.js";
import {ElMessage, ElMessageBox} from "element-plus";





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
  })
  // try {
  //   // 等待 axios 请求完成
  //   const response = await get(`http://localhost:8081/data2?page=${page}&pageSize=${pageSize.value}`);
  //   // 赋值操作
  //   tableData.value=response.data.userDataList;
  //   pageCount.value=response.data.count
  //   // console.log(tableData)
  //   // console.log(pageCount.value)
  // } catch (error) {
  //   console.error(error);
  // }
}

getData(1)

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
      <el-table-column  label="用户id" property="playlist_id"  align="center" min-width="20"/>
      <el-table-column label="用户图片"  align="center" min-width="50">
        <template #default="row">
          <el-avatar shape="square" :size="80" :src="row.row.playList_path" />
          <el-button size="small">更新图片</el-button>
        </template>
      </el-table-column>
      <el-table-column label="标题" property="playlist_name" align="center" min-width="40"/>
      <el-table-column label="创建者" property="user_name" align="center" min-width="40"/>
      <el-table-column label="风格" property="category" align="center" min-width="40"/>
      <el-table-column label="简介" property="intro" align="center"  min-width="160"/>
      <el-table-column label="xx管理" property="userSex" align="center" min-width="60">
        <template #default="row">
          <el-button>
            xx管理
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" property="name7" align="center">
        <template #default="row">
          <el-button>编辑</el-button>
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