<template>
  <div class>
    <table-page
      title="权威管理"
      :data="list"
      :columns="columns"
      :current.sync="current"
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
          align: "left",
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
          key: "masterzonesize",
        },
        {
          title: "记录数",
          key: "rrsize",
        },
        {
          title: "优先级",
          key: "priority",
        },
        {
          title: "访问控制",
          key: "action",
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
        }
      ],
      list: [],
      current: 0,
      total: 0
    };
  },
  watch: {
    current() {
      this.getConfig();
    }
  },

  methods: {
    getConfig() {
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
        .catch(function (err) {
          console.log(err);
        });
    }
  }
};
</script>