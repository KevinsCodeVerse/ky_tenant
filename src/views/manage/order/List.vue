<template>
  <div id="">
    <main-head>
      <el-form :inline="true" class="demo-form-inline" size="medium" :disabled="load">
        <el-form-item>
          <el-input
              placeholder="输入订单编号搜索"
              v-model="params.orderId"
              clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input
              placeholder="输入手机号搜索"
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
          <el-tabs @tab-click="handleClick">
            <el-tab-pane label="全部"></el-tab-pane>
            <el-tab-pane label="待支付"></el-tab-pane>
            <el-tab-pane label="待发货"></el-tab-pane>
            <el-tab-pane label="待收货"></el-tab-pane>
            <el-tab-pane label="已收货"></el-tab-pane>
            <el-tab-pane label="已完成"></el-tab-pane>
            <el-tab-pane label="已取消"></el-tab-pane>
          </el-tabs>
          <!--          <el-button size="medium" @click="addDialog=true" type="primary">打印合同</el-button>-->
        </div>
      </template>


      <!-- 表格 -->
      <el-table :data="list" v-loading="loading" stripe fixed="right" :height="tableHeight" ref="tableWrapper">
        <el-table-column label="订单编号" prop="orderId" align="center" width="200px"></el-table-column>
        <el-table-column label="用户信息" prop="userName" align="center" width="200px"></el-table-column>
        <el-table-column label="商品数量" prop="count" align="center" width="200px"></el-table-column>
        <el-table-column label="订单金额" prop="totalAmount" align="center" width="200px">
          <template slot-scope="scope">
            {{ scope.row.totalAmount }}元
          </template>
        </el-table-column>
        <el-table-column label="实际支付" align="center" width="200px">
          <template slot-scope="scope">
            {{ scope.row.payAmount }}元
          </template>
        </el-table-column>
        <!--        <el-table-column label="会员折扣" prop="totalAmount" align="center" width="200px">-->
        <!--          <template slot-scope="scope">-->
        <!--            {{ scope.row.totalAmount}}元-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column label="状态" align="center" min-width="180px">
          <template slot-scope="scope">
            <div v-html="getStatus(scope.row.status)"></div>
          </template>
        </el-table-column>
        <el-table-column label="发货状态" align="center" min-width="180px">
          <template slot-scope="scope">
            <div v-html="getDeliveryCategory(scope.row.deliveryCategory)"></div>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" align="center" width="200px">
          <template slot-scope="scope">
            {{ $moment(scope.row.createTime).format('Y-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px" fixed="right">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="openDetail(scope.row)">详情</el-button>
            <el-button size="small" type="text" @click="openPrice(scope.row)" v-if="scope.row.status===0">改价</el-button>
            <el-button size="small" type="text" @click="$router.push('/order/afterSale?id='+scope.row.orderId)"
                       v-if="(scope.row.status===1||scope.row.status===2) && scope.row.afterSellCategory != 2">
              转售后</el-button>
            <el-button size="small" type="text" @click="openDev(scope.row)" v-if="scope.row.devStatus===1&&scope.row.status===1">发货
            </el-button>
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

    <!--  发货弹框  -->
    <el-dialog :visible.sync="devFlag" width="1200px" left @close="closeDevDialog" :close-on-click-modal="false">
      <span slot="title">发货</span>
      <el-form :model="devFrom" :rules="rule" ref="devFrom" label-width="120px">
        <el-form-item label="物流公司" prop="logisticsCompany">
          <el-input placeholder="输入内容" v-model="devFrom.logisticsCompany" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="物流单号" prop="logisticsNumber">
          <el-input placeholder="输入内容" v-model="devFrom.logisticsNumber" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="部分发货" prop="deliveryCategory">
          <el-switch
              @change="updateDeliveryCategory"
              v-model="devFrom.deliveryCategory"
              active-color="#13ce66"
              inactive-color="#7f8c8d"
              :active-value="2"
              :inactive-value="1"
              active-text="全部发货"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="发货商品" v-show="devFrom.deliveryCategory===1">
          <el-table :data="orderPayList" style="width: 100%" @selection-change="changeDev">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column prop="proId" label="商品编号" align="center"></el-table-column>
            <el-table-column label="商品信息" align="center">
              <template slot-scope="scope">
                <div style="display: flex;flex-direction: column;align-items: center;">
                  <div>
                    <el-image fit="cover" style="width: 50px; height: 50px" :src="JSON.parse(scope.row.proInfo).avatar | fullPath"
                              :preview-src-list="[$fullPath(JSON.parse(scope.row.proInfo).avatar)]"></el-image>
                  </div>
                  <div>
                    <span>{{ JSON.parse(scope.row.proInfo).title }}</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="商品规格" align="center">
              <template slot-scope="scope">
                <div style="display: flex;flex-direction: column;align-items: center;">
                  <div>
                    <el-image fit="cover" style="width: 50px; height: 50px" :src="JSON.parse(scope.row.proInfo).specAvatar | fullPath"
                              :preview-src-list="[$fullPath(JSON.parse(scope.row.proInfo).specAvatar)]"></el-image>
                  </div>
                  <div>
                    <span>{{ getSpecName(JSON.parse(scope.row.proInfo).specName) }}</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="count" label="订货数量" align="center"></el-table-column>
            <el-table-column prop="hasDevCount" label="未发货数量" align="center"></el-table-column>
            <el-table-column label="发货数量" align="center" width="200">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.devCount" placeholder="请输入数量" @change="devCount"
                                 :max="scope.row.hasDevCount" :min="1"></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveDev()" v-loading="btnStatus">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 改价弹框 -->
    <!-- 弹框 -->
    <el-dialog :visible.sync="priceDialog" width="700px" left @close="closePriceDialog" :close-on-click-modal="false">
      <span slot="title">改价</span>
      <div style="display: flex;justify-content: space-around">
        <div style="display: flex;flex-direction: column;width: 200px;gap: 24px">
          <div>
            订单编号：<span>{{ priceFrom.orderId }}</span>
          </div>
          <div>
            商品数量：<span>{{ priceFrom.count }}</span>
          </div>
          <div>
            订单金额：<span>{{ priceFrom.totalAmount }}</span>元
          </div>
          <div style="display: flex;align-items: center">
            安装费：
            <el-input-number v-model="priceFrom.installAmount" placeholder="请输入" @change="devCount"
                             :min="0" size="mini" :precision="2"></el-input-number>
          </div>
        </div>
        <div style="display: flex;flex-direction: column;margin-left: 25px;gap: 20px">
          <div>
            用户信息：<span>{{ priceFrom.userName }}</span>
          </div>
          <div>
            下单时间：<span>{{ $moment(priceFrom.createTime).format('Y-MM-DD HH:mm:ss') }}</span>
          </div>
          <div style="display: flex;align-items: center">
            快递费用：
            <el-input-number v-model="priceFrom.freightAmount" placeholder="请输入" @change="devCount"
                             :min="0" size="mini" :precision="2"></el-input-number>
          </div>
          <div style="display: flex;align-items: center">
            实际支付：
            <el-input-number v-model="priceFrom.payAmount" placeholder="请输入" @change="devCount"
                             :min="0" size="mini" :precision="2"></el-input-number>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="savePrice()" v-loading="btnStatus">确 定</el-button>
      </span>
    </el-dialog>
    <!--  详情抽屉  -->
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
            <div>支付方式：{{ detailFrom.order.payType==='1'?"会员账户":"线下支付" }}</div>
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
                      {{JSON.parse(scope.row.proInfo).title}}
                    </template>
                  </el-table-column>
                  <el-table-column label="商品规格" width="180" align="center">
                    <template slot-scope="scope">
                      {{getSpecName(JSON.parse(scope.row.proInfo).specName)}}
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
                    <el-descriptions  :column="4" border>
                      <el-descriptions-item label="录入人员">{{item.tenantName}}</el-descriptions-item>
                      <el-descriptions-item label="录入时间">{{ $moment(item.createTime).format('Y-MM-DD HH:mm:ss') }}</el-descriptions-item>
                      <el-descriptions-item label="物流公司">{{ item.logisticsCompany }}</el-descriptions-item>
                      <el-descriptions-item label="快递单号">{{item.logisticsNumber}}</el-descriptions-item>
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
                    <el-descriptions  :column="3" border>
                      <el-descriptions-item label="收货人">{{detailFrom.order.consignee}}</el-descriptions-item>
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
                    {{detailFrom.order.remark}}
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
                          {{ scope.row.status==0?"待审核":scope.row.status==1?"审核通过":"驳回" }}
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
                <div v-for="(item, index) in detailFrom.afterList" :key="index">
                  <div style="display: flex;gap: 5px;align-items: center;margin: 30px 0 15px 0">
                    <div style="width: 5px;height: 12px;background-color: #409EFF">
                    </div>
                    <div>售后记录{{detailFrom.afterList.length> 1? index+1:''}}
                      ({{item.userOrderAfter.status == 1?'待审核售后':(item.userOrderAfter.status == 3?'通过售后':'拒绝售后')}})
                    </div>
                  </div>
                  <div>
                    <el-descriptions  :column="3" border>
                      <el-descriptions-item label="售后订单号">{{item.userOrderAfter.afterNo}}</el-descriptions-item>
                      <el-descriptions-item label="发起时间">{{ item.userOrderAfter.createTime }}</el-descriptions-item>
                      <el-descriptions-item label="来源">手工录入</el-descriptions-item>
                      <el-descriptions-item label="售后类型">{{item.userOrderAfter.afterSellType==1?'仅退款':'退货退款'}}</el-descriptions-item>
                      <el-descriptions-item label="申请原因" :span="2">{{ item.userOrderAfter.reason }}</el-descriptions-item>
                      <el-descriptions-item label="照片" v-if="item.userOrderAfter.image">
                        <el-image 
                          v-for="(item2, index) in getFullPath(item.userOrderAfter.image)"
                          :key="index"
                          style="width: 100px; height: 100px;margin-left: 10px"
                          :src="item2" 
                          :preview-src-list="getFullPath(item.userOrderAfter.image)">
                        </el-image>
                      </el-descriptions-item>
                    </el-descriptions>
                  </div>
                  <div style="display: flex;gap: 5px;align-items: center;margin: 30px 0 15px 0">
                    <div style="width: 5px;height: 12px;">
                    </div>
                    <div>申请商品</div>
                  </div>
                  <div>
                    <el-table :data="item.orderPayList" style="width: 100%" show-summary>
                      <el-table-column prop="proId" label="商品编号" align="center"></el-table-column>
                      <el-table-column label="商品信息" width="180" align="center">
                        <template slot-scope="scope">
                          {{JSON.parse(scope.row.proInfo).title}}
                        </template>
                      </el-table-column>
                      <el-table-column label="商品规格" width="180" align="center">
                        <template slot-scope="scope">
                          {{getSpecName(JSON.parse(scope.row.proInfo).specName)}}
                        </template>
                      </el-table-column>
                      <el-table-column prop="price" label="单价" width="100" align="center"></el-table-column>
                      <el-table-column prop="count" label="数量" width="100" align="center"></el-table-column>
                      <el-table-column prop="totalAmount" label="小计" align="center"></el-table-column>
                    </el-table>
                    <el-descriptions  :column="1">
                      <el-descriptions-item label="说明">{{item.userOrderAfter.remark}}</el-descriptions-item>
                    </el-descriptions>
                  </div>
                </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-drawer>

  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName:"",
      detailFrom: {},
      detailFlag: false,
      priceDialog: false,
      priceFrom: {},
      devList: [],
      orderPayList: [],
      devFlag: false,
      tableHeight: 0,
      addDialog: false,
      params: {
        pageNo: 1,
        pageSize: 10,
        isCount: true,
        type: 0,
        id: '',
      },
      list: [123],
      total: 0,
      loading: false,
      btnStatus: false,
      addFrom: {
        password: "",
        account: "",
        type: 0
      },
      devFrom: {
        deliveryCategory: 1
      },
      rule: {
        deliveryCategory: {
          message: '请选择发货类型',
          required: true,

        },
        logisticsNumber: {
          message: '请输入物流单号',
          required: true,
        },
        logisticsCompany: {
          message: '请输入物流公司名称',
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
    getFullPath(imgListStr){
      let imgList = JSON.parse(imgListStr);
      let list = [];
      imgList.forEach(item =>{
        list.push(this.$fullPath(item))
      })
      return list;
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
    savePrice() {
      this.$confirm('确认改价, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.btnStatus = true
        this.$request.post({
          url: '/tenant/order/reformPrice',
          params: {
            id: this.priceFrom.id,
            freightAmount: this.priceFrom.freightAmount,
            installAmount: this.priceFrom.installAmount,
            payAmount: this.priceFrom.payAmount,
          },
          success: (result) => {
            this.$message.success(result)
            this.priceDialog = false
            this.closePriceDialog()
            this.search()
          },
          catch: (e) => {

          },
          finally: (e) => {
            this.btnStatus = false
          }
        });
      })
    },
    openPrice(row) {
      this.priceDialog = true
      this.priceFrom = JSON.parse(JSON.stringify(row))
    },
    closePriceDialog() {
      this.priceFrom = {}
    },
    saveDev() {
      this.$confirm('确定发货？, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs['devFrom'].validate((valid) => {
          if (!valid) {
            return;
          }
          if (this.devList.length === 0) {
            this.$message.warning("请勾选需要发货的商品")
            return;
          }
          this.validateDevList((valid) => {
            if (valid) {
              console.log("this.devFrom:", this.devFrom)
              console.log("this.devList:", this.devList)
              this.btnStatus = true
              this.$request.post({
                url: '/tenant/order/orderDelivery',
                params: {
                  logisticsCompany: this.devFrom.logisticsCompany,
                  logisticsNumber: this.devFrom.logisticsNumber,
                  deliveryCategory: this.devFrom.deliveryCategory,
                  devInfo: JSON.stringify(this.devList)
                },
                success: (result) => {
                  this.$message.success(result)
                  this.devFlag = false
                  this.closeDevDialog()
                  this.search()
                },
                catch: (e) => {

                },
                finally: (e) => {
                  this.btnStatus = false
                }
              });
            }
          })

        })
      })

    },

    validateDevList(callback) {
      var validate = true;
      this.devList.forEach(item => {
        if (!item.devCount) {
          this.$message.warning("请填写发货数量");
          validate = false;
        }
        if (item.devCount < 1) {
          this.$message.warning("发货数量最小为1件");
          validate = false;
        }
      });
      // 调用回调函数
      callback(validate);
    },
    updateDeliveryCategory() {
      if (this.devFrom.deliveryCategory === 2) {
        this.devList = this.orderPayList.map(item => {
          item.devCount = item.hasDevCount
          return item;
        })
      } else {
        this.devList = []
      }
    }
    ,
    changeDev(e) {
      this.devList = e
    }
    ,
    devCount() {
    }
    ,
    getSpecName(specJson) {
      var spec = JSON.parse(specJson)
      var key = Object.keys(spec)
      var value = Object.values(spec)
      return "规格:" + key + "-" + value
    }
    ,
    closeDevDialog() {
      this.orderPayList = []
      this.devFrom = {deliveryCategory: 1}
    }
    ,
    openDev(row) {
      this.$request.post({
        url: '/tenant/order/queryOrderPayList',
        params: {orderId: row.orderId},
        success: (result) => {
          this.orderPayList = result.map(item => {
            item.proInfo = item.proInfo.replace("\\\\")
            return item;
          })
          console.log("this.orderPayList", this.orderPayList)
          this.devFlag = true
        },
        catch: (e) => {

        },
        finally: (e) => {
        }
      });
    }
    ,
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
    }
    ,
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
    }
    ,
    getDeliveryCategory(e) {
      switch (e) {

        case 1:
          return '<span style="color: #27ae60">部分发货</span>'
        case 2:
          return '<span style="color: #3498db">全部发货</span>'
        default:
          return '<span style="color: #7f8c8d">未发货</span>'
      }
    }
    ,
    handleClick(e) {

      if (e.index === "6") {
        this.params.status = -1
      // }else if(e.index==="5"){
      //   //还没有评价功能，已完成暂时传已收货状态
      //   this.params.status=3
      } else if (e.index !== "0") {
        this.params.status = Number(e.index) - 1
      } else {
        delete (this.params.status)
      }
      this.search()
    }
    ,
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
    }
    ,
    openUpdate(row) {
      this.addDialog = true
      this.addFrom = JSON.parse(JSON.stringify(row))
    }
    ,
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
    }
    ,
    handleSelect(item) {
      console.log("item:", item)
      this.addFrom.courierCompany = item.courierCompany
    }
    ,
// 关闭 弹窗后
    closeDialog() {
      this.addFrom = {
        password: "",
        account: "",
        type: 0
      }
    }
    ,
    handleSizeChange(value) {
      this.params.pageSize = value;
      this.search();
    }
    ,
    search() {
      this.params.pageNo = 1;
      this.params.isCount = true;
      this.getList(1);
    }
    ,
    //获取列表
    async getList(pageNo) {
      this.loading = true;
      this.params.pageNo = pageNo;
      this.$request.post({
        url: '/tenant/order/orderList',
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
    }
    ,
  },

  beforeDestroy() {
  }
}
;
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