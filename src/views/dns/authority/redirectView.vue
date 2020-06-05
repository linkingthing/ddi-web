<template>
  <div class>
    <table-page
      title="重定向视图"
      :data="list"
      :columns="columns"
      :paginationEnable="false"
    />
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
          title: "本地区配置数量",
          key: "localzonesize",
          align: "center"
        },
        {
          title: "NXDOMAIN重定向配置数量",
          key: "nxdomainsize",
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
