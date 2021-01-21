<template>
  <div class>
    <table-page
      title="重定向视图"
      :loading="loading"
      :data="list"
      :columns="columns"
      :current.sync="current"
      :total="total"
    />
  </div>
</template>

<script>
import services from "@/services";

export default {
  name: "parameterSet",
  data() {
    return {
      loading: false,
      columns: [
        {
          title: "视图名称",
          key: "name",
          align: "left",
          render: (h, { row }) => {
            return h(
              "router-link",
              {
                props: {
                  to: {
                    name: "redirect",
                    params: { id: row.id, name: row.name }
                  }
                }
              },
              row.name
            );
          }
        },
        {
          title: "重定向配置数量",
          key: "localZoneCount",
        },
        {
          title: "NXDOMAIN重定向配置数量",
          key: "nxdomainCount",
        },
        {
          title: "创建时间",
          key: "creationTimestamp",
          render: (h, { row }) => {
            return h("div", this.$trimDate(row.creationTimestamp));
          }
        }
      ],
      current: 0,
      total: 0,
      list: [],
      id: ""
    };
  },
  watch: {
    current: {
      handler() {
        this.getView();

      }
    }
  },
  methods: {
    getView() {
      const params = {
        page_num: this.current,
        page_size: 10
      };
      this.loading = true;
      services
        .getViewList(params)
        .then(({ data, pagination }) => {
          this.list = data;
          this.total = pagination.total;
        })
        .catch(err => {
          console.log(err);
        }).finally(() => this.loading = false);
    }
  }
};
</script>

<style scoped>
.table-box table a {
  text-decoration: none;
}
</style>
