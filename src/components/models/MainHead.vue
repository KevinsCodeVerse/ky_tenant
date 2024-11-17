<template>
  <div class="main-head">
    <div :class="containerClass">
      <slot>{{$store.state.common.pageInfo.label}}</slot>
    </div>
    <div>
      <slot name="after"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "MainHead",

  props: {
    isFormSlot: { // 添加一个接受父组件判断的属性
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      // 初始化时不再直接设定isElForm，而是在computed中基于props动态计算
    };
  },

  computed: {
    isElForm() {

      console.log("this.isFormSlot:")
      return this.isFormSlot; // 直接使用来自父组件的判断
    },
    containerClass() {
      return this.isElForm ? 'main-head-container-alt' : 'main-head-container';
    }
  }
};
</script>

<style scoped>
.main-head-container, .main-head-container-alt {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  margin-top: 15px;
  margin-bottom: 15px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  border-radius: 5px;
}

.main-head-container-alt {
  padding: 20px 20px 0 20px; /* 如果是 el-form，微调顶部 padding */
}
</style>