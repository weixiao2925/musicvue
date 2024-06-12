<script setup>

  import {reactive} from "vue";
  import {get} from "@/net/index.js";

  const tableData=reactive({
    userSum:0,
    songSum:0,
    singerSum:0,
    playlistSum:0,
  })
  // 将 getData 方法改为异步函数,获取数据
  async function getData() {
    get(`/api/index/getHomeData`,(data)=>{
      tableData.userSum=data.userSum;
      tableData.songSum=data.songSum;
      tableData.singerSum=data.singerSum;
      tableData.playlistSum=data.playlistSum;
    })
  }
  getData()
</script>

<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content ep-bg-purple" >
          <div class="text">
            {{ tableData.userSum }}
          </div>
          <el-text>
            用户总数
          </el-text>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content ep-bg-purple" >
          <div class="text">
            {{ tableData.songSum }}
          </div>
          <el-text>
            歌曲总数
          </el-text>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content ep-bg-purple" >
          <div class="text">
            {{ tableData.singerSum }}
          </div>
          <el-text>
            歌手总数
          </el-text>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content ep-bg-purple" >
          <div class="text">
            {{ tableData.playlistSum }}
          </div>
          <el-text>
            歌单总数
          </el-text>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>


.grid-content {
  padding: 15px 0 0 0;
  border-radius: 4px;
  min-height: 3.5rem;
  background-color: #FFFFFF;
  text-align: center;
}
.text{
  font-size: 25px;
}
</style>