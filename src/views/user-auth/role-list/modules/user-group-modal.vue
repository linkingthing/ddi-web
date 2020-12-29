<template>
  <common-modal
    class="acl-modal"
    :visible.sync="dialogVisible"
    :title="getTitle"
    :width="750"
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
import MultipleSelect from "../../modules/MultipleSelect";

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
      semantics: [
        {
          validator: (rule, value, callback) => {
            let AllLen = 0;
            if (value) {
              AllLen += value.length;
            }
            if (this.formModel && this.formModel.views) {
              AllLen += this.formModel.views.length;
            }

            if (AllLen) {
              callback();
            } else {
              callback("请选择至少一个DNS资源或者IP前缀资源");
            }
          }
        }
      ],
      views: [
        {
          validator: (rule, value, callback) => {
            let AllLen = 0;
            if (value) {
              AllLen += value.length;
            }
            if (this.formModel && this.formModel.semantics) {
              AllLen += this.formModel.semantics.length;
            }

            if (AllLen) {
              callback();
            } else {
              callback("请选择至少一个DNS资源或者IP前缀资源");
            }
          }
        }
      ]

    };

    return {
      formModel: {
        name: "",
        semantics: [],
        views: [],
        comment: ""
      },
      loading: false,
      dialogVisible: false,
      viewList: [],
      planList: []
    };
  },

  computed: {
    getTitle() {
      return (this.isEdit ? "编辑" : "新建") + "角色";
    },
    isEdit() {
      return !!this.links.update;
    },
    formItemList() {
      return [
        {
          label: "角色名称",
          model: "name",
          type: "input",
          placeholder: "请填写角色名称",
          style: "width: 380px"

        },
        {
          label: "选择DNS",
          type: "component",
          model: "views",
          component: MultipleSelect,
          props: {
            dataList: this.viewList,
            tips: "已选DNS",
            clearKeywords: this.visible
          }
        },
        {
          label: "选择IP前缀",
          model: "semantics",
          type: "component",
          component: MultipleSelect,
          props: {
            height: 150,
            dataList: this.planList,
            tips: "已选择IP前缀",
            clearKeywords: this.visible,
            isAsyncSearch: true
          },
          events: {
            onSearch: this.handleAsyncSearch
          }
        },
        {
          label: "备注",
          model: "comment",
          type: "textarea",
          placeholder: "请填写备注",
          autosize: { minRows: 5, maxRows: 5 },
          style: "width: 380px"
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
          return data;
        }).then(({ semanticInfo }) => {
          if (Array.isArray(semanticInfo)) {
            const semanticList = semanticInfo.map(item => {
              return {
                ...item,
                id: item.semanticId,
                name: `${item.record.join("/")}`,
                prefixs: item.prefixs,
                record: item.record
              };
            });
            this.semanticList = semanticList;
            this.planList = semanticList;
          } else {
            this.planList = [];
          }


        }).catch();
      }
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.$emit("update:visible", val);
    },
    "formModel.semantics"() {
      if (this.dialogVisible) {
        this.$refs["formInline"].validate();

      }

    },
    "formModel.views"() {
      if (this.dialogVisible) {
        this.$refs["formInline"].validate();
      }
    }
  },

  created() {
    this.init();
  },

  methods: {

    init() {
      this.getViewList();
    },
    getViewList() {
      this.$getData({}, "/dns/dns/views").then(({ data }) => {
        this.viewList = data;
        return data;
      });
    },
    handleAsyncSearch(search) {
      this.getSemanticList(search);
    },
    semanticListParser(semanticList) {
      return semanticList.map(item => {
        return {
          ...item,
          id: item.semanticId,
          name: `${item.record.join("/")}`,
          prefixs: item.prefixs
        };
      });
    },
    getSemanticList(semanticName) {
      const { url } = this.$getApiByRoute(`/auth/auth/users?action=getSemanticByName`);
      const params = { semanticName };
      this.$post({ url, params }).then((res) => {
        const semanticList = this.semanticListParser(res);
        const result = [];
        const all = [...this.planList, ...semanticList];
        const idRecord = [];
        all.forEach(item => {
          if (!idRecord.includes(item.id)) {
            result.push(item);
            idRecord.push(item.id);
          }
        });

        this.planList = result;
      }).catch(() => {

        // this.planList = this.semanticList;
      });

    },
    reset() {
      this.$refs["formInline"].resetFields();
    },

    handleConfirm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.loading = true;
          const params = { ...this.formModel };
          if (this.isEdit) {
            this.$put({ url: this.links.update, params }).then(() => {
              this.$$success("编辑成功");
              this.$emit("success");
              this.dialogVisible = false;
              this.loading = false;
            }).catch(err => {
              this.loading = false;
              this.$$error(err.response.data.message);
            });
          } else {
            this.$post({ url: this.links.self, params }).then(() => {
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
.acl-modal {
  .ivu-radio-wrapper {
    margin-right: 34px;
  }
}
</style>