<template>
  <div class="safe-lock">
    <Tooltip :content="message" :disabled="!message">
      <img
        :src="isLock? require('./icon-lock-close.png') :require('./icon-lock-open.png')"
        alt=""
      >
    </Tooltip>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    isLock: {
      type: Boolean,
      default: false
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
  computed: {},
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