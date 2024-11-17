<template>
  <div class="main_content">
    <div v-if="hasTopSlot" ref="topContent" class="top">
      <slot name="top"></slot>
    </div>
    <div :style="{ marginTop: topMargin + 'px' }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "MainContent",
  data() {
    return {
      hasTopSlot: false,
      topMargin: 0,
    };
  },
  mounted() {
    this.updateTopSlot();
    this.$nextTick(() => {
      const observer = new MutationObserver(this.updateTopSlot);
      observer.observe(this.$refs.topContent, { childList: true, subtree: true });
    });
  },
  methods: {
    updateTopSlot() {
      this.hasTopSlot = !!this.$slots.top;
      this.$nextTick(() => {
        if (this.hasTopSlot && this.$refs.topContent) {
          this.topMargin = this.$refs.topContent.offsetHeight;
        } else {
          this.topMargin = 0;
        }
      });
    },
  },
};
</script>

<style scoped>
.main_content {
  position: relative;
  background: white;
  margin-top: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  height: auto;
  overflow: auto;
}

.top {
  position: absolute;
  z-index: 999;
  margin: -20px;
  padding: 20px 20px 0 20px;
  background-color: white;
  width: 85vw;
}
</style>