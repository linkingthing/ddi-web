<template>
  <div class="A4ComposeView">
    <table-page
      title="4A地址合成视图"
      :data="list"
      :columns="columns"
      :total="list.length"
    />
    <createDefaultA4 ref="networkRef" />
    <editDefaultA4 ref="subnetRef" />
  </div>
</template>

<script>
import services from "@/services";
import createDefaultA4 from "./createDefaultA4";
import editDefaultA4 from "./editDefaultA4";

export default {
  name: "A4ComposeView",
  components: {
    createDefaultA4,
    editDefaultA4
  },
  data() {
    return {
      columns: [
        {
          title: "视图",
          key: "name",
          render: (h, { row }) => {
            return h(
              "router-link",
              {
                props: {
                  to: {
                    name: "a4-compose",
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
        },
        {
          title: "创建时间",
          key: "creationTimestamp",
          render: (h, { row }) => {
            return h("div", this.$trimDate(row.creationTimestamp));
          }
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
  mounted() {
    this.getView();
  },
  methods: {
    getView() {
      services
        .getViewList()
        .then(({ data }) => {
          this.list = data;
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
