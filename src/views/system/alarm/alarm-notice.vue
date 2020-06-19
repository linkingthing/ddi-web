<template>
  <div class="alarm-notice">
    <table-page
      :total="list.length"
      :data="list"
      :columns="columns"
    >
      <template slot="neck">
        <div>
          <SearchBar />
        </div>
      </template>
    </table-page>
    

  </div>
</template>

<script>
import SearchBar from "./modules/SearchBar";
export default {
  components: {
    SearchBar
  },
  props: {},
  data() {
    return {
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "告警项",
          key: "name",
          align: "left"
        },
        {
          title: "告警类型",
          key: "name",
          align: "left"
        },
        {
          title: "告警信息",
          key: "name",
          align: "left"
        },
        {
          title: "告警状态",
          key: "name",
          align: "left"
        },
        {
          title: "时间",
          key: "name",
          align: "left"
        },
        {
          title: "操作",
          key: "action",
          align: "right",
          width: 200,
          render: (h, { row }) => {
            return h("div", {

            }, [
              h("i-button", {
                props: {
                  size: "small",
                }

              }, "忽略"),
              h("Button", {
                props: {
                  size: "small",
                }

              }, "已处理")
            ]);
          }
        }
      ],
      list: [{}]
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {}
};
</script>

<style lang="less" scoped>
</style>