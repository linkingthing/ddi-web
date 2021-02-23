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
            <Button type="primary">地址规划</Button>
            <Button type="primary">信息上报</Button>
            <Button type="primary">查看地图</Button>
          </div>
        </div>

      </template>
    </table-page>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      loading: false,
      total: 0,
      list: [],
      columns: [{
        title: "机构名称",
        key: "semanticName"
      }, {
        title: "IPv6地址",
        key: "networkV6s",
        render: (h, { row }) => {
          const data = row.networkV6s.map(item => item.prefix)
          const ips = data.join(",");
          return <Tooltip placement="top">
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
      }, {
        title: "IPv4地址",
        key: "networkV4s",
        render: (h, { row }) => {
          const data = row.networkV4s.map(item => item.prefix)
          const ips = data.join(",");
          return <Tooltip placement="top">
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
      }, {
        title: "操作",
        key: "action",
        render: (h, { row }) => {
          return <div>
            <btn-line title="下发" />
            <btn-line title="详情" />
          </div>
        }
      }],
      query: {
        current: 0
      },
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getDataList();
  },
  mounted() { },
  methods: {
    getDataList() {
      this.$get({ url: "/apis/linkingthing.com/ipam_new/v1/semanticinfos" }).then(({ data }) => {
        this.list = data;
      })
    }
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