<template>
  <div id="">
    <main-head>
      <el-form :inline="true" class="demo-form-inline" size="medium" :disabled="load">
        <el-form-item>
          <el-input
              placeholder="订单编号"
              v-model="params.orderId"
              clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input
              placeholder="手机号"
              v-model="params.phone"
              clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="search" type="primary" icon="el-icon-search">搜索</el-button>
        </el-form-item>
      </el-form>
    </main-head>
    <main-content>
      <!-- 筛选 -->
      <template v-slot:top>
        <div>
          <el-button size="medium" @click="batchSuccess" type="primary">批量通过</el-button>
        </div>
      </template>


      <!-- 表格 -->

      <el-table :data="list" v-loading="loading" stripe fixed="right" :height="tableHeight" ref="tableWrapper"
                @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column label="订单编号" prop="orderId" align="center" width="200px"></el-table-column>
        <el-table-column label="用户信息" prop="userName" align="center" width="180px"></el-table-column>
        <el-table-column label="商品数量" prop="count" align="center" width="100px"></el-table-column>
        <el-table-column label="订单金额" prop="totalAmount" align="center" width="180px">
          <template slot-scope="scope">
            {{ scope.row.orderAmount }}元
          </template>
        </el-table-column>
        <el-table-column label="实际支付" prop="totalAmount" align="center" width="180px">
          <template slot-scope="scope">
            {{ scope.row.orderAmount }}元
          </template>
        </el-table-column>
        <el-table-column label="收款金额" prop="amount" align="center" width="150px">
          <template slot-scope="scope">
            {{ scope.row.amount }}元
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" min-width="150px">
          <template slot-scope="scope">
            <div v-html="getStatus(scope.row.status)"></div>
          </template>
        </el-table-column>
        <el-table-column label="登记人" prop="registerAd" align="center" width="150px"></el-table-column>
        <el-table-column label="登记时间" align="center" width="180px">
          <template slot-scope="scope">
            <span>{{ $moment(scope.row.createTime).format('Y-MM-DD HH:mm') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核人" prop="auditAd" align="center" width="180px"></el-table-column>
        <el-table-column label="审核时间" align="center" width="220px">
          <template slot-scope="scope">
            <span>{{ $moment(scope.row.auditTime).format('Y-MM-DD HH:mm') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" align="center" width="180px" fixed="right"></el-table-column>
        <el-table-column label="操作" align="center" width="200px" fixed="right">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="auditBy(scope.row.id,1)" v-if="scope.row.status===0">通过</el-button>
            <el-button size="small" type="text" @click="auditBy(scope.row.id,-1)" style="color: #e74c3c" v-if="scope.row.status===0">驳回
            </el-button>
            <el-button size="small" type="text" @click="openUpdateAmount(scope.row)">修改</el-button>
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
      <span slot="title">收款</span>
      <el-form :model="addFrom" :rules="rule" ref="addFrom" label-width="120px">
        <el-form-item label="账号" prop="account">
          <el-input placeholder="请输入账号" v-model="addFrom.account"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入内容" v-model="addFrom.password"></el-input>
        </el-form-item>
        <el-form-item label="租户名称" prop="name">
          <el-input placeholder="请输入名称" v-model="addFrom.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="save()" v-loading="btnStatus">确 定</el-button>
      </span>
    </el-dialog>
    <!--  修改收款金额  -->
    <el-dialog :visible.sync="updateDialog" width="400px" @close="closeDialog" :close-on-click-modal="false">
      <span slot="title">修改收款信息</span>
      <el-form :model="updateFrom" :rules="rule" ref="updateFrom" label-width="120px">
        <el-form-item label="收款金额" prop="amount">
          <el-input-number placeholder="请输入金额" v-model="updateFrom.amount" :precision="2"></el-input-number>
        </el-form-item>
        <el-form-item label="收款日期" prop="receiptTime">
          <el-date-picker
              v-model="updateFrom.receiptTime"
              type="datetime"

              placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注">
          <el-input placeholder="收款备注" v-model="updateFrom.remark" style="width: 220px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateSave()" v-loading="btnStatus">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      batchDialog: false,
      batchBillsList: [],
      updateFrom: {},
      updateDialog: false,
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
        type: 0
      },
      rule: {
        amount: {
          message: '请输入收款金额',
          required: true,

        },
        receiptTime: {
          message: '请选择收款日期',
          required: true,
        },
        remark: {
          message: '请输入收款备注',
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
    batchSuccess() {
      if (this.batchBillsList.length === 0) {
        this.$message.warning("请至少选择一条数据")
        return;
      }
      this.$confirm(`确定批量通过${this.batchBillsList.length}条数据吗, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      this.$request.post({
              url: '/tenant/tenantOrderBills/batchSuccess',
              params: {ids:JSON.stringify(this.batchBillsList)},
              success: (result) => {
                this.$message.success(result)
                this.search()
              },
              catch:(e)=>{

              },
              finally:(e)=>{

              }
            });
      })
    },
    handleSelectionChange(e) {
      this.batchBillsList = e.filter(item=>item.status===0)
    },
    updateSave() {
      this.$refs['updateFrom'].validate((valid) => {
        if (!valid) {
          return;
        }
        this.$confirm('确认修改收款信息吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.updateFrom.receiptTime = new Date(this.updateFrom.receiptTime).getTime()
          this.$request.post({
            url: '/tenant/tenantOrderBills/updateBills',
            params: this.updateFrom,
            success: (result) => {
              this.$message.success(result)
              this.updateDialog = false
              this.search()
            },
            catch: (e) => {

            },
            finally: (e) => {

            }
          });
        })
      })

    },
    auditBy(id, type) {
      this.$confirm(`确定${type === 1 ? '通过' : '驳回'}数据吗, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.post({
          url: '/tenant/tenantOrderBills/auditCollection',
          params: {id: id, type: type},
          success: (result) => {
            this.$message.success(result)
            this.search()
          },
          catch: (e) => {

          },
          finally: (e) => {
          }
        });
      })

    },
    getStatus(e) {
      switch (e) {
        case 0:
          return '<span style="color: #e67e22">• 待审核</span>'
        case 1:
          return '<span style="color: #19BE6B">• 审核通过</span>'
        case -1:
          return '<span style="color: #7f8c8d">• 驳回</span>'
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
          url: '/admin/tat/delete',
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
    openUpdateAmount(row) {
      this.updateDialog = true
      this.updateFrom = JSON.parse(JSON.stringify(row))
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
          url: !this.addFrom.id ? '/admin/tat/add' : "/ad/sys/commSpeech/update",
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
        type: 0
      }
      this.updateFrom = {}
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
    //获取列表
    async getList(pageNo) {
      this.loading = true;
      this.params.pageNo = pageNo;
      this.$request.post({
        url: '/tenant/tenantOrderBills/confirmList',
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
          }, 200);
        }
      });
    },
    //不同浏览器高度适配
    calculateTableHeight() {
      const tableWrapper = this.$refs.tableWrapper.$el;
      if (tableWrapper) {
        const bottomOffset = 160; // 距离底部的距离
        const wrapperRect = tableWrapper.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        this.tableHeight = windowHeight - wrapperRect.top - bottomOffset;
      }
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