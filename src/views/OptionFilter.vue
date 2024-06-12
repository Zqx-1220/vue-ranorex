<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="组件类型">
        <el-select v-model="form.type" placeholder="请选择组件" @change="handleSelect" size="mini">
          <template v-for="item in typeList">
            <el-option :label="item.name" :value="item.value"></el-option>
          </template>
        </el-select>
        <el-button v-if="form.type"  size="mini" icon="el-icon-view" circle @click="previewImg1"></el-button>
      </el-form-item>
      <el-form-item label="示例" v-show="false">
        <el-image
          style="width: 100px; height: 100px"
          :src="previewSrc"
          ref="previewImg"
          :preview-src-list="[previewSrc]">
        </el-image>
      </el-form-item>
      <el-form-item label="示例" v-show="false">
        <el-image
          style="width: 100px; height: 100px"
          :src="previewSrc2"
          ref="previewImg2"
          :preview-src-list="[previewSrc2]">
        </el-image>
      </el-form-item>
      <h4 v-if="form.type">数据
      </h4>
      <div v-if="form.type=='radio'">
        <el-form-item label="筛选条件">
          <el-input v-model="form.value" placeholder="示例:待审核" size="mini" ></el-input>
        </el-form-item>
      </div>
      <div v-if="form.type=='span'">
        <template v-for="(item,index) in fields">
          <el-form-item label="筛选条件" style="margin-bottom: 20px" label-width="150px">
            <div  >
              <el-input v-model="item.type" placeholder="示例:分类" style="width: 90%" size="mini"></el-input>
              <el-button type="primary" size="mini" icon="el-icon-plus" circle @click="addField" v-if="index==0"></el-button>
              <el-button v-if="item.type"  size="mini" icon="el-icon-view" circle @click="previewImg2" ></el-button>
              <el-button type="danger" size="mini" icon="el-icon-minus" circle @click="delField(index)" v-if="index!=0"></el-button>
            </div>
          </el-form-item>
          <el-form-item label="输入值" style="margin-bottom: 20px" label-width="150px">
            <el-input v-model="item.value" placeholder="实例:房屋建筑工程" style="width: 90%" size="mini"></el-input>
          </el-form-item>
        </template>
      </div>

    </el-form>
  </div>
</template>

<script>
import {readJson} from "../api";

export default {
  name: "OptionFilter",
  data() {
    return {
      form: {
        type: ''
      },
      previewSrc: '',
      previewSrc2:'',
      typeList: [{name: "单选框", value: "radio"}, {name: "标签", value: "span"}],
      fields: [{
        label: "",
        value: "",
        type: ""
      }],
      types:['input','select','tree','radio','date_range','tree_checkbox'],
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    previewImg2(){
      this.$refs.previewImg2.showViewer=true
    },
    previewImg1(){
      this.$refs.previewImg.showViewer=true
    },
    addField(){
      this.fields.push({
        label: "",
        value: "",
        type: ""
      })
    },
    delField(index){
      this.fields.splice(index,1);
    },
    handleSelect(value){
      console.log(value);
      if(value=='span'){
        this.previewSrc= require('@/assets/OptionFilter_span.png')
      }
      if(value=='radio'){
        this.previewSrc= require('@/assets/OptionFilter_radio.png')
      }
    },
    handleSelect2(value){
      if(value=='input'){
        this.previewSrc2= require('@/assets/multipleInput_input.png')
      }
      if(value=='select'){
        this.previewSrc2= require('@/assets/multipleInput_select.png')
      }
      if(value=='tree'){
        this.previewSrc2= require('@/assets/multipleInput_tree.png')
      }
      if(value=='radio'){
        this.previewSrc2= require('@/assets/multipleInput_radio.png')
      }
      if(value=='date_range'){
        this.previewSrc2= require('@/assets/multipleInput_date_range.png')
      }
      if(value=='tree_checkbox'){
        this.previewSrc2= require('@/assets/multipleInput_tree_checkbox.png')
      }
    }
  }
}
</script>

<style scoped>

</style>
