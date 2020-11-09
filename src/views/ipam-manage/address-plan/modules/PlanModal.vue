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
        prefixs: "",
        name: ""
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
          model: "prefixs",
          type: "textarea",
          placeholder: "请填写IPv6前缀"

        },
        {
          label: "规划名称",
          model: "name",
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
          this.formModel = {
            prefixs: data.prefixs.join(","),
            ...data
          };


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
          params.prefixs = params.prefixs.split(",").map(item => item.trim());
          params.maxmaskwidths = Array.from(params.prefixs).fill(64);

          const parentsemanticid = uuidv4();
          const rootPlanNodes = params.prefixs.map((prefix, index) => {
            return {
              id: uuidv4(),
              prefix: prefix,
              parentsemanticid,
              parentplannodeid: "0", // 网络节点的上层网络节点
              sequence: index,
              value: index + 1,
              name: `plannodes root`,
              bitWidth: 4,
              maxmaskwidth: 64
            };
          });

          params.semanticnodes = [{
            id: parentsemanticid,
            modified: 1,
            name: "语义节点1",
            parentsemanticid: "0",
            stepsize: 2,
            sequence: 1,
            autocreate: false,
            ipv4s: [],
            plannodes: rootPlanNodes
          }];

          if (this.isEdit) {
            this.$put({ url: this.links.update, params }).then(() => {
              this.$$success("编辑成功");
              this.$emit("success");
              this.dialogVisible = false;
            }).catch(err => {
              this.$$error(err.response.data.message);
            });
          } else {

            // this.$router.push({ name: "ipam-address-plan-create", query: params });
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