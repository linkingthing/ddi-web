<template>
  <div class="panel-split">
    <Form
      ref="form"
      :rules="rules"
      :model="splitNode"
    >
      <FormItem label="子网名称">
        <Input
          placeholder="请输入子网名称"
          class="base-input"
          v-model="splitNode.name"
        />
      </FormItem>
      <FormItem
        label="位宽"
        prop="bitWidth"
      >
        <Input
          placeholder="请输入位宽"
          class="base-input"
          v-model="splitNode.bitWidth"
        />
      </FormItem>
      <FormItem>
        <Button
          type="warning"
          :disabled="abledDelete"
          class="btn-del"
          @click="handleClickSplitSubnet"
        >子网拆分</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>

export default {
  props: {
    currentNode: {
      type: Object,
      default: () => ({})
    },
    currentParent: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      splitNode: {},
      rules: {
        //  beginsubnet: [
        //   {
        //     required: true,
        //     message: "请填写subnet"
        //   },
        //   {
        //     validator: subnetValidateFunc
        //   }
        // ],
      }
    };
  },
  computed: {
    abledDelete() {
      return false;
    }
  },
  watch: {},
  created() {
    console.log('split', this.currentNode, this.currentParent)
  },
  mounted() { },
  methods: {
    handleClickSplitSubnet() {
      console.log('split', this.currentNode, this.currentParent)
      const siblings = this.currentParent.data.children;
      const newSubnet = {
        id: "2",
        type: "splitNode",
        ...this.splitNode
      };
      siblings.push(newSubnet)
    }
  }
};
</script>

<style lang="less" scoped>
</style>