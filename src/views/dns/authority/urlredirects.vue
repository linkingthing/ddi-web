<template>
  <div class>
    <table-page
      :data="list"
      :columns="columns"
      :current.sync="current"
      :total="total"
    >
      <template slot="top-right">
        <i-button
          type="primary"
          @click="handleOpenCreate"
        >新建</i-button>
      </template>
    </table-page>
    <urlredirects-modal
      :links="paramsLinks"
      :visible.sync="visible"
      @success="getData"
    />
  </div>
</template>

<script>
import UrlredirectsModal from "./modules/urlredirects-modal";
export default {
  name: "configGroupMg",
  components: {
    "urlredirects-modal": UrlredirectsModal
  },
  data() {
    return {
      columns: [
        {
          title: "域名",
          key: "domain",
          align: "left",
        },
        {
          title: "重定向URL",
          key: "url",
          align: "left"
        },
        {
          title: "操作",
          key: "action",
          align: "right",
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
            ])
          }
        }
      ],
      list: [],
      current: 1,
      total: 0,
      visible: false,
      paramsLinks: {}
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$getDataAndLinks()
        .then(({ data, links }) => {
          this.list = data;
          this.total = data.length;
          this.links = links;
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    handleOpenCreate() {
      this.paramsLinks = this.links;
      this.visible = true;
    },
    handleOpenEdit({ links }) {
      this.paramsLinks = links;
      this.visible = true;
    },
    handleDelete({ links }) {
      this.$Modal.confirm({
        title: "您确定要删除当前数据吗？",
        onOk: () => {
          this.$delete({ url: links.remove }).then(res => {
            this.$Message.info("删除成功");
            this.getData();
          }).catch(err => {
            this.$Message.error(err.message);
          });
        },
        onCancel: () => {
          this.$Message.info("取消删除");
        }
      });
    }
  }
};
</script>