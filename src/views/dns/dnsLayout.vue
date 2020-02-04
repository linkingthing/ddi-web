<template>
  <main class="main-content">
    <!-- 菜单 -->
    <menu-nav-dns></menu-nav-dns>
    <section class="content">
      <div class="bread">
        <Breadcrumb>
          <BreadcrumbItem
            :key="item.path"
            :to="item.path"
            v-for="item in breadcrumbList"
          >{{item.title}}</BreadcrumbItem>
        </Breadcrumb>
      </div>

      <router-view></router-view>
    </section>
  </main>
</template>

<script>
import menuNavDns from "./MenuDns";

export default {
  name: "DnsLayout",
  data() {
    return {
      breadcrumbList: []
    };
  },
  mounted() {
    this.excuteBreadcrumbList();
  },
  components: {
    menuNavDns
  },
  methods: {
    excuteBreadcrumbList() {
      console.log(this.$route.meta,)
      console.log( this)
      const { title } = this.$route.meta;
      this.breadcrumbList = [
        {
          path: "/",
          title: "首页"
        }
      ];
    }
  }
};
</script>

<style lang="less" scoped>
.main-content {
  position: absolute;
  margin: 0;
  bottom: 70px;
  top: 60px;
}

.content {
  height: 100%;
}

.bread {
  padding: 20px;
}
</style>