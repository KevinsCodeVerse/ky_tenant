PR<template>
    <div id="user_promoter_aduit_list">
        <!-- -----------------------------------筛选------------------------------------ -->
      <main-head>
        <el-form :inline="true" size="medium">
          <el-form-item>
            <el-input placeholder="用户账号/ID/手机号" @keyup.enter.native="search" clearable v-model="screenData.mobile"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select placeholder="分销等级" v-model="screenData.isInside" clearable @change="search">
              <el-option value="0" label="普通会员"></el-option>
              <el-option value="1" label="黄金会员"></el-option>
              <el-option value="2" label="合伙人"></el-option>
              <el-option value="3" label="至尊合伙人"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item>
              <el-select placeholder="状态" v-model="screenData.status" clearable>
                  <el-option value="" label="全部状态"></el-option>
                  <el-option value="1" label="正常"></el-option>
                  <el-option value="-1" label="取消资格"></el-option>
              </el-select>
          </el-form-item> -->


          <el-form-item>
            <el-date-picker v-model="selectData" type="daterange" range-separator="-" start-placeholder="注册日期筛选开始" end-placeholder="注册日期筛选结束"
                            clearable
                            @change="search">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          </el-form-item>
<!--          <el-form-item>-->
<!--            <el-button type="warning" @click="reset">重置</el-button>-->
<!--          </el-form-item>-->
        </el-form>
      </main-head>

      <main-content>
        <!-- -----------------------------------列表------------------------------------ -->
        <el-table :data="list" stripe v-loading="loading" style="width: 100%" height="570">
          <el-table-column align="center" width="80" prop="id编号" label="ID"></el-table-column>
          <el-table-column align="center" prop="shopName" label="分销员">
            <template slot-scope="scope">
              <el-image
                  fit="cover"
                  style="width: 60px; height: 60px"
                  :src="scope.row.userInfoList[0].avatar"
                  :preview-src-list="[scope.row.userInfoList[0].avatar]"
              ></el-image>
              <p>{{ scope.row.userInfoList[0].nick }}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="mobile" label="手机号"> </el-table-column>

          <el-table-column align="center" prop="grade" label="分销等级" width="120px">
            <template slot-scope="scope">
              <div class="tag_grade_pt" v-if="scope.row.grade == 0">普通会员</div>
              <div class="tag_grade_hj" v-else-if="scope.row.grade == 1">黄金会员</div>
              <div class="tag_grade_hh" v-else-if="scope.row.grade == 2">合伙人</div>
              <div class="tag_grade_zz" v-else-if="scope.row.grade == 3">至尊合伙人</div>
            </template>
          </el-table-column>
<!--          <el-table-column align="center" prop="inviteAgent" label="他邀请的人" >-->
<!--            <template slot-scope="scope">-->
<!--              <el-tag type="success" size="normal" effect="dark">{{ scope.row.inviteAgent }} 名</el-tag>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column align="center" prop="realName" label="累积佣金">-->
<!--            <template slot-scope="scope">-->
<!--              <span class="error">￥{{ scope.row.amount }}</span>-->
<!--            </template>-->
<!--          </el-table-column>-->

<!--          &lt;!&ndash; <el-table-column align="center" prop="userInfoList[0].account" label="账号"> </el-table-column> &ndash;&gt;-->
<!--          <el-table-column align="center" prop="userInfoList[0].mobile" label="手机号"> </el-table-column>-->
<!--          <el-table-column align="center" prop="agentNick" label="邀请人" show-overflow-tooltip>-->
<!--            <template slot-scope="scope">-->
<!--              {{ scope.row.agentNick ? scope.row.agentNick : '- -' }}-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column label="申请时间" align="center">
            <template slot-scope="scope">
              {{ $moment(scope.row.createTime).format('Y-MM-DD HH:mm:ss') }}
            </template>
          </el-table-column>

<!--          <el-table-column align="center" prop="orderCount" label="今日开单数"> </el-table-column>-->

<!--          <el-table-column align="center" prop="proAmount" label="总业绩"> </el-table-column>-->
<!--          &lt;!&ndash; <el-table-column align="center" prop="inviteAgent" label="他邀请的人数"> </el-table-column> &ndash;&gt;-->

