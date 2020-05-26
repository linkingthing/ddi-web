<template>
  <common-modal
    class="zone-modal"
    :visible.sync="dialogVisible"
    :title="getTitle"
    :width="413"
    @confirm="handleConfirm"
  >
    <IviewLoading v-if="loading" />
    <Form
      ref="formInline"
      label-position="left"
      :label-width="80"
      :label-colon="true"
      :rules="rules"
      :model="formModel"
    >

      <common-form
        :form-model="formModel"
        :form-item-list="formItemList"
      />

    </Form>
  </common-modal>
</template>

<script>
import ForwardSelectName from "./forward-select-name";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },

    links: {
      type: Object,
      default: () => ({})
    }
  },

  data() {

    this.rules = {};
    return {
      forwardList: [],
      formItemList: [
        {
          label: "名称",
          model: "name",
          type: "component",
          placeholder: "请填写名称",
          component: ForwardSelectName
        },
        {
          label: "转发分组",
          model: "forwardids",
          type: "select",
          placeholder: "请选择转发分组",
          multiple: true,
          children: []
        },

        {
          label: "转发方式",
          model: "forwardtype",
          type: "select",
          placeholder: "请选择转发方式",
          children: [{
            label: "first",
            text: "first"
          }, {
            label: "only",
            text: "only"
          }]
        },
        {
          label: "备注",
          model: "comment",
          type: "input",
          placeholder: "请填写备注"
        }
      ],
      formModel: {
        name: ""
      },
      loading: false,
      dialogVisible: false
    };
  },

  computed: {
    getTitle() {
      return (this.isEdit ? "编辑" : "新建") + "配置";
    },
    isEdit() {
      return !!this.links.update;
    }
  },

  watch: {

    visible(val) {
      if (!val) {
       
        return;
      }

      if (this.links.update) {
        this.$get({ url: this.links.self }).then(({ name, comment,forwardtype,forwards }) => {
          this.formModel = {
            name,
            comment,
            forwardtype,
            forwards,
            forwardids: forwards.map(item => item.id)
          };

          
        }).catch();
      }
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.$emit("update:visible", val);
    },

    forwardList(value) {

      const optionList = value.map(item => {
        return {
          label: item.id,
          text: item.name
        };
      });

      this.formItemList.some(item => {
        if (item.model === "forwardids") {
          item.children = optionList;
        }
      });

    }
  },

  created() {
    this.$getData("/dns/dns/forwards").then(({ data }) => {
      this.forwardList = data;
    }).catch();
  },

  methods: {

    handleConfirm() {

      const params = { ...this.formModel };

      if (this.isEdit) {
        this.$put({ url: this.links.update, params }).then(res => {
          this.$$success("编辑成功");
          this.$emit("success");
          this.dialogVisible = false;
        }).catch(err => {
          this.$$error(err.response.data.message);
        });
      } else {
        this.$post({ url: this.links.self, params }).then(res => {
          this.$$success("新建成功");
          this.$emit("success");
          this.dialogVisible = false;
        }).catch(err => {
          this.$$error(err.response.data.message);
        });
      }

    }

  }
};
</script>

<style lang="less">
.zone-modal {
  .ivu-radio-wrapper {
    margin-right: 34px;
  }
}
</style>