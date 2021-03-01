<template>
  <div class="CommonTableToolTip">
    <Tooltip transfer>
      <div class="ellipsis">{{value.join(",")}}</div>
      <div slot="content">
        <p
          v-for="item in value"
          :key="item"
        >{{item}}</p>
      </div>
    </Tooltip>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    value: {
      type: Array,
      default: () => ([])
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

<style lang="less" >
.CommonTableToolTip {
  .ivu-tooltip {
    width: 100%;
  }
}
</style>