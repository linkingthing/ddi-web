<template>
  <div class="ForwardView">
    <table-page
      title="转发视图"
      :data="list"
      :columns="columns"
      :total="total"
      :current.sync="current"
    >
      <template slot="top-right">
        <i-button
          type="primary"
          @click="handleOpenCreate"
          v-if="$hasPermissionCreate('forward')"
        >新建</i-button>
      </template>
    </table-page>
    <ForwardModal
      :links="paramsLinks"
      :visible.sync="visible"
      @success="getDataList"
    />
  </div>
</template>

<script>
import ForwardModal from "./modules/forward-modal";

export default {
  name: "applicationFirewall",
  components: {
    ForwardModal
  },
  data() {
    return {
      columns: [
        {
          title: "组名称",
          key: "name",
          align: "left",
          render: (h, { row }) => {
            return h(
              "span",
              {
                props: {
                  href: "javascript:;"
                }
              },
              row.name
            );
          }
        },
        {
          title: "服务器",
          key: "ips",
          align: "left",
          render: (h, { row }) => {
            return h("Tags", {
              props: {
                list: row.ips,
                field: row
              }
            });
          }
        },
        {
          title: "备注",
          key: "comment",
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          align: "right",
          width: 160,
          render: (h, { row }) => {

            if (this.$hasPermissionCreate("forward")) {
              return h("div", [
                h("btn-edit", {
                  on: {
                    click: () => this.handleOpenEdit(row)
                  }
                }),
                h("btn-del", {
                  on: {
                    click: () => this.handleDelete(row)
                  }
                })
              ]);
            } else {
              return h("div");
            }
          }
        }
      ],
      total: 0,
      current: 0,
      list: [],
      links: {},
      paramsLinks: {},
      visible: false
    };
  },
  watch: {
    current: {
      handler() {
        this.getDataList();
      }
    }
  },
  methods: {
    getDataList() {
      const params = {
        page_num: this.current,
        page_size: 10
      };
      this.$getData(params).then(({ data, links, pagination }) => {
        this.list = data;
        this.links = links;
        this.total = pagination.total;
      });
    },
    handleOpenCreate() {
      this.visible = true;
      this.paramsLinks = this.links;
    },
    handleOpenEdit({ links }) {
      this.visible = true;
      this.paramsLinks = links;
    },
    handleDelete({ links }) {
      this.$Modal.confirm({
        title: "提示",
        content: "确定删除？",
        onOk: () => {
          this.$delete({ url: links.remove }).then(() => {
            this.getDataList();
          }).catch(err => {
            this.$Message.error(err.response.data.message);
          });
        }
      });
    }
  }
};
</script>

