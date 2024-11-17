<template>
  <div>
    <main-head :is-form-slot="false">

      <!--      <el-button type="primary" style="float: right; margin-right: 20px" size="small" @click="btn">保存</el-button>-->
      <!--      <el-button type="warning" style="float: right; margin-right: 20px" size="small" @click="getList">重置</el-button>-->
      <!--      <el-button type="success" style="float: right" size="small" @click="updata">修改</el-button>-->

    </main-head>

    <main-content style="height: 75vh">
        <el-card>
          <div slot="header" class="clearfix">
            <span style="font-weight: bold">商品消费佣金</span>
            <el-button style="float: right; padding: 10px;margin:-10px" type="primary" @click="$router.push('/user/setVipLevel')">添加会员等级
            </el-button>
          </div>
          <div style="font-size: 13px;padding: 20px">
            <div v-for="(item,index) in vipList">
              <div style="display: flex;justify-content: space-between">
                <div style="display: flex;flex-direction: column;gap: 50px;">
                  <div style="font-weight: bold">
                    推广等级
                  </div>
                  <div style="font-weight: bold">
                    普通推广员
                  </div>
                  <div style="font-weight: bold">
                    黄金推广员
                  </div>
                  <div style="font-weight: bold">
                    合伙人
                  </div>
                  <div style="font-weight: bold">
                    至尊合伙人
                  </div>
                </div>
                <div style="display: flex;flex-direction: column;margin-left: 125px;gap: 120px">
                  <div style="font-weight: bold">
                    会员等级
                  </div>
                  <div style="font-weight: bold">
                    {{ item.name }}
                  </div>
                </div>
                <div style="display: flex;flex-direction: column;gap: 30px;margin-left: 125px">
                  <div style="font-weight: bold">
                    直推佣金比例(0.01-1)
                  </div>
                  <div style="font-weight: bold">
                    <el-input-number :disabled="isUpdata" v-model="item.ptDirect" :precision="2" :step="0.01" :max="1"
                                     :min="0.00"></el-input-number>
                  </div>
                  <div style="font-weight: bold">
                    <el-input-number :disabled="isUpdata" v-model="item.hjDirect" :precision="2" :step="0.01" :max="1"
                                     :min="0.00"></el-input-number>
                  </div>
                  <div style="font-weight: bold">
                    <el-input-number :disabled="isUpdata" v-model="item.hhrDirect" :precision="2" :step="0.01" :max="1"
                                     :min="0.00"></el-input-number>
                  </div>
                  <div style="font-weight: bold">
                    <el-input-number :disabled="isUpdata" v-model="item.zzDirect" :precision="2" :step="0.01" :max="1"
                                     :min="0.00"></el-input-number>
                  </div>
                </div>
                <div style="display: flex;flex-direction: column;gap: 30px;margin-left: 50px">
                  <div style="font-weight: bold">
                    间推佣金比例(0.01-1)
                  </div>
                  <div style="font-weight: bold">
                    <el-input-number :disabled="isUpdata" v-model="item.ptIndirect" :precision="2" :step="0.01" :max="1"
                                     :min="0.00"></el-input-number>
                  </div>
                  <div style="font-weight: bold">
                    <el-input-number :disabled="isUpdata" v-model="item.hjIndirect" :precision="2" :step="0.01" :max="1"
                                     :min="0.00"></el-input-number>
                  </div>
                  <div style="font-weight: bold">
                    <el-input-number :disabled="isUpdata" v-model="item.hhrIndirect" :precision="2" :step="0.01" :max="1"
                                     :min="0.00"></el-input-number>
                  </div>
                  <div style="font-weight: bold">
                    <el-input-number :disabled="isUpdata" v-model="item.zzIndirect" :precision="2" :step="0.01" :max="1"
                                     :min="0.00"></el-input-number>
                  </div>
                </div>

              </div>
              <el-divider></el-divider>
            </div>

          </div>
          <div style="display: flex">
            <el-button type="success" style="float: right; margin-right: 20px;width: 100px" size="small" @click="saveList">保存</el-button>
          </div>

        </el-card>

        <el-card style="margin-top: 20px;padding: 20px">
          <div slot="header" class="clearfix">
            <span style="font-weight: bold">购买升级礼包</span>
            <el-button style="float: right; padding: 10px;margin:-10px" type="primary" @click="$router.push('/distribution/addOrUpdate')">
              添加升级礼包
            </el-button>
          </div>
          <div style="display: flex;justify-content: center;align-items: center;flex-direction: column" v-if="vipProList.length===0">
            <span>当前暂无升级礼包</span>
            <span>
            请添加升级礼包，用户购买开通升级礼包即可直升分销等级和会员等级，享受更高的佣金比例和会员折扣权益
          </span>
          </div>
          <div v-for="(item,index) in vipProList" v-else>
            <div style="display: flex;justify-content: space-between;font-size: 13px">
              <div style="display: flex;flex-direction: column;gap: 50px;">
                <div style="font-weight: bold">
                  推广等级
                </div>
                <div style="font-weight: bold">
                  普通推广员
                </div>
                <div style="font-weight: bold">
                  黄金推广员
                </div>
                <div style="font-weight: bold">
                  合伙人
                </div>
                <div style="font-weight: bold">
                  至尊合伙人
                </div>
              </div>

              <div style="display: flex;flex-direction: column;gap: 50px;">
                <div style="font-weight: bold">
                  推广会员礼包
                </div>
                <div style="font-weight: bold;margin-top: 55px">
                  <div>购买{{ item.name }}</div>
                  <div>价格:{{ item.price }}元(价格最低的规格)</div>
                  <div>送:{{ item.giftAmount }}元</div>
                </div>
              </div>
              <div style="display: flex;flex-direction: column;gap: 30px;margin-left: 125px">
                <div style="font-weight: bold">
                  直推佣金比例(0.01-1)
                </div>
                <div style="font-weight: bold">
                  <el-input-number :disabled="isUpdata" v-model="item.ptDirect" :precision="2" :step="0.01" :max="1"
                                   :min="0.00"></el-input-number>
                </div>
                <div style="font-weight: bold">
                  <el-input-number :disabled="isUpdata" v-model="item.hjDirect" :precision="2" :step="0.01" :max="1"
                                   :min="0.00"></el-input-number>
                </div>
                <div style="font-weight: bold">
                  <el-input-number :disabled="isUpdata" v-model="item.hhrDirect" :precision="2" :step="0.01" :max="1"
                                   :min="0.00"></el-input-number>
                </div>
                <div style="font-weight: bold">
                  <el-input-number :disabled="isUpdata" v-model="item.zzDirect" :precision="2" :step="0.01" :max="1"
                                   :min="0.00"></el-input-number>
                </div>
              </div>
              <div style="display: flex;flex-direction: column;gap: 30px;margin-left: 125px">
                <div style="font-weight: bold">
                  间推佣金比例(0.01-1)
                </div>
                <div style="font-weight: bold">
                  <el-input-number :disabled="isUpdata" v-model="item.ptIndirect" :precision="2" :step="0.01" :max="1"
                                   :min="0.00"></el-input-number>
                </div>
                <div style="font-weight: bold">
                  <el-input-number :disabled="isUpdata" v-model="item.hjIndirect" :precision="2" :step="0.01" :max="1"
                                   :min="0.00"></el-input-number>
                </div>
                <div style="font-weight: bold">
                  <el-input-number :disabled="isUpdata" v-model="item.hhrIndirect" :precision="2" :step="0.01" :max="1"
                                   :min="0.00"></el-input-number>
                </div>
                <div style="font-weight: bold">
                  <el-input-number :disabled="isUpdata" v-model="item.zzIndirect" :precision="2" :step="0.01" :max="1"
                                   :min="0.00"></el-input-number>
                </div>
              </div>
            </div>
            <el-divider></el-divider>
          </div>
          <div style="display: flex">
            <el-button type="success" style="float: right; margin-right: 20px;width: 100px" size="small" @click="saveProList">保存</el-button>
          </div>

        </el-card>

        <el-card style="margin-top: 20px">
          <div slot="header" class="clearfix">
            <span style="font-weight: bold">分销等级</span>
          </div>
          <div style="font-size: 13px;padding: 20px">
            <div style="display: flex;">
              <div style="display: flex;flex-direction: column;gap: 50px;">
                <div style="font-weight: bold">
                  推广等级
                </div>
                <div style="font-weight: bold">
                  普通推广员
                </div>
                <div style="font-weight: bold">
                  黄金推广员
                </div>
                <div style="font-weight: bold">
                  合伙人
                </div>
                <div style="font-weight: bold">
                  至尊合伙人
                </div>
                <div style="font-weight: bold">
                  <el-button type="success" style="float: right; margin-right: 20px;width: 100px" size="small" @click="btn">保存</el-button>
                </div>
              </div>
              <div style="display: flex;flex-direction: column;gap: 30px;margin-left: 125px">
                <div style="font-weight: bold">
                  升级所需个人业绩（直推）
                </div>
                <div style="font-weight: bold">
                  <el-input :disabled="true" v-model="defaultValue" width="200px"></el-input>
                </div>
                <div style="font-weight: bold">
                  <el-input :disabled="isUpdata" v-model="list.goldPerson" width="200px"></el-input>
                </div>
                <div style="font-weight: bold">
                  <el-input :disabled="isUpdata" v-model="list.partnerPerson" width="200px"></el-input>
                </div>
                <div style="font-weight: bold">
                  <el-input :disabled="isUpdata" v-model="list.superPartnerPerson" width="200px"></el-input>
                </div>
              </div>
              <div style="display: flex;flex-direction: column;gap: 30px;margin-left: 50px">
                <div style="font-weight: bold">
                  升级所需团队业绩（间推）
                </div>
                <div style="font-weight: bold">
                  <el-input :disabled="true" v-model="defaultValue" width="200px"></el-input>
                </div>
                <div style="font-weight: bold">
                  <el-input :disabled="isUpdata" v-model="list.goldTeam"></el-input>
                </div>
                <div style="font-weight: bold">
                  <el-input :disabled="isUpdata" v-model="list.partnerTeam"></el-input>
                </div>
                <div style="font-weight: bold">
                  <el-input :disabled="isUpdata" v-model="list.superPartnerTeam"></el-input>
                </div>
              </div>
            </div>
          </div>

        </el-card>
