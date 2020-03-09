<template>
  <div class="zoneQueryForward">
    <table-page title="转发区域" :data="dsliteList" :columns="columns" :paginationEnable="false" />
  </div>
</template>

<script>
import services from "@/services";

export default {
  name: "dsliteAnalysis",
  data() {
    return {
      columns: [
        {
          title: "域名",
          key: "name",
          align: "center",
          render: (h, { row }) => {
            return h(
              "router-link",
              {
                props: {
                  to: {
                    name: "forwardList",
                    query: {
                      viewId: this.viewId,
                      zoneId: row.id,
                      name: row.name
                    }
                  }
                }
              },
              row.name
            );
          }
        },
        {
          title: "转发地址数量",
          key: "forwardsize",
          algin: "center"
        },
        {
          title: "创建时间",
          key: "creationTimestamp",
          algin: "center"
        }
      ],
      viewId: "",
      dsliteList: []
    };
  },
  created() {
    this.viewId = this.$route.query.id;
  },
  mounted() {
    this.getManger();
  },
  methods: {
    getManger() {
      services
        .getZoneByViewId(this.viewId)
        .then(res => {
          this.dsliteList = res.data.data;
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
