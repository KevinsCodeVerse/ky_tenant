<template>
  <div id="">
    <main-head :is-form-slot="false">

    </main-head>
    <main-content>
      <!-- 表格 -->
      <template v-slot:top>

                <el-button size="medium" @click="addDialog=true" type="primary" >添加海报图</el-button>

      </template>
      <el-table :data="list" v-loading="loading" stripe fixed="right" height="540">
        <el-table-column label="id" prop="id" align="center" width="200px"></el-table-column>
        <el-table-column label="排序(倒序查询）" prop="sort" align="center" width="200px"></el-table-column>
        <el-table-column label="海报图" prop="url" align="center" min-width="180px">
          <template slot-scope="scope">
            <el-image fit="cover" style="width: 100px; height: 100px" :src="scope.row.url | fullPath"
                      :preview-src-list="[$fullPath(scope.row.url)]"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" align="center" width="200px"></el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            {{ $moment(scope.row.createTime).format('Y-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="openUpdate(scope.row)">修改</el-button>
            <el-button size="small" type="text" @click="remove(scope.row.id)" style="color: #e74c3c">删除</el-button>
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
    <el-dialog :title="dialogTitle" :visible.sync="addDialog" width="520px" center @close="closeDialog" :close-on-click-modal="false">
      <el-form :model="addFrom" :rules="rule" ref="addFrom" label-width="120px">
        <el-form-item label="海报图">
          <el-image
              style="width: 150px; height: 150px"
              fit="cover"
              class="el-defult"
              :src="addFrom.url | fullPath"
              v-if="addFrom.url.search(';base64') == -1 && addFrom.url"
          ></el-image>
          <el-image style="width: 150px; height: 150px" fit="cover" class="el-defult" :src="addFrom.url"
                    v-if="addFrom.url.search(';base64') != -1"></el-image>
          <ImgCutter @onChooseImg="onChooseImg(2)" v-on:cutDown="cutDown" :sizeChange="false" :cutWidth="400" :cutHeight="320"
                    >
            <el-button size="small" type="primary" slot="open">选择图片</el-button>
          </ImgCutter>
        </el-form-item>
        <el-form-item label="排序(倒序查询）" prop="sort">
          <el-input-number placeholder="排序" v-model="addFrom.sort" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="备注" prop="name">
          <el-input placeholder="请输入备注" v-model="addFrom.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="save()" v-loading="btnStatus">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogTitle:"海报图信息",
      addDialog: false,
      params: {
        pageNo: 1,
        pageSize: 10,
        isCount: true,
        type: 1,
        id: '',
      },
      list: [],
      total: 0,
      loading: false,
      btnStatus: false,
      addFrom: {
        password: "",
        account: "",
        sort: 0,
        url:""
      },
      rule: {
        url: {
          message: '请上传图片',
          required: true,
        }
      },


    };
  },
  watch: {},
  created() {
  },
  mounted() {
    this.getList(1);
  },

  methods: {
    cutDown(e) {
      this.addFrom.url = e.dataURL;
    },
    remove(id) {
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.post({
          url: '/tenant/sysShareImg/delete',
          params: {id: id},
          success: (result) => {
            this.$message.success(result)
            this.search()
          },
        });
      })
    },
    openUpdate(row) {
      this.addDialog = true
      this.addFrom = JSON.parse(JSON.stringify(row))
    },
    save() {
      this.$refs['addFrom'].validate((valid) => {
        if (!valid) {
          return;
        }
        this.btnStatus = true
        if(!this.addFrom.url){
          this.$message.warning('图片不能为空');
          return;
        }
        delete(this.addFrom.createTime)
        delete(this.addFrom.updateTime)
        this.$request.post({
          url: !this.addFrom.id ? '/tenant/sysShareImg/add' : "/tenant/sysShareImg/update",
          params: this.addFrom,
          success: (result) => {
            this.$message.success(result)
            this.addDialog = false
            this.closeDialog();
            this.search()
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
        sort: 0,
        url:""
      }
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
        url: '/tenant/sysShareImg/list',
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
          setTimeout(()=>{
            this.$store.commit('routes/SET_LOADING', false);
          },200)
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