<template>
  <div class="ForwardView">
    <table-page
      title="转发视图"
      :data="list"
      :columns="columns"
      :pagination-enable="false"
    >
      <template slot="top-right">
        <i-button
          type="primary"
          @click="handleOpenCreate"
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
              "router-link",
              {
                props: {
                  to: {
                    name: "zone-query-forward",
                    query: { id: row.id, name: row.name }
                  }
                }
              },
              row.name
            );
          }
        },
        {
          title: "服务器",
          key: "ips",
          align: "center",
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
          align: "right"
        },
        {
          title: "操作",
          key: "action",
          align: "right",
          width: 160,
          render: (h, { row }) => {
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
          }
        }
      ],
      list: [],
      links: {},
      paramsLinks: {},
      visible: false
    };
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      this.$getDataAndLinks().then(({ data, links }) => {
        this.list = data;
        this.links = links;
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
            this.$Message.error(err.data.message);
          });
        }
      });
    }
  }
};
</script>

