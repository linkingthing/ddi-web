<template>
  <main class="main-content">
    <!-- 菜单 -->
    <menu-nav-dns></menu-nav-dns>
    <section class="content">
      <div class="bread">
        <Breadcrumb>
          <BreadcrumbItem
            :key="item.path"
            :to="index === breadcrumbList.length-1 ? '': item.path"
            v-for="(item, index) in breadcrumbList"
          >
            {{item.title}}
            <template v-if="item.name">({{item.name}})</template>
          </BreadcrumbItem>
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
  components: {
    menuNavDns
  },
  mounted() {
    this.excuteBreadcrumbList(this.$route, this.$route);
  },
  methods: {
    excuteBreadcrumbList(currentRoute, prevRoute) {
      const {
        fullPath: currentFullPath,
        meta: { parent, title: currentTitle },
        query: { name }
      } = currentRoute;
      const {
        fullPath,
        meta: { title }
      } = prevRoute;
      if (prevRoute.name === parent) {
        this.breadcrumbList.pop();
        this.breadcrumbList.push({
          path: fullPath,
          title,
          name
        });
      } else if (
        this.breadcrumbList.map(item => item.path).includes(currentFullPath)
      ) {
        // 面包屑回退
        const index = this.breadcrumbList
          .map(item => item.path)
          .indexOf(currentFullPath);
        this.breadcrumbList = this.breadcrumbList.slice(0, index);
      } else {
        const { path } = this.$route;
        const [, , menu] = path.split("/");
        const menuConfig = {
          authority: "权威管理",
          recursion: "递归管理",
          forward: "转发管理",
          accessControl: "访问控制"
        };
        this.breadcrumbList = [
          {
            title: menuConfig[menu]
          }
        ];
      }
      this.breadcrumbList.push({
        path: currentFullPath,
        title: currentTitle
      });
    }
  },
  watch: {
    $route(currentRoute, prevRoute) {
      this.excuteBreadcrumbList(currentRoute, prevRoute);
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
  overflow: auto;
}

.bread {
  padding: 20px;
}
</style>