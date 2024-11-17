<template>
  <div id="user_promoter_aduit_list">
    <!-- -----------------------------------筛选------------------------------------ -->
    <main-head>
      <el-form :inline="true" size="medium">
        <el-form-item>
            <el-select placeholder="类型" v-model="screenData.source" clearable @change="search">
                <el-option v-for="(item,index) in sourceList" :key="index" :value="item.value" :label="item.label"></el-option>
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
        <el-table-column align="center" prop="nick" label="类型">
            <template slot-scope="scope">
                <div v-for="(item,index) in sourceList" :key="index">
                    <span v-if="item.value == scope.row.source">{{item.label}}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column align="center" prop="nick" label="微信昵称"> </el-table-column>
        <el-table-column align="center" prop="amount" label="充值金额"> </el-table-column>
        <el-table-column label="操作人" prop="operatorName" align="center"></el-table-column>
        <el-table-column label="充值时间" align="center">
            <template slot-scope="scope">
                <span> {{ $moment(scope.row.createTime).format('Y-MM-DD HH:mm') }}</span>
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
        isRecharge: 1,
        status: 1,
        pageNo: 1,
        pageSize: 10,
        nick: '',
        source: '',
      },
      itemTotal: 0,
      sourceList:[
        {
          value: 1,
          label: '手动充值'
        },
        {
          value: 2,
          label: '会员礼包'
        }
      ]
    };
  },

  watch: {},
  methods: {
    //--------------获取列表----------------------
    getList(pageNo) {
      this.loading = true;
      this.screenData.pageNo = pageNo || this.screenData.pageNo;
      this.$request.post({
        url: '/tenant/userVipFlow/list',
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
