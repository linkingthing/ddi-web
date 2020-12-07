<template>
  <div class="zoneQueryForward">
    <table-page
      title="转发区域"
      :data="dsliteList"
      :columns="columns"
      :total="total"
      :current.sync="current"
    >
      <template slot="top-right">
        <i-button
          type="primary"
          @click="handleOpenCreate"
        >新建</i-button>
      </template>
    </table-page>
    <zoneModal
      :links="paramsLinks"
      :visible.sync="visible"
      @success="getDataList"
    />
  </div>
</template>

<script>
import zoneModal from "./modules/zone-modal";

export default {
  components: { zoneModal },
  data() {
    return {
      columns: [
        {
          title: "转发类型",
          key: "domain",
          align: "left",
          width: 120,
          render: (h, { row }) => {
            const typeMap = {
              root: "根区",
              domain: "域名",
              domaingroup: "域名组"
            };
            return h("div", typeMap[row.nametype]);
          }
        },

        {
          title: "转发项",
          key: "forwardItem"
        },

        {
          title: "转发服务器组",
          key: "forwardtype",
          width: 150,
          render: (h, { row }) => {
            return h("div", row.forwarders.map(item => item.name).join(","));
          }
        },

        {
          title: "时间策略",
          key: "forwardtimepolicyname"
        },
        {
          title: "创建时间",
          key: "creationTimestamp",
          width: 190,
          render: (h, { row }) => {
            return h("div", this.$trimDate(row.creationTimestamp));
          }
        },
        {
          title: "备注",
          key: "comment"
        },
        {
          title: "操作",
          key: "action",
          width: 160,
          render: (h, { row }) => {
            return h("div", [
              h("btn-edit", {
                on: {
                  click: () => this.handleEdit(row)
                }
              }), h("btn-del", {
                on: {
                  click: () => this.delete(row)
                }
              })
            ]);
          }
        }
      ],
      viewId: "",
      total: 0,
      current: 0,
      dsliteList: [],
      visible: false,
      links: {},
      paramsLinks: {},
      domainGroupList: []
    };
  },
  watch: {
    current: {
      handler() {
        this.getDataList();
      }
    }
  },
  created() {
    this.viewId = this.$route.params.viewsId;
  },
  mounted() {
    this.getDataList();
    this.$getData({}, "/dns/dns/domaingroups").then(({ data }) => {
      this.domainGroupList = data;
    });
  },
  methods: {
    getDataList() {
      const params = {
        page_num: this.current,
        page_size: 10
      };
      this.$getData(params).then(({ data, links, pagination }) => {
        this.dsliteList = data.map(item => {
          const forwardItemMap = {
            root: "@",
            domain: item.domain,
            domaingroup: item.domaingroupids.map(item => this.domainGroupList.find(domain => domain.id === item).name || "").join(",")
          };
          const forwardItem = forwardItemMap[item.nametype];
          return {
            ...item,
            forwardItem
          };
        });
        this.links = links;
        this.total = pagination.total;
      }).catch(err => {
        this.$Message.error(err.message);
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
    // 删除
    delete({ links }) {
      this.$Modal.confirm({
        title: "提示",
        content: "确定删除？",
        onOk: () => {
          this.$delete({ url: links.remove }).then(res => {
            this.$Message.success("删除成功");
            this.getDataList();
          }).catch(err => {
            this.$$error(err.response.data.message);
          });

        }
      });
    }
  }
};
</script>

<style scoped>
.table-box table a {
  text-decoration: none;
}
</style>
