<template>
  <common-modal
    class="acl-modal"
    :visible.sync="dialogVisible"
    :title="getTitle"
    :width="750"
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
        views: []

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
        }).then(({ semantics }) => {
          const { url } = this.$getApiByRoute(`/auth/auth/users?action=getSemanticInfo`);
          const params = { semanticIds: semantics };
          this.$post({ url, params }).then((res) => {
            const semanticList = res.map(item => {
              return {
                ...item,
                id: item.semanticId,
                name: item.semanticName,
                prefixs: item.prefixs
              };
            });
            this.semanticList = semanticList;
            this.planList = semanticList;
          }).catch(() => {
            this.planList = [];
          });

        }).catch();
      }
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.$emit("update:visible", val);
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
        this.planList = [...this.planList, ...semanticList];
      }).catch(() => {
        this.planList = this.semanticList;
      });

    },
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

<style lang="less">
.acl-modal {
  .ivu-radio-wrapper {
    margin-right: 34px;
  }
}
</style>