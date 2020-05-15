<template>
  <div class="option-config">   
    <table-page 
      title="OPTION列表"
      :data="tableData"
      :pagination-enable="false"
      :columns="columns"> 
      <template slot="top-right">
        <Button 
          type="primary" 
          @click="handleAdd" 
          class="top-button button-add"
        >
          新建
        </Button>
      </template>
    </table-page>

    <Edit 
      :visible.sync="showEdit"
      :data="editData"
      @confirmed="handleSaved"
    />
  </div>
</template>

<style lang="less">
@import "./index.less";
</style>

<script>
import Edit from "./edit";

export default {
  components: {
    Edit
  },

  data() {
    return {
      tableData: [],
      columns: [
        {
          title: "序号",
          key: "index",
          align: "center"
        },
        {
          title: "名称",
          key: "optionName",
          align: "center"
        },
        {
          title: "类型",
          key: "optionType",
          align: "center"
        },
        {
          title: "操作",
          align: "center",      
          render: (h, { row }) => {
            return h("div", [
              h("label", {
                class: "operate-label operate-edit",
                on: {
                  click: () => {
                    this.handleEdit(row);
                  }
                }
              }, "编辑"),
              h("label", {
                class: "operate-label operate-delete",
                on: {
                  click: () => {
                    this.handleDelete(row);
                  }
                }
              }, "删除")
            ]);
          }
        }
      ],
      showEdit: false,
      editData: null
    };
  },

  mounted() {    
    this.getDataList();
    this.$getData().then(res => {
      console.log(res)
    })
  },

  methods: {
    getDataList() {
      this.$get(this.$getApiByRoute()).then(([globalConfig]) => {
        this.globalConfig = globalConfig;
      }).catch(err => err);
    },

    handleAdd() {
      this.showEdit = true;

      this.editData = null;
    },


    handleEdit(data) {
      this.showEdit = true;

      this.editData = data;
    },

    handleSaved() {
      this.handleQuery();
    },

    async handleDelete(data) {
      try {
        await this.$$confirm({ content: "您确定要删除当前数据吗？" });
        
        let { message, status } = await services.deleteOption(data.embedded.id);

        status = +status;

        if (status === 200 || status === 204) {
          this.$$success("删除成功！");

          this.handleQuery();
        }
        else {
          Promise.reject({ message });
        }
      }
      catch (err) {
        this.$$error(err.message || "删除失败！");
      }
    }
  }
};
</script>