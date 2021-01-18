<template>
  <div class="viewManage">
    <table-page
      :data="list"
      :columns="columns"
      :total="total"
      :current.sync="query.current"
    >

      <template slot="neck">
        <SearchBar
          :params="query"
          @on-search="handleSearch"
        >
          <template slot="operate">
            <i-button
              v-if="$hasPermission('view', 'POST')"
              type="primary"
              @click="handleOpenCreate"
            >新建</i-button>
          </template>
        </SearchBar>

      </template>

    </table-page>

    <ViewModal
      :visible.sync="visible"
      :links="paramsLinks"
      @success="getView"
    />
  </div>
</template>

<script>

import services from "@/services";

import ViewModal from "./modules/view-modal";
import SearchBar from "./modules/SearchBarForView";
import _ from "lodash";

export default {
  name: "deviceMonitor",
  components: {
    ViewModal,
    SearchBar
  },
  data() {
    return {
      columns: [
        {
          title: "视图名称",
          key: "name",
          align: "left"
        },
        {
          title: "优先级",
          key: "priority"
        },
        {
          title: "访问控制",
          key: "acls",

          render: (h, { row }) => {
            return h("Tags", {
              props: {
                list: row.acls
              }
            });
          }
        },
        {
          title: "DNS64",
          key: "dns64"
        },
        {
          title: "备注",
          key: "comment"
        },
        {
          title: "操作",
          key: "action",
          width: 300,
          render: (h, { row }) => {
            if (this.$hasPermission("view", "POST")) {
              return h("div", [
                h("btn-edit", {
                  on: {
                    click: () => this.handleEdit(row)
                  }
                }),
                row.name !== "default" &&
                h("btn-del", {
                  on: {
                    click: () => this.delect(row.id)
                  }
                }),
                h("btn-line", {
                  props: {
                    title: !row.recursion ? "开启递归" : "关闭递归"
                  },
                  on: {
                    click: () => this.handleToggleRecursion(row)
                  }
                }),
                h("btn-move", {
                  style: {
                    display: (row.name === "default" || row.priority === 1) ? "none" : "inline-block"
                  },
                  props: {
                    type: "up",
                    // disabled: row.name === "default" || row.priority === 1
                  },
                  on: {
                    click: () => this.handleMove(row, "up")
                  }
                }),
                h("btn-move", {
                  style: {
                    display: (row.name === "default" || row.priority === 1) ? "none" : "inline-block"
                  },
                  props: {
                    type: "down",
                    // disabled: row.name === "default" || ((row.priority + 1) === this.default.priority)
                  },
                  on: {
                    click: () => this.handleMove(row, "down")
                  }
                })
              ]);
            } else {
              h("div");
            }

          }
        }
      ],
      total: 0,
      current: 0,
      list: [],
      visible: false,
      links: {},
      paramsLinks: {},
      default: {},
      query: {
        current: 1
      }
    };
  },

  watch: {
    "$route.query": {
      deep: true,
      immediate: true,
      handler(value) {
        this.query = _.cloneDeep(value);
        this.getView(value);
      }
    }
  },


  methods: {
    handleSearch(query) {
      this.$router.replace({
        query: { ..._.cloneDeep(this.$route.query), ..._.cloneDeep(query) }
      });
    },
    handleOpenCreate() {
      this.visible = true;
      this.paramsLinks = this.links;
    },
    handleEdit({ links }) {
      this.visible = true;
      this.paramsLinks = links;
    },
    getView(query = this.query) {
      const params = query;
      params.page_size = 10;
      params.page_num = query.current || 1;
      services
        .getViewList(params)
        .then(({ data, links, pagination }) => {
          this.list = data;
          this.links = links;

          this.default = this.list.find(item => item.id === "default") || {};
          this.total = pagination.total;
        })
        .catch(function (err) {
          console.log(err);
        });
    },

    // 删除
    delect(data) {
      this.$Modal.confirm({
        title: "提示",
        content: "确定删除？",
        onOk: () => {
          services
            .deleteViewById(data)
            .then(res => {
              this.$Message.success("删除成功");
              this.getView();
            })
            .catch(err => {
              this.$Message.error(err.response.data.message);
            });
        }
      });
    },
    handleToggleRecursion({ links, recursion }) {
      this.$Modal.confirm({
        title: "提示",
        content: `您确定要${recursion ? "关闭" : "开启"}该视图的递归服务吗？`,
        onOk: () => {
          this.$post({
            url: `${links.update}?action=switchrecursion`,
            params: { recursion: !recursion }
          }).then(() => {
            this.$Message.success("更新成功");
            this.getView();
          }).catch(err => {
            this.$Message.error(err.response.data.message);
          });
        }
      });


    },
    handleMove({ priority, links, ...rest }, type) {
      let count = priority;
      if (type === "up") {
        count -= 1;
        count = count || 1;
      } else {
        count += 1;
      }

      this.$post({
        url: `${links.update}?action=changepriority`,
        params: { priority: count, ...rest }
      }).then(() => {
        this.$Message.success("更新成功");
        this.getView();
      }).catch(err => {
        this.$Message.error(err.response.data.message);
      });
    }
  }
};
</script>

<style scoped>
</style>
