<template>
  <div>
    <i class="icon-delete"></i>
  </div>
</template>

<script>
export default {
  mounted() {
    setTimeout(() => {
      this.$store.commit('routes/SET_LOADING', false);
    }, 200)
  },
}
</script>

<style>

</style>

<style lang="scss" scoped>

</style>
