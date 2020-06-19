<template>
  <div class="admin-email">

    <table-page
      :total="list.length"
      :data="list"
      :columns="columns"
    />
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      list: [],
      columns: [
        {
          title: "管理员",
          key: "name",
          align: "left"
        },
        {
          title: "邮箱",
          key: "name",
          align: "left"
        },
        {
          title: "操作",
          key: "name",
          align: "right",
          render(h, { row }) {
            return h("div", [
              h("btn-edit", {
                on: {
                  click: () => this.handleEdit(row)
                }
              }),
              row.name !== "default" &&
              h("btn-del", {
                on: {
                  click: () => this.handleDelete(row.id)
                }
              })
            ]);
          }
        }
      ]
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    handleEdit() { },
    handleDelete() { }
  }
};
</script>

<style lang="less" scoped>
</style>