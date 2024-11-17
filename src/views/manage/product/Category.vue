<template>
  <div id="">
    <main-head>
      <el-form :inline="true" class="demo-form-inline" size="medium">
        <el-form-item>
          <el-input
              placeholder="请输入分类名称搜索"
              v-model="params.name"
              clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="search" type="primary" icon="el-icon-search">搜索</el-button>
        </el-form-item>
      </el-form>

    </main-head>
    <main-content>
      <template v-slot:top>
        <!-- 筛选 -->
        <el-button size="medium" @click="openDialog(1)" type="primary">添加分类</el-button>
      </template>
      <!-- 表格 -->
      <el-table
          ref="tree"
          :data="list"
          style="width: 100%"
          row-key="id"
          lazy
          :load="load"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}" height="520">

        <el-table-column label="分类编号" prop="id" align="center" width="180px">
          <template slot-scope="scope">
            <span>{{ scope.row.id === undefined ? "—" : scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分类名称" prop="name" align="center" width="200px">
          <template slot-scope="scope">
            {{ scope.row.name === undefined ? "—" : scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="图标" prop="avatar" align="center" min-width="180px">
          <template slot-scope="scope">
            <img :src="scope.row.cover | fullPath" alt="" style="width: 40px; height: 40px" v-if="scope.row.cover">
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            {{ $moment(scope.row.createTime).format('Y-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250px">
          <template slot-scope="scope">
            <div v-if="scope.row.tenantId!==-1">
              <el-button size="small" type="text" @click="saveSon(scope.row)">添加</el-button>
              <el-button size="small" type="text" @click="openUpdate(scope.row)">编辑</el-button>
              <el-button size="small" type="text" @click="remove(scope.row.id)" style="color: #e74c3c">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </main-content>
    <main-footer>
      <el-pagination
          class="align-center"
          background
          @size-change="handleSizeChange"
          @current-change="getList"
          :current-page.sync="params.pageNo"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="params.pageSize"
          :layout="$store.state.isPhone ? 'total, prev, pager, next' : 'total, sizes, prev, pager, next, jumper'"
          :total="total"
      >
      </el-pagination>
    </main-footer>
    <!-- 弹框 -->
    <el-dialog :title="dialogTitle" :visible.sync="addDialog" width="520px" @close="closeDialog" :close-on-click-modal="false">
      <el-form :model="addFrom" :rules="rule" ref="addFrom" label-width="120px">

        <div v-if="dialogTitle==='添加分类'">
          <!--          <el-form-item>-->
          <!--            <el-switch-->
          <!--                v-model="addFrom.hasParent"-->
          <!--                active-color="#13ce66"-->
          <!--                inactive-color="#3498db"-->
          <!--                active-text="子级分类"-->
          <!--                inactive-text="一级分类">-->
          <!--            </el-switch>-->
          <!--          </el-form-item>-->

        </div>
        <el-form-item label="上级分类">
          <!--          <el-select v-model="addFrom.parentName" placeholder="请选择" @change="changeCategory" :disabled="true">-->
          <!--            <el-option-->
          <!--                v-for="item in allList"-->
          <!--                :key="item.id"-->
          <!--                :label="item.name"-->
          <!--                :value="item.id"-->
          <!--            >-->
          <!--            </el-option>-->
          <!--          </el-select>-->
          <span>{{ addFrom.parentName }}</span>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input placeholder="请输入分类名称" v-model="addFrom.name"></el-input>
        </el-form-item>
        <el-form-item label="分类图标">
          <el-image
              style="width: 150px; height: 150px"
              fit="cover"
              class="el-defult"
              :src="addFrom.cover | fullPath"
              v-if="addFrom.cover.search(';base64') == -1 && addFrom.cover"
          ></el-image>
          <el-image style="width: 150px; height: 150px" fit="cover" class="el-defult" :src="addFrom.cover"
                    v-if="addFrom.cover.search(';base64') != -1"></el-image>
          <ImgCutter @onChooseImg="onChooseImg(2)" v-on:cutDown="cutDown" :sizeChange="false" :cutWidth="80" :cutHeight="80"
                     :boxWidth="800" :boxHeight="700">
            <el-button size="small" type="primary" slot="open">选择图片</el-button>
          </ImgCutter>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="save()" v-loading="btnStatus">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {VueCropper} from 'vue-cropper';

export default {
  components: {
    VueCropper,

  },
  data() {
    return {
      addDialog: false,
      dialogTitle: "分类信息",
      params: {
        pageNo: 1,
        pageSize: 10,
        isCount: true,
        type: 1,
        id: '',
      },
      //所有分类缓存
      allList: [],
      list: [],
      total: 0,
      loading: false,
      btnStatus: false,
      addFrom: {
        password: "",
        account: "",
        type: 0,
        parentName: "",
        hasParent: false,
        categoryStatus: true,
        cover: ''
      },
      rule: {
        account: {
          message: '请输入账号',
          required: true,

        },
        password: {
          message: '请输入密码',
          required: true,
        },
      },


    };
  },
  watch: {},
  created() {
  },
  mounted() {
    this.getList(1);
    this.getAllList()
  },

  methods: {
    cutDown(e) {
      console.log("裁切：", e)
      this.addFrom.cover = e.dataURL;
      console.log("this.addFrom.cover:", this.addFrom.cover)
    },
    saveSon(row) {
      this.addDialog = true
      this.addFrom.parentId = row.id
      this.dialogTitle = "添加子分类"
      this.addFrom.parentName = row.name
    },
    getAllList() {
      this.$request.post({
        url: '/tenant/tenantProCategory/allList',
        success: (result) => {
          this.allList = result
        },
        catch: (e) => {

        },
        finally: (e) => {

        }
      });
    },
    openDialog(type) {
      if (type === 1) {
        this.dialogTitle = "添加分类";
        this.addDialog = true
        this.addFrom.parentName = "一级分类"
      }
    },
    changeCategory(e) {
      var parentNode = this.allList.find(item => item.id === e)
      this.addFrom.parentName = parentNode.name
      this.addFrom.parentId = parentNode.id
      this.$forceUpdate()
    },
    load(tree, treeNode, resolve) {
      // 发起请求获取子节点数据
      this.$request.post({
        url: 'tenant/tenantProCategory/sonList',
        params: {id: tree.id},
        success: (result) => {
          resolve(result);
        },
        catch: (error) => {
        },
        finally: () => {
        }
      });
    },
    remove(id) {
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.post({
          url: '/tenant/tenantProCategory/delete',
          params: {id: id},
          success: (result) => {
            this.$message.success(result)
            setTimeout(() => {
              location.reload()
            }, 500)
          },
        });
      })
    },
    openUpdate(row) {
      this.addDialog = true
      this.addFrom = JSON.parse(JSON.stringify(row))
      if (row.parentId !== -1) {
        var parentNode = this.allList.find(item => item.id === row.parentId)
        this.addFrom.parentName = parentNode.name
      } else {
        console.log("一级分类")
        this.addFrom.parentName = "一级分类"
      }
    },
    save() {
      this.$refs['addFrom'].validate((valid) => {
        if (!valid) {
          return;
        }
        this.btnStatus = true
        delete (this.addFrom.updateTime)
        delete (this.addFrom.createTime)
        this.$request.post({
          url: !this.addFrom.id ? '/tenant/tenantProCategory/add' : "/tenant/tenantProCategory/edit",
          params: this.addFrom,
          success: (result) => {
            setTimeout(() => {
              location.reload()
            }, 500)
          },
          finally: (e) => {
            this.btnStatus = false
          },
        });
      })
    },
    handleSelect(item) {
      console.log("item:", item)
      this.addFrom.courierCompany = item.courierCompany
    },
    // 关闭 弹窗后
    closeDialog() {
      this.addFrom = {
        password: "",
        account: "",
        type: 0,
        parentName: "",
        hasParent: false,
        categoryStatus: false,
        cover: ''
      }
      this.dialogTitle = "分类信息"
    },
    handleSizeChange(value) {
      this.params.pageSize = value;
      this.search();
    },
    search() {
      this.params.pageNo = 1;
      this.params.isCount = true;
      this.getList(1);
    },
    //获取列表
    getList(pageNo) {
      this.loading = true;
      this.params.pageNo = pageNo;
      this.$request.post({
        url: 'tenant/tenantProCategory/list',
        params: this.params,
        success: (result) => {
          this.list = result.list;
          if (this.params.isCount) {
            this.params.isCount = false;
            this.total = result.total;
          }
        },
        finally: () => {
          this.loading = false;
          setTimeout(() => {
            this.$store.commit('routes/SET_LOADING', false);
          }, 200)
        }
      });
    },
  },

  beforeDestroy() {
  }
};
</script>

<style>
</style>

<style lang="scss" scoped>
/deep/ .el-dialog__header {
  background-color: #F5F5F5;
  border-bottom: #EBEBEB solid 1px;
}

/* 添加这部分CSS样式来改变表格表头的颜色 */
/deep/ .el-table .el-table__header th {
  background-color: #D7D7D7 !important;
  color: #666666 !important;
}

.page {
  text-align: right;
  margin-top: 20px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 5px;
}

.primarys {
  color: rgb(0, 155, 216);
}
</style>