<template>
  <div class="ForwardView">
    <table-page
      title="转发视图"
      :data="list"
      :columns="columns"
      :total="total"
      :current.sync="current"
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
          key: "forwardZoneCount",
        },
        {
          title: "创建时间",
          key: "creationTimestamp",
          render: (h, { row }) => {
            return h("div", this.$trimDate(row.creationTimestamp))
          }
        }
      ],
      total: 0,
      current: 0,
      list: []
    };
  },
  watch: {
    current: {
      handler() {
        this.getManger();
      }
    }
  },
  methods: {
    getManger() {
      const params = {
        page_num: this.current,
        page_size: 10
      };
      services
        .getViewList(params)
        .then(({ data, pagination }) => {
          this.list = data;
          this.total = pagination.total;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

