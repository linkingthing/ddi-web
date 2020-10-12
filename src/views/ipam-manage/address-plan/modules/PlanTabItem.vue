<template>
  <li
    class="PlanTabItem"
    :class="{active: id === active}"
  >
    {{description}}
    <Icon
      type="md-close"
      class="tab-close"
      @click="handleClickClose"
    />
  </li>
</template>

<script>
export default {
  components: {},
  props: {
    id: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: String | Number,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    active: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: String | Number,
      default: ""
    }
  },
  data() {
    return {
    };
  },
  computed: {},
  watch: {
    
  },
  created() { },
  mounted() { },
  methods: {
    handleClickClose(e) {
      e.stopPropagation();
      this.$emit("remove", this.id);
    }
  }
};
</script>

<style lang="less" scoped>
.PlanTabItem {
  font-size: 14px;
  width: 160px;
  padding: 10px 14px;
  color: #999;
  cursor: pointer;
  border-radius: 4px 4px 0px 0px;
  line-height: 1;
  flex-shrink: 0;

  &.active {
    color: #4585fd;
    background: #fff;
    cursor: default;
  }
  .tab-close {
    float: right;
    cursor: pointer;
  }
}
</style>