<!--      </view>-->

    </main-content>

  </div>
</template>

<script>
export default {
  data() {
    return {
      vipProList: [],
      vipList: [],
      defaultValue: "无",
      list: {},
      rules: {},
      isUpdata: false
    };
  },

  watch: {},

  mounted() {
    this.getList();
    this.getVipLevel();
    this.getVipPro()
  },

  methods: {
    saveProList() {
      this.$confirm('保存最新升级礼包配置, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        this.$request.post({
          url: '/tenant/tenantVipLevel/batchUpdateVipPro',
          params: {
            list: JSON.stringify(this.vipProList)
          },
          success: (result) => {
            this.$message.success(result)
            this.getList()
            this.getVipLevel()
          },
          catch: (e) => {

          },
          finally: (e) => {

          }
        });
      })
    },
    saveList() {
      this.$confirm('保存最新商品消费佣金配置, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        this.$request.post({
          url: '/tenant/tenantVipLevel/batchUpdateVipLevel',
          params: {
            list: JSON.stringify(this.vipList)
          },
          success: (result) => {
            this.$message.success(result)
            this.getList()
            this.getVipLevel()
          },
          catch: (e) => {

          },
          finally: (e) => {

          }
        });
      })
    },
    getVipLevel() {
      this.$request.post({
        url: '/tenant/tenantVipLevel/vipListNoPage',
        success: (result) => {
          this.vipList = result
          console.log("this.", this.vipList)
        },
        catch: (e) => {

        },
        finally: (e) => {
          setTimeout(() => {
            this.$store.commit('routes/SET_LOADING', false);
          }, 200)
        }
      });
    },
    getVipPro() {
      this.$request.post({
        url: '/tenant/tenantVipLevel/vipProList',
        success: (result) => {
          this.vipProList = result
        },
        catch: (e) => {

        },
        finally: (e) => {

        }
      });
    },
    // 修改
    updata() {
      this.isUpdata = false;
    },
    // 保存
    btn() {
      this.$confirm('保存为最新配置, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      })
          .then(() => {
            this.$request.post({
              url: '/tenant/tenantInvite/setConfig',
              params: this.list,
              success: (result) => {
                this.$message.success('修改成功');
              },
              finally: () => {
              }
            });
          })
          .catch((err) => {
            return err;
          });
    },
    // 请求 list
    getList() {
      this.$request.post({
        url: '/tenant/tenantInvite/configList',
        success: (result) => {
          this.list = result || {};
          console.log(result);
        },
        finally: () => {

        }
      });
    }
  }
};
</script>

<style></style>

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
