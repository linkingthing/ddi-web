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

    // this.rules = {
    //   name: [
    //     { required: true, message: "请填访问控制名称" },
    //     commonNameValidate,
    //     {
    //       pattern: /^.*[^\d].*$/,
    //       message: "访问控制列表名称不能为纯数字"
    //     }
    //   ],
    //   ips: [
    //     { required: true, message: "请填写网络地址" },
    //     {
    //       validator: function (rule, value, callback) {
    //         if (isIp(value)) {
    //           callback();
    //         }
    //         if ("cmcc,cucc,ctcc".includes(value)) {
    //           callback();
    //         }
    //         callback("请正确填写网络地址");

    //       }

    //     }

    //   ]

    // };

    this.rules = {};
    return {
      formModel: {
        name: "",
        roleIDs: [],
        userIDs: []
      },
      loading: false,
      dialogVisible: false,
      userList: [],
      roleList: []
    };
  },

  computed: {
    getTitle() {
      return (this.isEdit ? "编辑" : "新建") + "用户组";
    },
    isEdit() {
      return !!this.links.update;
    },
    formItemList() {
      return [
        {
          label: "用户组名称",
          model: "name",
          type: "input",
          placeholder: "请填写前缀长度",
          style: "width: 380px"

        },
        {
          label: "选择用户",
          type: "component",
          model: "userIDs",
          component: MultipleSelect,
          props: {
            dataList: this.userList
          }
        },
        {
          label: "选择角色",
          model: "roleIDs",
          type: "component",
          component: MultipleSelect,
          props: {
            height: 150,
            dataList: this.roleList
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
        this.$get({ url: this.links.self }).then((res) => {
          this.formModel = res;
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
      this.getUserList();
      this.getRoleList();
    },
    getUserList() {
      this.$getData({}, "/auth/auth/ddiusers").then(({ data }) => {
        this.userList = data.map(item => {
          return {
            id: item.id,
            name: item.username
          };
        });
      });
    },
    getRoleList() {
      this.$getData({}, "/auth/auth/roles").then(({ data }) => {
        this.roleList = data;
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