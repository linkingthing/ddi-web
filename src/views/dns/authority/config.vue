<template>
  <div class>
    <table-page
      title="权威管理"
      :data="list"
      :columns="columns"
      :pagination-enable="false" />
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
          align: "center",
          render: (h, { row }) => {
            return h(
              "router-link",
              {
                props: {
                  to: {
                    name: "authority-zone-query",
                    query: { id: row.id, name: row.name }
                  }
                }
              },
              row.name
            );
          }
        },
        {
          title: "区数量",
          key: "zonesize",
          align: "center"
        },
        {
          title: "优先级",
          key: "priority",
          align: "center"
        },
        {
          title: "访问控制列表",
          key: "action",
          align: "center",
          render: (h, { row }) => {
            return h("Tags", {
              props: {
                list: row.acls
              }
            });
          }
        }
      ],
      list: [],
      IP: [],
      id: "",
      name: "",
      modal1: false,
      aclids: [],
      zones: "",
      areaList: [],
      number: ""
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
          for (var key in this.list) {
            this.id = this.list[key].id;
            this.name = this.list[key].name;
            this.priority = this.list[key].priority;
            this.aclids = this.list[key].aclids;
            this.zones = this.list[key].links.zones;
            this.zonesize = this.list[key].links.zonesize;
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  }
};
</script>