<!--          <el-table-column align="center" prop="isInside" label="类型">-->
<!--            <template slot-scope="scope">-->
<!--              <el-tag type="success" v-if="!scope.row.isInside == 1">普通用户</el-tag>-->
<!--              <el-tag type="warning" v-else>内部人员</el-tag>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column label="状态" align="center" min-width="180px">
            <template slot-scope="scope">
              <div v-html="getStatus(scope.row.status)"></div>
            </template>
          </el-table-column>
          <el-table-column label="个人业绩" align="center" prop="proAmount">
          </el-table-column>
          <el-table-column label="团队业绩" align="center" prop="teamAmount">
          </el-table-column>
          <el-table-column label="佣金钱包" align="center" prop="amount">
          </el-table-column>
<!--          <el-table-column label="状态" align="center">-->
<!--            <template slot-scope="scope">-->
<!--              &lt;!&ndash; <span v-if="scope.row.status==0" class="warning">正在审核中</span>-->
<!--           <span v-if="scope.row.status==1" class="success">通过审核</span>-->
<!--           <span v-else class="error">{{scope.row.reason}}</span> &ndash;&gt;-->
<!--              <span class="success" v-if="scope.row.status == 1">正常</span>-->
<!--              <span class="warning" v-else-if="scope.row.status == 0">待审核</span>-->
<!--              <span class="error" v-else-if="scope.row.status == -1">不通过</span>-->
<!--              <span class="error" v-else-if="scope.row.status == 2">取消资格</span>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column align="center" label="操作" width="150px" fixed="right">
            <template slot-scope="scope">
              <el-button class="mybtn" type="text" size="mini" @click="goDetail(scope.row)">团队</el-button>
              <el-button v-if="scope.row.status != 2" class="mybtn" type="text" size="mini" @click="call(scope.row)">取消</el-button>
              <el-button class="mybtn" type="text" size="mini" @click="grade(scope.row)" plain>等级</el-button>
              <el-button class="mybtn" type="text" size="mini" @click="biaoshi(scope.row)">标识</el-button>
              <el-button v-if="scope.row.status == 2" class="mybtn" type="text" size="mini" @click="regain(scope.row)">恢复</el-button>

              <!-- <el-button class="mybtn" type="success" size="mini" v-if="scope.row.status == 0" @click="updateStatus(scope.row.id, 1)">通过审核</el-button>
              <el-button class="mybtn" type="danger" size="mini" v-if="scope.row.status == 0" @click="updateStatus(scope.row.id, -1)">不通过</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </main-content>
