<template>
  <div class>
    <table-page
      title="权威管理"
      :data="list"
      :columns="columns"
      :current="current"
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
          align: "center",
          render: (h, { row }) => {
            return h(
              "router-link",
              {
                props: {
                  to: {
                    name: "authority-zone-query",
                    params: { id: row.id }
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
          title: "记录数",
          key: "rrsize",
          align: "center"
        },
        {
          title: "优先级",
          key: "priority",
          align: "center"
        },
        {
          title: "访问控制",
          key: "action",
          align: "center",
          render: (h, { row }) => {
            return h("Tags", {
              props: {
                list: row.acls
              }
            });
          }
        },
        {
          title: "DNS64",
          key: "dns64",
          align: "center"
        }
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