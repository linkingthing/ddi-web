<template>
  <div class="address-pool">
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
      :links="links"
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

export default {
  components: {
    TablePagination,
    Edit
  },

  data() {
    return {
      loading: false,
      keywords: "",
      tableData: [],
      columns: [
        {
          title: "开始地址",
          key: "beginAddress",
          align: "center"
        },
        {
          title: "结束地址",
          key: "endAddress",
          align: "center"
        },
        {
          title: "操作",
          align: "right",
          render: (h, { row }) => {
            return h("div", [
              h("btn-edit", {
                on: {
                  click: () => {
                    this.handleEdit(row);
                  }
                }
              }),
              h("btn-del", {
                on: {
                  click: () => {
                    this.handleDelete(row);
                  }
                }
              })
            ]);
          }
        }
      ],
      showEdit: false,
      links: {}
    };
  },
  mounted() {
    this.handleQuery();
  },
  methods: {

    handleQuery() {
      this.loading = true;

      this.$axios.get(this.$getApiByRoute().url).then(({ data: { data, links } }) => {
        this.tableData = data;
        this.links = links;
      }).catch().finally(() => {
        this.loading = false;
      });

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