<script setup>

</script>

<template>
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
  background-color: green;
}
</style>