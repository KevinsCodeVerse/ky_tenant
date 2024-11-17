<template>
  <div id="">

    <main-content>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="商户信息" name="first">
          <el-form :model="addFrom" :rules="rule" ref="addFrom" label-width="120px">
            <el-form-item label="LOGO">
              <el-image
                  style="width: 150px; height: 150px"
                  fit="cover"
                  class="el-defult"
                  :src="addFrom.shopPhoto | fullPath"
                  v-if="addFrom.shopPhoto.search(';base64') == -1 && addFrom.shopPhoto"
              ></el-image>
              <el-image style="width: 150px; height: 150px" fit="cover" class="el-defult" :src="addFrom.shopPhoto"
                        v-if="addFrom.shopPhoto.search(';base64') != -1"></el-image>
              <ImgCutter @onChooseImg="onChooseImg(2)" v-on:cutDown="cutDown" :sizeChange="false" :cutWidth="400" :cutHeight="400"
                         :boxWidth="800" :boxHeight="700">
                <el-button size="small" type="primary" slot="open">选择图片</el-button>
              </ImgCutter>
            </el-form-item>
            <el-form-item label="店铺名称" prop="shopName">
              <el-input placeholder="请输入名称" v-model="addFrom.shopName"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
              <el-input placeholder="请输入名称" v-model="addFrom.phone"></el-input>
            </el-form-item>
            <el-form-item label="详细地址" prop="shopName">
              <el-input placeholder="请输入名称" v-model="addFrom.address"></el-input>
            </el-form-item>
            <el-form-item label="定位" prop="shopName">
              <el-button type="primary" size="small" @click="TencentMap()" v-if="addFrom.latitude">
                查看当前定位
              </el-button>
              <el-button type="primary" size="small" @click="codeAddress()">
                {{addFrom.latitude?'重新定位':'开始定位'}}
              </el-button>
              <div v-show="visible" ref="map" class="mapClass"></div>
            </el-form-item>
            <el-form-item label="店铺介绍" prop="content">
              <div style="display: flex;">
                <editor :isClear="true" style="width:1000px" :value.sync="addFrom.content"
                        uploadUrl="/api/tenant/tenantShop/public/proUpload"></editor>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="success" @click="saveShopInfo">保存商户信息</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商城配置" name="second">
          <el-form :model="addFrom" :rules="rule" ref="addFrom" label-width="150px">
            <el-form-item label="自动确认收货">
              <el-input-number v-model="addFrom.afterSaleDay" @change="handleChange" :min="1" :max="15" label="售后天数"></el-input-number>
            </el-form-item>
            <el-form-item label="商城单位">
              <el-radio v-model="addFrom.unit" :label="1">积分</el-radio>
              <el-radio v-model="addFrom.unit" :label="2">人民币</el-radio>
            </el-form-item>
            <el-form-item label="是否允许提现" prop="content">
              <el-switch
                  v-model="addFrom.allowWithdrawal"
                  :active-value="1"
                  :inactive-value="0">
              </el-switch>
            </el-form-item>
<!--            <el-form-item label="开启会员卡分销" prop="content">-->
<!--              <el-switch-->
<!--                  v-model="addFrom.vipSales"-->
<!--                  :active-value="1"-->
<!--                  :inactive-value="0">-->
<!--              </el-switch>-->
<!--            </el-form-item>-->
            <el-form-item label="支付方式">
              <el-radio v-model="addFrom.payType" :label="1">会员账户</el-radio>
              <el-radio v-model="addFrom.payType" :label="2">线下支付</el-radio>
              <el-radio v-model="addFrom.payType" :label="3">全部支持</el-radio>
            </el-form-item>
            <el-form-item label="银行卡最低手续费">
              <el-input v-model="addFrom.costLimit" label="提现到银行卡最低手续费" style="width: 200px;"></el-input>
            </el-form-item>
            <el-form-item label="银行卡手续费比例">
              <el-input v-model="addFrom.costProportion" label="提现到银行卡手续费比例(100=100%)" style="width: 200px;"></el-input>%
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="warning" @click="saveMallSet">保存商城配置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </main-content>
  </div>
</template>
<script>
import editor from '@/components/editor/CustomWangEditor';
//引入地图js
import { TMap } from "@/utils/TMap";