<main-footer>
  <!-- 分页功能 -->
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



        <el-dialog title="添加标识" :visible.sync="show" width="30%" @close="(show = false), (form = { isInside: 0, realName: '' })">
            <el-form :model="form" ref="form" :rules="rules" label-width="80px" :inline="false" size="normal">
                <el-form-item label="真实姓名">
                    <el-input v-model="form.realName"></el-input>
                </el-form-item>
                <el-form-item label="内部人员">
                    <el-radio v-model="form.isInside" :label="1">是</el-radio>
                    <el-radio v-model="form.isInside" :label="0">否</el-radio>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="show = false">取消</el-button>
                <el-button type="primary" @click="identification">确认</el-button>
            </span>
        </el-dialog>
        <el-dialog title="我的团队" :visible.sync="dialogDialog" :close-on-click-modal="false" top="4vh" width="80%">
            <el-table :data="teamList" class="margin_top20" v-loading="logLoading">
                <el-table-column align="center" width="80" prop="id" label="ID"></el-table-column>
                <el-table-column align="center" prop="shopName" label="分销员">
                    <template slot-scope="scope">
                        <el-image
                            fit="cover"
                            style="width: 60px; height: 60px"
                            :src="scope.row.userInfoList[0].avatar"
                            :preview-src-list="[scope.row.userInfoList[0].avatar]"
                        ></el-image>
                        <p>{{ scope.row.userInfoList[0].nick }}</p>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="realName" label="真实姓名"> </el-table-column>

                <el-table-column align="center" prop="grade" label="分销员等级" width="120px">
                    <template slot-scope="scope">
                        <div class="tag_grade_pt" v-if="scope.row.grade == 0">普通会员</div>
                        <div class="tag_grade_hj" v-else-if="scope.row.grade == 1">黄金会员</div>
                        <div class="tag_grade_hh" v-else-if="scope.row.grade == 2">合伙人</div>
                        <div class="tag_grade_zz" v-else-if="scope.row.grade == 3">至尊合伙人</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="inviteAgent" label="他邀请的人">
                    <template slot-scope="scope">
                        <el-tag type="success" size="normal" effect="dark">{{ scope.row.inviteAgent }} 名</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="realName" label="累积佣金">
                    <template slot-scope="scope">
                        <span class="error">￥{{ scope.row.amount }}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column align="center" prop="userInfoList[0].account" label="账号"> </el-table-column> -->
                <el-table-column align="center" prop="userInfoList[0].mobile" label="手机号"> </el-table-column>
                <el-table-column align="center" prop="agentNick" label="邀请人">
                    <template slot-scope="scope">
                        {{ scope.row.agentNick ? scope.row.agentNick : '- -' }}
                    </template>
                </el-table-column>

                <el-table-column label="加入时间" align="center">
                    <template slot-scope="scope">
                        {{ $moment(scope.row.createTime).format('Y-MM-DD HH:mm:ss') }}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="orderCount" label="今日开单数"> </el-table-column>
                <el-table-column align="center" prop="monthAmount" label="本月业绩">
                    <template slot-scope="scope">
                        <span class="warning">￥{{ scope.row.monthAmount || 0 }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="proAmount" label="总业绩"> </el-table-column>
                <!-- <el-table-column align="center" prop="inviteAgent" label="他邀请的人数"> </el-table-column> -->

                <el-table-column align="center" prop="isInside" label="类型">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="!scope.row.isInside == 1">普通用户</el-tag>
                        <el-tag type="warning" v-else>内部人员</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <!-- <span v-if="scope.row.status==0" class="warning">正在审核中</span>
                 <span v-if="scope.row.status==1" class="success">通过审核</span>
                 <span v-else class="error">{{scope.row.reason}}</span> -->
                        <span class="success" v-if="scope.row.status == 1">正常</span>
                        <span class="warning" v-else-if="scope.row.status == 0">待审核</span>
                        <span class="error" v-else-if="scope.row.status == -1">不通过</span>
                        <span class="error" v-else-if="scope.row.status == 2">取消资格</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="150px" fixed="right">
                    <template slot-scope="scope">
                        <!-- <el-button class="mybtn" type="primary" size="mini" @click="biaoshi(scope.row)">标识修改</el-button> -->
                        <!-- <el-button v-if="scope.row.status != 2" class="mybtn" type="warning" size="mini" @click="call(scope.row)">取消资格</el-button> -->
                        <!-- <el-button v-if="scope.row.status == 2" class="mybtn" type="success" size="mini" @click="regain(scope.row)">恢复资格</el-button> -->
                        <el-button class="mybtn" type="info" size="mini" @click="goDetail(scope.row)">查看我的团队</el-button>
                        <el-button class="mybtn" type="primary" size="mini" @click="grade(scope.row)" plain>修改分销等级</el-button>
                        <el-button class="mybtn" type="primary" size="mini" @click="biaoshi(scope.row)">标识修改</el-button>
                        <el-button v-if="scope.row.status == 2" class="mybtn" type="success" size="mini" @click="regain(scope.row)">恢复资格</el-button>
                        <el-button v-if="scope.row.status != 2" class="mybtn" type="warning" size="mini" @click="call(scope.row)">取消资格</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="page"
                background
                @size-change="handleLogSizeChange"
                @current-change="goDetail"
                :current-page.sync="teamData.pageNo"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="teamData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="teamTotal"
            >
            </el-pagination>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            rules: {},
            selectData: '',
            show: false,
            form: {
                isInside: 0,
                realName: ''
            },
            list: [], //数据
            loading: false,
            screenData: {
                usType: '', //筛选参数
                status: '',
                pageNo: 1,
                pageSize: 10,
                isInside: ''
            },
            itemTotal: 0,
            // 团队弹框
            dialogDialog: false,
            teamList: [],
            logLoading: false,
            teamData: {
                id: '',
                pageNo: 1,
                pageSize: 10
            },
            teamTotal: 0
        };
    },

    watch: {},
    methods: {
      getStatus(e){
        switch (e) {
          case 1:
            return '<span style="color: #19BE6B">• 正常</span>'
          case 0:
            return '<span style="color: #e67e22">• 待审核</span>'
          case -1:
            return '<span style="color: #7f8c8d">• 不通过</span>'
          case 2:
            return '<span style="color: #7f8c8d">• 取消资格</span>'
        }
      },
        // 修改 等级
        grade(row) {
            console.log(row);
            this.$prompt('1.普通会员 2.黄金会员 3.合伙人 4.至尊合伙人', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /(1|2|3|4)/,
                inputErrorMessage: '请输入1~4'
            })
                .then(({ value }) => {
                    this.$request.post({
                        url: 'tenant/tenantInvite/changeShopLevel',
                        params: {
                            id: row.id,
                            grade: value - 1
                        },
                        success: () => {
                            this.$message.success('修改成功');
                            this.getList();
                            this.dialogDialog && this.getteam();
                        }
                    });
                })
                .catch(() => {
                    this.$message.warning('取消修改');
                });
        },
        //--------------获取列表----------------------
        getList(pageNo) {
            this.loading = true;
            this.screenData.pageNo = pageNo || this.screenData.pageNo;
            this.$request.post({
                url: '/tenant/tenantInvite/inviteList',
                params: this.screenData,
                success: (res) => {
                    for (let aa of res.list) {
                        aa.hasChildren = true;
                    }
                    this.list = res.list;
                    this.itemTotal = res.total;

                    console.log(this.list);
                },
                finally: () => {
                    this.loading = false;
                  setTimeout(()=>{
                    this.$store.commit('routes/SET_LOADING', false);
                  },200)
                }
            });
        },
        // 查询 团队
        goDetail(data) {
            console.log(data);
            this.dialogDialog = true;
            this.logLoading = true;
            console.log(this.teamData);
            data&&(this.teamData.id = data.userId || data.id||this.teamData.id)
            this.$request.post({
                url: '/tenant/tenantInvite/teamList',
                params: this.teamData,
                success: (res) => {
                    this.teamList = res.list;
                    this.teamTotal = res.total;
                },
                finally: () => {
                    this.logLoading = false;
                }
            });
        },

        handleLogSizeChange(current) {
            if (current) {
                this.teamData.pageNo = current;
                this.goDetail();
            }
        },
        // 重置
        reset() {
            this.screenData = {
                //筛选参数
                pageNo: 1,
                pageSize: 10,
                startTime: '',
                isInside: '',
                status: '',
                endTime: ''
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
        // 取消分销员
        call(row) {
            this.$confirm('此操作将取消资格, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            })
                .then(() => {
                    this.$request.post({
                        url: '/tenant/tenantInvite/cancelInvite',
                        params: {
                            id: row.id
                        },
                        success: (res) => {
                            this.$message.success('操作成功');
                            this.getList(this.screenData.pageNo);
                            this.dialogDialog && this.getteam();
                        }
                    });
                })
                .catch((err) => {
                    return err;
                });
        },
        // 恢复
        regain(row) {
            this.$request.post({
                url: '/tenant/tenantInvite/setInvite',
                params: {
                    id: row.id
                },
                success: (res) => {
                    this.$message.success('操作成功');
                    this.getList(this.screenData.pageNo);
                    this.dialogDialog && this.getteam();
                }
            });
        },
        // 标识
        biaoshi(row) {
            this.form.id = row.id;
            this.show = true;
            this.form.isInside = row.isInside;
            this.form.realName = row.realName;
        },
        //页面改变
        pageChange(current) {
            if (current) {
                this.screenData.pageNo = current;
                this.getList(this.screenData.pageNo);
            }
        },
        //
        identification() {
            this.$request.post({
                url: '/tenant/tenantInvite/markInvite',
                params: {
                    id: this.form.id,
                    isInside: this.form.isInside,
                    realName: this.form.realName
                },
                success: () => {
                    this.getList();
                    this.dialogDialog && this.getteam();
                    this.show = false;
                },
                finally: () => {}
            });
        },

        // 团队更新
        getteam() {
            this.$request.post({
                url: '/tenant/tenantInvite/teamList',
                params: {
                    id: this.teamData.id,
                    pageNo: this.teamData.pageNo,
                    pageSize: this.teamData.pageSize
                },
                success: (res) => {
                    this.teamList = res.list;
                    this.teamTotal = res.total;
                },
                finally: () => {}
            });
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
.avatar {
    border-radius: 50%;
    width: 70px;
    height: 70px;
}

.tag_grade_pt {
    padding: 4px 6px;
    background-color: rgba(0, 0, 0, 0.041);
    border-radius: 3px;
    color: rgba(48, 48, 48, 0.822);
    border: 1px solid rgba(0, 0, 0, 0.096);
}
.tag_grade_hj {
    padding: 4px 6px;
    background-color: rgba(204, 201, 0, 0.103);
    border-radius: 3px;
    color: rgb(170, 167, 0);
    border: 1px solid rgba(204, 201, 0, 0.144);
}
.tag_grade_hh {
    padding: 4px 6px;
    background-color: rgba(232, 82, 82, 0.103);
    border-radius: 3px;
    color: rgb(232, 82, 82);
    border: 1px solid rgba(232, 82, 82, 0.144);
}
.tag_grade_zz {
    padding: 4px 6px;
    background-color: rgba(189, 125, 225, 0.103);
    border-radius: 3px;
    color: rgb(177, 101, 221);
    border: 1px solid rgba(189, 125, 225, 0.144);
}
</style>
