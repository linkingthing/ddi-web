<template>
  <div class="A4ComposeView">
    <table-page title="A4地址合成" :data="list" :columns="columns" :paginationEnable="false" />
    <createDefaultA4 ref="networkRef"></createDefaultA4>
    <editDefaultA4 ref="subnetRef"></editDefaultA4>
  </div>
</template>

<script>
import services from "@/services";
import createDefaultA4 from "./createDefaultA4";
import editDefaultA4 from "./editDefaultA4";

export default {
  name: "A4ComposeView",
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
                    name: "A4Compose",
                    query: {
                      id: row.id,
                      dns64s: row.links.dns64s,
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
          title: "规则数量",
          key: "dns64size",
          align: "center"
        },
        {
          title: "创建时间",
          key: "creationTimestamp",
          align: "center"
        }
      ],
      list: [],
      id: "",
      name: "",
      remove: "",
      modal1: false,
      priority: "",
      acls: [],
      dns64s: ""
    };
  },
  components: {
    createDefaultA4,
    editDefaultA4
  },
  mounted() {
    this.getView();
  },
  methods: {
    getView() {
      services
        .getViewList()
        .then(res => {
          this.list = res.data.data;
          for (var key in this.list) {
            this.dns64s = this.list[key].links.dns64s;
          }
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
