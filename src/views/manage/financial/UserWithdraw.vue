<template>
  <div id="user_promoter_aduit_list">
    <!-- -----------------------------------筛选------------------------------------ -->
    <main-head>
      <el-form :inline="true" size="medium">
        <el-form-item>
            <el-select placeholder="状态" v-model="screenData.status" clearable @change="search">
                <el-option v-for="(item,index) in statusList" :key="index" :value="item.value" :label="item.label"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="用户微信昵称" @keyup.enter.native="search" clearable v-model="screenData.nick"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="selectData" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                          clearable @change="search">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </main-head>
    <main-content>
      <!-- -----------------------------------列表------------------------------------ -->
      <el-table :data="list" stripe v-loading="loading" style="width: 100%" height="570">
        <el-table-column align="center" width="150" prop="id" label="ID"></el-table-column>
        <el-table-column align="center" prop="nick" label="微信昵称"> </el-table-column>
        <el-table-column align="center" prop="money" label="提现金额"> </el-table-column>
        <el-table-column align="center" prop="cardName" label="银行卡名称"> </el-table-column>
        <el-table-column align="center" prop="name" label="持卡姓名"> </el-table-column>
        <el-table-column align="center" prop="cardNum" label="银行卡号" width="200"> </el-table-column>
        <el-table-column label="失败原因" prop="refusedReason" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="审核时间" align="center">
            <template slot-scope="scope">
                <span v-if="scope.row.status == 0" class="warning">正在审核中</span>
                <span v-else> {{ $moment(scope.row.auditTime).format('Y-MM-DD HH:mm') }}</span>
            </template>
        </el-table-column>
        <el-table-column label="审核状态" align="center">
            <template slot-scope="scope">
                <span v-if="scope.row.status == 0" class="warning">正在审核中</span>
                <span v-if="scope.row.status == 1" class="success">已通过</span>
                <span v-if="scope.row.status == 2" class="warning">微信打款中</span>
                <span v-if="scope.row.status == -1" class="error">已拒绝</span>
            </template>
        </el-table-column>
        <el-table-column label="申请时间" align="center">
            <template slot-scope="scope">
                <span> {{ $moment(scope.row.createTime).format('Y-MM-DD HH:mm') }}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="200px">
            <template slot-scope="scope">
                <el-button class="mybtn" type="warning" size="mini" v-if="scope.row.status == 0" @click="updateStatus(scope.row.id, 1)">通过</el-button>
                <el-button class="mybtn" type="danger" size="mini" v-if="scope.row.status == 0" @click="updateStatus(scope.row.id, -1)">不通过</el-button>
            </template>
        </el-table-column>
      </el-table>

    </main-content>

    <main-footer>
      <el-pagination
          class="align-right"
          background
          @current-change="pageChange"
          :current-page.sync="screenData.pageNo"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="itemTotal"
      >
      </el-pagination>
    </main-footer>
    <!-- 分页功能 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectData: '',
      list: [], //数据
      loading: false,
      screenData: {
        status: 0,
        pageNo: 1,
        pageSize: 10,
        nick: '',
      },
      itemTotal: 0,
      statusList:[
        {
          value: 0,
          label: '审核中'
        },
        {
          value: 1,
          label: '提现成功'
        },
        {
          value: -1,
          label: '提现失败'
        }
      ]
    };
  },

  watch: {},
  methods: {
        //审核状态
        updateStatus(id, status) {
            if (status == -1) {
                this.$prompt('请输入失败原因', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                })
                .then(({ value }) => {
                    if (!value) {
                        this.$message.error('失败原因不能为空');
                        return;
                    }
                    this.updateStatus2(id, status, value);
                })
                .catch(() => {
                    this.$message.warning('取消操作');
                });
            } else {
                //成功
                this.$confirm('此操作将通过审核, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                })
                .then(() => {
                    this.updateStatus2(id, status);
                })
                .catch(() => {
                    this.$message.warning('取消操作');
                });
            }
        },
        updateStatus2(id, status, refusedReason){
            if(this.loading) return;
            this.loading = true;
            this.$request.post({
                url: 'tenant/userWithdraw/audit',
                params: {
                    id,
                    status,
                    refusedReason
                },
                success: (res) => {
                    this.$message.success('操作成功');
                    this.getList(this.screenData.pageNo);
                },
                finally: () => {
                    this.loading = false;
                }
            });
        },
    //--------------获取列表----------------------
    getList(pageNo) {
      this.loading = true;
      this.screenData.pageNo = pageNo || this.screenData.pageNo;
      this.$request.post({
        url: '/tenant/userWithdraw/list',
        params: this.screenData,
        success: (res) => {
          this.list = res.list;
          this.itemTotal = res.total;
        },
        finally: () => {
          this.loading = false;
          setTimeout(() => {
            this.$store.commit('routes/SET_LOADING', false);
          }, 200)
        }
      });
    },
    // 重置
    reset() {
      this.screenData = {
        //筛选参数
        status: '',
        pageNo: 1,
        pageSize: 10,
        nick: '',
      };
      this.getList();
    },
    // 搜索
    search() {
      this.screenData.pageNo = 1;
      this.screenData.isCount = true;
      if (this.selectData && this.selectData.length) {
        this.screenData.startTime = this.$moment(this.selectData[0]).format('Y-MM-DD HH:mm:ss');
        this.screenData.endTime = this.$moment(this.selectData[1]).add(1, 'days').format('Y-MM-DD HH:mm:ss');
      } else {
        this.screenData.startTime = '';
        this.screenData.endTime = '';
        this.selectData = [];
      }
      this.getList(1);
    },
    //页面改变
    pageChange(current) {
      if (current) {
        this.screenData.pageNo = current;
        this.getList(this.screenData.pageNo);
      }
    }
  },
  created() {
    this.getList(1);
  }
};
</script>

<style scoped>
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

.mybtn {
  margin: 3px 10px;
}


</style>
