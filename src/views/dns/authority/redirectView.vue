<template>
  <div class>
    <table-page title="重定向视图" :data="list" :columns="columns" :paginationEnable="false" />
  </div>
</template>

<script>
import services from "@/services";

export default {
  name: "parameterSet",
  data() {
    return {
      columns: [
        {
          title: "视图",
          key: "name",
          align: "center",
          render: (h, { row }) => {
            return h(
              "router-link",
              {
                props: {
                  to: {
                    name: "redirect",
                    query: { id: row.id, name: row.name }
                  }
                }
              },
              row.name
            );
          }
        },
        {
          title: "重定向配置数量",
          key: "rpzsize",
          align: "center"
        },
        {
          title: "NXDOMAIN重定向配置数量",
          key: "redirectsize",
          align: "center"
        }
      ],
      list: [],
      id: ""
    };
  },
  mounted() {
    this.getView();
  },
  methods: {
    goConfig(type) {
      if (type == 0) {
        this.$refs.deviceRef.openConfig();
      }
    },
    getView() {
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

<style scoped>
.table-box table a {
  text-decoration: none;
}
</style>
