<script setup>

import {reactive, ref} from "vue";
import {Search} from "@element-plus/icons-vue";
import {useRouter} from "vue-router";
import {fetchAndDisplayFile, get, uploadFile} from "@/net/index.js";
import {singerInfoStore} from "@/store/singer.js";
import IndexSingerAdd from "@/views/index/indexSingerManagement/IndexSingerAdd.vue";
import {ElMessage, ElMessageBox, genFileId} from "element-plus";
import IndexSingerEditingPage from "@/views/index/indexSingerManagement/IndexSingerEditingPage.vue";

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
  get(`http://localhost:8081/api/index/getSingerTableList?page=${page}&pageSize=${pageSize.value}`,(data)=>{
    tableData.value = data.singerDataList;
    pageCount.value=data.count;
    for (let i=0;i<pageCount.value;i++) {
      fetchAndDisplayFile(`/api/index/getSingerAvatar?singer_id=${tableData.value[i].singer_id}`,(data)=>{
        // console.log(data)
        tableData.value[i].singer_path=data;
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
  const singerStore=singerInfoStore()
  singerStore.singer_id=table.row.singer_id;
  singerStore.singer_name=table.row.singer_name;
  goTo('/index-song')
}

//----搜索功能
const searchText=ref("")
function getSearch(page) {
  if (typeof page !== 'number') {
    page = currentPage.value;
  }
  get(`http://localhost:8081/api/index/searchSingerTableList?searchText=${searchText.value}&page=${page}&pageSize=${pageSize.value}`,(data)=>{
    tableData.value = data.singerDataList;
    pageCount.value=data.count;
    for (let i=0;i<pageCount.value;i++) {
      fetchAndDisplayFile(`/api/index/getSingerAvatar?singer_id=${tableData.value[i].singer_id}`,(data)=>{
        // console.log(data)
        tableData.value[i].singer_path=data;
        // console.log(tableData.value)
      })
    }
  })
}
//添加数据
const dialogFormVisible = ref(false)
function addInfo() {
  dialogFormVisible.value = !dialogFormVisible.value
  // console.log(dialogFormVisible.value)
}

//----删除
//--批量删除
//接收选择框的id
const payload=ref([])
//表格复选框
function handSelectChange(rows) {
  // console.log(rows)
  // 使用 map() 从选中的行中提取出id和email列表
  payload.value = rows.map(row => row.singer_id);
  // console.log(payload.value);
}
const  deleteSingers=()=>{
  // 将数组转换成以逗号分隔的字符串
  const singerIds = payload.value.join(',');
  get(`/api/index/deleteSingers?singerIds=${singerIds}`, (data)=>{
    ElMessage.success("删除成功");
    getData(currentPage.value)
  })
}
//请求确认
const handDeleteSingers=()=>{
  ElMessageBox.confirm(
      '是否确认删除',
      'warning',
      {
        confirmButtonText:'确认',
        cancelButtonText:'取消',
        type:'warning'
      }
  ).then(()=>{
    deleteSingers()
    // ElMessage.success("删除成功")
  }).catch(()=>{
    ElMessage.success("已取消")
  })
}
//--单个删除
const payloadOne=ref([])

const deleteSinger=()=>{
  // 将数组转换成以逗号分隔的字符串
  const singerIds = payloadOne.value.join(',');
  get(`/api/index/deleteSingers?singerIds=${singerIds}`, (data)=>{
    ElMessage.success("删除成功");
    getData(currentPage.value)
  })
}
function handDeleteSinger(row){
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
    payloadOne.value = [row.row.singer_id];
    // console.log(payloadOne.value);
    deleteSinger();
  }).catch(()=>{
    ElMessage.success("已取消");
  })
}

//----跳转编辑页
const dialogFormVisible_change = ref(false)
const singer_id=ref("")
function editingSinger(row) {
  singer_id.value=row.row.singer_id
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
    formData.append('singer_id', row.row.singer_id); // 这里需要传递正确的 song_id
    uploadFile('/api/index/upSingerAvatar', formData, () => {
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
          <el-input v-model="searchText" placeholder="搜索歌手名称">
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
        <el-button type="success" @click="addInfo">添加</el-button>
      </div>
    </el-col>
    <el-col :span="2">

    </el-col>
  </el-row>
  <el-dialog v-model="dialogFormVisible"
             destroy-on-close
             center
             draggable
             @closed="getData"
  >
    <IndexSingerAdd :currentPage="currentPage" :getData="getData"/>
  </el-dialog>
  <el-dialog v-model="dialogFormVisible_change"
             destroy-on-close
             center
             draggable
             @closed="getData"
  >
    <IndexSingerEditingPage :singer_id="singer_id.valueOf()"/>
  </el-dialog>
    <div>
      <el-table
          ref="multipleTableRef"
          style="width: 100%"
          @selection-change="handSelectChange"
          :data="tableData"
          border
          flexible
          header-row-style="color:red"
      >
        <el-table-column  type="selection"/>
        <el-table-column  label="歌手id" property="singer_id"  align="center" min-width="20"/>
        <el-table-column label="歌手图片"  align="center" min-width="50">
          <template #default="row">
            <el-avatar shape="square" :size="80" :src="row.row.singer_path" />
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
        <el-table-column label="歌手名" property="singer_name" align="center" min-width="40"/>
        <el-table-column label="性别" property="sex" align="center" min-width="20"/>
        <el-table-column label="生日" property="birth_date" align="center" min-width="60"/>
        <el-table-column label="地区" property="nationality" align="center" min-width="60"/>
        <el-table-column label="简介" property="intro" align="center" show-overflow-tooltip min-width="80"/>
        <el-table-column label="歌曲管理" property="userSex" align="center" min-width="60">
          <template #default="row">
            <el-button @click="putSinger(row)">
              歌曲管理
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" property="name7" align="center" min-width="70">
          <template #default="row">
            <el-button @click="editingSinger(row)">编辑</el-button>
            <el-button type="danger" @click="handDeleteSinger(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-button type="danger" @click="handDeleteSingers">批量删除</el-button>
    </div>
    <el-row :gutter="12" justify="center">
      <el-col :span="3">

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
