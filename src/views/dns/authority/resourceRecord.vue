<template>
  <div class>
    <table-page
      title="资源记录"
      :data="resList"
      :columns="columns"
      :total="total"
      :current.sync="query.current"
    >

      <template slot="neck">
        <SearchBar
          :params="query"
          @on-search="handleSearch"
        >
          <template slot="operate">

            <i-button
              type="primary"
              v-if="showCreate"
              @click="handleOpenCreate(viewId,zoneId)"
            >新建</i-button>

            <import-export-csv
              style="margin-left: 20px;"
              :links="links"
              @on-import-success="onImportSuccess"
              resource="记录"
              download-only
            />
          </template>
        </SearchBar>

      </template>
    </table-page>
    <createResource
      ref="configRef"
      :record-suffix="recordSuffix"
      @onCreateSuccess="getResources"
    />
    <editResource
      ref="analysisRef"
      :record-suffix="recordSuffix"
      @onEditSuccess="getResources"
    />
  </div>
</template>

<script>
import services from "@/services";
import createResource from "./createResource";
import editResource from "./editResource";
import { getParantData } from "@/util/request";
import _ from "lodash";
import SearchBar from "./modules/SearchBarForRRs";


export default {
  name: "resourceRecord",
  components: {
    createResource,
    editResource,
    SearchBar
  },
  data() {
    return {
      columns: [
        {
          title: "记录名称",
          key: "name",
          align: "left"
        },
        {
          title: "类型",
          key: "rrType"
        },
        {
          title: "记录值",
          key: "rdata"
        },
        {
          title: "TTL",
          key: "ttl"
        },
        {
          title: "备注",
          key: "comment",
          tooltip: true
        },
        {
          title: "操作",
          key: "action",
          width: 200,
          render: (h, { row }) => {
            if (!this.showOperate) {
              return h("div");
            }
            return h("div", [
              h("btn-edit", {
                class: "k-btn",
                on: {
                  click: () => {
                    this.goAnalysis(this.viewId, this.zoneId, row.id);
                  }
                }
              }),
              h("btn-del", {
                class: "k-btn",
                on: {
                  click: () => {
                    this.delect(row.id);
                  }
                }
              }),
              h("btn-line", {
                props: {
                  title: !row.enabled ? "启用" : "停用"
                },
                on: {
                  click: () => this.handleToggleUse(row)
                }
              })
            ]);
          }
        }
      ],
      viewId: "",
      zoneId: " ",
      resList: [],
      total: 0,
      current: 0,
      recordSuffix: "",
      role: "",

      query: {
        current: 1
      },
      links: {}
    };
  },

  computed: {
    isSlave() {
      return this.role === "slave";
    },
    showCreate() {
      return !this.isSlave;
    },
    showOperate() {
      return !this.isSlave;
    }
  },

  watch: {
    "$route.query": {
      deep: true,
      immediate: true,
      handler(value) {
        this.query = _.cloneDeep(value);
        this.getResources(value);
      }
    }
  },

  created() {
    this.viewId = this.$route.params.id;
    this.zoneId = this.$route.params.zoneId;
    this.getZoneInfo();

    const { query } = this.$route;
    this.query = _.cloneDeep(query);
    if (query.current) {
      this.query.current = Number(query.current);
    }
  },
  methods: {
    onImportSuccess() {
      console.log("=================")
      this.query.current = 1;
      this.getResources();
    },
    handleSearch(query) {
      this.$router.replace({
        query: { ..._.cloneDeep(this.$route.query), ..._.cloneDeep(query) }
      });
    },
    getZoneInfo() {
      getParantData().then(({ name, role }) => {
        this.recordSuffix = name;
        this.role = role;
      });
    },
    handleOpenCreate(viewId, zoneId) {
      this.$refs.configRef.openConfig(viewId, zoneId);
    },
    goAnalysis(viewId, zoneId, id) {
      this.$refs.analysisRef.openModel(viewId, zoneId, id);
    },
    handleToggleUse({ links, enabled }) {
      this.$post({
        url: `${links.self}?action=${enabled ? "disable" : "enable"}`

      }).then(res => {
        this.$Message.success("切换成功");
        this.getResources();
      }).catch(err => err);
    },
    getResources(query = this.query) {
      const params = query;
      params.page_size = 10;
      params.page_num = query.current || 1;

      this.$get({ ...this.$getApiByRoute(), params })

        .then(({ data, pagination, links }) => {
          this.resList = data;
          this.total = pagination.total;
          this.links = links;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 删除
    delect(data) {
      this.$Modal.confirm({
        title: "提示",
        content: "确定删除？",
        onOk: () => {
          services
            .deleteResourceById(this.viewId, this.zoneId, data)
            .then(() => {
              this.$Message.success("删除成功");
              this.getResources();
            })
            .catch((err) => {
              this.$Message.error(err.response.data.message);
            });
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
