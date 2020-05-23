<template>
  <div class="ForwardView">
    <table-page
      title="转发视图"
      :data="list"
      :columns="columns"
      :pagination-enable="false" />
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
                    query: { id: row.id, name: row.name }
                  }
                }
              },
              row.name
            );
          }
        },
        {
          title: "域名数量",
          key: "zonesize",
          align: "center"
        },
        {
          title: "创建时间",
          key: "creationTimestamp",
          align: "right"
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

