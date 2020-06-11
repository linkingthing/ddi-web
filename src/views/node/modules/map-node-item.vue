<template>
  <div
    :key="value.ip"
    class="node-map-server"
    :style="`background-image: url(${require('../../../assets/images/monitor-group.png')})`"
    @mouseenter="(e) => $emit('mouseenter', value, e)"
    @mouseleave="(e) => $emit('mouseleave', value, e)"
  >
    <i :class="{'success' :value.nodeIsAlive, 'error': !value.nodeIsAlive}" />
    <ul class="">
      <li
        v-for="item in value.roles"
        :key="item"
      >
        {{item}}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    value: {
      type: Object,
      default: () => ({
      })
    }
  },
  data() {
    return {
    };
  },
  computed: {},
  watch: {
    value(v) {
      console.log(v)
    }
  },

  mounted() { },
  methods: {}
};
</script>

<style lang="less">
.node-map-server {
  position: relative;
  width: 300px;
  height: 104px;
  border-radius: 6px;
  background-size: cover;
  i {
    position: absolute;
    right: 24px;
    top: 18px;
    display: block;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    &.success {
      background: #3eec3d;
    }
    &.error {
      background: #f15e5e;
    }
  }
  ul {
    display: inline-flex;
    color: #fff;
    font-size: 14px;
    margin: 18px 24px;
    li {
      position: relative;

      & + li {
        margin-left: 30px;
        &::before {
          position: absolute;
          top: -3px;
          left: -20px;
          content: ".";
          font-size: 40px;
          line-height: 0;
        }
      }
    }
  }
}
</style>