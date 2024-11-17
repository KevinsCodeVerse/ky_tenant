<template>
  <div id="">
    <main-head :isFormSlot="false">
      转售后
    </main-head>
    <main-content>
      <div style="padding: 20px">
        <div>
          <div style="display: flex;gap: 5px;align-items: center;margin: 15px 0">
            <div style="width: 5px;height: 12px;background-color: #409EFF">
            </div>
            <div>订单信息</div>
          </div>
          <el-descriptions :column="3" border>
            <el-descriptions-item label="订单编号">{{ order.orderId }}</el-descriptions-item>
            <el-descriptions-item label="订单状态"><span v-html="getStatus(order.status)"></span></el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ $moment(order.createTime).format('Y-MM-DD HH:mm:ss') }}</el-descriptions-item>
            <el-descriptions-item label="订单金额">{{ order.totalAmount }}</el-descriptions-item>
            <el-descriptions-item label="实际应付">{{ order.payAmount }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div style="margin-top: 20px">
          <div style="display: flex;gap: 5px;align-items: center;margin: 15px 0">
            <div style="width: 5px;height: 12px;background-color: #409EFF">
            </div>
            <div>售后信息</div>
          </div>
          <el-form :model="addFrom" :rules="rule" ref="addFrom" label-width="120px">
            <el-form-item label="售后类型" prop="afterSellType">
              <el-radio v-model="addFrom.afterSellType" label="1">仅退款</el-radio>
              <el-radio v-model="addFrom.afterSellType" label="2">退货退款</el-radio>
            </el-form-item>
            <el-form-item label="售后原因" prop="reason">
              <el-input placeholder="输入内容" v-model="addFrom.reason" style="width: 300px"></el-input>
            </el-form-item>
            <el-form-item label="售后说明" prop="remark">
              <el-input placeholder="输入内容" v-model="addFrom.remark" style="width: 300px"></el-input>
            </el-form-item>
            <el-form-item label="照片" prop="image">
              <!-- <el-image
                  style="width: 150px; height: 150px"
                  fit="cover"
                  class="el-defult"
                  :src="addFrom.image | fullPath"
                  v-if="addFrom.image.search(';base64') == -1 && addFrom.image"
              ></el-image>
              <el-image style="width: 150px; height: 150px" fit="cover" class="el-defult" :src="addFrom.image"
                        v-if="addFrom.image.search(';base64') != -1"></el-image>
              <ImgCutter @onChooseImg="onChooseImg(2)" v-on:cutDown="cutDown" :sizeChange="false" :cutWidth="800" :cutHeight="800">
                <el-button size="small" type="primary" slot="open">选择图片</el-button>
              </ImgCutter> -->
              <upload ref="banner" :limit_size="5" />
            </el-form-item>
            <el-form-item label="选择商品" prop="orderPayIds" v-if="orderPys.length!==0">
              <el-table :data="orderPys" style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    width="55"
                    :disabled="true"
                >
                </el-table-column>
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
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main-content>
    <main-footer>
      <el-button size="small" type="primary" @click="save" v-loading="btnStatus">提交</el-button>
    </main-footer>

  </div>
</template>
<script>
import upload from "@/components/upload/Upload";

export default {
  components: {
    upload: upload,
  },
  data() {
    return {
      orderPys: [],
      orderId: "",
      order: {},
      afterSaleList: [],
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
        afterSellType: '1',
        reason: "",
        remark: "",
        imageListStr: "",
        orderId: "",
        orderPayIds:"",
      },
      rule: {
        reason: {
          message: '请输入售后原因',
          required: true,

        },
        remark: {
          message: '请输入售后说明',
          required: true,
        },
        orderPayIds: {
          message: '请选择商品',
          required: true,
        },
      },


    };
  },
  watch: {},
  created(e) {
    this.orderId = this.$route.query.id;
    this.addFrom.orderId = this.orderId;
  },
  mounted() {
    this.$nextTick(() => {
      this.getDetail();
    })
  },

  methods: {
    handleSelectionChange(e) {
      this.afterSaleList = e;
      
      let orderPayIdList = [];
      this.afterSaleList.forEach(element => {
        orderPayIdList.push(element.id);
      });
      if(orderPayIdList.length > 0) {
        this.addFrom.orderPayIds = JSON.stringify(orderPayIdList);
      }else {
        this.addFrom.orderPayIds = "";
      }
      
    },
    getSpecName(specJson) {
      var spec = JSON.parse(specJson)
      var key = Object.keys(spec)
      var value = Object.values(spec)
      return "规格:" + key + "-" + value
    },
    getDetail() {
      this.$request.post({
        url: '/tenant/order/orderDetail',
        params: {orderId: this.orderId},
        success: (result) => {
          this.order = result.order
          this.orderPys = result.userOrders
          setTimeout(() => {
            this.$store.commit('routes/SET_LOADING', false);
          }, 200)
        },
        catch: (e) => {

        },
        finally: (e) => {

        }
      });
    },
    cutDown(e) {
      this.addFrom.image = e.dataURL;
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
    save() {
      this.$refs['addFrom'].validate((valid) => {
        if (!valid) {
          return;
        }
        let pathList = this.$refs.banner.path_list;
        if(pathList.length > 0) {
          let imageList = [];
          pathList.forEach(item =>{
            imageList.push(item.path);
          })
          this.addFrom.imageListStr = JSON.stringify(imageList);
        }
        if(this.btnStatus) return;
        this.btnStatus = true
        this.$request.post({
          url: "tenant/order/submitAfterSale",
          params: this.addFrom,
          success: (result) => {
              this.$message.success("提交售后成功");
              this.$router.push('/order/afterList');
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
        icon: ""
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