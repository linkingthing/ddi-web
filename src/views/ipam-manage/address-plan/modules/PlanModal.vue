<template>
  <common-modal
    class="acl-modal"
    :visible.sync="dialogVisible"
    :title="getTitle"
    :width="413"
    @confirm="handleConfirm('formInline')"
    :loading="loading"
  >
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
import { modifiedEnum } from "./helper";

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
      name: [{
        required: true,
        message: "请输入规划名"
      },
      {
        validator: function (rule, value, callback) {
          if (value.trim()) {
            if (value.length > 36) {
              callback("规划名长度不能超过36哥字符");
            } else {
              callback();
            }
          } else {
            callback("请输入规划名");
          }
        }
      }],

      prefixs: [{
        required: true,
        message: "请输入地址前缀"
      }]

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
          label: "规划名称",
          model: "name",
          type: "input",
          placeholder: "请填写规划名称",
        },
        {
          label: "IPv6前缀",
          model: "prefixs",
          type: "textarea",
          placeholder: "请填写IPv6前缀"
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

          this.loading = true;
          const params = { ...this.formModel };
          params.prefixs = params.prefixs.split(",").map(item => item.trim());
          params.maxmaskwidths = Array.from(params.prefixs).fill(64);

          const parentsemanticid = uuidv4(); // 语义节点id，也就是planNode的parentsemanticid
          const rootPlanNodes = params.prefixs.map((prefix, index) => {
            return {
              id: uuidv4(),
              prefix: prefix,
              semanticid: parentsemanticid,
              parentplannodeid: "0", // 网络节点的上层网络节点
              sequence: index,
              value: index + 1,
              name: `根网络节点`,
              bitWidth: 0,
              maxmaskwidth: 64
            };
          });

          params.semanticnodes = [{
            id: parentsemanticid,
            modified: modifiedEnum.STRUCTURED,
            name: params.name,
            parentsemanticid: "0",
            stepsize: 0,
            sequence: 1,
            // autocreate: true,
            ipv4s: [],
            plannodes: rootPlanNodes
          }];



          // this.$router.push({ name: "ipam-address-plan-create", query: params });
          this.$post({ url: this.links.self, params }).then((res) => {
            this.$$success("新建成功");
            this.$emit("success");
            this.dialogVisible = false;
            this.loading = false;

            const { links } = res;
            let url = this.$getRouteByLink(links.self, "address");
            this.$router.push({
              path: url
            });

          }).catch(err => {
            this.loading = false;
            this.$$error(err.response.data.message);
          });

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