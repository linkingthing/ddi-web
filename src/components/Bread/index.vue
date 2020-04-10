<template>
  <div class="wrapper" v-show="showBread">
    <Breadcrumb>
      <BreadcrumbItem
        :key="item.id"
        :to="index === breadcrumbList.length-1 ? '': item.path"
        v-for="(item, index) in breadcrumbList"
      >
        {{item.title}}
        <template v-if="item.name">({{item.name}})</template>
      </BreadcrumbItem>
    </Breadcrumb>
  </div>
</template>

<script>
let autoId = 0;
export default {
  components: {},
  props: {},
  data() {
    return {
      showBread: true,
      breadcrumbList: []
    };
  },

  computed: {},
  created() {},
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
        this.showBread = menuConfig[menu];

        this.breadcrumbList = [
          {
            title: menuConfig[menu]
          }
        ];
      }

      // TODO:临时方案：用于控制某些特定页面才显示面包屑
      const { path } = this.$route;
      const [, , menu] = path.split("/");
      const menuConfig = {
        authority: "权威管理",
        recursion: "递归管理",
        forward: "转发管理",
        accessControl: "访问控制"
      };
      this.showBread = menuConfig[menu];

      this.breadcrumbList.push({
        id: autoId++,
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
.wrapper {
  padding: 12px 20px;
}
</style>