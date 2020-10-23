<template>
  <common-modal
    class="acl-modal"
    :visible.sync="dialogVisible"
    :title="getTitle"
    :width="413"
    @confirm="handleConfirm('formInline')"
  >
    <IviewLoading v-if="loading" />
    <Form
      ref="formInline"
      label-position="left"
      :label-width="100"
      :label-colon="true"
      :rules="rules"
      :model="formModel"
    >

      <common-form
        :form-model="formModel"
        :form-item-list="formItemList"
        :show-fields="isEdit ? ['name'] : []"
      />

    </Form>
  </common-modal>
</template>

<script>
import { v4 as uuidv4 } from "uuid";

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


    this.rules = {
      name: [
        {
          validator: function (rule, value, callback) {
            if (value.trim()) {
              callback();
            } else {
              callback("请输入角色名");
            }
          }
        }
      ],



    };

    return {
      formModel: {
        prefix: "",
        description: ""
      },
      loading: false,
      dialogVisible: false,
      viewList: [],
      planList: []
    };
  },

  computed: {
    getTitle() {
      return (this.isEdit ? "编辑" : "新建") + "地址规划";
    },
    isEdit() {
      return !!this.links.update;
    },
    formItemList() {
      return [
        {
          label: "IPv6前缀",
          model: "prefix",
          type: "input",
          placeholder: "请填写IPv6前缀"

        },
        {
          label: "规划名称",
          model: "description",
          type: "input",
          placeholder: "请填写规划名称",
        }

      ];
    }
  },

  watch: {
    visible(val) {
      if (!val) {
        this.reset();
        return;
      }

      if (this.links.update) {
        this.$get({ url: this.links.self }).then(data => {
          this.formModel = data;
        }).catch();
      }
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.$emit("update:visible", val);
    }

  },

  methods: {


    reset() {
      this.$refs["formInline"].resetFields();
    },

    handleConfirm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          const params = { ...this.formModel };
          if (this.isEdit) {
            this.$put({ url: this.links.update, params }).then(() => {
              this.$$success("编辑成功");
              this.$emit("success");
              this.dialogVisible = false;
            }).catch(err => {
              this.$$error(err.response.data.message);
            });
          } else {
            // params.id = uuidv4();
            params.maskLen = 64;
            // params.lockedby = "admin";

            this.$post({ url: this.links.self, params }).then(() => {
              this.$$success("新建成功");
              this.$emit("success");
              this.dialogVisible = false;
            }).catch(err => {
              this.$$error(err.response.data.message);
            });
          }
        }
      });
    }

  }
};
</script>

<style lang="less" scoped>
.acl-modal {
  .ivu-radio-wrapper {
    margin-right: 34px;
  }
}
</style>