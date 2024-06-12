<template>
  <el-container class="index-con">
    <el-aside class="asideshow">
      <leftnav></leftnav>
    </el-aside>
    <el-container class="main-con">
      <el-header class="index-header">
        <navcon></navcon>
      </el-header>
      <el-main clss="index-main">
        <router-view :key="Math.random()"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
// 导入组件
import navcon from '../components/navcon.vue'
import leftnav from '../components/leftnav.vue'
export default {
  name: 'index',
  data() {
    return {
      showclass: 'asideshow',
      showtype: false
    }
  },
  // 注册组件
  components: {
    navcon,
    leftnav
  },
  methods: {},
}
</script>
<style >
.index-con {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}


.aside {
  width: 64px !important;
  height: 100%;
  background-color: #334157;
  margin: 0px;
}
.asideshow {
  width: 280px !important;
  height: 100%;
  background-color: #334157;
  margin: 0;
  overflow:scroll;
}

::-webkit-scrollbar {
  display: none;
}

.index-header,
.index-main {
  padding: 0px;
  border-left: 2px solid #333;
}
</style>
