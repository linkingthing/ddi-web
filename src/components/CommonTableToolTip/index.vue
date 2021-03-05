<template>
  <div class="CommonTableToolTip">
    <Tooltip
      transfer
      v-if="innerValue.length"
    >
      <div class="ellipsis">{{innerValue.join(",")}}</div>
      <div slot="content">
        <p
          v-for="(item,index) in innerValue"
          :key="item+index"
        >{{item}}</p>
      </div>
    </Tooltip>
    <span v-else></span>
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
      innerValue: []
    };
  },
  computed: {},
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(value) {
        if (Array.isArray(value)) {
          this.innerValue = value
        } else {
          this.innerValue = [];
        }
      }
    }
  },
  created() { },
  mounted() { },
  methods: {}
};
</script>

<style lang="less" >
.CommonTableToolTip {
  margin-top: 5px;
  .ivu-tooltip {
    width: 100%;
  }
}
</style>