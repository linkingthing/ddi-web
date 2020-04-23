<template>
  <div class="wrapper" v-show="showBread">
    <Breadcrumb>
      <BreadcrumbItem
        v-for="(item, index) in breadcrumbList"
        :key="index"
        :to="index === breadcrumbList.length - 1 ? '': item.path"
      >
        {{item.title}}
        <template v-if="item.name">({{item.name}})</template>
      </BreadcrumbItem>
    </Breadcrumb>
  </div>
</template>

<script>
import configs from "@/router/configs";

let autoId = 0;

export default {
  name: "Bread",

  data() {
    return {
      showBread: true,
      breadcrumbList: [],
      configs: [...configs]
    };
  },

  watch: {
    $route(route) {
      this.getBreadcrumbList(route);
      
      // this.excuteBreadcrumbList(currentRoute, prevRoute);
    }
  },

  mounted() {
    
    // this.excuteBreadcrumbList(this.$route, this.$route);
    this.getBreadcrumbList(this.$route);
  },

  methods: {
    getBreadcrumbList(route) {
      let result = [];

      this.breadcrumbList = this.getChildren(route.path, this.configs, result);      
    },

    getChildren(path, routes, result, parent) {
      let len = routes.length;
      let found = false;
      let i = 0;

      for (i = 0; i < len; i++) {
        let item = routes[i];
        
        if (item.path === path) {
          result.push({
            path,
            title: this.getTitle(item.meta.title)
          });

          found = true;

          break;
        }
        else {
          if (item.children) {
            this.getChildren(path, item.children, result, item);
          }
        }
      }

      if (found && parent) {
        this.setParent(parent, routes[i], result);
      }

      return result;
    },

    setParent(parent, child, result) {
      if (!child) return;
      
      if (child.meta.from) {
        let item = this.getItemByName(child.meta.from);
          
        result.unshift({
          path: item.path,
          title: this.getTitle(item.meta.title)
        });

        if (item.meta.from) {
          let grandParent = this.getParent(parent);

          if (!grandParent) return;

          this.setParent(grandParent, parent, result);
        }
        else {
          let title = this.getTitle(parent.meta.title);

          if (title) {
            result.unshift({
              path: parent.path,
              title
            });
          }
        }
      }
      else {
        let title = this.getTitle(parent.meta.title);

        if (title) {
          result.unshift({
            path: parent.path,
            title
          });
        }
      }
    },

    getParent(item, res = this.configs) {
      let result = res.find(item => item.name === item.name);

      if (result) {
        return result;
      }
      else if (result.children) {
        let len = result.children.length;

        for (let i = 0; i < len; i++) {
          return this.getParent(item, result.children);
        }
      }
      else {
        return;
      }
    },

    getItemByName(name, res = this.configs) {
      let result = null;
      
      for (let i = 0; i < res.length; i++) {
        if (res[i].name === name) {
          result = res[i];

          break;
        }
        else {
          result = this.getItemByName(name, res[i].children || []);

          if (result) break;
        }
      }

      return result;
    },

    getTitle(title = "") {
      let arr = title.split(":");
      let route = this.$route;

      if (arr.length > 1) {
        let key = arr[1];

        return Object.keys(route.params).length ? route.params[key] : route.query[key];
      }
      else {
        return arr[0];
      }
    },

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
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  padding: 12px 20px;
}
</style>