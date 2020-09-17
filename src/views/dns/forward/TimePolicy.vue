<template>
  <div class="TimePolicy">
    <table-page
      title="转发视图"
      :data="list"
      :columns="columns"
      :total="list.length"
    >
      <template slot="top-right">
        <i-button
          type="primary"
          @click="handleOpenCreate"
          v-if="$store.getters.hasPermissionToCreate"
        >新建</i-button>
      </template>
    </table-page>
    <TimePolicyModal
      :links="paramsLinks"
      :visible.sync="visible"
      @success="getDataList"
    />
  </div>
</template>

<script>
import TimePolicyModal from "./modules/time-policy-modal";

export default {
  name: "applicationFirewall",
  components: {
    TimePolicyModal
  },
  data() {
    return {
      columns: [
        {
          title: "名称",
          key: "name",
          align: "left",
          render: (h, { row }) => {
            return h(
              "a",
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
          title: "开始时间",
          key: "begindaytime",
          align: "left"
        },
        {
          title: "结束时间",
          key: "enddaytime",
          align: "left"
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

            if (this.$store.getters.hasPermissionToCreate) {
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
            this.$Message.error(err.response.data.message);
          });
        }
      });
    }
  }
};
</script>

