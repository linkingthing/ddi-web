<template>
  <div class="menu">
    <vue-scroll :ops="ops">
      <Menu
        :theme="theme"
        :active-name="tab"
        :open-names="openNames"
      >
        <template v-for="(item, idx) in routes">
          <template v-if="item.meta.isFlat && PACK_SYSTEM.includes(item.meta.range) && hasShowMenu(item.meta.range) ">
            <template v-for="child in item.children">
              <MenuItem
                :key="child.path"
                :name="child.name"
                @click.native="handleJump(child.path)"
                class="sigle-menu"
              >
              <i
                class="menu-icon"
                :class="child.icon"
              />
              {{ child.meta.title }}
              </MenuItem>
            </template>
          </template>

          <template v-else>
            <MenuItem
              v-if="item.meta.isSingle && PACK_SYSTEM.includes(item.meta.range) && hasShowMenu(item.meta.range)"
              :key="idx"
              :name="item.name"
              @click.native="handleJump(item.path)"
              class="single-node"
            >
            <i
              v-if="item.icon"
              class="menu-icon"
              :class="item.icon"
            />
            {{ item.meta.title }}
            </MenuItem>

            <Submenu
              :key="idx"
              v-else-if="PACK_SYSTEM.includes(item.meta.range) && hasShowMenu(item.meta.range)"
              :name="item.name"
              class="level-menu"
            >
              <template slot="title">
                <i
                  v-if="item.icon"
                  class="menu-icon"
                  :class="item.icon"
                />
                {{ item.meta.title }}
              </template>

              <template v-for="child in item.children">
                <MenuItem
                  v-if="!child.meta.notInMenu"
                  :key="child.path"
                  :name="child.name"
                  @click.native="handleJump(child.path)"
                >
                {{ child.meta.title }}
                </MenuItem>
              </template>
            </Submenu>
          </template>

        </template>
      </Menu>
    </vue-scroll>
  </div>
</template>

<script>
import routes from "@/router/configs";

export default {
  name: "menuNav",

  data() {
    const route = this.$route;
    this.openNames = [
      "ipam-manage",
      "dns-service",
      "access-control",
      "dhcp-service",
      "system-safe"
    ];
    return {
      // eslint-disable-next-line no-undef
      PACK_SYSTEM,
      theme: "dark",
      ops: {
        vuescroll: {
          mode: "native",
          sizeStrategy: "percent",
          detectResize: true
        }
      },
      routes: [],
      tab: route.params.tab || route.name // 路由tab
    };
  },

  watch: {
    $route() {
      if (this.$route.params.tab) {
        this.tab = this.$route.params.tab;
      } else {
        this.tab = this.$route.name;
      }
    }
  },

  created() {
    this.formatMenus();
  },

  methods: {
    handleJump(res) {
      this.$router.push(res);
    },

    formatMenus() {
      this.routes = routes.map(item => {
        if (item.meta.isSingle) {
          let res = item.children.filter(item => !item.notInMenu)[0];

          res.meta.isSingle = true;

          return res;
        }
        else {
          return item;
        }
      });
    },

    hasShowMenu(range) {
      const [, moduleName] = this.$route.path.split("/");
      return moduleName === range;
    }

  }
};
</script>

<style lang="less">
@import "./index.less";
</style>