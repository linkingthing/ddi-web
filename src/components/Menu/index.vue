<template>
  <div class="menu">
    <vue-scroll :ops="ops">
      <Menu
        ref="menu"
        :theme="theme"
        :active-name="tab"
        :open-names="openNames"
      >
        <template v-for="(item, idx) in routes">
          <template v-if="item.meta.isFlat && hasShowMenu(item.meta.range) ">
            <template v-for="child in item.children">
              <MenuItem
                v-if="!child.meta.notInMenu"
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
              v-if="item.meta.isSingle && hasShowMenu(item.meta.range)"
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
              v-else-if="hasShowMenu(item.meta.range)"
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

    return {
      theme: "dark",
      ops: {
        vuescroll: {
          mode: "native",
          sizeStrategy: "percent",
          detectResize: true
        }
      },
      openNames: [
        "ipam-manage",
        "dns-service",
        "access-control",
        "dhcp-service",
        "system-safe",
        "dhcp-config",
        "forward",
        "dhcp-dhcp",
        "system-log",
        "system-alarms",
        "auth-user"
      ],
      routes: [],
      tab: "" // 路由tab
    };
  },

  watch: {
    $route: {
      immediate: true,
      async handler(val) {
        if (!val) return;

        await this.$nextTick();

        if (val.params.tab) {
          this.tab = val.params.tab;
        } else {
          this.tab = val.name;
        }

        if (val.meta && val.meta.active) {
          this.tab = val.meta.active;
        }

        await this.$nextTick();

        this.$refs.menu.updateOpened();
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
      }).filter(item => {
        return "dns,monitor,address,system,auth".includes(item.meta.range);
      });

      // this.openNames = this.routes.map(item => item.name);      
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