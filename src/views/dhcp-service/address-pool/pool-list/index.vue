<template>
  <div class="address-pool">
    <IviewLoading v-if="loading" />

    <TablePagination
      title="地址池管理"
      :data="tableData"
      :total="total"
      :columns="columns"
      :current.sync="current"
    >
      <template slot="top-right">
        <Button
          type="primary"
          @click="handleAdd"
          v-if="$hasPermissionCreate('pool')"
          class="top-button button-add"
        >
          新建
        </Button>
      </template>
    </TablePagination>

    <Edit
      :visible.sync="showEdit"
      :links="links"
      @success="getDataList"
      :version="version"
    />
  </div>
</template>

<style lang="less">
@import "./index.less";
</style>

<script>
import TablePagination from "@/components/TablePagination";
import Edit from "./edit";

export default {
  components: {
    TablePagination,
    Edit
  },
  props: {
    version: {
      type: Number,
      default: null
    }
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
          align: "left"
        },
        {
          title: "结束地址",
          key: "endAddress"
        },
        {
          title: "已使用/未使用",
          key: "usedCount",
          render: (h, {row}) => {
            return <div>{row.usedCount}/{row.capacity}</div>
          }
        },
        {
          title: "操作",
          render: (h, { row }) => {
            return h("div", [
              // h("btn-edit", {
              //   on: {
              //     click: () => {
              //       this.handleEdit(row);
              //     }
              //   }
              // }),
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
      links: {},
      current: 0,
      total: 0
    };
  },
  watch: {
    current() {
      this.getDataList();
    },
    
  },
  created() {
  },
  methods: {

    getDataList() {
      this.loading = true;
      const params = {
        page_num: this.current,
        page_size: 10
      };
      this.$axios.get(this.$getApiByRoute().url, { params }).then(({ data, links, pagination }) => {
        this.tableData = data;
        this.links = links;
        this.total = pagination.total;
        this.current = pagination.pageNum;
      }).catch().finally(() => {
        this.loading = false;
      });

    },

    handleAdd() {
      this.showEdit = true;
      this.editData = null;
    },

    handleEdit({ links }) {
      this.showEdit = true;
      this.links = links;
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

    }
  }
};
</script>