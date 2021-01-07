<template>
  <div
    :key="value.ip"
    class="node-map-server"
    :class="{'node-off': !value.nodeIsAlive}"
    :style="`background-image: url(${require('../../../assets/images/monitor-group.png')})`"
    @mouseenter="(e) => $emit('mouseenter', value, e)"
    @mouseleave="(e) => $emit('mouseleave', value, e)"
  >
    <ol class="top-info">
      <!-- <li>
        {{!value.master ? "MASTER" : "SLAVE"}}
      </li> -->
      <!-- <li
        class="show-hostname"
        v-if="!value.hostName.startsWith('node-')"
      >
        {{value.hostName }}
      </li> -->

      <li>
        {{value.ip }}
      </li>
      <li
        v-if="value.vip"
      >
        VIP: {{value.vip }}
      </li>

    </ol>
    <i :class="{'success' :value.nodeIsAlive, 'error': !value.nodeIsAlive}" />
    <ul class="">
      <li
        v-for="item in value.roles"
        :key="item"
        :style="`color: ${getColor(item)}`"
      >
        {{item.toLocaleUpperCase()}}
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

    }
  },

  mounted() { },
  methods: {
    getColor(item) {
      const error = "#f15e5e";
      const succcess = "#3eec3d";
      const { nodeIsAlive, dhcpIsAlive, dnsIsAlive } = this.value;
      if (item === "controller" && nodeIsAlive) {
        return succcess;
      }
      if (item === "dns" && dnsIsAlive) {
        return succcess;
      }
      if (item === "dhcp" && dhcpIsAlive) {
        return succcess;
      }
      if (item === "dataCenter" && nodeIsAlive) {
        return succcess;
      }
      return error;
    }
  }
};
</script>

<style lang="less">
.node-off {
  opacity: 0.5;
}

.node-map-server {
  position: relative;
  width: 300px;
  height: 124px;
  border-radius: 6px;
  background-size: cover;
  text-align: left;

  .top-info {
    display: flex;
    justify-content: space-between;

    li {
      font-size: 14px;
      line-height: 16px;
      color: #fff;
      padding: 8px 20px;
    }
    .show-hostname {
      padding-left: 0;
      padding-right: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  i {
    position: absolute;
    right: 20px;
    top: 43px;
    display: block;
    width: 10px;
    height: 10px;
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
    margin: 6px 20px;
    li {
      position: relative;
      font-size: 14px;
      font-weight: bold;

      & + li {
        margin-left: 30px;
        &::before {
          position: absolute;
          top: 4px;
          left: -18px;
          content: ".";
          font-size: 22px;
          line-height: 0;
        }
      }
    }
  }
}
</style>