/**
* 左边菜单
*/
<template>
  <el-menu :collapse="collapsed" active-text-color="#ffd04b" background-color="#334157" class="el-menu-vertical-demo"
           collapse-transition text-color="#fff" unique-opened @select="handleSelect">
    <div class="logobox" style="cursor: pointer" @click="openDialog">
      <img alt="" class="logoimg" src="../assets/img/logo.png">
    </div>
    <template v-for="(menu,index) in allmenu">
      <el-submenu :index="(index + '')">
        <template slot="title">
          <span>{{ menu.name }}</span>
        </template>
        <template v-for="(chmenu,idx) in menu.children">
          <el-menu-item v-if="!chmenu.children" :index="index + '-' + idx">
            <template slot="title">
              <span>{{ chmenu.name }}</span>
            </template>
          </el-menu-item>
          <el-submenu v-else :index="index + '-' + idx">
            <template slot="title">
              <span>{{ chmenu.name }}</span>
            </template>

            <template v-for="(chchmenu,ii) in chmenu.children">
              <el-menu-item v-if="!chchmenu.children" :index="index + '-' + idx + '-' + ii">
                <template slot="title">
                  <span>{{ chchmenu.name }}</span>
                </template>
              </el-menu-item>

              <el-submenu v-else :index="index + '-' + idx + '-' + ii">
                <template slot="title">{{ chchmenu.name }}</template>


                <template v-for="(chchchmenu,i) in chchmenu.children">
                  <el-menu-item v-if="!chchchmenu.children" :index="index + '-' + idx + '-' + ii + '-' + i">
                    <template slot="title">
                      <span>{{ chchchmenu.name }}</span>
                    </template>
                  </el-menu-item>

                  <el-submenu v-else :index="index + '-' + idx + '-' + ii + '-' + i">
                    <template slot="title">
                      {{ chchchmenu.name }}
                    </template>

                    <template v-for="(chchchchmenu,j) in chchchmenu.children">
                      <el-menu-item v-if="!chchchchmenu.children"
                                    :index="index + '-' + idx + '-' + ii + '-' + i + '-' + j">
                        <template slot="title">
                          <span>{{ chchchchmenu.name }}</span>
                        </template>
                      </el-menu-item>
                      <el-submenu v-else :index="index + '-' + idx + '-' + ii + '-' + i + '-' + j">
                        <template slot="title">
                          {{ chchchchmenu.name }}
                        </template>
                      </el-submenu>
                    </template>
                  </el-submenu>
                </template>
              </el-submenu>
            </template>
          </el-submenu>
        </template>
      </el-submenu>
    </template>
    <el-dialog
      :visible.sync="dialogVisible"
      title="菜单管理"
      top="5vh"
      width="80%"
    >

      <div style="height: 70vh;overflow:scroll;display: flex">
        <div style="width: 40%">
          <el-tree ref="treeRef" :data="allmenu" :props="defaultProps" highlight-current node-key="id"
                   @node-click="handleNodeClick"></el-tree>
        </div>


        <div style="width: 60%">
          <el-row style="margin-bottom: 40px">
            <el-button @click="addParent">新增主菜单</el-button>
            <el-button v-if="type" plain type="warning" @click="cancel">取消</el-button>
          </el-row>


          <!--新增主菜单 -->
          <el-form v-if="type=='addParent'" ref="form" :model="form" label-width="180px">
            <el-form-item label="新增的主菜单名称">
              <el-input v-model="form.newName"></el-input>
            </el-form-item>
          </el-form>


          <el-form ref="form" :model="form" label-width="180px">
            <el-form-item label="选择的菜单">
              <el-input v-model="form.chooseName" disabled></el-input>
            </el-form-item>
            <el-form-item label="" v-if="type!='addParent' && form.chooseName">
              <el-row>
                <el-button type="primary" @click="add">新增子菜单</el-button>
                <el-popconfirm
                  @confirm="del"
                  :title="'是否删除<'+form.chooseName+'>菜单'"
                >
                  <el-button type="danger" slot="reference">删除</el-button>
                </el-popconfirm>
              </el-row>
            </el-form-item>

            <el-form-item v-if="type=='add'" label="子菜单名称">
              <el-input v-model="form.newName"></el-input>
            </el-form-item>


          </el-form>
        </div>
      </div>


      <span slot="footer" class="dialog-footer">

    <el-button @click="dialogVisible = false">关 闭</el-button>
        <el-button type="primary" @click="save">保 存</el-button>
  </span>
    </el-dialog>


  </el-menu>
</template>
<script>
import axios from "axios";
import {readJson, writeJson} from "../api"

