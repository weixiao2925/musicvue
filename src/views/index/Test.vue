<script setup>
import {onBeforeUpdate, onMounted, onUpdated, reactive} from 'vue';
import * as echarts from 'echarts';
const data=reactive({
  msg1:'衬衫',
  msg2:'羊毛衫',
  msg3:'雪纺纱',
  msg4:'裤子',
  msg5:'袜子'
})

onMounted(() => {
  const songType = echarts.init(document.getElementById('songType'));
  songType.setOption({
    legend:{
      orient: 'vertical',
    },
    title: {
      text: '测试1'
    },
    tooltip: {},
    xAxis: {
      data: [data.msg1, data.msg2, data.msg3, data.msg4, data.msg5,data.msg5]
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }
    ]
  });
  const userSex=echarts.init(document.getElementById('userSex'));
  userSex.setOption({
    legend:{
      orient: 'vertical',
      x:'left'
    },
    series:[
      {
        type: 'pie',
        data:[
          {
            value:2,
            name:'男'
          },
          {
            value: 3,
            name:'女'
          }
        ]
      }
    ]
  })
});
onUpdated(()=>{
  const songType = echarts.init(document.getElementById('songType'));
  songType.setOption({
    legend:{
      orient: 'vertical',
    },
    title: {
      text: '测试1'
    },
    tooltip: {},
    xAxis: {
      data: [data.msg1, data.msg2, data.msg3, data.msg4, data.msg5,data.msg5]
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }
    ]
  });
  const userSex=echarts.init(document.getElementById('userSex'));
  userSex.setOption({
    legend:{
      orient: 'vertical',
      x:'left'
    },
    series:[
      {
        type: 'pie',
        data:[
          {
            value:2,
            name:'男'
          },
          {
            value: 3,
            name:'女'
          }
        ]
      }
    ]
  })
})
</script>

<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <h4 style="margin: 0.8rem 0">比例1</h4>
        <div  class="grid-content ep-bg-purple">
          <div id="userSex" style="min-width: 300px; min-height: 20rem"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <h4 style="margin: 0.8rem 0">比例1</h4>
        <div  class="grid-content ep-bg-purple">
          <div id="songType" style="min-width: 300px; min-height: 20rem"></div>
        </div>
      </el-col>
    </el-row>
  </div>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <h4 style="margin: 0.8rem 0">比例1</h4>
        <div class="grid-content ep-bg-purple" />
      </el-col>
      <el-col :span="12">
        <h4 style="margin: 0.8rem 0">比例1</h4>
        <div class="grid-content ep-bg-purple" />
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.grid-content {
  border-radius: 4px;
  min-height: 20rem;
  background-color: #11ff00;

}
</style>