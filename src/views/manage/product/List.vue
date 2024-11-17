<template>
  <div>
    <main-head>
      <el-form :inline="true" size="medium">
        <el-form-item>
          <el-input placeholder="请输入商品名" clearable v-model="params.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="selectData" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                          clearable
                          @change="search">
          </el-date-picker>
        </el-form-item>
<!--        <el-form-item>-->
<!--          <el-select-->
<!--              v-model="params.categoryId"-->
<!--              filterable-->
<!--              clearable-->
<!--              remote-->
<!--              reserve-keyword-->
<!--              placeholder="请输入分类名称搜索"-->
<!--              :remote-method="remoteMethod"-->
<!--              :loading="loading">-->
<!--            <el-option-->
<!--                v-for="item in options"-->
<!--                :key="item.id"-->
<!--                :label="item.name"-->
<!--                :value="item.id">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->

        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>

      </el-form>
    </main-head>


    <main-content>
      <template v-slot:top>
        <div >
          <el-tabs v-model="params.status" @tab-click="handleClick">
            <el-tab-pane label="全部" name="0"></el-tab-pane>
            <el-tab-pane label="销售中" name="1"></el-tab-pane>
            <el-tab-pane label="仓库中" name="2"></el-tab-pane>
          </el-tabs>
<!--          <el-form :inline="true" size="medium">-->

<!--            <el-form-item>-->
              <el-button type="success" @click="add" icon="el-icon-edit-outline" >添加商品</el-button>
              <el-button type="primary" @click="indexTop" :disabled="(goodsPros.length==0)">首页推荐</el-button>
<!--            </el-form-item>-->
<!--            <el-form-item>-->
              <el-button :disabled="(goodsPros.length==0)||(goodsPros.length>0&&upStatus===true)" type="success" @click="updateBatchStatus(1)">
                批量上架
              </el-button>
<!--            </el-form-item>-->
<!--            <el-form-item>-->
              <el-button :disabled="(goodsPros.length==0)||(goodsPros.length>0&&downStatus===true)" type="danger" @click="updateBatchStatus(2)">
                批量下架
              </el-button>
<!--            </el-form-item>-->
            <!-- <el-button type="primary" @click="printTag" >打印吊牌</el-button> -->
<!--          </el-form>-->
        </div>
      </template>

      <el-table :data="list" v-loading="loading" stripe fixed="right" @selection-change="handleSelectionChange" :row-key="getRowKeys"
                :header-cell-style="tableHeaderColor" height="470">
        <el-table-column type="selection"
                         width="55" align="center" :reserve-selection="true"></el-table-column>
        <el-table-column label="商品编号" prop="id" align="center"></el-table-column>
        <el-table-column label="主图" width="110" align="center">
          <template slot-scope="scope">
            <el-image fit="cover" style="width: 100px; height: 50px" :src="scope.row.cover | fullPath"
                      :preview-src-list="[$fullPath(scope.row.cover)]"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="name" align="center" width="600"></el-table-column>
        <!--      <el-table-column label="积分" prop="weightSort" align="center"></el-table-column>-->
