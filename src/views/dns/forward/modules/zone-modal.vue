<template>
  <common-modal
    class="zone-modal"
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

    this.rules = {
      name: [
        { required: true, message: "请填写区名称" }
      ],
      forwardids: [
        { required: true, message: "请选择转发分组" }
      ],
      forwardtype: [
        { required: true, message: "请选择转发方式" }
      ]
    };
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
          label: "时间策略",
          model: "forwardids",
          type: "select",
          placeholder: "请选择时间策略",
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
        name: {}
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
    }
  },

  watch: {

    visible(val) {
      if (!val) {
        this.$refs["formInline"].resetFields();
        return;
      }

      if (this.links.update) {
        this.$get({ url: this.links.self }).then(({ name, domainGroup, comment, forwardtype, forwards }) => {
          this.formModel = {
            name,
            comment,
            forwardtype,
            forwards,
            forwardids: Array.isArray(forwards) ? forwards.map(item => item.id) : []
          };

          // 改造name 和 domainGroup 字段映射到 name中，二者存在值的情况必然互斥

          if (domainGroup.length) {
            this.formModel.name = domainGroup.map(item => this.domainGroupList.find(domain => domain.id === item).name).join(",");
          } else {
            this.formModel.name = name;
          }


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

    },

    forwardtimepolicyList(value) {
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
    this.$getData({}, "/dns/dns/forwards").then(({ data }) => {
      this.forwardList = data;
    }).catch();

    this.$getData({}, "/dns/dns/domaingroups").then(({ data }) => {
      this.domainGroupList = data;
    });

    this.$getData({}, "/dns/dns/forwardtimepolicies").then(({ data }) => {
      this.forwardtimepolicyList = data;
    })
  },

  methods: {

    handleConfirm(name) {

      this.$refs[name].validate(valid => {
        if (valid) {
          const params = { ...this.formModel };

          const { type, value } = params.name;

          if (type === "domainGroup") {
            params.domainGroup = value;
            params.name = "";
          } else {
            params.name = name;
            params.domainGroup = [];
          }


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