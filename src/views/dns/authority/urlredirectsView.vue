<template>
  <div class>
    <table-page
      title="权威管理"
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
          key: "urlRedirectSize",
          align: "center"
        },
      ],
      list: [],
      current: 1,
      total: 0
    };
  },
  mounted() {
    this.getConfig();
  },
  methods: {
    getConfig() {
      services
        .getViewList()
        .then(res => {
          this.list = res.data.data;
          this.total = this.list.length;
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  }
};
</script>