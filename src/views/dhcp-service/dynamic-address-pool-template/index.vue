<template>
  <div class="dynamic-address-pool-template">
    <table-page
      :data="tableData"
      :columns="columns"
      :total="total"
      :loading="loading"
      :current.sync="current"
    >
      <template slot="neck">
        <div class="pool-template">
          <CommonTab
            :active="active"
            :tab-list="tabList"
            @change="(value) => { active = value }"
          />
          <Button
            type="primary"
            @click="handleAdd"
            class="pool-template-btn"
          >
            新建
          </Button>
        </div>

      </template>
    </table-page>

    <TemplateModal
      :visible.sync="visible"
      :links="currentLinks"
      :version="active"
      @success="getDataList"
    />
  </div>
</template>

<script>
import TemplateModal from "./modules/TemplateModal";
import CommonTab from "@/components/CommonTab";

export default {
  components: {
    TemplateModal,
    CommonTab
  },
  props: {},
  data() {
    this.tabList = [{
      id: "4",
      label: "IPv4"
    }, {
      id: "6",
      label: "IPv6"
    }];

    return {
      active: "4",

      loading: false,
      tableData: [],
      total: 0,
      current: 0,
      currentLinks: {},
      links: {},
      visible: false,
    };
  },
  computed: {

    columns() {
      const frontList = [{
        title: "模板名称",
        key: "name"
      }, {
        title: "地址起始位置",
        key: "beginOffset"
      }, {
        title: "地址数量",
        key: "capacity"
      }, {
        title: "DNS",
        key: "domainServers",
        render: (h, { row }) => {
          return <common-table-tool-tip value={row.domainServers} />
        }
      }]

      const endList = [{
        title: "备注",
        key: "comment"
      }, {
        title: "操作",
        key: "",
        width: 140,
        render: (h, { row }) => {
          return (
            <div>
              <btn-edit onClick={() => this.handleEdit(row)} />
              <btn-del onClick={() => this.handleDelete(row)} />
            </div>
          )
        }
      }];

      const middleList = [];

      if (this.active === "4") {
        middleList.push({
          title: "默认网关",
          key: "routers",
          render: (h, { row }) => {
            return <common-table-tool-tip value={row.routers} />
          }
        }, {
          title: "OPTION60",
          key: "clientClass"
        });
      }


      return [...frontList, ...middleList, ...endList];
    },

  },
  watch: {
    current() {
      this.getDataList();
    },
    active() {
      this.getDataList();
    }
  },
  created() { },
  mounted() { },
  methods: {
    getDataList() {
      this.loading = true;
      const params = {
        version: this.active
      }
      this.$get({ url: "/apis/linkingthing.com/dhcp/v1/pooltemplates", params }).then(({ data, links }) => {
        this.tableData = data;
        this.links = links;
      }).catch(err => {
        this.$Message.error(err.response.data.message);
      }).finally(() => {
        this.loading = false;
      });
    },
    handleAdd() {
      this.currentLinks = this.links;
      this.visible = true;
    },
    handleEdit({ links }) {
      this.currentLinks = links;
      this.visible = true;
    },
    handleDelete({ links }) {
      this.$Modal.confirm({
        title: "删除提示",
        content: "请在此确认是否删除该记录？",
        onOk: () => {
          this.$delete({ url: links.remove }).then(() => {
            this.$Message.info("删除成功");
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

<style lang="less" scoped>
.pool-template {
  display: flex;
  padding: 16px 26px 0;
  .pool-template-btn {
    margin-left: auto;
  }
}
</style>