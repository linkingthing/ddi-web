<template>
  <div class="common-process">
    <div class="process-text">{{(Number(percent)*100).toFixed(2)}}%</div>
    <Progress
      :percent="Number((Number(percent)*100).toFixed(2))"
      hide-info
    />

  </div>
</template>

<script>
export default {
  components: {},
  props: {
    percent: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: Number | String,
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