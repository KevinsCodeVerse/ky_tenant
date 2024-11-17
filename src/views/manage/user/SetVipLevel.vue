<template>
  <div id="">
    <main-head :is-form-slot="false">
    </main-head>
    <main-content>
      <!-- 筛选 -->
      <template v-slot:top>
        <div>
          <!--          <el-tabs @tab-click="handleClick">-->
          <!--            <el-tab-pane label="全部"></el-tab-pane>-->
          <!--            <el-tab-pane label="待收款"></el-tab-pane>-->
          <!--            <el-tab-pane label="部分收款"></el-tab-pane>-->
          <!--            <el-tab-pane label="已完成收款"></el-tab-pane>-->
          <!--          </el-tabs>-->
          <el-button size="medium" @click="addDialog=true" type="primary">添加等级</el-button>
        </div>
      </template>


      <!-- 表格 -->
      <el-table :data="list" v-loading="loading" stripe fixed="right" :height="tableHeight" ref="tableWrapper">
        <el-table-column label="id编号" prop="id" align="center" width="150px"></el-table-column>
        <el-table-column label="图标标识" align="center">
          <template slot-scope="scope">
            <el-image fit="cover" style="width: 50px; height: 50px" :src="scope.row.icon | fullPath"
                      :preview-src-list="[$fullPath(scope.row.icon)]"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="等级名称" prop="name" align="center" width="180px">
          <template slot-scope="scope">
            {{ scope.row.name === undefined ? "—" : scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="有效期" align="center" prop="day">
          <template slot-scope="scope">
            {{ scope.row.day }}天
          </template>
        </el-table-column>
        <el-table-column label="折扣比例" align="center" width="180px">
          <template slot-scope="scope">
            {{ (scope.row.discountRatio * 100) < 10 ? '0' + Math.floor(scope.row.discountRatio * 100) : Math.floor(scope.row.discountRatio * 100) }}折
            <!-- <span style="color: red">优惠{{ ((1-scope.row.discountRatio)*100).toFixed(0)}}%</span> -->
          </template>
        </el-table-column>

        <el-table-column label="创建时间" prop="name" align="center" width="180px">
          <template slot-scope="scope">
            <span>{{ $moment(scope.row.create_time).format('Y-MM-DD HH:mm') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px" fixed="right">
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
    <el-dialog :visible.sync="addDialog" width="520px" center @close="closeDialog" :close-on-click-modal="false">
      <span slot="title">会员等级</span>
      <el-form :model="addFrom" :rules="rule" ref="addFrom" label-width="120px">
        <el-form-item label="等级名称" prop="name">
          <el-input placeholder="请输入名称" v-model="addFrom.name"></el-input>
        </el-form-item>
        <el-form-item label="有效期" prop="day">
          <el-input-number v-model="addFrom.day"  :min="1" :max="1000" label="描述文字"></el-input-number><span style="margin-left: 10px">天
        </span>
        </el-form-item>
        <el-form-item label="折扣比例" prop="discountRatio">
          <el-input-number v-model="addFrom.discountRatio"  :min="1" :max="99" label="描述文字"></el-input-number>
          <span style="margin-left: 10px">折</span>
          <!-- <span style="color: red;margin-left: 10px">商品价格优惠{{ (100-addFrom.discountRatio)}}%</span> -->
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-image
              style="width: 150px; height: 150px"
              fit="cover"
              class="el-defult"
              :src="addFrom.icon | fullPath"
              v-if="addFrom.icon.search(';base64') == -1 && addFrom.icon"
          ></el-image>
          <el-image style="width: 150px; height: 150px" fit="cover" class="el-defult" :src="addFrom.icon"
                    v-if="addFrom.icon.search(';base64') != -1"></el-image>
          <ImgCutter @onChooseImg="onChooseImg(2)" v-on:cutDown="cutDown" :sizeChange="false" :cutWidth="300" :cutHeight="300">
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
export default {
  data() {
    return {
      tableHeight: 0,
      addDialog: false,
      params: {
        pageNo: 1,
        pageSize: 10,
        isCount: true,
        type: 1,
        id: '',
      },
      selectData: [],
      list: [],
      total: 0,
      loading: false,
      btnStatus: false,
      addFrom: {
        password: "",
        account: "",
        icon:"",
        day:1,
        name:"",
        discountRatio:99,
      },
      rule: {
        day: {
          message: '请输入有效期',
          required: true,
        },
        name: {
          message: '请输入名称',
          required: true,
        },
        discountRatio: {
          message: '请输入折扣比例',
          required: true,
        },
        icon: {
          message: '请上传图标',
          required: true,
        },
      },


    };
  },
  watch: {},
  created() {
  },
  mounted() {
    this.$nextTick(() => {
      this.getList(1);
      this.calculateTableHeight();
    })
  },

  methods: {
    cutDown(e) {
      this.addFrom.icon = e.dataURL;
    },
    getStatus(e) {
      switch (e) {
        case 1:
          return '<span style="color: #19BE6B">• 正常</span>'
        case -1:
          return '<span style="color: #e67e22">• 冻结</span>'
        case -2:
          return '<span style="color: #7f8c8d">• 注销</span>'
      }
    },
    handleClick(e) {
      if (e.index !== "0") {
        this.params.receiptStatus = Number(e.index) - 1
      } else {
        delete (this.params.receiptStatus)
      }
      this.search()
    },
    remove(id) {
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.post({
          url: '/tenant/tenantVipLevel/delete',
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
      this.addFrom.discountRatio=row.discountRatio*100
      console.log("row:",row)
      console.log("addFrom:",this.addFrom)
    },
    save() {
      this.$refs['addFrom'].validate((valid) => {
        if (!valid) {
          return;
        }
        this.btnStatus = true
        delete (this.addFrom.createTime)
        delete (this.addFrom.updateTime)
        this.$request.post({
          url: !this.addFrom.id ? '/tenant/tenantVipLevel/add' : "/tenant/tenantVipLevel/update",
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
        icon:"",
        day:1,
        name:"",
        discountRatio:99,
      }
    },
    handleSizeChange(value) {
      this.params.pageSize = value;
      this.search();
    },
    search() {
      this.params.pageNo = 1;
      this.params.isCount = true;
      if (this.selectData && this.selectData.length) {
        this.params.startTime = this.$moment(this.selectData[0]).format('Y-MM-DD HH:mm:ss');
        this.params.endTime = this.$moment(this.selectData[1]).add(1, 'days').format('Y-MM-DD HH:mm:ss');
      } else {
        this.params.startTime = '';
        this.params.endTime = '';
        this.selectData = [];
      }
      this.getList(1);
    },
    //不同浏览器高度适配
    calculateTableHeight() {
      const tableWrapper = this.$refs.tableWrapper.$el;
      if (tableWrapper) {
        //距底部距离，可视content内容调整
        const bottomOffset = 170;
        const wrapperRect = tableWrapper.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        this.tableHeight = windowHeight - wrapperRect.top - bottomOffset;
      }
    },
    //获取列表
    async getList(pageNo) {
      this.loading = true;
      this.params.pageNo = pageNo;
      this.$request.post({
        url: '/tenant/tenantVipLevel/list',
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
          //设置全局loading状态
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
/* dialog样式覆盖 */
/deep/ .el-dialog__header {
  background-color: #F5F5F5;
  border-bottom: #EBEBEB solid 1px;
}

/* 表格头样式覆盖 */
/deep/ .el-table .el-table__header th {
  background-color: #D7D7D7 !important;
  color: #666666 !important;
}

/* 标签样式覆盖 */
/deep/ .el-tabs__item {
  color: #898989 !important;
}
</style>