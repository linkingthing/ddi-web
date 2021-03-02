<template>
  <div class="address-pool">
    <IviewLoading v-if="loading" />

    <TablePagination
      title="地址池管理"
      :data="tableData"
      :columns="columns"
      :total="total"
      :current.sync="current"
    >
      <template slot="neck">
        <div class="address-pool-search">

          <CommonTab
            :active="String(active)"
            :tab-list="tabList"
            @change="(value) => { active = +value }"
          />

          <div class="address-pool-search-right">
            <Input
              search
              enter-button
              placeholder="请输入子网地址"
              v-model="search.subnet"
              @on-search="handleSearch"
              style="width: 200px;margin-right: 20px"
            />
            <Button
              type="primary"
              @click="handleAdd"
              class="top-button button-add"
            >
              新建
            </Button>
          </div>
        </div>

      </template>
    </TablePagination>
    <Edit
      :version="active"
      :visible.sync="showEdit"
      :links="links"
      @success="getDataList"
    />
  </div>
</template>

<style lang="less">
@import "./index.less";
</style>

<script>
import TablePagination from "@/components/TablePagination";
import Edit from "./edit";
import CommonTab from "@/components/CommonTab";

import { columns } from "./define";

export default {
  components: {
    TablePagination,
    Edit,
    CommonTab
  },

  data() {
    this.tabList = [{
      id: "4",
      label: "IPv4"
    }, {
      id: "6",
      label: "IPv6"
    }];

    return {
      active: 4,

      loading: true,
      keywords: "",
      search: {
        subnet: ""
      },
      tableData: [],
      columns: columns(this),
      showEdit: false,
      links: {},
      total: 0,
      current: 0
    };
  },

  watch: {
    current() {
      this.getDataList();
    },
    active() {
      this.getDataList();
    }
  },
  mounted() {
    this.openToCreate();
  },

  methods: {
    handleSearch() {

      this.getDataList(this.search.subnet.trim() || null);
    },
    openToCreate() {
      const { ipnet } = this.$route.query;

      if (ipnet) {
        this.showEdit = true;
        this.links = {
          create: "/apis/linkingthing.com/dhcp/v1/subnets"
        };
      }
    },
    handleAdd() {
      this.showEdit = true;
      this.links = {
        create: "/apis/linkingthing.com/dhcp/v1/subnets"
      };
    },

    getDataList(subnet = null) {
      const params = {
        page_num: this.current,
        page_size: 10,
        subnet,
        version: this.active
      };
      this.$getData(params).then(({ data, pagination }) => {
        this.loading = false;
        this.tableData = data;
        this.total = pagination.total;
      }).catch().finally(() => {
        this.loading = false;
      });

    },
    handleDelete({ links }) {
      this.$Modal.confirm({
        title: "您确定要删除当前数据吗？",
        onOk: () => {
          this.$delete({ url: links.remove }).then(res => {
            this.$Message.info("删除成功");
            this.getDataList();
          }).catch(err => {
            this.$Message.error(err.response.data.message);
          });
        },
        onCancel: () => {
          this.$Message.info("取消删除");
        }
      });

    },
    handleEdit({ links }) {
      this.links = links;
      this.showEdit = true;
    }

  }
};
</script>

<style lang="less">
.address-pool-search {
  display: flex;
  padding: 20px 26px 0;

  .address-pool-search-right {
    margin-left: auto;
    display: flex;
  }
}
</style>