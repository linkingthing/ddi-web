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
          // this.$store
          //   .dispatch("getUserInfo")
          //   .then(userInfo => {
          //     if (userInfo) {
          //       const { userType } = userInfo;
          //       if (userType === "superUser") {
          //         this.$router.push("/monitor");
          //       }
          //       if (userType === "normalUser") {
          //         this.$router.push("/dns/dns/views_zones");
          //       }
          //     }
          //   });
        }
      }
    }
  }
};
</script>
