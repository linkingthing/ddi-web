<template>
  <div class="address-pool">

    <Tabs
      :value="subnetChild"
      style="margin: 60px 0 -75px"
      @on-click="handleChangeChild"
    >
      <TabPane
        label="地址池"
        name="pools"
      />
      <TabPane
        label="固定地址"
        name="reservations"
      />
      <TabPane
        label="前缀委派"
        name="pdpools"
      />
    </Tabs>

    <IviewLoading v-if="loading" />

    <TablePagination
      title="地址池管理"
      :data="tableData"
      :pagination-enable="false"
      :columns="columns"
    >
      <template slot="top-right">
        <Button
          type="primary"
          @click="handleAdd"
          class="top-button button-add"
        >
          新建
        </Button>
      </template>
    </TablePagination>

    <Edit
      :visible.sync="showEdit"
      :data="editData"
      :type="addressType"
      :subnet-id="subnetId"
      @success="handleQuery"
    />
  </div>
</template>

<style lang="less">
@import "./index.less";
</style>

<script>
import TablePagination from "@/components/TablePagination";
import Edit from "./edit";
import service from "@/services";
import { columns } from "./define";

import { getAddressType } from "@/util/common";

export default {
  components: {
    TablePagination,
    Edit
  },

  data() {
    return {
      subnetChild: "reservations",
      loading: false,
      keywords: "",
      tableData: [{

      }],
      columns: columns(this),
      showEdit: false,
      editData: null,
      subnetId: null,
      addressType: ""
    };
  },
  mounted() {
    const { address, subnetId } = this.$route.query;

    this.subnetId = subnetId;
    this.address = address;

    this.addressType = getAddressType(address);

  },
  methods: {
    handleChangeChild(child) {
      const { path } = this.$route;
      const pathSplit = path.split("/");
      pathSplit[pathSplit.length - 1] = child;
      this.$router.push({ path: pathSplit.join("/") });
    },

    async handleQuery() {
      this.loading = true;

      try {
        const action = this.addressType === "ipv4" ? "getIPv4AddressPoolList" : "getIPv6AddressPoolList";

        let { status, data, message } = await service[action](this.subnetId);

        if (status === 200) {
          this.tableData = data.data.map(item => {
            item.creationTime = item.embedded.creationTimestamp ? item.embedded.creationTimestamp.replace(/(T|Z)/g, " ") : "";
            item.usage = item.usage + "%";

            return item;
          });
        }
        else {
          Promise.reject({ message: message || "查询失败！" });
        }
      }
      catch (err) {
        console.error(err);

        this.$$error(err.message);
      }
      finally {
        this.loading = false;
      }
    },

    handleAdd() {
      this.showEdit = true;
      this.editData = null;
    },

    handleEdit(data) {
      this.showEdit = true;
      this.editData = { ...data };
    },

    async handleDelete(data) {
      try {
        await this.$$confirm({ content: "您确定要删除当前数据吗？" });

        this.loading = true;

        const action = this.addressType === "ipv4" ? "deleteIPv4AddressPool" : "deleteIPv6AddressPool";

        let { status, message } = await service[action](this.subnetId, data.embedded.id);

        status = +status;

        if (status === 200 || status === 204) {
          this.$$success("删除成功！");

          this.handleQuery();
        }
        else {
          Promise.reject({ message: message || "删除失败！" });
        }
      }
      catch (err) {
        console.error(err);

        this.$$error(err.message);
      }
      finally {
        this.loading = false;
      }
    }
  }
};
</script>