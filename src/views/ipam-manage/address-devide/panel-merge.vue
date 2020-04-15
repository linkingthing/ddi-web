<template>
  <div class="panel-merge">
    <Button
      type="success"
      size="small"
      :disabled="abledDelete"
      class="btn-del"
      @click="handleClickMergeSubnet"
    >子网合并</Button>
  </div>
</template>

<script>
import ipaddr from "ipaddr.js";
import { binary } from "./tool";

export default {
  components: {},
  props: {
    currentNodeList: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {

    };
  },
  computed: {
    abledDelete() {
      return false;
    }
  },
  watch: {},
  created() { },
  mounted() {
  },
  methods: {
    handleClickMergeSubnet() {
      if (this.currentNodeList.length !== 2) {
        this.$Message.info("请只选择两个节点进行合并");
        return;
      }

      const [childOne, childTwo] = this.currentNodeList;

      // 同一父节点判断
      console.log(childOne, childTwo)
      if (childOne.node.parent.data.id !== childTwo.node.parent.data.id) {
        this.$Message.info("请只选择同一父节点下的子节点");
        return;
      }

      // beginnodecode 大小 先后

      const { beginnodecode, endnodecode, bitWidth } = childOne.node.data;
      const beginnodecodeNext = childTwo.node.data.beginnodecode;
      const endnodecodeNext = childTwo.node.data.endnodecode;

      let start, end; // 
      if (beginnodecode < beginnodecodeNext) {
        start = beginnodecode;
        end = endnodecodeNext;
      } else {
        start = beginnodecodeNext;
        end = endnodecode;
      }

      const startBinary = binary(start, 3);
      const endBinary = binary(end, 3);

      const startBinaryArr = startBinary.split("");
      const endBinaryArr = endBinary.split("");
      let index = -1; // 异同分界点
      let ableMerge = true;

      for (let i = 0; i < startBinaryArr.length; i++) {
        if (index === -1 && startBinaryArr[i] === endBinaryArr[i]) {
          index = i;
        } else {
          if (!(startBinaryArr[i] === "0" && endBinaryArr[i] === "1")) {
            ableMerge = false;
          }
        }
      }


      console.log(index, ableMerge)

      const siblings = childOne.node.parent.children;
      console.log(siblings)

      if (ableMerge) {
        const newNode = {
          type: "mergeNode",
          name: "",
          beginsubnet: "",
          endsubnet: ""
        }

      }


    }
  }
};
</script>

<style lang="less" scoped>
</style>