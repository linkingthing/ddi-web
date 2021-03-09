<template>
  <common-modal
    class="acl-modal"
    :visible.sync="dialogVisible"
    :title="getTitle"
    :width="413"
    @confirm="handleConfirm('form')"
    :loading="loading"
  >
    <Form
      ref="form"
      label-position="left"
      :label-width="100"
      :label-colon="true"
      :rules="rules"
      :model="formModel"
    >
      <FormItem
        prop="name"
        label="规划名称"
      >
        <span v-if="isEdit">{{formModel.name}}</span>
        <Input
          v-else
          placeholder="请填写规划名称"
          v-model="formModel.name"
        />
      </FormItem>
      <FormItem
        prop="prefix"
        label="地址前缀"
      >
        <Select
          v-model="formModel.prefix"
          filterable
          allow-create
          clearable
          @on-change="handleSelect"
          placeholder="请输入地址前缀"
        >
          <Option
            v-for="item in ipv6List"
            :value="item.prefix"
            :key="item.id"
          >{{ item.prefix }}</Option>
        </Select>
      </FormItem>
      <FormItem
        prop="prefixes"
        label="地址前缀"
      >
        <Tag
          v-for="item in formModel.prefixes"
          :key="item"
          :name="item"
          closable
          @on-close="handleRemove"
        >{{item}}</Tag>

      </FormItem>

    </Form>
  </common-modal>
</template>

<script>
import { isIpv6Segment } from "@/util/common";

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

      prefixes: [{
        required: true,
        message: "请输入地址前缀"
      }]
    };

    return {
      formModel: {
        prefixes: [],
        prefix: "",
        name: ""
      },
      loading: false,
      dialogVisible: false,
      viewList: [],
      planList: [],
      semanticId: "",
      ipv6List: []
    };
  },

  computed: {
    getTitle() {
      return (this.isEdit ? "编辑" : "新建") + "地址规划";
    },
    isEdit() {
      return !!this.links.update;
    },
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
            ...data
          };


        }).catch();
      }
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.$emit("update:visible", val);
    },


  },

  created() {
    this.getSematicRootId();
    this.getIpv6List();
  },

  methods: {

    getIpv6List() {
      this.$get({ url: "/apis/linkingthing.com/ipam/v1/networkv6s" }).then(({ data }) => {
        if (Array.isArray(data)) {
          this.ipv6List = data;
        } else {
          this.ipv6List = []
        }
      })
    },


    reset() {
      this.$refs["formInline"].resetFields();
    },

    getSematicRootId() {
      this.$get({ url: "/apis/linkingthing.com/ipam/v1/semantics" }).then(({ data }) => {
        if (Array.isArray(data) && data.length) {
          const [{ id }] = data;
          this.semanticId = id;
        }
      })
    },
    pushPrefix(value) {
      if (this.formModel.prefixes.includes(value)) {
        this.$Message.info("请勿重复添加");
      } else {
        if (value.trim() !== "") {
          this.formModel.prefixes.push(value);
        }
      }

    },
    handleCreate() {
    },
    handleSelect(value) {

      if (typeof value === "undefined") {
        return;
      }

      if (isIpv6Segment(value)) {
        this.pushPrefix(value)
      } else {
        this.$Message.error("请正确输入IPv6网段");
      }

    },
    handleRemove(event, name) {
      const index = this.formModel.prefixes.indexOf(name);
      this.formModel.prefixes.splice(index, 1);
    },
    handleConfirm(name) {

      this.$refs[name].validate(valid => {
        if (valid) {

          this.loading = true;
          const params = { ...this.formModel };
          params.semantic = this.semanticId;

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