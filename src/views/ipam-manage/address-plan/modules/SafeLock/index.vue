<template>
  <div class="safe-lock">
    <Tooltip
      :content="message"
      :disabled="!message"
    >
      <img
        :src="lockStatus"
        alt=""
      >
    </Tooltip>
  </div>
</template>

<script>

import { LOCK_STATUS_ENUM } from "./config";

export default {
  components: {},
  props: {
    type: {
      type: String,
      default: "" // open, 
    },
    message: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
    };
  },
  computed: {
    lockStatus() {
      const statusMap = {
        [LOCK_STATUS_ENUM.OPEN]: require("./icon-lock-open.png"),
        [LOCK_STATUS_ENUM.CLOSE]: require("./icon-lock-close.png"),
        [LOCK_STATUS_ENUM.DISABLED]: require("./icon-lock-disabled.png")
      };
      return statusMap[this.type];
    }
  },
  watch: {},
  created() { },
  mounted() { },
  methods: {}
};
</script>

<style lang="less" scoped>
.safe-lock {
  cursor: pointer;
}
</style>