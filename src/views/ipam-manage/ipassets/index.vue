<template>
  <div class="ipassets">
    <div class="search-box">
      <Input
        v-model="search"
        style="width: 300px"
        placeholder="请输入IP检索"
      />
      <Button
        type="primary"
        @click="handleSearch"
      >搜索</Button>
    </div>
    <table-page
      :data="dataList"
      :columns="columns"
      :total="total"
      :current.sync="current"
    />
    <common-modal
      :visible.sync="visible"
      :width="750"
      :title="currentRow.ip"
      @confirm="visible = false"
    >
      <Table
        :data="currentRow.schedules"
        :columns="detailLColumns"
      />
    </common-modal>

  </div>
</template>



<script>

import { typeLegends } from "../network-interface/define";
export default {
  components: {},
  props: {},
  data() {
    return {
      dataList: [],
      columns: [{
        title: "IP地址",
        key: "ip"
      },
      {
        title: "历史详情",
        key: "action",
        render: (h, { row }) => {
          return h("a", {
            attr: {
              href: "javascript:;"
            },
            on: {
              click: () => this.handleOpenDetail(row)
            }
          }, "查看");
        }
      }],
      total: 0,
      current: 0,
      search: "",
      visible: false,
      currentRow: {},
      detailLColumns: [
        {
          title: "MAC",
          key: "mac",
        },
        {
          title: "地址类型",
          key: "ipType",
          render: (h, { row }) => {
            return h("div", typeLegends.find(item => item.type === row.ipType).label);
          }
        }, {
          title: "时间",
          key: "time",
          render: (h, { row }) => {
            return h("div", this.$trimDate(row.time));
          }
        }
      ]

    };
  },
  computed: {},
  watch: {
    current() {
      this.getDataList();
    }
  },
  created() { },
  mounted() { },
  methods: {
    getDataList() {
      const params = {
        page_num: this.current,
        page_size: 10
      };
      if (this.search !== "") {
        params.ip = this.search.trim();
      }
      const { url } = this.$getApiByRoute();
      this.$get({ url, params }).then(({ data, pagination }) => {
        this.dataList = data;
        this.current = pagination.pageNum;
        this.total = pagination.total;
      });
    },
    handleSearch() {
      this.getDataList();
    },
    handleOpenDetail(row) {
      this.visible = true;
      this.currentRow = row;
    }
  }
};
</script>

<style lang="less" scoped>
.ipassets {
  position: relative;
}
.search-box {
  position: absolute;
  z-index: 101;
  right: 10px;
  top: 14px;
}
</style>