<!--        <el-table-column label="运费" prop="name" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            <span :class="scope.row.freight != 0 ? 'warning' : 'success'">{{ scope.row.freight == 0 ? '包邮' : '￥' + scope.row.freight }}</span>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column label="商品价格" align="center">
          <template slot-scope="scope">
            <span class="error">￥{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <!--            <el-table-column label="开启应用" align="center" width="160px">-->
        <!--                <template slot-scope="scope">-->
        <!--                    <div>拼团: <span class="error" v-if="scope.row.isGroup == 0">未开启</span><span class="success" v-if="scope.row.isGroup != 0">已开启</span></div>-->
        <!--                    <div>秒杀: <span class="error" v-if="scope.row.isSpike == 0">未开启</span><span class="success" v-if="scope.row.isSpike != 0">已开启</span></div>-->
        <!--                    <div v-if="scope.row.isInvite == 0">分销: <span class="error">未开启</span></div>-->
        <!--                    <div v-if="scope.row.isInvite != 0">-->
        <!--                        分销: <span class="success" style="z-index: 500" @mouseenter="mouseenter(scope.row)" @mouseleave="mouseleave(scope.row)">已开启</span>-->
        <!--                    </div>-->
        <!--                    <div v-if="scope.row.reward && scope.row.isShowReward" class="diPriceBox" @mouseenter="mouseenter(scope.row)" @mouseleave="mouseleave(scope.row)">-->
        <!--                        <h3>佣金分成</h3>-->
        <!--                        <div class="diPrice">-->
        <!--                            <div>普通会员:</div>-->
        <!--                            <div class="Dleft">直推: ￥{{ scope.row.reward[0] }}</div>-->
        <!--                            <div class="Dleft">间推: ￥{{ scope.row.reward[1] }}</div>-->
        <!--                        </div>-->
        <!--                        <div class="diPrice">-->
        <!--                            <div>黄金会员:</div>-->
        <!--                            <div class="Dleft">直推: ￥{{ scope.row.reward[2] }}</div>-->
        <!--                            <div class="Dleft">间推: ￥{{ scope.row.reward[3] }}</div>-->
        <!--                        </div>-->
        <!--                        <div class="diPrice">-->
        <!--                            <div>合伙人:</div>-->
        <!--                            <div class="Dleft">直推: ￥{{ scope.row.reward[4] }}</div>-->
        <!--                            <div class="Dleft">间推: ￥{{ scope.row.reward[5] }}</div>-->
        <!--                        </div>-->
        <!--                        <div class="diPrice">-->
        <!--                            <div>至尊合伙人:</div>-->
        <!--                            <div class="Dleft">直推: ￥{{ scope.row.reward[6] }}</div>-->
        <!--                            <div class="Dleft">间推: ￥{{ scope.row.reward[7] }}</div>-->
        <!--                        </div>-->
        <!--                    </div>-->
        <!--                </template>-->
        <!--            </el-table-column>-->
<!--        <el-table-column label="浏览量" prop="pv" align="center"></el-table-column>-->
<!--        <el-table-column label="销量" prop="deal" align="center"></el-table-column>-->
        <!--                <el-table-column label="收藏量" prop="favor" align="center"></el-table-column>-->
        <!--                <el-table-column label="评论量" prop="evaluation" align="center"></el-table-column>-->
<!--        <el-table-column label="首页推荐" prop="goodScore" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            <span>{{ scope.row.indexRecommend === 0 ? '未推荐' : '已推荐' }}</span>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <!--      <el-table-column label="配送方式" prop="carriage" align="center"></el-table-column>-->
        <el-table-column align="center" label="创建时间" width="200">
          <template slot-scope="scope">
            <p>{{ $common.getDate(scope.row.createTime) }}</p>
          </template>
        </el-table-column>

        <el-table-column label="状态" align="center" width="90px">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 2" >仓库中</span>
            <span v-if="scope.row.status == 1" >销售中</span>
          </template>
        </el-table-column>
<!--        <el-table-column label="下架原因" align="center" show-overflow-tooltip>-->
<!--          <template slot-scope="scope">-->
<!--            <div class="error" v-if="scope.row.remark&&scope.row.status == 2">下架原因:{{ scope.row.remark }}</div>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column label="操作" align="center" width="200px" fixed="right">
          <template slot-scope="scope">
            <div>
              <el-button type="text" size="mini" @click="printTag(scope.row.id)" >打印吊牌</el-button>
              <el-button type="text" size="mini" @click="update(scope.row.id)" >编辑</el-button>
              <el-button v-if="scope.row.status == 2" type="text" size="mini" @click="updateStatus(scope.row.id, 1)">上架</el-button>
              <el-button v-if="scope.row.status == 1" type="text" size="mini" @click="updateStatus(scope.row.id, 2)">下架</el-button>
              <el-button v-if="scope.row.status == 2" type="text" size="mini" @click="remove(scope.row.id)" style="color: #e74c3c">删除
              </el-button>
              <!--            <el-button type="warning" size="mini" @click="cancelIndex(scope.row.id)" v-if="scope.row.indexRecommend===1">取消推荐</el-button>-->
            </div>
            <!--                    <div>-->
            <!--                        <el-button v-if="$store.state.use.use['2'] == 1" type="warning" size="small" @click="$router.push('/seckill/seckill_edit?id=' + scope.row.id)" >设置秒杀</el-button >-->
            <!--                        <el-button v-if="$store.state.use.use['1'] == 1" type="warning" size="small" @click="$router.push('/group/group_edit?id=' + scope.row.id)" >设置团购</el-button >-->
            <!--                    </div>-->
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

    <el-dialog title="营销活动" :visible.sync="activityDialog" @close="clearDialog" width="500px">
      <el-form :inline="true" size="medium" label-width="80px">
        <el-form-item label="营销类型">
          <el-radio-group v-model="activityForm.type">
            <el-radio :label="1" border>秒杀</el-radio>
            <el-radio :label="2" border>拼团</el-radio>
          </el-radio-group>
        </el-form-item>
        <br/>
        <el-form-item label="活动时间">
          <el-date-picker v-model="timeArr" type="datetimerange" range-separator="至" start-placeholder="开始日期"
                          end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <div v-if="activityForm.type == 1">
          <el-form-item label="活动时间">
            <el-date-picker v-model="timeArr" type="datetimerange" range-separator="至" start-placeholder="开始日期"
                            end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
    </el-dialog>
    <d-alllabel v-model="labelVisible" :ids="Did" :type="type" :labelData="labelData" @refresh="getList"></d-alllabel>
  </div>
</template>
<script>
import DAlllabel from './childComponent/D_Alllabel.vue';
export default {
  components: {
    DAlllabel
  },
  data() {
    return {
      options: [],
      goodsPros: [], //多选数据
      params: {
        pageNo: 1,
        pageSize: 10,
        isCount: true,
        name: '',
        sort: '',
      },
      sortList: [
        {label: '全部', value: ''},
        {label: "销售中", value: "1"},
        {label: "仓库中", value: "2"},
      ],
      list: [],
      total: 0,
      loading: false,
      selectData: [],
      activityDialog: false,
      activityForm: {
        type: 1, //1秒杀 2拼团
        activityStartTime: '',
        activityEndTime: '',
        activityInventory: 100,
        peopleNum: 0,
        activityPrice: ''
      },
      timeArr: [],
      // 标签
      labelVisible: false,
      Did: -1,
      type: 1,
      labelData: ''
    };
  },
  watch: {},
  created() {
  },
  mounted() {
    this.getList(1);
  },
  activated() {
    this.getList();
  },
  methods: {
    printTag(id){
      this.$router.push('/product/printTag?id='+id);
    },
    remoteMethod(e) {
      this.$request.post({
        url: '/tenant/tenantProCategory/queryCategoryByName',
        params: {name: e},
        success: (result) => {
          this.options=result
        },
        catch: (e) => {

        },
        finally: (e) => {

        }
      });
    },
    handleClick(e) {
      console.log("this.params:", this.params.status)
      // if (this.params.status == 0) {
      //   this.params.status = 1
      // }
      this.search()
    },
    cancelIndex(id) {
      this.$request.post({
        url: '/tenant/tenantPro/cancelIndexTop',
        params: {id: id},
        success: (result) => {
          this.$message.success(result)
          this.search()
        },
        catch: (e) => {

        },
        finally: (e) => {

        }
      });
    },
    indexTop() {
      console.log("this.pro:", this.goodsPros)
      var ids = this.goodsPros.map(item => item.id)
      this.$request.post({
        url: '/tenant/tenantPro/indexTop',
        params: {ids: JSON.stringify(ids)},
        success: (result) => {
          this.$message.success(result)
          this.search()
        },
        catch: (e) => {

        },
        finally: (e) => {

        }
      });
    },
    getRowKeys(row) {
      return row.id
    },
    handleSelectionChange(val) {
      this.goodsPros = val;
      // 初始化状态为 false
      let hasUpStatus = false;
      let hasDownStatus = false;

      // 遍历选中的行数据
      for (let item of val) {
        // 如果有一个状态为 1，设置上架状态为 true
        if (item.status === 1) {
          hasUpStatus = true;
        }
        // 如果有一个状态为 2，设置下架状态为 true
        if (item.status === 2) {
          hasDownStatus = true;
        }
        // 如果两种状态都已经存在，则无需再继续遍历
        if (hasUpStatus && hasDownStatus) {
          break;
        }
      }

      // 将状态保存到 data 中的 upStatus 和 downStatus 中
      this.upStatus = hasUpStatus;
      this.downStatus = hasDownStatus;
      console.log('upStatus', this.upStatus)
      console.log('downStatus', this.downStatus)
    },
    // 批量上下架
    updateBatchStatus(status) {
      let msg, show = false;
      if (status == 1) {
        msg = '确定批量上架选中的商品吗';
      } else if (status == 2) {
        msg = '确定批量下架选中的商品吗';
        show = true
      }
      this.$prompt(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showInput: show,
        inputPlaceholder: '输入下架原因',
        inputType: 'textarea',
        inputValidator: (value) => {       // 点击按钮时，对文本框里面的值进行验证
          if (show && value.length > 200) {
            return '字数在200以内';
          }
        },
      }).then((res) => {
        let goodsPros = this.goodsPros.map((item) => {
          return {
            id: item.id,
            type: this.params.type
          }
        })
        this.loading = true;
        console.log('JSON.stringify(goodsPros)', JSON.stringify(goodsPros))
        this.$request.post({
          url: 'tenant/tenantPro/batchUpdateProStatus',
          params: {
            status,
            remark: res.value || '',
            goodsPros: JSON.stringify(goodsPros)
          },
          success: (result) => {
            this.goodsPros = [];
            // this.$refs.dataTable.clearSelection();
            this.$message.success("操作成功");
            // this.getList(this.params.pageNo);
            setTimeout(() => {
              location.reload()
            }, 500)
          },
          finally: () => {
            this.loading = false;
          }
        });
      });
    },
    // 分配标签
    allotLabel(row) {
      this.Did = row.id;
      this.labelVisible = true;
      this.labelData = row.afterSellIdent || '';
    },
    // 鼠标移除
    mouseleave(row) {
      row.isShowReward = false;
    },
    // 监听鼠标经过
    mouseenter(row) {
      row.isShowReward = true;
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
    getList(pageNo) {
      this.loading = true;
      this.params.pageNo = pageNo || this.params.pageNo;
      this.params.vipPro=0
      this.$request.post({
        url: 'tenant/tenantPro/list',
        params: this.params,
        success: (result) => {
          result.list.forEach((item) => {
            item.isShowReward = 0;
          });
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
    // 添加商品
    add() {
      this.$router.push('/product/addOrUpdate');
    },
    // 设置秒杀活动
    addSeckill() {
    },
    // 上下架
    updateStatus(id, status) {
      let msg = status == 1 ? '是否确定上架此商品？' : '是否确定下架此商品？';
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.$request.post({
          url: 'tenant/tenantPro/updateProStatus',
          params: {
            id,
            status
          },
          success: (result) => {
            this.$message.success('操作成功');
            this.getList(this.params.pageNo);
          },
          finally: () => {
            this.loading = false;
          }
        });
      });
    },
    // 编辑
    update(id) {
      this.$router.push('/product/addOrUpdate?id=' + id);
    },
    // 删除
    remove(id) {
      this.$confirm('是否确定删除该商品？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.$request.post({
          url: 'tenant/tenantPro/deletePro',
          params: {
            id
          },
          success: (result) => {
            this.$message.success('操作成功');
            this.getList(this.params.pageNo);
          },
          finally: () => {
            this.loading = false;
          }
        });
      });
    },
    activityDetail() {
    },
    // 设置营销方案
    addActivity() {
      this.activityDialog = true;
    },
    clearDialog() {
    }
  },

  beforeDestroy() {
  }
};
</script>

<style>
</style>

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

</style>