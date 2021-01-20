<template>
  <common-modal
    :visible.sync="dialogVisible"
    :title="getTitle"
    :width="413"
    @confirm="handleConfirm"
    :loading="loading"
  >
    <Form
      ref="formInline"
      label-position="left"
      :label-width="80"
      :label-colon="true"
      :rules="rules"
      :model="formModel"
    >

      <common-form
        :form-model="formModel"
        :form-item-list="formItemList"
      />

    </Form>
  </common-modal>
</template>

<script>

import {
  ipv6IsValid,
  isIPv4Reg,
  getAddressType,
  isPosNumber
} from "@/util/common";

const types = [
  {
    label: "ipv4",
    value: "ipv4"
  },
  {
    label: "ipv6",
    value: "ipv6"
  }
];

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
    this.formItemList = [
      {
        label: "启始地址",
        model: "beginAddress",
        type: "input",
        placeholder: "请填写起始地址"
      },
      {
        label: "结束地址",
        model: "endAddress",
        type: "input",
        placeholder: "请填写结束地址"
      }
    ];

    this.rules = {};
    return {
      formModel: {},
      loading: false,
      dialogVisible: false
    };
  },

  computed: {
    getTitle() {
      return (this.isEdit ? "编辑" : "新建") + "地址池";
    },
    isEdit() {
      return !!this.links.update;
    }
  },

  watch: {
    visible(val) {
      if (!val) {
        return;
      }

      if (this.links.update) {
        this.$get({ url: this.links.self }).then(res => {
          this.formModel = res;
        }).catch();
      }
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      if (!val) {
        // 关闭弹窗
        // console.log(val)
      }

      this.$emit("update:visible", val);
    }
  },

  created() {
    // console.log(this.links.update) // ranck？为什么呢会直接运行了 
  },

  methods: {

    handleConfirm() {
      this.loading = true;
      if (this.isEdit) {
        this.$put({ url: this.links.update, params: this.formModel }).then(res => {
          this.$$success("编辑成功");
          this.$emit("success");
          this.dialogVisible = false;
          this.loading = false;
        }).catch(err => {
          this.loading = false;
          this.$$error(err.response.data.message);
        });
      } else {
        this.$post({ url: this.links.self, params: this.formModel }).then(res => {
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

  }
};
</script>

<style lang="less">
@import "./index.less";
</style>