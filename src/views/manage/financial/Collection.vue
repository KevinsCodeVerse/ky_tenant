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
        <el-tabs @tab-click="handleClick">
          <el-tab-pane label="全部" name="10"></el-tab-pane>
          <el-tab-pane label="待收款" name="1"></el-tab-pane>
          <el-tab-pane label="部分收款" name="2"></el-tab-pane>
          <el-tab-pane label="已完成收款" name="3"></el-tab-pane>
        </el-tabs>
        <!--        <el-button size="medium" @click="addDialog=true" type="primary">打印合同</el-button>-->
      </template>

      <!-- 表格 -->
      <el-table :data="list" v-loading="loading" stripe fixed="right" :height="tableHeight" ref="tableWrapper">
        <el-table-column label="订单编号" prop="orderId" align="center" width="200px"></el-table-column>
        <el-table-column label="用户信息" prop="userName" align="center" width="200px"></el-table-column>
        <el-table-column label="商品数量" prop="count" align="center" width="150px"></el-table-column>
        <el-table-column label="订单金额" prop="totalAmount" align="center" width="200px"></el-table-column>
        <el-table-column label="实际支付" align="center" width="200px">
          <template slot-scope="scope">
            <span>{{ scope.row.payAmount }}元</span>
          </template>
        </el-table-column>

        <el-table-column label="已收款" prop="collection" align="center" width="200px"></el-table-column>
        <el-table-column label="未收款" prop="unCollection" align="center" width="200px"></el-table-column>
        <el-table-column label="下单时间" align="center" width="200px">
          <template slot-scope="scope">
            {{ $moment(scope.row.createTime).format('Y-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px" fixed="right">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="openDetail(scope.row)">详情</el-button>
            <el-button size="small" type="text" @click="openRecord(scope.row)">收款记录</el-button>
            <el-button size="small" type="text" @click="openUpdate(scope.row)">收款</el-button>
            <!--            <el-button size="small" type="text" @click="remove(scope.row.id)" style="color: #e74c3c">删除</el-button>-->
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
    <el-dialog :visible.sync="addDialog" width="600px" @close="closeDialog" :close-on-click-modal="false">
      <span slot="title">收款</span>
      <div style="padding: 0 30px">
        <div style="display: flex;justify-content: space-around">
          <div style="display: flex;justify-content: space-between;flex-direction: column;gap: 10px">
            <div>
              <span style="color: #8c8c8c">订单编号：</span>
              <span>{{ addFrom.orderId }}</span>
            </div>
            <div>
              <span style="color: #8c8c8c">商品数量：</span>
              <span>{{ addFrom.count }}</span>
            </div>
            <div>
              <span style="color: #8c8c8c">订单金额：</span>
              <span>{{ addFrom.totalAmount }}元</span>
            </div>
            <div>
              <span style="color: #8c8c8c">已收金额：</span>
              <span>{{ addFrom.collection }}元</span>
            </div>
          </div>
          <div style="display: flex;justify-content: space-between;flex-direction: column">
            <div>
              <span style="color: #8c8c8c">用户信息：</span>
              <span>{{ addFrom.userName }}</span>
            </div>
            <div>
              <span style="color: #8c8c8c">下单时间：</span>
              <span>{{ $moment(addFrom.createTime).format('Y-MM-DD HH:mm:ss') }}</span>
            </div>
            <div>
              <span style="color: #8c8c8c">实际应收：</span>
              <span>{{ addFrom.totalAmount }}元</span>
            </div>
            <div>
              <span style="color: #8c8c8c">未收金额：</span>
              <span>{{ addFrom.unCollection }}元</span>
            </div>
          </div>
        </div>
        <div style="margin-left: -25px; margin-top: 17px;">
          <el-form :model="addFrom" :rules="rule" ref="addFrom" label-width="120px">
            <el-form-item label="收款金额" prop="amount">
              <el-input placeholder="请输入金额" v-model="addFrom.amount" type="number"></el-input>
            </el-form-item>
            <el-form-item label="收款日期" prop="time">
              <el-date-picker
                  v-model="addFrom.time"
                  type="datetime"
                  style="width: 405px"
                  placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="备注">
              <el-input placeholder="收款备注" v-model="addFrom.remark"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="save()" v-loading="btnStatus">确 定</el-button>
      </span>
    </el-dialog>

    <!--  订单详情抽屉  -->
    <el-drawer
        size="50%"
        title="订单详情"
        :visible.sync="detailFlag"
        direction="rtl"
    >
      <div style="padding: 0 50px;font-size: 13px" v-if="detailFlag">
        <div style="display: flex;justify-content: space-between">
          <div style="display: flex;flex-direction: column;gap: 15px">
            <div>订单编号：{{ detailFrom.order.orderId }}</div>
            <div>订单金额：{{ detailFrom.order.totalAmount }}</div>
            <div>安装费用：{{ detailFrom.order.installAmount }}</div>
          </div>
          <div style="display: flex;flex-direction: column;gap: 15px">
            <div v-html="`订单状态：`+getStatus(detailFrom.order.status)"></div>
            <div>快递运费：{{ detailFrom.order.freightAmount }}</div>
            <div>实际支付：{{ detailFrom.order.payAmount }}</div>
          </div>
          <div style="display: flex;flex-direction: column;gap: 15px">
            <div>创建时间：{{ $moment(detailFrom.order.createTime).format('Y-MM-DD HH:mm:ss') }}</div>
            <div>支付方式：{{ detailFrom.order.payType === '1' ? "会员账户" : "线下支付" }}</div>
          </div>
        </div>
        <div style="margin-top: 20px">
          <el-tabs v-model="activeName" @tab-click="handleDetail">
            <el-tab-pane label="订单信息">
              <div>
                <div style="display: flex;gap: 5px;align-items: center;margin: 15px 0">
                  <div style="width: 5px;height: 12px;background-color: #409EFF">
                  </div>
                  <div>商品信息</div>
                </div>
                <el-table :data="detailFrom.userOrders" style="width: 100%">
                  <el-table-column prop="proId" label="商品编号" align="center"></el-table-column>
                  <el-table-column label="商品信息" width="180" align="center">
                    <template slot-scope="scope">
                      {{ JSON.parse(scope.row.proInfo).title }}
                    </template>
                  </el-table-column>
                  <el-table-column label="商品规格" width="180" align="center">
                    <template slot-scope="scope">
                      {{ getSpecName(JSON.parse(scope.row.proInfo).specName) }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="price" label="单价" width="100" align="center"></el-table-column>
                  <el-table-column prop="count" label="数量" width="100" align="center"></el-table-column>
                  <el-table-column prop="totalAmount" label="小计" align="center"></el-table-column>
                </el-table>
                <div v-if="detailFrom.devList.length!==0">
                  <div style="display: flex;gap: 5px;align-items: center;margin: 30px 0 15px 0">
                    <div style="width: 5px;height: 12px;background-color: #409EFF">
                    </div>
                    <div>发货信息</div>
                  </div>
                  <div v-for="(item,index) in detailFrom.devList">
                    <el-descriptions :column="4" border>
                      <el-descriptions-item label="录入人员">{{ item.tenantName }}</el-descriptions-item>
                      <el-descriptions-item label="录入时间">{{ $moment(item.createTime).format('Y-MM-DD HH:mm:ss') }}</el-descriptions-item>
                      <el-descriptions-item label="物流公司">{{ item.logisticsCompany }}</el-descriptions-item>
                      <el-descriptions-item label="快递单号">{{ item.logisticsNumber }}</el-descriptions-item>
                    </el-descriptions>
                  </div>
                </div>
                <div v-if="detailFrom.order.consignee">
                  <div style="display: flex;gap: 5px;align-items: center;margin: 30px 0 15px 0">
                    <div style="width: 5px;height: 12px;background-color: #409EFF">
                    </div>
                    <div>收货信息</div>
                  </div>
                  <div>
                    <el-descriptions :column="3" border>
                      <el-descriptions-item label="收货人">{{ detailFrom.order.consignee }}</el-descriptions-item>
                      <el-descriptions-item label="手机号">{{ detailFrom.order.phone }}</el-descriptions-item>
                      <el-descriptions-item label="收货地址">{{ detailFrom.order.address }}</el-descriptions-item>
                    </el-descriptions>
                  </div>
                </div>
                <div>
                  <div style="display: flex;gap: 5px;align-items: center;margin: 30px 0 15px 0">
                    <div style="width: 5px;height: 12px;background-color: #409EFF">
                    </div>
                    <div>买家备注</div>
                  </div>
                  <div>
                    {{ detailFrom.order.remark }}
                  </div>
                </div>
                <div v-if="detailFrom.bills.length!==0">
                  <div style="display: flex;gap: 5px;align-items: center;margin: 30px 0 15px 0">
                    <div style="width: 5px;height: 12px;background-color: #409EFF">
                    </div>
                    <div>线下收款进度</div>
                  </div>
                  <div>
                    <el-table :data="detailFrom.bills" style="width: 100%">
                      <el-table-column prop="amount" label="收款金额" align="center"></el-table-column>
                      <el-table-column prop="registerAd" label="登记人" align="center"></el-table-column>
                      <el-table-column label="登记时间" align="center" width="200px">
                        <template slot-scope="scope">
                          {{ $moment(scope.row.createTime).format('Y-MM-DD HH:mm:ss') }}
                        </template>
                      </el-table-column>
                      <el-table-column label="状态" align="center" width="200px">
                        <template slot-scope="scope">
                          {{ scope.row.status == 0 ? "待审核" : scope.row.status == 1 ? "审核通过" : "驳回" }}
                        </template>
                      </el-table-column>
                      <el-table-column prop="auditAd" label="审核人" align="center"></el-table-column>
                      <el-table-column label="审核时间" align="center" width="200px">
                        <template slot-scope="scope">
                          {{ $moment(scope.row.auditTime).format('Y-MM-DD HH:mm:ss') }}
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="售后记录">

            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-drawer>
    <el-dialog :visible.sync="recordFlag" width="75%" @close="closeDialog" :close-on-click-modal="false">
      <span slot="title">收款记录</span>
      <div style="padding: 0 30px;">
        <el-table :data="recordList" v-loading="loading" stripe fixed="right" :height="500" ref="tableWrapper">
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
              <div v-html="getRecordStatus(scope.row.status)"></div>
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
              <span>{{ scope.row.auditTime === undefined ? "未审核" : $moment(scope.row.auditTime).format('Y-MM-DD HH:mm') }}</span>
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
      </div>
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
      tableHeight: 0,
      batchDialog: false,
      batchBillsList: [],
      updateFrom: {},
      updateDialog: false,
      recordList: [],
      recordFlag: false,
      activeName: "",
      detailFrom: {},
      detailFlag: false,
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
        amount: {
          message: '请输入收款金额',
          required: true,

        },
        time: {
          message: '请选择日期',
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
    //不同浏览器高度适配
    calculateTableHeight() {
      const tableWrapper = this.$refs.tableWrapper.$el;
      if (tableWrapper) {
        //距底部距离，可视content内容调整
        const bottomOffset = 180;
        const wrapperRect = tableWrapper.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        this.tableHeight = windowHeight - wrapperRect.top - bottomOffset;
      }
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
              this.openRecord(this.updateFrom)
              // this.search()
            },
            catch: (e) => {

            },
            finally: (e) => {

            }
          });
        })
      })

    },
    openUpdateAmount(row) {
      this.updateDialog = true
      this.updateFrom = JSON.parse(JSON.stringify(row))
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
            this.recordFlag = false
            this.search()
          },
          catch: (e) => {

          },
          finally: (e) => {
          }
        });
      })

    },
    getRecordStatus(e) {
      switch (e) {
        case 0:
          return '<span style="color: #e67e22">• 待审核</span>'
        case 1:
          return '<span style="color: #19BE6B">• 审核通过</span>'
        case -1:
          return '<span style="color: #7f8c8d">• 驳回</span>'
      }
    },
    openRecord(row) {
      this.$request.post({
        url: '/tenant/tenantOrderBills/confirmList',
        params: {orderId: row.orderId, pageNo: 1, pageSize: 100},
        success: (result) => {
          this.recordList = result.list
          this.recordFlag = true
        },
        finally: () => {

        }
      });
    },
    getSpecName(specJson) {
      var spec = JSON.parse(specJson)
      var key = Object.keys(spec)
      var value = Object.values(spec)
      return "规格:" + key + "-" + value
    },
    getStatus(e) {
      switch (e) {
        case 0:
          return '<span style="color: #3498db">未支付</span>'
        case 1:
          return '<span style="color: #3498db">待发货</span>'
        case 2:
          return '<span style="color: #3498db">待收货</span>'
        case 3:
          return '<span style="color: #3498db">已收货</span>'
        case 4:
          return '<span style="color: #3498db">已完成</span>'
        case -1:
          return '<span style="color: #eb4d4b">已取消</span>'
      }
    },
    openDetail(row) {
      this.$request.post({
        url: '/tenant/order/orderDetail',
        params: {orderId: row.orderId},
        success: (result) => {
          this.detailFrom = result
          this.detailFlag = true
          // this.$message.success(result)
        },
        catch: (e) => {

        },
        finally: (e) => {

        }
      });
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
    save() {
      this.$refs['addFrom'].validate((valid) => {
        if (!valid) {
          return;
        }
        this.addFrom.time = new Date(this.addFrom.time).getTime()
        this.btnStatus = true
        this.$request.post({
          url: "tenant/tenantOrderBills/collection",
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
        url: '/tenant/tenantOrderBills/collectionProgressList',
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