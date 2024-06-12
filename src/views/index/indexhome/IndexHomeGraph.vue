<script setup>
import {onMounted} from 'vue';
import * as echarts from 'echarts';
import axios from "axios";
import {get} from "@/net/index.js";


let songTypeList = [];
let userSexList=[];
let singerSexList=[];
let singerNationList=[];


//这里我们把get放到promise里面就能解决promise问题了，这样就能在图形渲染时正确请求到数据
async function getData() {
  // 将每个请求包裹在一个新的Promise中
  const userSexPromise = new Promise((resolve) => {
    get(`/api/index/getHomeData`, (data) => {
      userSexList=data.userSexList
      songTypeList=data.songTypeList
      singerSexList=data.singerSexList
      singerNationList=data.singerNationList
      resolve(); // 当请求成功时，解决Promise
    });
  });

  const otherPromise = null // 根据需要创建其他请求对应的Promise
  // 等待所有请求完成
  await Promise.all([userSexPromise, otherPromise]);

  // 此时所有数据应该已经正确赋值
}


onMounted(async () => {
  // 等待 getData 执行完毕(加载数据)
  await getData();


  //获取应用上下文
  const songType = echarts.init(document.getElementById('songType'));
  const userSex = echarts.init(document.getElementById('userSex'));
  const singerSex = echarts.init(document.getElementById('singerSex'));
  const singerNation = echarts.init(document.getElementById('singerNation'));

  const xAxisData_userSex = userSexList.map(userSexList => userSexList.value);
  const seriesData_userSex = userSexList.map(userSexList => userSexList.sum);
  //开始定制
  userSex.setOption({
    legend: {
      orient: 'vertical',
      x: 'left'
    },
    series: [
      {
        type: 'pie',
        data: xAxisData_userSex.map((name, index) => ({
          name: name,
          value: seriesData_userSex[index]
        }))
      }
    ]
  })

  // console.log(songTypeList)
  const xAxisData_songType = songTypeList.map(songTypeList => songTypeList.value);
  const seriesData_songType = songTypeList.map(songTypeList => songTypeList.sum);
  songType.setOption({
    legend: {
      orient: 'vertical',
    },
    title: {

    },
    tooltip: {},
    xAxis: {
      data: xAxisData_songType
    },
    yAxis: {},
    series: [
      {
        name: '数量',
        type: 'bar',
        data: seriesData_songType
      }
    ]
  });

  const xAxisData_singerSex = singerSexList.map(singerSexList => singerSexList.value);
  const seriesData_singerSex = singerSexList.map(singerSexList => singerSexList.sum);
  singerSex.setOption({
    legend: {
      orient: 'vertical',
      x: 'left'
    },
    series: [
      {
        type: 'pie',
        stillShowZeroSum: false,
        data: xAxisData_singerSex.map((name,index) =>({
          name: name,
          value: seriesData_singerSex[index]
        }))
      }
    ],
    roseType: 'area'
  })

  const xAxisData_singerNation = singerNationList.map(singerNationList => singerNationList.value);
  const seriesData_singerNation = singerNationList.map(singerNationList => singerNationList.sum);
  singerNation.setOption({
    legend: {
      orient: 'vertical',
    },
    title: {

    },
    tooltip: {},
    xAxis: {
      data: xAxisData_singerNation
    },
    yAxis: {},
    series: [
      {
        name: '数量',
        type: 'bar',
        data:seriesData_singerNation
      },
    ],
    itemStyle: {
      barBorderRadius: 5,
      borderWidth: 1,
      borderType: 'solid',
      borderColor: '#73c0de',
      shadowColor: '#5470c6',
      shadowBlur: 3
    }

  })

});

</script>

<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <h4 style="margin: 0.8rem 0">用户性别比例</h4>
        <div class="grid-content ep-bg-purple">
          <div id="userSex" style="min-width: 300px; min-height: 20rem"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <h4 style="margin: 0.8rem 0">歌曲类别分布</h4>
        <div class="grid-content ep-bg-purple">
          <div id="songType" style="min-width: 300px; min-height: 20rem"></div>
        </div>
      </el-col>
    </el-row>
  </div>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <h4 style="margin: 0.8rem 0">歌手性别比例</h4>
        <div class="grid-content ep-bg-purple">
          <div id="singerSex" style="min-width: 300px; min-height: 20rem"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <h4 style="margin: 0.8rem 0">歌手国籍分布</h4>
        <div class="grid-content ep-bg-purple">
          <div id="singerNation" style="min-width: 300px; min-height: 20rem"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.grid-content {
  border-radius: 4px;
  min-height: 20rem;
  background-color: #fff;
  border: 1px solid red;
}
</style>