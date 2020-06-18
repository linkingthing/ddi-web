<template>
  <div class="alarm-config">
    <table-page
      :total="list.length"
      :data="list"
      :columns="columns"
    />
  </div>
</template>

<script>

export default {
  props: {},
  data() {
    return {
      list: [{}],
      columns: [
        {
          title: "告警项",
          key: "name",
          align: "left"
        },
        {
          title: "告警类型",
          key: "",
          align: "center",
          render: (h, { row }) => {
            return h("Tags", {
              props: {
                list: row.ips,
                field: row
              }
            });
          }
        },
        {
          title: "告警阈值",
          key: "status",
          align: "center",
          render: (h, { row }) => {

            return h("line-edit",
              {
                on: {
                  "on-edit-finish": (val) => {
                    console.log(val)
                  }
                },
                props: {
                  value: "20"
                }
              }
              
            );
          }
        },
        {
          title: "通知",
          key: "action",
          align: "right",
          width: 160,
          render: (h, { row }) => {
            return h("i-switch", {
              props: {
                size: "large"
              }
            }, [
              h("span", {
                slot: "open",

              }, "开启"),
              h("span", {
                slot: "close",

              }, "关闭")
            ]);
          }
        }
      ]
    };
  },
  computed: {},
  watch: {},
  created() {
    // this.getData();
  },
  mounted() { },
  methods: {
    getData() {
      this.$getData().then(({ data }) => {
        console.log(data)
        this.loading = false;
        this.tableData = data;
      }).catch().finally(() => {
        this.loading = false;
      });

    }
  }
};
</script>

<style lang="less" scoped>
</style>