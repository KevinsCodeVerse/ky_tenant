<template>
  <div id="">
    <main-head>
        <div style="padding-bottom: 20px;">打印吊牌</div>
    </main-head>
    <main-content>
        <el-select v-model="type" size="small">
            <el-option v-for="(item, index) in typeList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
    </main-content>

    <main-footer>
    </main-footer>
  </div>
</template>
<script>

export default {
  data() {
    return {
      type: 1,
      typeList: [
          {
              value: 1,
              label:'横版大图(A4)'
          },
          {
              value: 2,
              label:'竖版小吊牌'
          }
      ],
      goodsInfo:{},
    };
  },
  watch: {},
  created() {
      var id = this.$route.query.id;
      if (id) {
        this.id = id;
        this.getDetail();
        }
  },
  mounted() {
  },
  methods: {
    getDetail: function () {
      this.$request.post({
        url: 'tenant/tenantPro/detail',
        params: {
          id: this.id
        },
        success: (res) => {
            this.goodsInfo = res;
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

<style scoped>
/* 添加这部分CSS样式来改变表格表头的颜色 */
/deep/ .el-table .el-table__header th {
  background-color: #D7D7D7 !important;
  color: #666666 !important;
}

.page {
  text-align: right;
  margin-top: 20px;
}

.diPrice {
  display: flex;
  flex-wrap: wrap;
}

.diPrice div {
  text-align: right;
  margin-right: 15px;
  width: 100px;
}

.Dleft {
  text-align: left !important;
}

.diPriceBox {
  background: white;
  position: absolute;
  z-index: 9999;

  padding: 5px 10px;
  top: 2%;
  left: -50%;
  border-radius: 10px;
  box-shadow: 2px 2px 10px #0000002f;
  width: 400px;
  color: #666666;
}
</style>