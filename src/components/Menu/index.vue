<template>
  <div class="menu">
    <vue-scroll :ops="ops">
      <Menu
        ref="menu"
        :theme="theme"
        :active-name="tab"
        :open-names="openNames"
      >
        <template v-for="(item, idx) in routeList">
          <template v-if="item.meta.isFlat">
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
              v-if="item.meta.isSingle"
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
      tab: "" // 路由tab
    };
  },

  computed: {
    routeList() {
      const { routes } = this.$store.getters;
      const routeFlat = routes[0].children;
      const result = routeFlat
        .filter(item => {
          const [, moduleName] = this.$route.path.split("/");
          return item.meta.range === moduleName;
        })
        .map(item => {
          if (item.meta.isSingle) {
            let res = item.children.filter(item => !item.notInMenu)[0];
            res.meta.isSingle = true;
            return res;
          }
          else {
            return item;
          }
        });
      console.log(routes)
      console.log(result, "menu")
      return result;

    }

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



  methods: {
    handleJump(res) {
      this.$router.push(res);
    },

    flatTree(tree) {
      let result = [];

      tree.forEach(item => {

        if (item.children) {
          const innerResult = this.flatTree(item.children);
          result = result.concat(innerResult);
        }
        result.push(item);

      });

      return result;

    }


  }
};
</script>

<style lang="less">
@import "./index.less";
</style>