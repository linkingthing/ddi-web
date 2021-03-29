<template>
  <router-view style="height: 100%; min-height:100%;" />
</template>

<script>
export default {
  name: "DefaultLayout",
  watch: {
    $route: {
      deep: true,
      immediate: true,
      handler(to) {
        if (to.path === "/") {
          this.$router.push("/monitor");
        }
      }
    }
  }
};
</script>
