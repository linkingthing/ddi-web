<template>
  <div class="ip-info-manage">
    <table-page
      :loading="loading"
      :total="total"
      :data="list"
      :columns="columns"
      :current.sync="query.current"
    >

      <template slot="neck">
        <div class="neck">
          <Input
            style="width: 270px"
            search
            enter-button="搜索"
            placeholder="请输入机构名称关键字"
          />
          <div class="neck-handle">
            <Button
              type="primary"
              @click="$router.push({name: 'ipam-address-plan'})"
            >地址规划</Button>
            <Button type="primary">信息上报</Button>
            <Button
              type="primary"
              @click="handleOpenMap"
            >查看地图</Button>
          </div>
        </div>

      </template>
    </table-page>

    <Modal
      v-model="mapVisible"
      fullscreen
      :title="mapTitle"
      class="mapModal"
      footer-hide
    >
      <PlanTree :data="treeData" />
    </Modal>

    <Modal
      v-model="detailVisible"
      title="详情"
      footer-hide
    >

      <common-tab
        class="tab-box"
        style="margin-bottom: 16px"
        @change="handleTab"
        :active="tab"
        :tab-list="tabList"
      />

      <Table
        :loading="detailLoading"
        border
        :data="detailData"
        :columns="detailColumns"
      />

    </Modal>
  </div>
</template>

<script>

import PlanTree from "../address-plan/modules/PlanTree";
import { list2Tree } from "../address-plan/modules/helper";


export default {
  components: {
    PlanTree
  },
  props: {},
  data() {
    this.tabList = [{
      id: "list_v6",
      label: "Ipv6子网",
    }, {
      id: "list_v4",
      label: "Ipv4子网",
    }];
    return {
      loading: false,
      total: 0,
      list: [],
      columns: [{
        title: "机构名称",
        key: "name"
      }, {
        title: "IPv6地址",
        key: "networkV6s",
        render: (h, { row }) => {
          if (Array.isArray(row.networkV6s)) {
            const data = row.networkV6s.map(item => item.prefix)
            const ips = data.join(",");
            return <Tooltip >
              <span>{ips}</span>
              <div slot="content">
                {
                  data.map(item => {
                    return <p>{item}</p>
                  })
                }
              </div>
            </Tooltip>
          }

        }
      }, {
        title: "IPv4地址",
        key: "networkV4s",
        render: (h, { row }) => {
          if (Array.isArray(row.networkV4s)) {
            const data = row.networkV4s.map(item => item.prefix)
            const ips = data.join(",");
            return <Tooltip >
              <span>{ips}</span>
              <div slot="content">
                {
                  data.map(item => {
                    return <p>{item}</p>
                  })
                }
              </div>
            </Tooltip>
          }

        }
      }, {
        title: "操作",
        key: "action",
        width: 150,
        render: (h, { row }) => {
          return <div>
            <btn-line title="下发" />
            <btn-line title="详情" onClick={() => this.handleOpenDetailModal(row)} />
          </div>
        }
      }],
      query: {
        current: 0
      },

      mapVisible: false,
      mapTitle: "",
      treeData: [],

      links: {},
      current: {},

      detailVisible: false,
      tab: "list_v6",
      detailLoading: false,
      detailColumns: [{
        title: "子网名称",
        key: "name",
      }, {
        title: "子网类型",
        key: "networkType",
      }, {
        title: "业务",
        key: "business",
      }, {
        title: "子网地址",
        key: "prefix",
      }],
      detailData: [],

    };
  },
  computed: {},
  watch: {

  },
  created() {
    this.getDataList();
  },
  mounted() { },
  methods: {
    getDataList() {
      this.loading = true;
      this.$get({ url: "/apis/linkingthing.com/ipam/v1/semanticinfos" }).then(({ data }) => {
        if (Array.isArray(data) && data.length) {
          const [{ links }] = data;
          this.getItemList(links);
          this.links = links;

        }
      }).catch(err => {
        this.loading = false;
      })
    },
    getItemList(links) {
      this.$post({ url: `${links.self}?action=list_semantic_info` }).then(({ semanticTree }) => {
        this.list = semanticTree;
      }).catch().finally(() => {
        this.loading = false;
      })
    },

    handleOpenDetailModal(row) {
      this.detailVisible = true;
      this.current = row;
      this.getDetail();

    },

    handleTab(_, tab) {
      this.tab = tab.id;
      this.getDetail();

    },

    getDetail(action = this.tab) {
      const params = {
        semanticId: this.current.id
      };
      this.detailLoading = true;
      this.$post({ url: `${this.links.self}?action=${action}`, params }).then(data => {
        if (Array.isArray(data)) {
          this.detailData = data;
        } else {
          this.detailData = [];
        }
      }).finally(() => {
        this.detailLoading = false;
      });
    },

    handleOpenMap() {
      this.mapVisible = true;
      this.mapTitle = "规划树";
      this.treeData = list2Tree(this.list, "root");
    },

  }
};
</script>

<style lang="less" scoped>
.neck {
  display: flex;
  padding: 24px 26px 0;
  .neck-handle {
    margin-left: auto;
    .ivu-btn {
      margin-left: 10px;
    }
  }
}
</style>

<style lang="less">
.mapModal {
  .ivu-modal-header {
    background: #f1f1f1;
  }
  .ivu-modal-body {
    background-image: url("./box-bg.png");
  }
}
</style>