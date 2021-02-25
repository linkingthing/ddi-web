<template>
  <div class="subnet-type">
    <table-page
      :loading="loadingPage"
      :data="dataList"
      :columns="columns"
      :total="total"
      :current.sync="current"
    >
      <template slot="top-right">

        <Button
          type="primary"
          @click="handleClickOpenToCreate"
        >新建子网类型</Button>

      </template>
    </table-page>

    <SubnetTypeModal
      :visible.sync="visible"
      :links="paramsLinks"
      @success="getList"
    />
  </div>
</template>

<script>
import SubnetTypeModal from "./subnet-type-modal";

const presetSubnetTypeMap = {
  guest: "访客子网",
  management: "管理子网",
  office: "办公子网",
  server: "服务器子网",
  vpn: "VPN子网"
}

export default {
  components: {
    SubnetTypeModal
  },
  props: {},
  data() {
    this.columns = [{
      title: "子网类型",
      key: "name",
      render: (h, { row }) => {
        return h("div", row.custom ? row.name : presetSubnetTypeMap[row.name])
      }
    }, {
      title: "备注",
      key: "comment",
    }, {
      title: "操作",
      key: "",
      render: (h, { row }) => {
        return h("div", [
          h("btn-del", {
            style: {
              display: row.custom ? "inline-block" : "none"
            },
            on: {
              click: () => this.handleDelete(row)
            }
          }),
          // h("btn-edit", {
          //   props: {
          //     title: ""
          //   },
          //   on: {
          //     click: () => this.handleEdit(row)
          //   }
          // })
        ])
      }
    }];
    return {
      loadingPage: false,
      dataList: [],
      total: 0,
      current: 0,
      links: {},

      visible: false,
      paramsLinks: {},


    };
  },
  computed: {},
  watch: {
    current() {
      this.getList();
    }
  },
  created() { },
  mounted() { },
  methods: {
    getList() {

      const params = {
        page_size: 10,
        page_num: this.current
      }
      this.loadingPage = true;
      this.$get({ url: "/apis/linkingthing.com/ipam/v1/networktypes", params }).then(({ data, links, pagination }) => {
        this.dataList = data;
        this.links = links;
        this.total = pagination.total;
        this.current = pagination.pageNum;
      }).finally(() => {
        this.loadingPage = false;
      });
    },
    handleClickOpenToCreate() {
      this.visible = true;
      this.paramsLinks = this.links;
    },
    handleEdit({ links }) {
      this.visible = true;
      this.paramsLinks = links;
    },
    handleDelete({ links }) {
      this.$Modal.confirm({
        title: "删除提示",
        content: "请再次确定是够删除该记录？",
        onOk: () => {
          this.$delete({ url: links.remove }).then(() => {
            this.$Message.success("删除成功");
            this.getList();
          }).catch(err => {
            this.$Message.error(err.response.data.message);
          })
        }
      });

    }
  }
};
</script>

<style lang="less" scoped>
</style>