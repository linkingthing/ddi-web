<template>
  <div class="ForwardView">
    <table-page
      title="转发视图"
      :data="list"
      :columns="columns"
      :pagination-enable="false"
    />
  </div>
</template>

<script>
import services from "@/services";

export default {
  name: "applicationFirewall",
  data() {
    return {
      columns: [
        {
          title: "视图",
          key: "name",
          align: "left",
          render: (h, { row }) => {
            return h(
              "router-link",
              {
                props: {
                  to: {
                    name: "zone-query-forward",
                    params: { viewsId: row.id }
                  }
                }
              },
              row.name
            );
          }
        },
        {
          title: "域名数量",
          key: "forwardzonesize",
          align: "center"
        },
        {
          title: "创建时间",
          key: "creationTimestamp",
          align: "right",
          render: (h, { row }) => {
            return h("div", this.$trimDate(row.creationTimestamp))
          }
        }
      ],
      list: []
    };
  },
  mounted() {
    this.getManger();
  },
  methods: {
    getManger() {
      services
        .getViewList()
        .then(res => {
          this.list = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

