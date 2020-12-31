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
        :show-fields="isEdit ? ['name', 'forwardtype', 'domain', 'nametype'] : []"
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
      domaingroupids: [
        { required: true, message: "请选择域名组" }
      ],
      forwarderids: [
        { required: true, message: "请选择转发分组" }
      ],
      forwardtype: [
        { required: true, message: "请选择转发方式" }
      ]
    };
    return {
      forwardList: [],
      formModel: {
        nametype: "domain",
        comment: "",
        domain: "",
        domaingroupids: [],
        forwarderids: [],
        forwarders: [],
        forwardtimepolicyname: "",
        forwardtype: "",
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

      const { nametype } = this.formModel;

      const forwardItemMap = {
        "root": null,
        "domain": {
          label: "转发项",
          model: "domain",
          type: "input",
          placeholder: "请填写域名"
        },
        "domaingroup": {
          label: "转发项",
          model: "domaingroupids",
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
          model: "nametype",
          type: "select",
          placeholder: "请选择转类型",
          children: [{
            label: "root",
            text: "根区"
          }, {
            label: "domain",
            text: "域名"
          }, {
            label: "domaingroup",
            text: "域名组"
          }]
        },
        forwardItemMap[nametype],
        {
          label: "转发分组",
          model: "forwarderids",
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
          model: "forwardtimepolicyname",
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
      ].filter(item => item);
    }
  },

  watch: {

    visible(val) {
      if (!val) {
        this.formModel = {
          nametype: "domain",
          comment: "",
          domain: "",
          domaingroupids: [],
          forwarderids: [],
          forwarders: [],
          forwardtimepolicyname: "",
          forwardtype: "",
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
    this.$getData({}, "/dns/dns/forwarders").then(({ data }) => {
      this.forwardList = data;
    }).catch();

    this.$getData({}, "/dns/dns/domaingroups").then(({ data }) => {
      this.domainGroupList = data;
    });

    this.$getData({}, "/dns/dns/forwardtimepolicies").then(({ data }) => {
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
          if (params.nametype === "root") {
            params.domain = ".";
          }

          if (params.nametype === "domaingroup") {
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