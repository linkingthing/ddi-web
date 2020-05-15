<template>
  <div class="common-process">
    <div class="process-text">{{percent}}%</div>
    <Progress
      :percent="percent"
      hide-info
    />

  </div>
</template>

<script>
export default {
  components: {},
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
    };
  },
  computed: {},
  created() { },
  mounted() { },
  methods: {},
  watch: {},
};
</script>

<style lang="less" scoped>
.common-process {
  .process-text {
    font-size: 14px;
    color: #333;
    line-height: 1;
    padding-top: 4px;
    margin-bottom: -4px;
  }
}
</style>