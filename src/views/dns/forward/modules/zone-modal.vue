<template>
  <common-modal
    class="zone-modal"
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
        :show-fields="isEdit ? ['name', 'forwardStyle', 'domain'] : []"
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
      domain: [
        { required: true, message: "请填写域名" }
      ],
      domainGroupIds: [
        { required: true, message: "请选择域名组" }
      ],
      forwarderGroupIds: [
        { required: true, message: "请选择转发分组" }
      ],
      forwardStyle: [
        { required: true, message: "请选择转发方式" }
      ]
    };
    return {
      forwardList: [],
      formModel: {
        forwardItemType: "domain",
        comment: "",
        domain: "",
        domainGroupIds: [],
        forwarderGroupIds: [],
        forwarders: [],
        timeScheduler: "",
        forwardStyle: "",
        name: ""
      },
      loading: false,
      dialogVisible: false,
      domainGroupList: [],
      forwardtimepolicyList: []
    };
  },

  computed: {
    getTitle() {
      return (this.isEdit ? "编辑" : "新建") + "配置";
    },
    isEdit() {
      return !!this.links.update;
    },
    formItemList() {

      const { forwardItemType } = this.formModel;

      const forwardItemMap = {
        "root": null,
        "domain": {
          label: "转发项",
          model: "domain",
          type: "input",
          placeholder: "请填写域名"
        },
        "domain_group": {
          label: "转发项",
          model: "domainGroupIds",
          type: "select",
          placeholder: "请选择域名组",
          multiple: true,
          children: this.domainGroupList.map(item => {
            return {
              label: item.id,
              text: item.name
            };
          })

        }
      };

      return [
        {
          label: "转发类型",
          model: "forwardItemType",
          type: "select",
          placeholder: "请选择转类型",
          disabled: this.isEdit,
          children: [{
            label: "root",
            text: "根区"
          }, {
            label: "domain",
            text: "域名"
          }, {
            label: "domain_group",
            text: "域名组"
          }]
        },
        forwardItemMap[forwardItemType],
        {
          label: "转发分组",
          model: "forwarderGroupIds",
          type: "select",
          placeholder: "请选择转发分组",
          multiple: true,
          children: this.forwardList.map(item => {
            return {
              label: item.id,
              text: item.name
            };
          })
        },
        {
          label: "时间策略",
          model: "timeScheduler",
          type: "select",
          placeholder: "请选择时间策略",
          clearable: true,
          children: this.forwardtimepolicyList.map(item => {
            return {
              label: item.name,
              text: item.name
            };
          })
        },
        {
          label: "转发方式",
          model: "forwardStyle",
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
      ].filter(item => item);
    }
  },

  watch: {

    visible(val) {
      if (!val) {
        this.formModel = {
          forwardItemType: "domain",
          comment: "",
          domain: "",
          domainGroupIds: [],
          forwarderGroupIds: [],
          forwarders: [],
          timeScheduler: "",
          forwardStyle: "",
          name: ""
        };
        this.$refs["formInline"].resetFields();
        return;
      }

      if (this.links.update) {
        this.$get({ url: this.links.self }).then((data) => {
          this.formModel = data;

        }).catch();
      }
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.$emit("update:visible", val);
    }

  },

  created() {
    this.$getData({}, "/dns/dns/forwardergroups").then(({ data }) => {
      this.forwardList = data;
    }).catch();

    this.$getData({}, "/dns/dns/domaingroups").then(({ data }) => {
      this.domainGroupList = data;
    });

    this.$getData({}, "/dns/dns/timeschedulers").then(({ data }) => {
      this.forwardtimepolicyList = data;
    });
  },

  methods: {

    handleConfirm(name) {

      this.$refs[name].validate(valid => {
        if (valid) {

          this.loading = true;
          const params = { ...this.formModel };
          params.name = uuidv4();
          if (params.forwardItemType === "root") {
            params.domain = "@";
          }

          if (params.forwardItemType === "domain_group") {
            Reflect.deleteProperty(params, "domain");
          }


          if (this.isEdit) {
            this.$put({ url: this.links.update, params }).then(res => {
              this.$$success("编辑成功");
              this.$emit("success");
              this.dialogVisible = false;
              this.loading = false;
            }).catch(err => {
              this.loading = false;
              this.$$error(err.response.data.message);
            });
          } else {
            this.$post({ url: this.links.self, params }).then(res => {
              this.$$success("新建成功");
              this.$emit("success");
              this.dialogVisible = false;
              this.loading = false;
            }).catch(err => {
              this.loading = false;
              this.$$error(err.response.data.message);
            });
          }
        }
      });

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