<template>
  <div class>
    <table-page
      title="权威管理"
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
  name: "configGroupMg",
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
                    name: "urlredirects",
                    params: { id: row.id }
                  }
                }
              },
              row.name
            );
          }
        },
        {
          title: "重定向数量",
          key: "urlRedirectCount",
        },
      ],
      list: [],
      current: 0,
      total: 0
    };
  },
  watch: {
    current: {
      handler() {
        this.getConfig();
      }
    }
  },

  methods: {
    getConfig() {
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
        .catch(function (err) {
          console.log(err);
        }).finally(() => this.loading = false);
    }
  }
};
</script>