export default {
  name: 'leftnav',
  data() {
    return {
      form: {
        chooseName: '',
        chooseNode: '',
        newName: '',
        newNode: ''
      },
      collapsed: false,
      allmenu: [],
      dialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      backAllMenu: [],
      type: ''
    }
  },
  // 创建完毕状态(里面是操作)
  created() {
    this.refreshMenu();
  },
  methods: {
    handleSelect(index, indexPath) {
      let indexArr = index.split('-')
      let indexArr2 = indexArr.map((item) => {
          return Number(item)
        }
      )
      let components = this.getComponentsByIndices(this.allmenu, indexArr2);
      let id = this.getComponentsByID(this.allmenu, indexArr2);
      this.$router.push({path: `/components/${id}/${index}`})
    },
    getComponentsByIndices(menus, indices) {
      if (indices.length == 1) {
        return menus[indices[0]].components
      }
      if (indices.length == 2) {
        return menus[indices[0]].children[indices[1]].components
      }
      if (indices.length == 3) {
        return menus[indices[0]].children[indices[1]].children[indices[2]].components
      }
      if (indices.length == 4) {
        return menus[indices[0]].children[indices[1]].children[indices[2]].children[indices[3]].components
      }
      if (indices.length == 5) {
        return menus[indices[0]].children[indices[1]].children[indices[2]].children[indices[3]].children[indices[4]].components
      }
    },
    getComponentsByID(menus, indices) {
      if (indices.length == 1) {
        return menus[indices[0]].id
      }
      if (indices.length == 2) {
        return menus[indices[0]].children[indices[1]].id
      }
      if (indices.length == 3) {
        return menus[indices[0]].children[indices[1]].children[indices[2]].id
      }
      if (indices.length == 4) {
        return menus[indices[0]].children[indices[1]].children[indices[2]].children[indices[3]].id
      }
      if (indices.length == 5) {
        return menus[indices[0]].children[indices[1]].children[indices[2]].children[indices[3]].children[indices[4]].id
      }
    },
    openDialog() {
      this.refreshMenu();
      this.cleanForm();
      this.dialogVisible = true
    },
    cancel() {
      this.form.newName = ''
      this.form.newNode = ''
      this.type = ''
    },
    refreshMenu() {
      readJson().then(res => {
        this.allmenu = res.data
      })
    },
    handleNodeClick(data, node) {
      this.form.chooseName = data.name
      this.form.chooseNode = node
    },
    addParent() {
      this.type = 'addParent'
    },
    del() {
      this.$refs.treeRef.remove(this.form.chooseNode)
      this.cleanForm();
      writeJson({"data": this.allmenu}).then(res => {
        this.refreshMenu()
        console.log('保存成功')
        this.$message.success('保存成功')
      })
    },
    cleanForm() {
      this.form.newName = ''
      this.form.newNode = ''
      this.form.chooseNode = ''
      this.form.chooseName = ''
      this.type = ''
    },
    add() {
      this.type = 'add'
      this.form.newName = '';
      this.form.newNode = '';
    },
    save() {
      let maxId = this.findMaxId(this.allmenu)
      if (this.type == '') {
        return this.$message.error('操作失败');
      } else {
        if (this.type == 'addParent') {
          this.allmenu.push({
            name: this.form.newName,
            children: []
          })
        }
        if (this.type == 'add') {
          this.$refs.treeRef.append({name: this.form.newName, id: maxId + 1, components: {}}, this.form.chooseNode)
        }
      }

      this.cleanForm();
      writeJson({"data": this.allmenu}).then(res => {
        this.refreshMenu()
        console.log('保存成功')
        this.$message.success('保存成功')
      })
    },
    findMaxId(obj) {
      const that = this
      var maxId = 0;
      if (Array.isArray(obj)) {
        obj.forEach(function (item) {
          var id = that.findMaxId(item);
          if (id > maxId) {
            maxId = id;
          }
        });
      } else if (typeof obj === 'object') {
        for (var key in obj) {
          if (key === 'id') {
            if (obj[key] > maxId) {
              maxId = obj[key];
            }
          } else {
            var id = that.findMaxId(obj[key]);
            if (id > maxId) {
              maxId = id;
            }
          }
        }
      }
      return maxId;
    }
  }
}
</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 280px;
  min-height: 400px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
  text-align: left;
}

.el-menu-item-group__title {
  padding: 0px;
}

.el-menu-bg {
  background-color: #1f2d3d !important;
}

.el-menu {
  border: none;
}

.logobox {
  height: 40px;
  line-height: 40px;
  color: #9d9d9d;
  font-size: 20px;
  text-align: center;
  padding: 20px 0px;
}

.logoimg {
  height: 40px;
}
</style>
