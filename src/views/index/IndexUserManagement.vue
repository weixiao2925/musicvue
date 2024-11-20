<script setup>

import {reactive, ref} from "vue";
import testImage from '@/assets/test.jpg'
import {Search} from "@element-plus/icons-vue";
import axios from "axios";
import {fetchAndDisplayFile, get, uploadFile} from "@/net/index.js";
import {useRouter} from "vue-router";
import {usersInfoStore} from "@/store/users.js";
import {ElMessage, ElMessageBox, genFileId} from "element-plus";

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
  getData(currentPage.value)
}


// 将 getData 方法改为异步函数,获取数据
async function getData(page = currentPage.value) {
  await get(`/api/index/getUserTableList?page=${page}&pageSize=${pageSize.value}`,(data)=>{
      tableData.value = data.userDataList;
      pageCount.value=data.count
    // console.log(tableData.value[0].avatarUrl)
    for (let i=0;i<pageCount.value;i++) {
      fetchAndDisplayFile(`/api/index/getUserAvatar?user_id=${tableData.value[i].id}`,(data)=>{
        // console.log(data)
        tableData.value[i].avatarUrl=data;
        // console.log(tableData.value)
      })
    }

    },(errorMessage, errorCode) => {
      // 失败回调函数
      console.error(`Error: ${errorMessage}, Code: ${errorCode}`);
    })



}
getData(1)


//----搜索功能
const searchText=ref("")
// console.log(pageCount)
// console.log(pageSize)
function getSearch(page) {
  if (typeof page !== 'number') {
    page = currentPage.value;
  }
  get(`/api/index/searchUserTableList?searchText=${searchText.value}&page=${page}&pageSize=${pageSize.value}`,
      (data) => {
        tableData.value = data.userDataList;
        pageCount.value = data.count;
        for (let i=0;i<pageCount.value;i++) {
          fetchAndDisplayFile(`/api/index/getUserAvatar?user_id=${tableData.value[i].id}`,(data)=>{
            // console.log(data)
            tableData.value[i].avatarUrl=data;
            // console.log(tableData.value)
          })
        }
      },
      (errorMessage, errorCode) => {
        // 错误的处理逻辑
        console.error(`Error: ${errorMessage}, Code: ${errorCode}`);
      }
  );
}
// /导航
const router=useRouter()
function goTo(route) {
  router.push(route)
}
function editing(row) {
  const userStore=usersInfoStore()
  // console.log(row.row)
  userStore.id=row.row.id;
  userStore.name=row.row.name;
  userStore.email=row.row.email;
  goTo('/index-userEditor')
}

//----删除
//--批量删除
//接收选择框的id
const payload=ref([])
//表格复选框
function handSelectChange(rows) {
  // 使用 map() 从选中的行中提取出id和email列表
  payload.value = rows.map(row => row.id);
  console.log(payload.value);
}
const deleteUsers=()=>{
  // 将数组转换成以逗号分隔的字符串
  const userIds = payload.value.join(',');
  get(`/api/index/deleteUsers?userIds=${userIds}`, (data)=>{
    ElMessage.success("删除成功");
    getData(currentPage.value)
  })
}
//请求确认
const handDeleteUsers=()=>{
  ElMessageBox.confirm(
      '是否确认删除',
      'warning',
      {
        confirmButtonText:'确认',
        cancelButtonText:'取消',
        type:'warning'
      }
  ).then(()=>{
    deleteUsers()
    // ElMessage.success("删除成功")
  }).catch(()=>{
    ElMessage.success("已取消")
  })
}
//--单个删除
const payloadOne=ref([])

const deleteUser=()=>{
  // 将数组转换成以逗号分隔的字符串
  const userIds = payloadOne.value.join(',');
  get(`/api/index/deleteUsers?userIds=${userIds}`, (data)=>{
    ElMessage.success("删除成功");
    getData(currentPage.value)
  })
}
function handDeleteUser(row){
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
    payloadOne.value = [row.row.id];
    // console.log(payloadOne.value);
    deleteUser();
  }).catch(()=>{
    ElMessage.success("已取消");
  })
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
    formData.append('user_id', row.row.id); // 这里需要传递正确的 song_id
    uploadFile('/api/index/upUserAvatar', formData, () => {
      form.aFile=null
      // uploadRef.value= null
      ElMessage.success("上传图片文件成功")
      getData()
    });
  }
  getData()
};
</script>

<template>
      <el-row :gutter="20">
        <el-col :span="6">
          <div>
            <el-input v-model="searchText" placeholder="搜索用户名或邮箱" clearable>
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
            <el-button type="danger" @click="handDeleteUsers">批量删除</el-button>
          </div>
        </el-col>
        <el-col :span="2">

        </el-col>
      </el-row>
  <div style="z-index: 1000">
    <el-table
      style="width: 100%;"
      @selection-change="handSelectChange"
      :data="tableData"
      border
      flexible
      header-row-style="color:red"
    >
      <el-table-column  type="selection"/>
      <el-table-column  label="用户id" property="id"  align="center" min-width="20"/>
      <el-table-column label="用户图片"  align="center" min-width="50">
        <template #default="row">
          <el-avatar shape="square" :size="80" :src="row.row.avatarUrl" />
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
      <el-table-column label="用户名" property="name" align="center" min-width="40"/>
      <el-table-column label="性别" property="sex" align="center" min-width="20"/>
      <el-table-column label="电子邮箱" property="email" align="center" min-width="60"/>
      <el-table-column label="生日" property="birth_date" align="center" min-width="60"/>
      <el-table-column label="签名" property="signature" align="center" show-overflow-tooltip min-width="60"/>
      <el-table-column label="地区" property="region" align="center" min-width="40"/>
      <el-table-column label="操作" property="name7" align="center" min-width="60">
        <template #default="row">
          <el-button @click="editing(row)">编辑</el-button>
          <el-button type="danger" @click="handDeleteUser(row)">删除</el-button>
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
      /><!-- 后端返回总页数-->
    </el-col>
    <el-col :span="4">
      <div></div>
    </el-col>
  </el-row>
</template>

<style scoped>

</style>
