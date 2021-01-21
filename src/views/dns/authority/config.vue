<template>
  <div class>
    <table-page
      title="权威管理"
      :data="list"
      :columns="columns"
      :current.sync="query.current"
      :total="total"
    >
      <template slot="top-right">
        <SearchBar
          style="margin:0"
          :params="query"
          @on-search="handleSearch"
        >
          <template slot="operate">

          </template>
        </SearchBar>

      </template>
    </table-page>
  </div>
</template>

<script>
import services from "@/services";
import SearchBar from "./modules/SearchBarForView";
import _ from "lodash";


export default {
  name: "configGroupMg",
  components: {
    SearchBar
  },
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
          title: "主区数量",
          key: "masterZoneCount"
        },
        {
          title: "辅区数量",
          key: "slaveZoneCount"
        },
        {
          title: "记录数",
          key: "rrCount",
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
      total: 0,
      query: {
        current: 1
      }
    };
  },

  watch: {
    "$route.query": {
      deep: true,
      immediate: true,
      handler(value) {
        this.query = _.cloneDeep(value);
        this.getConfig(value);
      }
    }
  },


  methods: {
    handleSearch(query) {
      this.$router.replace({
        query: { ..._.cloneDeep(this.$route.query), ..._.cloneDeep(query) }
      });
    },
    getConfig(query = this.query) {
      const params = query;
      params.page_size = 10;
      params.page_num = +query.current || 1;

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