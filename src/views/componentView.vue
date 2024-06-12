<template>
  <div>
    <div>

      <el-dialog
        title="新增组件"
        :visible.sync="addComDialog"
        :close-on-click-modal="false"
        v-if="addComDialog"
        :before-close="handleClose"
        width="50%">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="用例名称">
            <el-autocomplete
              style="width: 100%"
              class="inline-input"
              size="mini"
              v-model="caseName"
              :fetch-suggestions="querySearch"
              placeholder="请输入用例名称"
              @select="handleSelect"
            ></el-autocomplete>
          </el-form-item>

          <el-form-item label="选择组件" v-if="caseName">
            <el-select v-model="form.components" placeholder="请选择组件" style="width: 100%" size="mini">
              <template v-for="item in allComList">
                <el-option :label="item" :value="item" :disabled="validCom(item)"></el-option>
              </template>
            </el-select>
          </el-form-item>

          <div>
            <search-b-d v-if="form.components=='SearchBD'"/>
            <option-filter v-if="form.components=='OptionFilter'"/>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="cancelAddCom">取 消</el-button>
    <el-button type="primary" @click="addComFN">确 定</el-button>
  </span>
      </el-dialog>
      <h3>
        组件列表
        <el-button type="primary" size="medium" icon="el-icon-plus" circle @click="addCom"></el-button>
      </h3>
      <div style="display: flex;justify-content: space-evenly;flex-wrap: wrap">
        <el-table
          :data="com_arr"
          style="width: 100%;margin-bottom: 20px;"
          row-key="id"
          border
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column
            prop="name"
            label="组件名称"
            width="220"
            >
          </el-table-column>
          <el-table-column
            prop="suiteName"
            label="用例"
            >
          </el-table-column>
          <el-table-column

            fixed="right"
            width="260">
            <template slot-scope="scope">
              <div style="display: flex;align-content: center;justify-content: center" v-if="!scope.row.name">
                <el-button
                  icon="el-icon-view"
                  type="primary"
                  @click="see(scope.row.suiteName, scope.row.suite)"
                  size="mini">
                </el-button>
                <el-button
                  type="warning"
                  icon="el-icon-edit"
                  size="mini">

                </el-button>
                <el-button
                  icon="el-icon-delete"
                  type="danger"
                  size="mini">
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

      </div>


    </div>

  </div>
</template>

<script>
import {readJson} from "../api";
import SearchBD from "./SearchBD.vue";
import OptionFilter from "./OptionFilter.vue";

export default {
  name: "componentView",
  components: {SearchBD, OptionFilter},
  data() {
    return {
      textarea: '',
      id: undefined,
      allmenu: [],
      index: undefined,
      components: {},
      com_arr: [],
      case_arr: [],
      addComDialog: false,
      addCaseDialog: false,
      caseName: '',
      restaurants: [],
      form: {},
      tableData: [{
        id: 1,
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        id: 2,
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        id: 3,
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        children: [{
          id: 31,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          id: 32,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }]
      }, {
        id: 4,
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      allComList: [
        'ChooseBD',
        'ChooseMenu',
        'ChooseTable',
        'ClickTopBtn',
        'InputForm',
        'InputTable',
        'Login',
        'Logout',
        'OptionFilter',
        'SearchBD',
        'SelectTree',
        'Submit'
      ]
    }
  },
  created() {
    this.refreshMenu()
    const loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    setTimeout(() => {
      loading.close();
    }, 2000);
  },
  mounted() {
    this.id = this.$route.params.id;
    this.index = this.$route.params.index;
    let indexArr = this.index.split('-')
    let indexArr2 = indexArr.map((item) => {
        return Number(item)
      }
    )
    setTimeout(() => {
      let map = new Map();
      let map2 = new Map();
      this.components = this.getComponentsByIndices(this.allmenu, indexArr2);
      for (var key in this.components) {
        if (this.components.hasOwnProperty(key)) {
          this.components[key].config.forEach(item => {
            let suiteName = item['suiteName'];
            if (map.has(suiteName)) {
            } else {
              map.set(suiteName, key)
              this.case_arr.push({name: suiteName})
              this.restaurants.push({"value": suiteName})
            }
          })
        }
      }

      this.com_arr = Object.keys(this.components)
      this.com_arr = this.com_arr.map(item => {
        let new_item = {
          "name": item,//OptionFilter,SearchBD...
          "children": [],
          "id": Math.random()
        }
        for (var key in this.components) {
          if (key == item) {
            this.components[key].config.forEach(items => {
              let suiteName = items['suiteName'];
              new_item.children.push({"suiteName": suiteName, "name": '', "id": Math.random(),"suite":item})
            })
          }
        }
        return new_item
      })
      console.log(this.com_arr)

    }, 2000)
  },
  methods: {
    see(suiteName, name) {
      console.log(suiteName,name)
      if (this.components.hasOwnProperty(name)) {
        let arr = this.components[name].config;
        for (let i = 0; i < arr.length; i++) {
          let items = this.components[name].config[i];
          let suiteNames = items['suiteName'];
          if (suiteName == suiteNames) {
            this.form = items
            console.log(this.form)
          }
        }
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {
        });
    },
    validCom(item) {
      if (this.components.hasOwnProperty(item)) {
        let arr = this.components[item].config;
        for (let i = 0; i < arr.length; i++) {
          let items = this.components[item].config[i];
          let suiteName = items['suiteName'];
          if (suiteName == this.caseName) {
            return true//禁用
          }
        }
        return false
      }
      return false
    },
    handleSelect(item) {
      this.caseName = item.value
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    cancelAddCom() {
      this.addComDialog = false;
      this.caseName = ''
    },
    addComFN() {


    },
    addCom() {
      this.addComDialog = true;
    },
    addCase() {
      this.addCaseDialog = true;
    },
    refreshMenu() {
      readJson().then(res => {
        this.allmenu = res.data
      })
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
  }
}
</script>

<style scoped>

</style>
