<template>
  <div id="">
    <main-head>
      <el-form :inline="true" class="demo-form-inline" size="medium" :disabled="load">
        <el-form-item>
          <el-input
              placeholder="用户账号/ID/手机号码"
              v-model="params.keyWord"
              clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="params.grade" placeholder="分销等级" @change="search" clearable>
            <el-option v-for="(item,index) in gradeList" :value="item.value" :label="item.label" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="selectData" type="daterange" range-separator="-" start-placeholder="注册日期筛选开始" end-placeholder="注册日期筛选结束"
                          clearable
                          @change="search">
          </el-date-picker>
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
          <el-button size="medium" @click="vipDialog=true" type="primary">办理会员卡</el-button>
        </div>
      </template>


      <!-- 表格 -->
      <el-table :data="list" v-loading="loading" stripe fixed="right" :height="tableHeight" ref="tableWrapper">
        <el-table-column label="ID编号" prop="id" align="center" width="200px"></el-table-column>
        <el-table-column label="微信昵称" prop="nick" align="center" width="200px"></el-table-column>
        <el-table-column label="微信头像" width="110" align="center">
          <template slot-scope="scope">
            <el-image fit="cover" style="width: 100px; height: 50px" :src="scope.row.avatar | fullPath"
                      :preview-src-list="[$fullPath(scope.row.avatar)]"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="mobile" align="center" width="200px"></el-table-column>
        <el-table-column label="注册时间" align="center" width="180px">
          <template slot-scope="scope">
            {{ $moment(scope.row.createTime).format('Y-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="储蓄卡余额" prop="royal" align="center" min-width="180px">
          <template slot-scope="scope">
            {{ scope.row.tenantVipSavingsCard }}元
          </template>
        </el-table-column>
        <el-table-column label="佣金余额" prop="royal" align="center" min-width="180px">
          <template slot-scope="scope">
            {{ scope.row.amount }}元
          </template>
        </el-table-column>
        <el-table-column label="分销等级" prop="royal" align="center" min-width="180px">
          <template slot-scope="scope">
            <div v-html="getVipLevel(scope.row.grade)"></div>
          </template>
        </el-table-column>
        <el-table-column label="用户状态" align="center" min-width="180px">
          <template slot-scope="scope">
            <div v-html="getStatus(scope.row.status)"></div>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="200px" fixed="right">
          <template slot-scope="scope">
            <!--            <el-button size="small" type="text" @click="openUpdate(scope.row)">详情</el-button>-->
            <el-button size="small" type="text" @click="openUpdate(scope.row.id)">充值</el-button>
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
      <span slot="title">充值储蓄卡余额</span>
      <el-form :model="addFrom" :rules="rule" ref="addFrom" label-width="120px">
        <el-form-item label="金额" prop="money">
          <el-input-number placeholder="充值金额" v-model="addFrom.money" :min="0.01" style="width: 250px" :precision="2"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button type="success" @click="save()" v-loading="btnStatus">充值</el-button>
      </span>
    </el-dialog>

    <!-- 开通会员礼包弹框 -->
    <el-dialog :visible.sync="vipDialog" width="620px" center @close="closeVipDialog" :close-on-click-modal="false">
      <span slot="title">开通会员礼包</span>
      <el-form :model="vipFrom" :rules="rule" ref="vipFrom" label-width="120px">
        <el-form-item label="手机号或昵称" prop="usId">
          <el-autocomplete
              style="width: 380px"
              v-model="vipFrom.search"
              value-key="nameAndPhone"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入用户手机号或微信昵称进行搜索"
              @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="用户信息" v-if="vipFrom.usId">
          <div style="display: flex;gap: 20px;align-items: center">
            <div style="display: flex;font-size: 12px">
              <el-image fit="cover" style="width: 50px; height: 50px" :src="vipFrom.usAvatar | fullPath"
                        :preview-src-list="[$fullPath(vipFrom.usAvatar)]"></el-image>
              <div style="display: flex;flex-direction: column;margin-left: 6px">
                <div>{{ vipFrom.name }}</div>
                <div style="margin-top: -20px" v-html="getVipLevel(vipFrom.vipLevel)"></div>
              </div>
            </div>
            <div style="color: #00a2e9" v-if="vipFrom.parentName">
              上级->
            </div>
            <div style="display: flex;font-size: 12px" v-if="vipFrom.parentName">
              <el-image fit="cover" style="width: 50px; height: 50px" :src="vipFrom.parentAvatar | fullPath"
                        :preview-src-list="[$fullPath(vipFrom.parentAvatar)]"></el-image>
              <div style="display: flex;flex-direction: column;margin-left: 6px">
                <div>{{ vipFrom.parentName }}</div>
                <div style="margin-top: -20px" v-html="getVipLevel(vipFrom.parentLevel)"></div>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="选择礼包" prop="proId">
          <el-select v-model="vipFrom.proId" placeholder="请选择" @change="changeSku" style="width: 380px">
            <el-option
                v-for="item in proList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择规格" prop="skuId">
          <el-select v-model="vipFrom.skuId" placeholder="请选择" style="width: 380px">
            <el-option
                v-for="item in changeSkuList"
                :key="item.id"
                :label="item.specName"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开通日期" prop="openTime">
          <el-date-picker
              v-model="vipFrom.openTime"
              type="datetime"
              placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button type="success" @click="openedVip()" v-loading="btnStatus">开通礼包</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      proList: [],
      skuList: [],
      changeSkuList: [],
      tableHeight: 0,
      addDialog: false,
      vipDialog: false,
      params: {
        pageNo: 1,
        pageSize: 10,
        isCount: true,
        type: 1,
        id: '',
        keyWord:'',
      },
      selectData: [],
      list: [1],
      total: 0,
      loading: false,
      btnStatus: false,
      vipFrom: {
        usId: "",
        skuId:"",
        search: "",
        usAvatar: ""
      },
      addFrom: {
        money: 1,
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
        proId: {
          message: '请选择礼包',
          required: true,
        },
        skuId: {
          message: '请选择礼包规格',
          required: true,
        },
        usId: {
          message: '请搜索用户',
          required: true,
        },
        openTime: {
          message: '请选择开通时间',
          required: true,
        },
      },
      gradeList:[
        {
          value: 0,
          label: '普通会员'
        },
        {
          value: 1,
          label:'黄金会员'
        },
        {
          value: 2,
          label:'合伙人'
        },
        {
          value: 3,
          label:'至尊合伙人'
        },

      ],


    };
  },
  watch: {},
  created() {
  },
  mounted() {
    this.$nextTick(() => {
      this.getList(1);
      this.calculateTableHeight();
      this.getProList()
    })
  },

  methods: {
    openedVip() {
      this.$refs['vipFrom'].validate((valid) => {
        if (!valid) {
          return;
        }
        this.vipFrom.openTime = new Date(this.vipFrom.openTime).getTime()
        this.$request.post({
          url: '/tenant/userManage/openedVip',
          params: this.vipFrom,
          success: (result) => {
            this.$message.success(result)
            this.vipDialog=false
            this.closeVipDialog()
            this.search()
          },
          catch: (e) => {

          },
          finally: (e) => {

          }
        });
      })

    },
    changeSku() {
      this.changeSkuList=[]
      this.$forceUpdate()
      this.changeSkuList = this.skuList.filter(item => item.proId === this.vipFrom.proId)
      this.changeSkuList = this.changeSkuList.map(item => {
        // 解析 JSON 字符串为对象
        let sku = JSON.parse(item.spec);
        // 获取对象的键和值
        let key = Object.keys(sku)[0]; // 获取第一个键，假设只有一个键值对
        let value = sku[key]; // 获取对应的值
        item.specName = '规格:(' + `${key}-${value}` + ') 价格:' + item.curPrice;
        return item;
      })
      this.vipFrom.skuId = '';

      console.log("skuList", this.skuList)
      console.log("proId", this.vipFrom.proId)
      console.log("执行1", this.changeSkuList)
    },
    getProList() {
      this.$request.post({
        url: '/tenant/userManage/queryAllVipProAndSku',
        success: (result) => {
          this.skuList = result.skuList
          this.proList = result.proList
        },
        catch: (e) => {

        },
        finally: (e) => {

        }
      });
    },
    closeVipDialog() {
      this.vipFrom = {
        usId: "",
        search: "",
        usAvatar: "",
        proId: "",
        skuId: "",
        openTime: null
      }
      this.changeSkuList = []

    },
    querySearchAsync(queryString, cb) {
      if (!queryString) {
        cb()
      }
      this.$request.post({
        url: '/tenant/userManage/queryUserInfoByPhone',
        params: {
          search: queryString
        },
        success: (result) => {
          // if(result.length===0){
          //   this.$message.warning("无搜索到的用户，请重新输入")
          // }
          cb(result)
        },
        catch: (e) => {

        },
        finally: (e) => {

        }
      });
    },
    //不同浏览器高度适配
    calculateTableHeight() {
      const tableWrapper = this.$refs.tableWrapper.$el;
      if (tableWrapper) {
        //距底部距离，可视content内容调整
        const bottomOffset = 160;
        const wrapperRect = tableWrapper.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        this.tableHeight = windowHeight - wrapperRect.top - bottomOffset;
      }
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
    getVipLevel(e) {
      switch (e) {
        case 0:
          return '<span style="color: #19BE6B">普通会员</span>'
        case 1:
          return '<span style="color: #e67e22">黄金会员</span>'
        case 2:
          return '<span style="color: #7f8c8d">合伙人</span>'
        case 3:
          return '<span style="color: #8c45b6">至尊合伙人</span>'
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
      // this.addFrom = JSON.parse(JSON.stringify(row))
      this.addFrom.money = 1
      this.addFrom.usId = row
      console.log("this.addFrom", row)
    },
    save() {
      this.$refs['addFrom'].validate((valid) => {
        if (!valid) {
          return;
        }
        this.btnStatus = true
        this.$request.post({
          url: "/tenant/userManage/recharge",
          params: this.addFrom,
          success: (result) => {
            this.$message.success("充值成功")
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
      this.vipFrom.usAvatar = '';
      this.vipFrom.name = '';
      this.vipFrom.usId = '';
      this.vipFrom.vipLevel = '';
      this.vipFrom.parentAvatar = '';
      this.vipFrom.parentLevel = '';
      this.vipFrom.parentName = '';

      this.vipFrom.usAvatar = item.avatar
      this.vipFrom.name = item.name === "真实姓名" ? item.nick : item.name
      this.vipFrom.usId = item.id
      this.vipFrom.vipLevel = item.grade
      if (item.parentAvatar) {
        this.vipFrom.parentAvatar = item.parentAvatar
        this.vipFrom.parentLevel = item.parentGrade
        this.vipFrom.parentName = item.parentName
      }
    },
    // 关闭 弹窗后
    closeDialog() {
      this.addFrom = {
        money: 0
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
    //获取列表
    async getList(pageNo) {
      this.loading = true;
      this.params.pageNo = pageNo;
      this.$request.post({
        url: '/tenant/userManage/userList',
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