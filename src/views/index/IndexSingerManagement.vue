<script setup>

import {ref} from "vue";
import testImage from '@/assets/test.jpg'
import {Search} from "@element-plus/icons-vue";



const multipleTableRef=ref()
const tableData = [
  {
    id: 1,
    name2: 'Tom',
    name3: 'jian-0925@qq.om',
    name4: '2019-04-25',
    name5: 'Tom',
    name6: '江苏',
    name7: 'Tom',
    name8: 'Tom',
    name9: 'Tom',
    avatarUrl:testImage,
  },  {
    id:2,
    name2: 'Tom2',
    name3: 'Tom2',
    name4: 'Tom2',
    name5: 'dwadbwbdakjwbdjasbdkbsajdaskbdasjdbasjdbasjdbasjkdbsjakbdjasbdjkasbd',
    name6: 'Tom2',
    name7: 'Tom2',
    name8: 'Tom2',
    name9: 'Tom2',
    avatarUrl:testImage,
  }, {
    id:3,
    name2: 'Tom2',
    name3: 'Tom2',
    name4: 'Tom2',
    name5: 'dwadbwbdakjwbdjasbdkbsajdaskbdasjdbasjdbasjdbasjkdbsjakbdjasbdjkasbd',
    name6: 'Tom2',
    name7: 'Tom2',
    name8: 'Tom2',
    name9: 'Tom2',
    avatarUrl:testImage,
  },{
    id:4,
    name2: 'Tom2',
    name3: 'Tom2',
    name4: 'Tom2',
    name5: 'dwadbwbdakjwbdjasbdkbsajdaskbdasjdbasjdbasjdbasjkdbsjakbdjasbdjkasbd',
    name6: 'Tom2',
    name7: 'Tom2',
    name8: 'Tom2',
    name9: 'Tom2',
    avatarUrl:testImage,
  },
]


</script>

<template>
    <el-row :gutter="20">
      <el-col :span="6">
        <div>
          <el-input>
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-button type="primary">搜索</el-button>
        </div>
      </el-col>
    </el-row>
    <div>
      <el-button type="danger">批量删除</el-button>
    </div>

    <div>
      <el-table
          ref="multipleTableRef"
          style="width: 100%"
          @selection-change=""
          :data="tableData"
          border
          flexible
      >
        <el-table-column  type="selection"/>
        <el-table-column  label="用户id" property="id"  align="center" min-width="20"/>
        <el-table-column label="用户图片"  align="center" min-width="50">
          <template #default="row">
            <el-avatar shape="square" :size="80" :src="row.row.avatarUrl" />
            <el-button size="small">更新图片</el-button>
          </template>
        </el-table-column>
        <el-table-column label="用户名" property="name8" align="center" min-width="40"/>
        <el-table-column label="性别" property="name2" align="center" min-width="20"/>
        <el-table-column label="生日" property="name4" align="center" min-width="60"/>
        <el-table-column label="地区" property="name6" align="center" min-width="60"/>
        <el-table-column label="简介" property="name5" align="center" show-overflow-tooltip min-width="80"/>
        <el-table-column label="xx管理" property="name3" align="center" min-width="60">
          <template #default="row">
            <el-button>
              xx管理
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" property="name7" align="center">
          <template #default="row">
            <el-button>编辑</el-button>
            <el-button type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-row :gutter="12" justify="center">
      <el-col :span="3">
        <div></div>
      </el-col>
      <el-col :span="4">
        <el-pagination layout="prev, pager, next" :total="50"/><!-- 后端再返回总数据量，然后再除以4-->
      </el-col>
      <el-col :span="4">
        <div></div>
      </el-col>
    </el-row>
</template>

<style scoped>

</style>