<template>
  <div class="main_footer">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "MainFooter"
}
</script>

<style scoped>
.main_footer {

  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  padding: 5px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
}
</style>
