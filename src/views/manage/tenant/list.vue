<template>
  <div id="">
    <main-head>
            <span slot="after">
                <el-button plain size="medium" @click="addDialog=true" type="primary" icon="el-icon-plus">添加账号</el-button>
            </span>
    </main-head>
    <main-content>
      <!-- 筛选 -->
      <el-form :inline="true" class="demo-form-inline" size="medium" :disabled="load">
        <el-form-item>
          <el-select v-model="params.status" placeholder="状态" @change="search">
            <el-option value="" label="全部"></el-option>
            <el-option value="1" label="正常"></el-option>
            <el-option value="-1" label="已冻结"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
              placeholder="请输入账号搜索"
              v-model="params.account"
              clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="search" type="primary" icon="el-icon-search">搜索</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格 -->
      <el-table :data="list" v-loading="loading" stripe fixed="right">
        <el-table-column label="账号" prop="account" align="center" width="200px"></el-table-column>
        <el-table-column label="名称" prop="name" align="center" min-width="180px">
          <template slot-scope="scope">
            {{ scope.row.name === undefined ? "—" : scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="头像" prop="avatar" align="center" min-width="180px">
          <template slot-scope="scope">
            <img :src="$common.getUrl()+scope.row.avatar" alt="">
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            {{ $moment(scope.row.createTime).format('Y-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
<!--            <el-button size="small" type="primary" @click="openUpdate(scope.row)">修 改</el-button>-->
            <el-button size="small" type="danger" @click="remove(scope.row.id)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
          class="page margin_top20 align-center"
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
    </main-content>
    <!-- 弹框 -->
    <el-dialog title="租户信息" :visible.sync="addDialog" width="520px" center @close="closeDialog" :close-on-click-modal="false">
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
  </div>
</template>
<script>
export default {
  data() {
    return {
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
        type: 0
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
  },

  methods: {
    remove(id) {
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.postJson({
          url: '/admin/tat/removeTat',
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
        this.$request.postJson({
          url: !this.addFrom.id ? '/admin/tat/addTat' : "/ad/sys/commSpeech/edit",
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
    // 重置
    reset() {
      (this.params = {
        pageNo: 1,
        pageSize: 10,
        isCount: true,
        type: 0,
        id: '',
        name: '',
        content: ''
      }),
          this.getList(1);
    },
    // 关闭 弹窗后
    closeDialog() {
      this.addFrom = {
        password: "",
        account: "",
        type: 0
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
        url: '/admin/tat/tatList',
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