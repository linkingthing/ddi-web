<template>
  <div
    class="bread-wrapper"
    v-show="show"
  >
    <div class="bread-list">
      <div
        class="bread-item"
        v-for="(item, index) in breadcrumbList"
        :key="index"
      >
        <div
          class="bread-item-link"
          :class="{'is-current': item.name === currentName}"
          @click="handleClickRoute(item, index)"
        >
          {{item.title}}
        </div>

        <div
          class="bread-arrow"
          v-if="index < breadcrumbList.length - 1"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {allConfig as configs} from "@/router/configs";

export default {
  name: "Bread",

  props: {
    show: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      showBread: true,
      breadcrumbList: [],
      currentName: "",
      configs: [...configs]
    };
  },

  watch: {
    $route(route) {
      this.getBreadcrumbList(route);
    }
  },

  mounted() {
    this.getBreadcrumbList(this.$route);
  },

  methods: {
    handleClickRoute(item, index) {
      if (index === this.breadcrumbList.length - 1) return;

      this.$router.push(item.path);
    },

    async getBreadcrumbList(route) {
      this.currentName = route.name;

      let routes = this.getChildren(this.configs, [])
        .flat(Infinity)
        .reduce((prev, next) => {
          prev[next.name] = next;

          return prev;
        }, {});

      let list = this.getListByName(routes, route.name, []);

      this.breadcrumbList = await this.formatList(list);
    },

    getChildren(res, result) {
      const len = res.length;
      
      for (let i = 0; i < len; i++) {
        result.push(res[i]);
          
        if (res[i].children) {
          this.getChildren(res[i].children, result);
        }
      }

      return result;
    },

    getListByName(routes, name, result) {
      let ret = routes[name];

      result.unshift(ret);

      let from = ret.meta ? ret.meta.from : "";

      if (from) {
        this.getListByName(routes, from, result);
      }

      return result;
    },

    async formatList(list) {
      let ret = list.filter(item => item.meta && !item.meta.hideTitle)
        .map(item => ({
          name: item.name,
          title: this.getTitle(item.meta.title),
          path: this.getPath(item.path)
        }));

      await ret.forEach(async item => {
        if (item.title.indexOf(":") === 0) {
          let temp = item.path.split("/");
          let len = temp.length - 1;

          // 由于前两级是块名称与节点名称，加上前面的空字符串，所以若路径的长度小于4，则不请求数据
          if (len < 4) return;

          temp.splice(len, 1);

          let res = await this.$get(this.$getApiByRoute(temp.join("/")));

          item.title = res[item.title.slice(1)];
        }
      });

      return ret;
    },

    getTitle(title = "") {
      let arr = title.split(":");
      let route = this.$route;

      if (arr.length > 1) {
        let key = arr[1];

        return route.params[key] || route.query[key] || title;
      }
      else {
        return arr[0];
      }
    },

    getPath(path) {
      let params = this.$route.params;
      
      return path.replace(/:\w+/g, word => params[word.slice(1)]);
    }
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>