export default {
  components: {
    editor
  },
  data() {
    return {
      activeName: "first",
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
        shopPhoto: "",
        shopName: "",
        content: "",
        afterSaleDay: 7,
        unit: "1",
        allowWithdrawal: "1",
        vipSales: "1",
        payType: "1",
        type: 0,
        phone:"",
        costLimit: 0,
        costProportion: 0,
        address:'',
        longitude:'',
        latitude:'',

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
      //地图
      visible: false,
      geocoder: "",
      city: "",
      formItem: {
        longitude: "", //经度
        latitude: "", //维度
        address: "", //搜索条件
      },


    };
  },
  watch: {},
  created() {
  },
  mounted() {
    this.getDetail();
  },

  methods: {
    saveMallSet() {
      this.$request.post({
        url: '/tenant/tenantMallSet/setMall',
        params: this.addFrom,
        success: (result) => {
          this.$message.success(result)
          this.getDetail()
        },
        catch: (e) => {

        },
        finally: (e) => {

        }
      });
    },
    saveShopInfo() {
      this.$request.post({
        url: '/tenant/tenantMallSet/setShopInfo',
        params: this.addFrom,
        success: (result) => {
          this.$message.success(result)
          this.getDetail()
        },
        catch: (e) => {

        },
        finally: (e) => {

        }
      });
    },
    getDetail() {
      this.$request.post({
        url: '/tenant/tenantMallSet/getMallSetAndShopInfo',
        success: (result) => {
          if (result.tenantShop) {
            this.addFrom.shopName = result.tenantShop.name
            this.addFrom.phone = result.tenantShop.phone
            this.addFrom.content = result.tenantShop.content
            this.addFrom.shopPhoto = result.tenantShop.shopPhoto
            this.addFrom.address = result.tenantShop.address
            this.addFrom.longitude = result.tenantShop.longitude
            this.addFrom.latitude = result.tenantShop.latitude
            //商城配置
            this.addFrom.afterSaleDay=result.tenantMallSet.afterSaleDay
            this.addFrom.unit=result.tenantMallSet.unit
            this.addFrom.allowWithdrawal=result.tenantMallSet.allowWithdrawal
            this.addFrom.vipSales=result.tenantMallSet.vipSales
            this.addFrom.payType=result.tenantMallSet.payType
            this.addFrom.costLimit=result.tenantMallSet.costLimit
            this.addFrom.costProportion=result.tenantMallSet.costProportion
          }

        },
        catch: (e) => {

        },
        finally: (e) => {
          setTimeout(()=>{
            this.$store.commit('routes/SET_LOADING', false);
          },200)
        }
      });
    },
    handleClick() {
    },
    cutDown(e) {
      this.addFrom.shopPhoto = e.dataURL;
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
        logo: "",
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
        url: '/admin/tat/list',
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
    //获取定位
    codeAddress() {
      console.log('this.addFrom.address', this.addFrom.address)
      if(!this.addFrom.address) {
        this.$message.error('地址不能为空');
        return;
      }
      this.$request.post({
        url: '/tenant/tenantMallSet/addressResolution',
        params: {
          address: this.addFrom.address,
        },
        success: (result) => {
          this.addFrom.longitude = result.location.lng;
          this.addFrom.latitude = result.location.lat;
          this.$message.success('定位成功');
          this.TencentMap();
        },
        finally: () => {
        }
      });
    },
    //创建地图
    TencentMap() {
      this.visible = true;
      //这里填自己的key
      TMap("GBIBZ-MHKK7-5C5X5-HJDVQ-I2UCJ-CABJE").then((qq) => {
        //地图经纬赋值
        const myLatlng = new qq.maps.LatLng(
          this.addFrom.latitude,
          this.addFrom.longitude
        );

        const map = new qq.maps.Map(this.$refs.map, {
          center: myLatlng, //位置
          zoom: 13, //放大程度
          mapTypeId: qq.maps.MapTypeId.ROADMAP,
        });
        //添加定时器
        // setTimeout(function(){
            var marker=new qq.maps.Marker({
                position:myLatlng,
                animation:qq.maps.MarkerAnimation.DROP,
                map:map
            });
        // },2000);
      });
    }
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

.mapClass {
  width: 100%;
  height: 500px;
}
</style>